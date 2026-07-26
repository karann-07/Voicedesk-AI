# VoiceDesk AI

VoiceDesk AI turns spoken audio into clean, professional documents in seconds.  
Users can record live or upload audio files, then get AI-formatted output ready to download as PDF.

---

## 🌐 Live Demo

| | Link |
|---|---|
| Frontend | [voicedesk-ai.vercel.app](https://voicedesk-ai.vercel.app) |
| Backend | [voicedesk-backend.onrender.com](https://voicedesk-backend.onrender.com/api/process/health) |

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
git clone https://github.com/karann-07/Voicedesk-AI.git
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

## 🧱 Architecture

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

---

## 🔐 Environment Variables

### Backend
| Variable | Description |
|---|---|
| `ASSEMBLYAI_API_KEY` | AssemblyAI key for transcription |
| `GROQ_API_KEY` | Groq key for document formatting |
| `ALLOWED_ORIGIN` | Frontend URL for CORS in production |

### Frontend
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL |

---

## 🔮 Future Improvements

- [ ] Editable output before PDF export
- [ ] Native Save As dialog for PDF download
- [ ] Auto retry on API timeout
- [ ] Multiple PDF export styles
- [ ] User accounts and document history

---

## 📝 License

MIT License