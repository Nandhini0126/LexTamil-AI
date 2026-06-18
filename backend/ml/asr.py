from pathlib import Path
import tempfile
import whisper

class ASRService:
    def __init__(self, model_name="tiny"):
        self.model = whisper.load_model(model_name)

    def transcribe_path(self, audio_path: str, language: str | None = None) -> str:
        kwargs = {}
        if language:
            kwargs["language"] = language
        result = self.model.transcribe(audio_path, **kwargs)
        return result.get("text", "").strip()

    async def transcribe_upload(self, upload_file) -> str:
        suffix = Path(upload_file.filename or "audio.webm").suffix or ".webm"
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(await upload_file.read())
            tmp_path = tmp.name
        try:
            return self.transcribe_path(tmp_path, language="ta")
        finally:
            Path(tmp_path).unlink(missing_ok=True)

asr_service = ASRService("tiny")