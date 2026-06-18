"""
convert_milpac.py — build legal_docs.json from MILPaC xlsx files.

Handles TWO different id formats found in MILPaC:
  - CCI FAQ file uses  Q_1_1 / A_1_1   (underscore format)
  - IP file uses       Q1   / A1       (compact format)
Each question row is paired with its answer row and emitted as one bilingual
(Tamil + English) document.
"""
import json
import re
import pandas as pd

# (filename, category, id_style)  — id_style picks the pairing rule
FILES = [
    ("MILPaC_CCI_FAQ_dataset.xlsx", "consumer", "underscore"),
    ("MILPaC_IP_dataset.xlsx",      "ip",       "compact"),
]

def answer_id_for(qid, style):
    """Given a question id, return the matching answer id, or None if not a question."""
    if style == "underscore":          # Q_1_1 -> A_1_1
        if not qid.startswith("Q_"):
            return None
        return "A_" + qid[2:]
    if style == "compact":             # Q1 -> A1
        m = re.fullmatch(r"Q(\d+)", qid)
        if not m:
            return None
        return "A" + m.group(1)
    return None

def pair_qa(path, category, style):
    df = pd.read_excel(path)
    ta = df[df["tgt_lang"] == "TA"].reset_index(drop=True)
    by_id = {str(row["id"]): row for _, row in ta.iterrows()}

    docs = []
    for qid, qrow in by_id.items():
        aid = answer_id_for(qid, style)
        if aid is None:
            continue
        arow = by_id.get(aid)
        if arow is None:
            continue
        q_ta, a_ta = str(qrow["tgt"]), str(arow["tgt"])
        q_en, a_en = str(qrow["src"]), str(arow["src"])
        section = "MILPaC IP FAQ" if category == "ip" else "MILPaC FAQ"
        docs.append({
            "title": q_ta,
            "content": (
                f"கேள்வி: {q_ta}\nபதில்: {a_ta}\n\n"
                f"Question: {q_en}\nAnswer: {a_en}"
            ),
            "category": category,
            "section": section,
        })
    return docs

all_docs = []
for path, cat, style in FILES:
    d = pair_qa(path, cat, style)
    print(f"{path}: {len(d)} QA documents ({cat})")
    all_docs.extend(d)

for i, d in enumerate(all_docs, 1):
    d["id"] = i

with open("legal_docs.json", "w", encoding="utf-8") as f:
    json.dump(all_docs, f, ensure_ascii=False, indent=2)

# summary
from collections import Counter
cats = Counter(d["category"] for d in all_docs)
print(f"\nTotal: {len(all_docs)} documents")
print(f"By category: {dict(cats)}")