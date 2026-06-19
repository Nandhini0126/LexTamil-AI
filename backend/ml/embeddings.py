# Deprecated: No longer used to save memory and avoid OOM on Render.
# Keep as placeholder.

class EmbeddingService:
    def __init__(self, model_name=None):
        pass
    def encode(self, texts):
        return []

embedding_service = EmbeddingService()