import os
import sys
from pathlib import Path
import uvicorn
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"
if ENV_PATH.exists():
    load_dotenv(ENV_PATH)

if __name__ == "__main__":
    print("=" * 65)
    print("  AAROGYA SAATHI - Multilingual Voice-First Healthcare AI")
    print("  Powered by Sarvam AI (105B Conversations + Bulbul TTS + Saaras STT)")
    print("=" * 65)
    print("  Server starting at: http://localhost:8000")
    print("  API Docs at:        http://localhost:8000/docs")
    print("=" * 65)
    
    # Add project root to sys.path
    if str(BASE_DIR) not in sys.path:
        sys.path.insert(0, str(BASE_DIR))

    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=False)
