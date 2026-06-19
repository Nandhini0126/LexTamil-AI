from pathlib import Path
import tempfile
import os
from groq import Groq

class ASRService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = None

    def _get_client(self):
        if not self.client:
            if not self.api_key:
                self.api_key = os.getenv("GROQ_API_KEY")
            if not self.api_key:
                raise RuntimeError("Missing GROQ_API_KEY environment variable")
            self.client = Groq(api_key=self.api_key)
        return self.client

    def transcribe_path(self, audio_path: str, language: str | None = None) -> str:
        client = self._get_client()
        with open(audio_path, "rb") as file:
            translation = client.audio.transcriptions.create(
                file=(Path(audio_path).name, file.read()),
                model="whisper-large-v3",
                language=language or "ta",
            )
            return translation.text.strip()

    async def transcribe_upload(self, upload_file) -> str:
        suffix = Path(upload_file.filename or "audio.webm").suffix or ".webm"
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(await upload_file.read())
            tmp_path = tmp.name
        try:
            return self.transcribe_path(tmp_path, language="ta")
        finally:
            Path(tmp_path).unlink(missing_ok=True)

asr_service = ASRService()