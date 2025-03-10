async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    const chatbox = document.getElementById("chatbox");

    // Display user message
    const userMessageElement = document.createElement("div");
    userMessageElement.classList.add("user-message");
    userMessageElement.innerText = `You: ${userMessage}`;
    chatbox.appendChild(userMessageElement);

    // Show "Chatbot is thinking..."
    const thinkingMessage = document.createElement("div");
    thinkingMessage.classList.add("bot-message", "thinking");
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
        thinkingMessage.remove();

        // Convert Markdown using Showdown.js (ensures correct numbered lists)
        const converter = new showdown.Converter({ tables: true, ghCompatibleHeaderId: true });
        const formattedReply = converter.makeHtml(data.reply);

        // Ensure response is inside chat bubble
        const botMessageElement = document.createElement("div");
        botMessageElement.classList.add("bot-message");
        botMessageElement.innerHTML = `Chatbot: ${formattedReply}`;
        chatbox.appendChild(botMessageElement);

    } catch (error) {
        thinkingMessage.remove();
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("bot-message", "error");
        errorMessage.innerText = "Error: Couldn't reach chatbot.";
        chatbox.appendChild(errorMessage);
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
