# VoiceDesk AI

VoiceDesk AI turns spoken audio into clean, professional documents in seconds.  
Users can record live or upload audio files, then get AI-formatted output ready to download as PDF.

---

## 🌐 Live Demo

**MVP Demo:** [Add your deployed app URL here]

---

## 🚀 Key Features

- 🎙 Live voice recording in browser
- 📁 Audio upload support (MP3, WAV, M4A, WebM, OGG up to 50MB)
- 🤖 Speech-to-text transcription with AssemblyAI
- ✨ AI document structuring with Groq (Llama 3.3 70B)
- 📄 One-click PDF export using Apache PDFBox
- 🎨 Smooth, modern UI built with React + Tailwind + Framer Motion

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion  
- **Backend:** Spring Boot 3.2, Java 17  
- **Integrations:** AssemblyAI, Groq API  
- **PDF Engine:** Apache PDFBox  
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## ▶️ Run Locally

### 1) Clone
```bash
git clone https://github.com/YOUR_USERNAME/voicedesk.git
cd voicedesk
```

### 2) Start Backend
```bash
cd backend
```

Set environment variables and run:

**PowerShell (Windows)**
```powershell
$env:ASSEMBLYAI_API_KEY="your_key"
$env:GROQ_API_KEY="your_key"
mvn spring-boot:run
```

**Bash (Mac/Linux)**
```bash
export ASSEMBLYAI_API_KEY=your_key
export GROQ_API_KEY=your_key
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

### 3) Start Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🧱 Architecture Snapshot

```text
+--------------------------------------------------+
|           BROWSER  (React 18 + Vite)             |
|                                                  |
|   Landing Page                                   |
|   Record Page    -->   RecordButton.jsx          |
|   Upload Page    -->   FileUpload.jsx            |
|   Output Page    -->   OutputPreview.jsx         |
+--------------------------------------------------+
                         |
                         | HTTP REST
                         | multipart/form-data
                         v
+--------------------------------------------------+
|         Spring Boot 3.2  (Java 17 | Port 8080)   |
|                                                  |
|   ProcessController.java                         |
|   |                                              |
|   +---> WhisperService.java                      |
|   |     (AssemblyAI - Speech to Text)            |
|   |                                              |
|   +---> ClaudeService.java                       |
|   |     (Groq - Document Formatting)             |
|   |                                              |
|   +---> PDFService.java                          |
|         (Apache PDFBox - PDF Generation)         |
|                                                  |
+--------------------------------------------------+
          |                        |
          v                        v
+-----------------+    +--------------------+
|  AssemblyAI API |    |     Groq API       |
|  Speech to Text |    |  Llama 3.3 70B     |
+-----------------+    +--------------------+


+--------------------------------------------------+
|                  DEPLOYMENT                      |
|                                                  |
|   Frontend  -->  Vercel                          |
|   Backend   -->  Render                          |
|                                                  |
+--------------------------------------------------+
```