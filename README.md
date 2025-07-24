# 💬 Chat-mate

**Chat-mate** is a modern full-stack real-time chat application that integrates with the **Gemini API** for AI-powered conversations. It includes **voice input**, **file uploads**, **multi-chat support**, and a sleek UI with **light/dark themes**, all built using React + Vite on the frontend and Express on the backend.

---

## 🚀 Features

* 🤖 **AI-Powered Chat** – Natural, context-aware responses using Google's Gemini API.
* 🎙️ **Voice Input** – Send messages via speech using browser SpeechRecognition.
* 📎 **File Attachments** – Upload PDFs, DOCX, TXT, images, or code and ask questions about them.
* 📂 **Multi-Chat Support** – Create, rename, and delete chat sessions with saved history.
* 🌗 **Theme Toggle** – Switch between dark and light themes easily.
* 📱 **Responsive Design** – Fully responsive for desktop and mobile.
* ✨ **Modern UI** – Built using Material UI and clean React components.

---

## 🛠 Tech Stack

**Frontend:**

* React + Vite
* Material UI
* Axios
* pdfjs-dist
* mammoth (for DOCX)
* uuid

**Backend:**

* Node.js + Express
* Axios
* dotenv
* cors
* Gemini API

**Others:**

* LocalStorage for chat history
* Web Speech API for voice

---

## 📁 Project Structure

## 📁 Project Structure

```text
Chat-mate/
├── client/                         # Frontend (React + Vite)
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── vite.config.js
│   ├── public/
│   │   ├── pdf.worker.min.js
│   │   └── vite.svg
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── theme.js
│       ├── api/
│       │   └── openai.js
│       ├── assets/
│       │   └── react.svg
│       └── components/
│           ├── ChatWindow.jsx
│           ├── MessageBubble.jsx
│           ├── Sidebar.jsx
│           ├── ThemeToggle.jsx
│           └── VoiceInput.jsx
│
├── server/                         # Backend (Node.js + Express)
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
└── .gitignore                      # Root-level .gitignore
```

---

## 📦 Installation

### 1. Prerequisites

* Node.js (v16+ recommended)
* Gemini API key from Google

---

### 2. Clone the Repo

```bash
git clone https://github.com/Subhapreet21/Chat-Mate.git
cd Chat-mate
```

---

### 3. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the server:

```bash
npm start
```

---

### 4. Setup Frontend

```bash
cd ../client
npm install
npm run dev
```

The frontend runs at: [http://localhost:5173](http://localhost:5173)
The backend runs at: [http://localhost:5000](http://localhost:5000)

---

## 🧪 Usage Guide

* 💬 Type or speak your message.
* 📄 Attach files (PDF, DOCX, TXT, images, code) to ask questions about their content.
* 📚 Switch between chats using the sidebar.
* 🌈 Toggle light/dark theme for comfort.

---

## 📂 Supported File Types

| Type   | Extensions                           |
| ------ | ------------------------------------ |
| Text   | `.txt`, `.md`, `.csv`, `.json`       |
| Code   | `.js`, `.py`, `.html`, `.css`, etc.  |
| PDF    | Extracts and analyzes up to 10 pages |
| DOCX   | Parses and summarizes text           |
| Images | Analyzed as base64 blobs             |

---

## 🧩 Customization

* Modify themes in: `client/src/theme.js`
* Update layout/UI in: `client/src/components/`
* Adjust backend logic in: `server/index.js`

---

## 📄 License

This project is intended for **educational and personal use only**.
Refer to [Gemini API terms](https://ai.google.dev/) for any production use.

---

