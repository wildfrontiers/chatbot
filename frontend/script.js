// Function to convert Markdown to HTML using Showdown.js
function renderMarkdown(markdownText) {
    const converter = new showdown.Converter();
    return converter.makeHtml(markdownText);
}

async function sendMessage() {
    const userInput = document.getElementById("userInput").value.trim();
    if (!userInput) return;

    const chatbox = document.getElementById("chatbox");

    // Display user message
    chatbox.innerHTML += `<p class="user-message"><strong>You:</strong> ${userInput}</p>`;
    document.getElementById("userInput").value = ""; // Clear input field

    // Add loading message
    const loadingMessage = document.createElement("p");
    loadingMessage.classList.add("bot-message");
    loadingMessage.innerHTML = "<em>Chatbot is thinking...</em>";
    chatbox.appendChild(loadingMessage);
    chatbox.scrollTop = chatbox.scrollHeight;

    try {
        const response = await fetch("https://help-center-chatbot.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        chatbox.removeChild(loadingMessage); // Remove loading indicator

        // Add bot response with Markdown rendering
        chatbox.innerHTML += `<p class="bot-message"><strong>Chatbot:</strong> ${renderMarkdown(data.reply)}</p>`;

    } catch (error) {
        chatbox.innerHTML += `<p class="bot-message error"><strong>Chatbot:</strong> Error reaching chatbot.</p>`;
    }

    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to latest message
}
