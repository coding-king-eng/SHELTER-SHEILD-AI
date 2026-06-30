# SHELTER-SHEILD-AI# 

⚖️ ProBono AI – Tenant Rights Defender

ProBono AI is an AI-powered legal assistant designed to help tenants understand their rights using **Retrieval-Augmented Generation (RAG)**. Instead of generating generic responses, the application retrieves information from verified legal documents stored in a Dify Knowledge Base, providing accurate and grounded answers.

This project was built as a legal-tech solution to make tenant rights more accessible through a modern AI chatbot interface.

---

## ✨ Features

* 🤖 AI-powered legal assistant
* 📚 RAG (Retrieval-Augmented Generation) with Dify Knowledge Base
* ⚖️ Grounded responses based on verified tenant laws
* 💬 Modern ChatGPT-inspired interface
* ⌨️ Typing animation and typewriter response effect
* 🌙 Light/Dark mode
* 📋 Copy AI responses with one click
* 💡 Suggested legal questions
* 📱 Responsive design for desktop and mobile
* ⚡ Fast and intuitive user experience

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Backend

* Node.js
* Express.js

### AI & RAG

* Dify AI
* Dify Knowledge Base
* Retrieval-Augmented Generation (RAG)

---

## 📂 Project Structure

```
ProBono-AI/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── server.js
├── package.json
├── .env
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ProBono-AI.git
```

### 2. Navigate to the project

```bash
cd ProBono-AI
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

```env
DIFY_API_KEY=YOUR_DIFY_API_KEY
DIFY_API_URL=https://api.dify.ai/v1/chat-messages
PORT=3000
```

### 5. Start the server

```bash
node server.js
```

Open your browser and visit:

```
http://localhost:3000
```

---

## 💡 Example Questions

* Can my landlord evict me without notice?
* Can my landlord increase my rent anytime?
* What should I do if my landlord refuses to make repairs?
* Can my security deposit be withheld?
* What are my rights if utilities are disconnected?

---

## 🔒 Security

For security reasons, the Dify API key is stored on the backend using environment variables (`.env`) and is **never exposed** to the frontend.

---

## 🎯 Future Improvements

* 📄 Lease agreement PDF analysis
* 🎙️ Voice input
* 🌐 Multi-language support
* 📑 Source citations from retrieved legal documents
* 💾 Conversation history
* 📱 Progressive Web App (PWA)

---

## 👨‍💻 Author

**Shorya Agrawal**

If you found this project helpful, consider giving it a ⭐ on GitHub!
