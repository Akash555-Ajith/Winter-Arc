# ❄️ WINTER ARC — Tactical Ops HUD Web Application

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Language-Python_3.14-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

A full-stack, gamified cross-platform Web Application for daily habit tracking, kinetic weight telemetry, streak heatmaps, and Pokémon-style XP level progression. Designed with a **Tactical Cyberpunk Frost HUD** visual aesthetic inspired by sci-fi military command interfaces.

---

## ⚡ Key Features

- **🕹️ Command Center HUD**: Real-time telemetry status (`STRIKE RATE: 98.4%`), Day 42/90 progress indicators, and rank status (`TITAN PROTOCOL`).
- **🛡️ Non-Negotiable Routine Matrix**: Zero-tolerance daily habit checklist with category badges (*Fitness*, *Mindset*, *Discipline*, *Nutrition*) and interactive completion toggles (`CLEARED`, `ENGAGED`).
- **🔥 84-Day Arc Consistency Heatmap**: 84-day (12-week) GitHub-style grid contribution heatmap tracking long-term consistency.
- **⚡ Pokémon-Style XP & Level-Up System**:
  - **Leveling Formula**: $\text{xpForLevel}(\text{level}) = \text{level}^2 \times 50$.
  - **Rewards**: +10 XP per habit completed, +25 XP bonus for a "Perfect Day", streak multipliers.
  - **Level-Up Celebration**: Smooth animated progress bar with confetti cannon modal popup upon reaching new level thresholds.
- **⚖️ Kinetic Weight Telemetry & Velocity Curve**: Daily weight logger form with `kg` / `lbs` unit conversion and interactive line graph powered by **Recharts** (`7D`, `30D`, `ALL TIME` filters).
- **🏆 Milestone Honor Codes & Badges**: Achievement showcase grid unlocking badges for key milestones (*Iron Will Protocol*, *Strike Force 7*, *Unstoppable Apex*, *Century Titan*, *Winter Champion*).
- **📊 Periodic Debrief & Report Card**: Auto-generated performance report cards awarding grades (`S Tier ❄️`, `A Tier 🔥`, `B Tier ⭐`, `C Tier`) based on completion rates over 7-day or 30-day windows.
- **⚙️ Settings & Local Backup**: Configurable daily evening notification reminders and one-click **JSON Export & Import** for full data backup and restore.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework**: React 18 (bootstrapped with Vite 6)
- **Styling**: Tailwind CSS 3 (Custom Tactical Cyberpunk Frost palette)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Effects**: Canvas Confetti

### **Backend**
- **Framework**: Python 3 (FastAPI + Uvicorn)
- **Validation**: Pydantic v2
- **Persistence**: SQLite 3 (`winter_arc.db`)

---

## 🚀 Quick Start & Installation

### **Prerequisites**
- **Node.js** (v18 or higher) & `npm`
- **Python** (v3.10 or higher)

---

### **1. Clone the Repository**
```bash
git clone https://github.com/Akash555-Ajith/Winter-Arc.git
cd Winter-Arc
```

---

### **2. Setup & Start Backend (Python FastAPI)**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Launch FastAPI backend server (runs on http://127.0.0.1:8000)
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

---

### **3. Setup & Start Frontend (React + Vite)**
Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite React dev server (runs on http://localhost:5173)
npm run dev
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 📡 REST API Documentation

FastAPI provides automatic interactive API documentation accessible when running the backend:

- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/tasks` | `GET` | Fetch all habits and recalculate active streaks |
| `/api/tasks` | `POST` | Create a new habit protocol |
| `/api/tasks/{id}` | `DELETE` | Delete a habit and its associated logs |
| `/api/logs` | `GET` | Fetch daily completion logs |
| `/api/logs/toggle` | `POST` | Toggle task completion and process XP / level-up logic |
| `/api/weight` | `GET` / `POST` | Fetch or record kinetic weight entries |
| `/api/progress` | `GET` | Get total XP, current level, and unlocked badges |
| `/api/recap` | `GET` | Calculate report card grade and performance metrics |
| `/api/export` | `GET` | Export entire database to JSON backup |
| `/api/import` | `POST` | Restore database from JSON backup file |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
