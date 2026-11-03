import os
from dotenv import load_dotenv
from sarvamai import SarvamAI

# Load environment variables from .env
load_dotenv()

# Read API key strictly from environment
api_key = os.environ.get("SARVAM_API_KEY")
if not api_key:
    raise ValueError("SARVAM_API_KEY not found. Please set it in your .env file.")

# Initialize Sarvam client
client = SarvamAI(api_subscription_key=api_key)

# Chat completion call with sarvam-105b-conversations
response = client.chat.completions(
    model="sarvam-105b-conversations",
    messages=[
        {"role": "user", "content": "Hello! Please introduce yourself briefly in one sentence."}
    ],
)

# Print the model reply
print(response.choices[0].message.content)
