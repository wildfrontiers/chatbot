import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from dotenv import load_dotenv

# Load API Key from .env file
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# OpenAI API setup
client = openai.Client(api_key=OPENAI_API_KEY)  # Corrected API Client setup

@app.route("/", methods=["GET"])
def home():
    return "Patreon Chatbot API is running!"

@app.route("/chat", methods=["POST"])
def chat():
    """Handles user messages and generates AI responses."""
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"reply": "Please enter a valid question."})

    # OpenAI API request with improved instructions
    messages = [
        {"role": "system", "content": (
            "You are a knowledgeable Patreon Help Center assistant. Your job is to answer questions about Patreon, "
            "including subscriptions, payments, pledges, and creator support. If a user asks something unrelated "
            "to Patreon, politely decline and guide them back to Patreon-related topics."
        )},
        {"role": "user", "content": user_message}
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages
        )
        return jsonify({"reply": response.choices[0].message.content})
    
    except Exception as e:
        print(f"Error: {str(e)}")  # Logs error in Render
        return jsonify({"reply": "Oops! Something went wrong. Please try again."})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use Render's provided PORT
    app.run(host="0.0.0.0", port=port, debug=True)  # Bind to 0.0.0.0
