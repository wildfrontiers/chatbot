async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    const chatbox = document.getElementById("chatbox");

    // Display user message
    chatbox.innerHTML += `<p class="user-message">You: ${userMessage}</p>`;

    // Show "Chatbot is thinking..."
    const thinkingMessage = document.createElement("p");
    thinkingMessage.classList.add("bot-message");
    thinkingMessage.id = "thinking";
    thinkingMessage.innerHTML = "<em>Chatbot is thinking...</em>";
    chatbox.appendChild(thinkingMessage);

    chatbox.scrollTop = chatbox.scrollHeight;
    userInput.value = ""; // Clear input field

    try {
        const response = await fetch("https://help-center-chatbot.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        // Remove "Chatbot is thinking..."
        document.getElementById("thinking").remove();

        // Convert Markdown using Showdown.js
        const converter = new showdown.Converter();
        const formattedReply = converter.makeHtml(data.reply);

        chatbox.innerHTML += `<p class="bot-message">Chatbot: ${formattedReply}</p>`;

    } catch (error) {
        document.getElementById("thinking").remove();
        chatbox.innerHTML += `<p class="bot-message error">Error: Couldn't reach chatbot.</p>`;
    }

    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to latest message
}

// Allow pressing "Enter" to send messages
document.getElementById("userInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
