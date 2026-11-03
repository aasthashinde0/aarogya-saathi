import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

# Base directory paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

if ENV_PATH.exists():
    load_dotenv(ENV_PATH)
else:
    load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "Aarogya Saathi"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SARVAM_API_KEY: str = os.environ.get("SARVAM_API_KEY", "")
    
    # Storage
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    DATABASE_PATH: Path = BASE_DIR / "aarogya_saathi.db"
    
    # Models
    SARVAM_CHAT_MODEL: str = "sarvam-105b-conversations"
    SARVAM_TTS_MODEL: str = "bulbul:v3"
    SARVAM_STT_MODEL: str = "saaras:v3"
    SARVAM_TRANSLATE_MODEL: str = "mayura:v1"
    
    # Supported Indian Languages (Mapped to bulbul:v3 supported speakers)
    # Available bulbul:v3 speakers: aditya, ritu, ashutosh, priya, neha, rahul, pooja, rohan, simran, kavya, amit, dev, ishita, shreya, ratan, varun, manan, sumit, roopa, kabir, aayan, shubh, advait, anand, tanya, tarun, sunny, mani, gokul, vijay, shruti, suhani, mohit, kavitha, rehan, soham, rupali
    SUPPORTED_LANGUAGES: dict = {
        "hi-IN": {"name": "Hindi", "native": "हिन्दी", "default_speaker": "aditya"},
        "en-IN": {"name": "English (India)", "native": "English", "default_speaker": "simran"},
        "mr-IN": {"name": "Marathi", "native": "मराठी", "default_speaker": "ishita"},
        "ta-IN": {"name": "Tamil", "native": "தமிழ்", "default_speaker": "vijay"},
        "te-IN": {"name": "Telugu", "native": "తెలుగు", "default_speaker": "pooja"},
        "bn-IN": {"name": "Bengali", "native": "বাংলা", "default_speaker": "roopa"},
        "gu-IN": {"name": "Gujarati", "native": "ગુજરાતી", "default_speaker": "pooja"},
        "kn-IN": {"name": "Kannada", "native": "ಕನ್ನಡ", "default_speaker": "priya"},
        "ml-IN": {"name": "Malayalam", "native": "മലയാളം", "default_speaker": "kavitha"},
        "pa-IN": {"name": "Punjabi", "native": "ਪੰਜਾਬੀ", "default_speaker": "anand"},
        "od-IN": {"name": "Odia", "native": "ଓଡ଼ିଆ", "default_speaker": "aditya"}
    }

settings = Settings()
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
