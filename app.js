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

    }

    else {

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
// APPEND MESSAGE
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

    // Copy button only for AI messages

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

    }

    else {

        row.appendChild(group);

        row.appendChild(avatar);

    }

    chatHistory.appendChild(row);

    scrollBottom();

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

    // Copy button
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

        bubble.childNodes[0].textContent = finalText;

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

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text
            })

        });

        const data = await response.json();

        hideTyping();

        await typeMessage(
            data.answer || "Sorry, I couldn't find an answer."
        );

    }

    catch (error) {

        hideTyping();

        appendMessage(
            "❌ Unable to contact the legal database.",
            "ai"
        );

        console.error(error);

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