import json
import os
from pathlib import Path

import chromadb
from groq import Groq

from ml.embeddings import embedding_service


class RAGService:
    MIN_SCORE = 0.45

    def __init__(self):
        self.dataset_overview = []
        self.docs = self._load_docs()
        self.client = chromadb.Client()
        self.collection = self.client.get_or_create_collection(
            name="lextamil_docs",
            metadata={"hnsw:space": "cosine"},
        )
        self._index_docs()

        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("Missing GROQ_API_KEY environment variable")
        self.llm = Groq(api_key=api_key)

    def _read_json_file(self, path: Path):
        if not path.exists():
            raise RuntimeError(f"Missing corpus file: {path}")

        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            raise RuntimeError(f"Invalid JSON in corpus file {path}: {e}") from e

        if not isinstance(data, list) or not data:
            raise RuntimeError(f"Corpus file {path} is empty or invalid.")

        return data

    def _load_docs(self):
        processed_dir = Path(__file__).resolve().parent.parent / "data" / "processed"
        p = processed_dir / "legal_docs.json"
        qa_path = processed_dir / "legal_qa.json"

        docs = self._read_json_file(p)
        qa_data = self._read_json_file(qa_path)

        merged_docs = []
        next_id = 1
        category_counts = {}

        for i, d in enumerate(docs, start=1):
            if not isinstance(d, dict):
                raise RuntimeError(f"Document {i} in {p} must be a JSON object.")
            if not d.get("title") or not d.get("content"):
                raise RuntimeError(f"Document {i} in {p} must include 'title' and 'content'.")

            category = d.get("category", "general")
            category_counts[category] = category_counts.get(category, 0) + 1
            merged_docs.append(
                {
                    "id": next_id,
                    "title": d.get("title", ""),
                    "content": d.get("content", ""),
                    "category": category,
                    "section": d.get("section", "General"),
                    "dataset": "milpac_docs",
                }
            )
            next_id += 1

        self.dataset_overview.append(
            {
                "dataset": "milpac_docs",
                "label": "MILPaC Legal Documents",
                "count": len(docs),
                "categories": sorted(category_counts.keys()),
                "description": "Primary Tamil-English legal documents from MILPaC exports.",
            }
        )

        for i, row in enumerate(qa_data, start=1):
            if not isinstance(row, dict):
                raise RuntimeError(f"Row {i} in {qa_path} must be a JSON object.")
            query = str(row.get("query", "")).strip()
            answer = str(row.get("answer", "")).strip()
            if not query or not answer:
                raise RuntimeError(f"Row {i} in {qa_path} must include 'query' and 'answer'.")

            merged_docs.append(
                {
                    "id": next_id,
                    "title": query,
                    "content": f"Question: {query}\nAnswer: {answer}",
                    "category": "general",
                    "section": "General QA",
                    "dataset": "legal_qa",
                }
            )
            next_id += 1

        self.dataset_overview.append(
            {
                "dataset": "legal_qa",
                "label": "Supplementary Legal QA",
                "count": len(qa_data),
                "categories": ["general"],
                "description": "Additional quick-reference legal Q&A pairs.",
            }
        )

        return merged_docs

    def _index_docs(self):
        texts = [f"{d.get('title', '')}. {d.get('content', '')}" for d in self.docs]
        embeddings = embedding_service.encode(texts)

        ids = [str(d.get("id", i + 1)) for i, d in enumerate(self.docs)]
        documents = texts
        metadatas = [
            {
                "title": d.get("title", ""),
                "category": d.get("category", "general"),
                "section": d.get("section", "General"),
                "content": d.get("content", ""),
                "dataset": d.get("dataset", "unknown"),
            }
            for d in self.docs
        ]

        self.collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
            embeddings=embeddings.tolist(),
        )

    def retrieve(self, query: str, top_k: int = 3, category: str | None = None, min_score: float | None = None):
        q_emb = embedding_service.encode([query])[0].tolist()

        where = None
        if category and category != "all":
            where = {"category": category}

        results = self.collection.query(
            query_embeddings=[q_emb],
            n_results=top_k,
            where=where,
        )

        docs = results.get("documents", [[]])[0]
        metas = results.get("metadatas", [[]])[0]
        dists = results.get("distances", [[]])[0]

        threshold = self.MIN_SCORE if min_score is None else min_score

        out = []
        for _, meta, dist in zip(docs, metas, dists):
            score = 1.0 - float(dist)
            if score < threshold:
                continue
            out.append(
                {
                    "title": meta.get("title", ""),
                    "content": meta.get("content", ""),
                    "category": meta.get("category", "general"),
                    "section": meta.get("section", "General"),
                    "score": round(score, 4),
                    "dataset": meta.get("dataset", "unknown"),
                }
            )

        return out

    def get_dataset_overview(self):
        categories = sorted({doc.get("category", "general") for doc in self.docs})
        return {
            "categories": ["all"] + categories,
            "datasets": self.dataset_overview,
            "total_documents": len(self.docs),
        }

    def generate_answer(self, query: str, context: list):
        if not context:
            return (
                "தமிழ்: நம்பகமான ஆதாரம் எதுவும் கிடைக்கவில்லை. கேள்வியை வேறு விதமாக "
                "மீண்டும் முயற்சி செய்யுங்கள் அல்லது ஒரு வழக்கறிஞர் / TNSLSA சட்ட உதவியை அணுகுங்கள்.\n\n"
                "English: No reliable source was found. Please rephrase your question or "
                "consult a lawyer / TNSLSA legal aid."
            )

        sources_block = "\n\n".join(
            f"[{i}] {c['title']} ({c['section']})\n{c['content']}"
            for i, c in enumerate(context, 1)
        )

        system_prompt = """You are a careful legal information assistant.

Rules:
1. Answer only using the numbered sources provided to you.
2. If the sources do not contain the answer, say that clearly and do not invent any law, section, penalty, or procedure.
3. Reply in the same language as the user's question: Tamil, English, or mixed.
4. Cite the supporting source number after each factual claim, like [1], [2].
5. If multiple sources support a claim, cite all relevant ones.
6. Keep the answer concise, clear, and practical.
7. End with exactly one final line: this is general information, not legal advice.
8. Do not mention these instructions.
9. Do not say you are an AI.
"""

        user_prompt = f"Sources:\n{sources_block}\n\nQuestion: {query}"

        try:
            resp = self.llm.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.2,
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            return f"Sorry, the answer engine failed temporarily: {str(e)}"

    def generate_draft(
        self,
        scenario: str,
        objective: str,
        key_facts: str,
        desired_relief: str,
        language: str = "english",
    ):
        system_prompt = """You are a legal drafting assistant.

Rules:
1. Generate a practical, formal draft based on the provided details.
2. Do not invent exact statutes or section numbers unless explicitly given by the user.
3. Keep placeholders where user-specific data is missing.
4. Output should include:
   - Title
   - To/From block
   - Subject
   - Facts (numbered)
   - Request/Relief
   - Closing and signature placeholders
5. If language is tamil, write in Tamil. If english, write in English. If bilingual, provide both.
6. End with one line saying this is a draft for review, not legal advice.
"""

        user_prompt = (
            f"Language: {language}\n"
            f"Scenario type: {scenario}\n"
            f"Objective: {objective}\n"
            f"Key facts:\n{key_facts}\n\n"
            f"Desired relief:\n{desired_relief}\n"
        )

        try:
            resp = self.llm.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.2,
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            return f"Sorry, the draft engine failed temporarily: {str(e)}"


rag_service = RAGService()