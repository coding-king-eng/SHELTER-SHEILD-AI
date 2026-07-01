// ===============================
// ELEMENTS
// ===============================

const chatHistory = document.getElementById("chat-history");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing-indicator");
const themeToggle = document.getElementById("theme-toggle");

// ===============================
// AUTO RESIZE TEXTAREA
// ===============================

input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
});

// ===============================
// DARK MODE
// ===============================

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const icon = themeToggle.querySelector("i");

    if (document.body.classList.contains("dark")) {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid fa-moon";
    }

});

// ===============================
// SUGGESTION BUTTONS
// ===============================

document.querySelectorAll(".suggestion").forEach(btn => {

    btn.addEventListener("click", () => {

        input.value = btn.innerText;

        sendMessage();

    });

});

// ===============================
// ENTER TO SEND
// SHIFT + ENTER = NEW LINE
// ===============================

input.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendMessage();

    }

});

// ===============================
// CURRENT TIME
// ===============================

function getTime() {

    return new Date().toLocaleTimeString([], {

        hour: "2-digit",
        minute: "2-digit"

    });

}

// ===============================
// AUTO SCROLL
// ===============================

function scrollBottom() {

    chatHistory.scrollTop = chatHistory.scrollHeight;

}

// ===============================
// SHOW / HIDE TYPING
// ===============================

function showTyping() {

    typingIndicator.classList.remove("hidden");

    scrollBottom();

}

function hideTyping() {

    typingIndicator.classList.add("hidden");

}

// ===============================
// APPEND USER / AI MESSAGE
// ===============================

function appendMessage(text, sender) {

    const row = document.createElement("div");
    row.className = `message-row ${sender}`;

    const avatar = document.createElement("div");
    avatar.className = `avatar ${sender === "ai" ? "ai-avatar" : "user-avatar"}`;
    avatar.innerHTML = sender === "ai" ? "⚖️" : "👤";

    const group = document.createElement("div");
    group.className = "message-group";

    const bubble = document.createElement("div");
    bubble.className = `message ${sender}-message`;

    bubble.textContent = text;

    // Copy button only for AI responses

    if (sender === "ai") {

        const copyBtn = document.createElement("button");

        copyBtn.className = "copy-btn";

        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';

        copyBtn.title = "Copy";

        copyBtn.onclick = () => {

            navigator.clipboard.writeText(text);

            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';

            setTimeout(() => {

                copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';

            }, 1500);

        };

        bubble.appendChild(copyBtn);

    }

    const time = document.createElement("div");

    time.className = "time";

    time.textContent = getTime();

    group.appendChild(bubble);

    group.appendChild(time);

    if (sender === "ai") {

        row.appendChild(avatar);

        row.appendChild(group);

    } else {

        row.appendChild(group);

        row.appendChild(avatar);

    }

    chatHistory.appendChild(row);

    scrollBottom();

}

// ===============================
// TYPEWRITER EFFECT
// ===============================

async function typeMessage(text) {

    const row = document.createElement("div");
    row.className = "message-row ai";

    const avatar = document.createElement("div");
    avatar.className = "avatar ai-avatar";
    avatar.innerHTML = "⚖️";

    const group = document.createElement("div");
    group.className = "message-group";

    const bubble = document.createElement("div");
    bubble.className = "message ai-message";

    // Text container

    const textSpan = document.createElement("span");

    bubble.appendChild(textSpan);

    // Copy Button

    const copyBtn = document.createElement("button");

    copyBtn.className = "copy-btn";

    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';

    copyBtn.style.display = "none";

    bubble.appendChild(copyBtn);

    const time = document.createElement("div");

    time.className = "time";

    time.textContent = getTime();

    group.appendChild(bubble);

    group.appendChild(time);

    row.appendChild(avatar);

    row.appendChild(group);

    chatHistory.appendChild(row);

    scrollBottom();

    let finalText = "";

    for (let i = 0; i < text.length; i++) {

        finalText += text.charAt(i);

        // Better than bubble.childNodes[0]

        textSpan.textContent = finalText;

        scrollBottom();

        await new Promise(resolve => setTimeout(resolve, 15));

    }

    copyBtn.style.display = "block";

    copyBtn.onclick = () => {

        navigator.clipboard.writeText(finalText);

        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';

        setTimeout(() => {

            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';

        }, 1500);

    };

}
// ===============================
// SEND MESSAGE
// ===============================

async function sendMessage() {

    const text = input.value.trim();

    if (!text) return;

    appendMessage(text, "user");

    input.value = "";
    input.style.height = "auto";

    sendBtn.disabled = true;
    input.disabled = true;

    showTyping();

    try {

        // ===============================
        // GEMINI API
        // ===============================

        const apiKey = "AQ.Ab8RN6IOutmwPWOzjdAtJATlMfkLB9qgrbBzKEhWM95T0xVYMA";

        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // ===============================
        // SYSTEM PROMPT
        // ===============================

        const prompt = `
You are ProBono AI, an intelligent legal assistant.

Your role is to provide clear, reliable, and easy-to-understand legal information.

Rules:

• Answer ONLY legal questions.
• If the user asks something unrelated to law, politely explain that you only assist with legal matters.
• Never claim to be a licensed lawyer.
• Never invent laws or court decisions.
• If you are uncertain, clearly state that.
• Use simple language.
• Organize answers using headings and bullet points whenever appropriate.
• Suggest practical next steps whenever possible.
• Maintain a professional and respectful tone.

Always end every answer with:

"⚠️ Disclaimer: This information is for educational purposes only and should not be considered legal advice. Please consult a qualified lawyer for advice regarding your specific situation."

User Question:

${text}
`;

        // ===============================
        // API REQUEST
        // ===============================

        const response = await fetch(url, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                contents: [

                    {

                        parts: [

                            {
                                text: prompt
                            }

                        ]

                    }

                ]

            })

        });

        if (!response.ok) {

            console.log("Status:", response.status);

            const errorText = await response.text();

            console.log(errorText);

            throw new Error(`HTTP ${response.status}`);

        }

        const data = await response.json();

        // ===============================
        // SAFE RESPONSE PARSING
        // ===============================

        const botAnswer =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response at the moment.";

        hideTyping();

        await typeMessage(botAnswer);

    }

    catch (error) {

        console.error(error);

        hideTyping();

        appendMessage(
            "❌ Sorry, ProBono AI is currently unavailable. Please try again later.",
            "ai"
        );

    }

    finally {

        sendBtn.disabled = false;

        input.disabled = false;

        input.focus();

    }

}
// ===============================
// SEND BUTTON
// ===============================

sendBtn.addEventListener("click", sendMessage);

// ===============================
// OPTIONAL UX IMPROVEMENTS
// ===============================

// Prevent multiple rapid clicks
sendBtn.addEventListener("click", () => {
    if (sendBtn.disabled) return;
});

// Focus input when page loads
window.addEventListener("load", () => {
    input.focus();
});

// Scroll to bottom if window is resized
window.addEventListener("resize", scrollBottom);

// ===============================
// WELCOME MESSAGE (Optional)
// ===============================

// Uncomment this if you want the AI to greet the user
/*
window.addEventListener("load", () => {

    appendMessage(
`👋 Welcome to ProBono AI!

I'm your AI legal assistant.

I can help explain:
• Consumer rights
• Rental & tenancy issues
• Employment law
• Cybercrime
• Family law
• Property disputes
• Traffic laws
• General legal information

⚠️ I provide educational information only and not legal advice.`,
        "ai"
    );

});
*/

// ===============================
// END OF FILE
// ===============================