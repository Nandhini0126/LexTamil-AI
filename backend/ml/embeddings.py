import numpy as np
from fastembed import TextEmbedding

class EmbeddingService:
    def __init__(self, model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"):
        self.model = TextEmbedding(model_name=model_name)

    def encode(self, texts):
        if isinstance(texts, str):
            texts = [texts]
        embeddings = list(self.model.embed(texts))
        return np.array(embeddings)

embedding_service = EmbeddingService()