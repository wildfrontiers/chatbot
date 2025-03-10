
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
client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Allowed topics for the chatbot
ALLOWED_KEYWORDS = ["patreon", "payment", "subscription", "creator", "pledge", "refund", "tier", "exclusive content", "patron"]

def is_relevant_query(user_input):
    """Check if user input is related to Patreon support."""
    return any(keyword in user_input.lower() for keyword in ALLOWED_KEYWORDS)

@app.route("/chat", methods=["POST"])
def chat():
    """Handles user messages and generates AI responses."""
    data = request.get_json()
    user_message = data.get("message", "")

    if not is_relevant_query(user_message):
        return jsonify({"reply": "I'm here to assist with Patreon-related questions. How can I help?"})

    # OpenAI API request
    messages = [
        {"role": "system", "content": "You are a Patreon Help Center assistant. Only answer Patreon-related questions. If a query is off-topic, politely refuse."},
        {"role": "user", "content": user_message}
    ]

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )

    return jsonify({"reply": response.choices[0].message.content})

if __name__ == "__main__":
    app.run(debug=True)

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
client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Allowed topics for the chatbot
ALLOWED_KEYWORDS = ["patreon", "payment", "subscription", "creator", "pledge", "refund", "tier", "exclusive content", "patron"]

def is_relevant_query(user_input):
    """Check if user input is related to Patreon support."""
    return any(keyword in user_input.lower() for keyword in ALLOWED_KEYWORDS)

@app.route("/chat", methods=["POST"])
def chat():
    """Handles user messages and generates AI responses."""
    data = request.get_json()
    user_message = data.get("message", "")

    if not is_relevant_query(user_message):
        return jsonify({"reply": "I'm here to assist with Patreon-related questions. How can I help?"})

    # OpenAI API request
    messages = [
        {"role": "system", "content": "You are a Patreon Help Center assistant. Only answer Patreon-related questions. If a query is off-topic, politely refuse."},
        {"role": "user", "content": user_message}
    ]

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )

    return jsonify({"reply": response.choices[0].message.content})

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use Render's provided PORT
    app.run(host="0.0.0.0", port=port, debug=True)  # Bind to 0.0.0.0


