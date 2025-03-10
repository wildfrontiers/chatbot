async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    const chatbox = document.getElementById("chatbox");
    
    // Display user message
    chatbox.innerHTML += `<p class="user-message">You: ${userMessage}</p>`;
    
    // Show "Chatbot is thinking..."
    chatbox.innerHTML += `<p class="bot-message" id="thinking">Chatbot is thinking...</p>`;
    
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
        
        // Convert Markdown links to clickable links
        const formattedReply = data.reply.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

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
        sendMessage();
    }
});
