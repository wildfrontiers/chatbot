// Function to convert Markdown to HTML using Showdown.js
function renderMarkdown(markdownText) {
    const converter = new showdown.Converter();
    return converter.makeHtml(markdownText);
}

async function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return; // Prevent sending empty messages

    const chatBox = document.getElementById("chat-box");

    // Add user message
    chatBox.innerHTML += `<div class="user-message"><strong>You:</strong> ${userInput}</div>`;
    document.getElementById("user-input").value = ""; // Clear input box

    // Add loading indicator
    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("bot-message");
    loadingMessage.innerHTML = "<em>Bot is thinking...</em>";
    chatBox.appendChild(loadingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("https://help-center-chatbot.onrender.com/chat", { // Fixed API endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        
        // Remove loading message
        chatBox.removeChild(loadingMessage);

        // Add bot response with Markdown rendering
        chatBox.innerHTML += `<div class="bot-message"><strong>Bot:</strong> ${renderMarkdown(data.reply)}</div>`;

    } catch (error) {
        chatBox.innerHTML += `<div class="bot-message"><strong>Bot:</strong> Error reaching chatbot.</div>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
}
