import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from dotenv import load_dotenv
import requests

# Load API Key from .env file
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# OpenAI API setup
client = openai.Client(api_key=OPENAI_API_KEY)

PATREON_HELP_CENTER_URL = "https://support.patreon.com/hc/en-us"

@app.route("/", methods=["GET"])
def home():
    return "Patreon Chatbot API is running!"

def fetch_relevant_link(query):
    """Search Patreon Help Center for relevant links."""
    search_url = f"{PATREON_HELP_CENTER_URL}/search.json?query={query}"
    
    try:
        response = requests.get(search_url)
        response.raise_for_status()
        results = response.json().get("results", [])
        
        if results:
            first_result = results[0]  # Get the most relevant result
            return f"For more details, visit: {PATREON_HELP_CENTER_URL}{first_result['url']}"
    
    except requests.RequestException as e:
        print(f"Error fetching Help Center link: {e}")
    
    return ""

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
        bot_reply = response.choices[0].message.content
        
        # Fetch relevant Patreon Help Center link
        link = fetch_relevant_link(user_message)
        if link:
            bot_reply += f"\n\n🔗 {link}"
        
        return jsonify({"reply": bot_reply})
    
    except Exception as e:
        print(f"Error: {str(e)}")  # Logs error in Render
        return jsonify({"reply": "Oops! Something went wrong. Please try again."})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use Render's provided PORT
    app.run(host="0.0.0.0", port=port, debug=True)  # Bind to 0.0.0.0
