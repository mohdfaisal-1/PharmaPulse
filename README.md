# PharmaPulse AI 🚀
### AI-Powered Pharmaceutical Quality Management System (QMS) & Complaint Triage Engine

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Stateful_LLM_Orchestration-orange.svg)](https://python.langchain.com/docs/langgraph)
[![Groq](https://img.shields.io/badge/Groq_LLM-llama--3.1--8b--instant-f05032.svg)](https://groq.com/)
[![SQLAlchemy](https://img.shields.io/badge/Database-PostgreSQL_%7C_MySQL_%7C_SQLite-blue.svg)](https://www.sqlalchemy.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

PharmaPulse AI is an enterprise-grade Quality Management System (QMS) designed for pharmaceutical QA officers, pharmacovigilance teams, and regulatory compliance units. It leverages stateful **LangGraph** workflows and fast **Groq LLM** inference to automate customer complaint intake, extract structured GxP parameters, evaluate patient safety risks, suggest 8D CAPA plans, and perform automated batch audit queries against database records.

---

## ✨ Key Features

- 📑 **Multi-Format Document Ingestion**: Supports PDF, DOCX, TXT, EML email files, and raw text intake.
- 🎯 **Automated Parameter Extraction**: Extracts Batch/Lot IDs, Product Names, Strengths, Expiry/Mfg Dates, Affected Quantities, and Defect Categories.
- 🛡️ **GxP Risk & CAPA Evaluation**: Generates GxP risk assessments aligned with **FDA 21 CFR Part 211.198** and **EU GMP Annex 16** guidelines.
- 🔍 **Batch Duplicate Detection**: Runs SQL checks to detect recurring complaints on the same manufactured batch.
- 📊 **Completeness Scoring Engine**: Computes 0-100% mandatory parameter completeness and flags required packaging/CoA documentation.
- 💬 **Interactive Pharma Copilot**: Context-aware AI assistant answering QMS, deviation, and CAPA compliance questions.
- 💾 **Multi-Database Support**: Out-of-the-box support for SQLite, PostgreSQL, and MySQL via environment-driven SQLAlchemy pooling.

---

## 🏗️ System Architecture

```
                       ┌────────────────────────────────────────┐
                       │        React / Redux Frontend          │
                       │     Vite + TailwindCSS + Lucide        │
                       └──────────────────┬─────────────────────┘
                                          │  HTTP / REST API
                                          ▼
                       ┌────────────────────────────────────────┐
                       │          FastAPI Web Server            │
                       │    main.py (Intake, CORS, Routes)      │
                       └──────────────────┬─────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
┌───────────────────────────────────┐           ┌──────────────────────────────────┐
│        LangGraph Workflow         │           │        SQLAlchemy ORM            │
│  1. Parameter Extraction Node     │           │  PostgreSQL / MySQL / SQLite     │
│  2. Risk & CAPA Evaluation Node   │           │  Batch Audit & Complaint Log DB  │
│  3. Validation & Completeness Node│           └──────────────────────────────────┘
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│         Groq Llama-3 LLM          │
│   llama-3.1-8b / llama-3.3-70b    │
└───────────────────────────────────┘
```

---

## 🧰 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **State Management**: Redux Toolkit (`complaintSlice`, `complaintThunks`)
- **Styling**: TailwindCSS + Lucide Icons
- **HTTP Client**: Native Fetch API

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Agent Orchestration**: LangGraph + LangChain Groq
- **LLM Engine**: Groq (`llama-3.1-8b-instant` / `llama-3.3-70b-versatile`)
- **Document Processing**: `pypdf`, `python-docx`
- **ORM & Database**: SQLAlchemy (`psycopg2-binary`, `pymysql`, SQLite)

---

## ⚡ Quick Start

### 1. Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed
- Groq API Key (Optional — built-in heuristic fallback engine runs automatically out of the box)

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables
cp .env.example .env
```

Edit `backend/.env` with your settings:
```env
GROQ_API_KEY=your_groq_api_key_here
DEFAULT_MODEL=llama-3.1-8b-instant
REASONING_MODEL=llama-3.3-70b-versatile
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:3001
DATABASE_URL=sqlite:///./pharmapulse.db
```

Launch the FastAPI development server:
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation available at: `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup

From the root directory:
```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🗄️ Database Configuration

PharmaPulse AI supports PostgreSQL, MySQL, and local SQLite through environment variable configuration in `.env`:

#### SQLite (Default Fallback)
```env
DATABASE_URL=sqlite:///./pharmapulse.db
```

#### PostgreSQL
```env
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/pharmapulse_db
```

#### MySQL
```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/pharmapulse_db
```

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `GET /` | `GET` | Service status and Groq configuration check |
| `GET /health` | `GET` | System health check endpoint |
| `POST /api/extract-text` | `POST` | Ingest raw text, execute LangGraph extraction & risk evaluation |
| `POST /api/upload` | `POST` | Upload PDF/DOCX/TXT/EML document for automated intake |
| `POST /api/copilot-chat` | `POST` | Context-aware QMS Q&A with Pharma Copilot |
| `POST /api/complaints` | `POST` | Persist triaged complaint record to database |
| `GET /api/complaints` | `GET` | List all historical logged complaint records |
| `GET /api/complaints/{id}` | `GET` | Fetch specific complaint record details |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
