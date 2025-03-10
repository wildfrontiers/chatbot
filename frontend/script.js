async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    const chatbox = document.getElementById("chatbox");
    chatbox.innerHTML += `<p class="user-message">You: ${userMessage}</p>`;
    userInput.value = ""; // Clear input field

    try {
        const response = await fetch("https://help-center-chatbot.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        chatbox.innerHTML += `<p class="bot-message">Chatbot: ${data.reply}</p>`;
        chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to latest message

    } catch (error) {
        chatbox.innerHTML += `<p class="bot-message error">Error: Couldn't reach chatbot.</p>`;
    }
}

// Allow pressing "Enter" to send messages
document.getElementById("userInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
