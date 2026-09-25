# ❄️ WINTER ARC — Tactical Ops HUD Web Application

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Language-Python_3.14-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

A full-stack, gamified cross-platform Web Application for daily habit tracking, kinetic weight telemetry, streak heatmaps, physical transformation photo logs, and Pokémon-style XP level progression. Designed with a **Tactical Cyberpunk Frost HUD** visual aesthetic inspired by military command interfaces.

---

## ⚡ Key Features & Navigation Modules

### **1. 🕹️ Command Center HUD**
- **Routine Matrix**: Zero-tolerance daily habit checklist with category badges (*Fitness*, *Mindset*, *Discipline*, *Nutrition*) and interactive checkmarks (`CLEARED`, `ENGAGED`).
- **Date Selector & Task Creation**: Easily pick any date (Today or historical) and add custom routine protocols.
- **Embedded XP Header**: Integrated rank badge (`TITAN PROTOCOL | LVL X`), total XP counter, day counter (e.g. `DAY 42 / 90`), and telemetry status.

### **2. 🔥 Streak Protocol Page**
- **Global Unbroken Streak**: A day counts towards your global streak when **100% of all active routines on that date are completed** ("Perfect Day").
- **Streak Records**: Displays active Global Streak and All-Time Longest Global Streak records.
- **90-Day Streak Grid**: Interactive 90-day calendar matrix highlighting unbroken 100% days vs partial/missed days.
- **Per-Habit Breakdown**: Detailed streak statistics table for each individual routine.

### **3. 📸 Physical Transformation Log**
- **Date-Specific Photo Uploads**: Upload progress photos for specific dates with optional benchmark notes.
- **Timeline Gallery Grid**: Visually inspect physical conditioning and physique milestones over time.
- **Side-by-Side Comparison Tool**: Select any Photo A (e.g., Day 1 Baseline) vs Photo B (e.g., Today) for a visual side-by-side transformation review.

### **4. ⚡ Pokémon-Style XP & Level-Up System**
- **Leveling Formula**: $\text{xpForLevel}(\text{level}) = \text{level}^2 \times 50$ (Level 1: 50 XP, Level 2: 200 XP, Level 5: 1250 XP).
- **Rewards**: +10 XP per task completed, +25 XP bonus for a "Perfect Day", streak multipliers.
- **Smooth Animation Sequence**: 800ms smooth fill animation (`easeOut`) that fills to 100% -> pulse flashes -> resets to 0% -> triggers a snappy celebration modal with **canvas-confetti**.
- **Multi-Level Queue**: Smoothly handles multiple consecutive level-ups from a single XP gain.

### **5. ⚖️ Kinetic Weight Telemetry & Velocity Curve**
- Daily weight logger form with `kg` / `lbs` unit conversion.
- Interactive line graph powered by **Recharts** (`7D`, `30D`, `ALL TIME` filters).
- Net weight change summary statistics.

### **6. 🏆 Milestone Honor Codes & Badges**
- Achievement showcase grid unlocking badges for key milestones (*Iron Will Protocol*, *Strike Force 7*, *Unstoppable Apex*, *Century Titan*, *Winter Champion*).

### **7. 📊 Periodic Debrief & Report Card**
- Auto-generated performance report cards awarding grades (`S Tier ❄️`, `A Tier 🔥`, `B Tier ⭐`, `C Tier`) based on completion rates over 7-day or 30-day windows.

### **8. ⚙️ Settings & Local Backup**
- Configurable daily evening notification reminders.
- One-click **JSON Export & Import** for full data backup and restore.

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
| `/api/photos` | `GET` / `POST` / `DELETE` | Manage physical transformation progress photos |
| `/api/progress` | `GET` | Get total XP, level rank, and unbroken global streak stats |
| `/api/recap` | `GET` | Calculate report card grade and performance metrics |
| `/api/export` | `GET` | Export entire database to JSON backup |
| `/api/import` | `POST` | Restore database from JSON backup file |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
