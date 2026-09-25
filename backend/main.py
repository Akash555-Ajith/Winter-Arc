import json
import uuid
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, get_db
from models import (
    TaskCreate, TaskResponse, ToggleLogRequest,
    WeightCreate, WeightResponse, UserProgressResponse, BackupData
)

app = FastAPI(title="Winter Arc Tactical API", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

# --- Helper Functions ---
def xp_for_level(level: int) -> int:
    if level < 1:
        return 50
    return level * level * 50

def calculate_level_from_xp(total_xp: int):
    level = 1
    current_xp = total_xp
    while True:
        req = xp_for_level(level)
        if current_xp >= req:
            current_xp -= req
            level += 1
        else:
            break
    return {
        "level": level,
        "xp_in_level": current_xp,
        "xp_required": xp_for_level(level)
    }

def recalculate_streaks(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    
    now = datetime.now()
    today_str = now.strftime("%Y-%m-%d")

    for task in tasks:
        task_id = task["id"]
        cursor.execute("SELECT date, completed FROM daily_logs WHERE task_id = ? ORDER BY date DESC", (task_id,))
        logs = {row["date"]: row["completed"] for row in cursor.fetchall()}

        streak = 0
        max_streak = task["longest_streak"]
        check_date = now

        # If not completed today, check starting yesterday
        if logs.get(today_str) != 1:
            check_date = now - timedelta(days=1)

        while True:
            d_str = check_date.strftime("%Y-%m-%d")
            if logs.get(d_str) == 1:
                streak += 1
                check_date -= timedelta(days=1)
            else:
                break

        if streak > max_streak:
            max_streak = streak

        cursor.execute("UPDATE tasks SET current_streak = ?, longest_streak = ? WHERE id = ?", (streak, max_streak, task_id))
    
    conn.commit()

def check_and_unlock_badges(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_progress WHERE id = 'main'")
    progress = cursor.fetchone()
    total_xp = progress["total_xp"]
    badges = json.loads(progress["badges_unlocked"])
    new_unlocked = list(badges)
    changed = False

    # Check 1: First Task
    if "first_task" not in new_unlocked:
        cursor.execute("SELECT COUNT(*) as cnt FROM daily_logs WHERE completed = 1")
        if cursor.fetchone()["cnt"] > 0:
            new_unlocked.append("first_task")
            changed = True

    # Check 2: 7-Day Streak
    if "streak_7" not in new_unlocked:
        cursor.execute("SELECT COUNT(*) as cnt FROM tasks WHERE current_streak >= 7 OR longest_streak >= 7")
        if cursor.fetchone()["cnt"] > 0:
            new_unlocked.append("streak_7")
            changed = True

    # Check 3: 30-Day Streak
    if "streak_30" not in new_unlocked:
        cursor.execute("SELECT COUNT(*) as cnt FROM tasks WHERE current_streak >= 30 OR longest_streak >= 30")
        if cursor.fetchone()["cnt"] > 0:
            new_unlocked.append("streak_30")
            changed = True

    # Check 4: Level 10
    calc = calculate_level_from_xp(total_xp)
    if "level_10" not in new_unlocked and calc["level"] >= 10:
        new_unlocked.append("level_10")
        changed = True

    # Check 5: 10 Weight Logs
    if "weight_10" not in new_unlocked:
        cursor.execute("SELECT COUNT(*) as cnt FROM weight_entries")
        if cursor.fetchone()["cnt"] >= 10:
            new_unlocked.append("weight_10")
            changed = True

    # Check 6: 1000 XP
    if "xp_1000" not in new_unlocked and total_xp >= 1000:
        new_unlocked.append("xp_1000")
        changed = True

    if changed:
        cursor.execute("UPDATE user_progress SET badges_unlocked = ? WHERE id = 'main'", (json.dumps(new_unlocked),))
        conn.commit()

# --- API Routes ---

@app.get("/api/tasks")
def get_tasks():
    conn = get_db()
    recalculate_streaks(conn)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks ORDER BY created_date ASC")
    tasks = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return tasks

@app.post("/api/tasks")
def create_task(task: TaskCreate):
    conn = get_db()
    cursor = conn.cursor()
    task_id = str(uuid.uuid4())[:8]
    created = datetime.now().strftime("%Y-%m-%d")
    cursor.execute(
        "INSERT INTO tasks (id, name, category, created_date, current_streak, longest_streak) VALUES (?, ?, ?, ?, 0, 0)",
        (task_id, task.name, task.category, created)
    )
    conn.commit()
    conn.close()
    return {"id": task_id, "name": task.name, "category": task.category, "created_date": created, "current_streak": 0, "longest_streak": 0}

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    cursor.execute("DELETE FROM daily_logs WHERE task_id = ?", (task_id,))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.get("/api/logs")
def get_logs(date: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if date:
        cursor.execute("SELECT * FROM daily_logs WHERE date = ?", (date,))
    else:
        cursor.execute("SELECT * FROM daily_logs")
    logs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return logs

@app.post("/api/logs/toggle")
def toggle_log(req: ToggleLogRequest):
    conn = get_db()
    cursor = conn.cursor()
    log_id = f"{req.task_id}_{req.date}"

    cursor.execute("SELECT * FROM daily_logs WHERE id = ?", (log_id,))
    existing = cursor.fetchone()

    new_completed = 1
    if existing:
        new_completed = 0 if existing["completed"] == 1 else 1
        cursor.execute("UPDATE daily_logs SET completed = ? WHERE id = ?", (new_completed, log_id))
    else:
        cursor.execute("INSERT INTO daily_logs (id, task_id, date, completed) VALUES (?, ?, ?, 1)", (log_id, req.task_id, req.date))

    # Fetch task streak for bonus XP calculation
    cursor.execute("SELECT current_streak FROM tasks WHERE id = ?", (req.task_id,))
    task = cursor.fetchone()
    streak = task["current_streak"] if task else 0
    streak_bonus = min(streak, 10)

    # XP Update
    cursor.execute("SELECT total_xp, current_level FROM user_progress WHERE id = 'main'")
    prog = cursor.fetchone()
    total_xp = prog["total_xp"]
    old_level = prog["current_level"]

    xp_change = (10 + streak_bonus) if new_completed == 1 else -(10 + streak_bonus)
    new_total_xp = max(0, total_xp + xp_change)

    calc = calculate_level_from_xp(new_total_xp)
    new_level = calc["level"]

    level_up = new_level > old_level

    cursor.execute("UPDATE user_progress SET total_xp = ?, current_level = ? WHERE id = 'main'", (new_total_xp, new_level))
    conn.commit()

    recalculate_streaks(conn)
    check_and_unlock_badges(conn)

    conn.close()
    return {
        "status": "success",
        "completed": bool(new_completed),
        "new_total_xp": new_total_xp,
        "new_level": new_level,
        "level_up": level_up,
        "xp_in_level": calc["xp_in_level"],
        "xp_required": calc["xp_required"]
    }

@app.get("/api/weight")
def get_weight():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM weight_entries ORDER BY date ASC")
    entries = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return entries

@app.post("/api/weight")
def add_weight(entry: WeightCreate):
    conn = get_db()
    cursor = conn.cursor()
    entry_id = str(uuid.uuid4())[:8]
    cursor.execute("INSERT INTO weight_entries (id, date, weight_kg) VALUES (?, ?, ?)", (entry_id, entry.date, entry.weight_kg))
    conn.commit()
    check_and_unlock_badges(conn)
    conn.close()
    return {"id": entry_id, "date": entry.date, "weight_kg": entry.weight_kg}

@app.delete("/api/weight/{entry_id}")
def delete_weight(entry_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM weight_entries WHERE id = ?", (entry_id,))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.get("/api/progress", response_model=UserProgressResponse)
def get_progress():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_progress WHERE id = 'main'")
    row = cursor.fetchone()
    conn.close()

    total_xp = row["total_xp"]
    badges = json.loads(row["badges_unlocked"])
    calc = calculate_level_from_xp(total_xp)

    return {
        "total_xp": total_xp,
        "current_level": calc["level"],
        "xp_in_level": calc["xp_in_level"],
        "xp_required_for_level": calc["xp_required"],
        "badges_unlocked": badges
    }

@app.get("/api/recap")
def get_recap(days: int = 7):
    conn = get_db()
    cursor = conn.cursor()

    now = datetime.now()
    cutoff = (now - timedelta(days=days - 1)).strftime("%Y-%m-%d")

    cursor.execute("SELECT COUNT(*) as cnt FROM tasks")
    total_tasks = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM daily_logs WHERE date >= ? AND completed = 1", (cutoff,))
    actual_completed = cursor.fetchone()["cnt"]

    expected_total = max(1, total_tasks * days)
    completion_rate = min(100.0, round((actual_completed / expected_total) * 100, 1))

    grade = "C"
    if completion_rate >= 90:
        grade = "S ❄️"
    elif completion_rate >= 75:
        grade = "A 🔥"
    elif completion_rate >= 50:
        grade = "B ⭐"

    cursor.execute("SELECT weight_kg FROM weight_entries WHERE date >= ? ORDER BY date ASC", (cutoff,))
    weights = [row["weight_kg"] for row in cursor.fetchall()]
    weight_change = 0.0
    if len(weights) >= 2:
        weight_change = round(weights[-1] - weights[0], 2)

    conn.close()
    return {
        "days": days,
        "grade": grade,
        "completion_rate": completion_rate,
        "actual_completed": actual_completed,
        "expected_total": expected_total,
        "weight_change": weight_change
    }

@app.get("/api/export")
def export_data():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks")
    tasks = [dict(row) for row in cursor.fetchall()]

    cursor.execute("SELECT * FROM daily_logs")
    logs = [dict(row) for row in cursor.fetchall()]

    cursor.execute("SELECT * FROM weight_entries")
    weights = [dict(row) for row in cursor.fetchall()]

    cursor.execute("SELECT * FROM user_progress WHERE id = 'main'")
    prog = dict(cursor.fetchone())
    prog["badges_unlocked"] = json.loads(prog["badges_unlocked"])

    conn.close()
    return {
        "version": 1,
        "exportedAt": datetime.now().isoformat(),
        "tasks": tasks,
        "dailyLogs": logs,
        "weightEntries": weights,
        "userProgress": prog
    }

@app.post("/api/import")
def import_data(data: BackupData):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM tasks")
    cursor.execute("DELETE FROM daily_logs")
    cursor.execute("DELETE FROM weight_entries")

    for t in data.tasks:
        cursor.execute(
            "INSERT INTO tasks (id, name, category, created_date, current_streak, longest_streak) VALUES (?, ?, ?, ?, ?, ?)",
            (t["id"], t["name"], t["category"], t["created_date"], t.get("current_streak", 0), t.get("longest_streak", 0))
        )

    for l in data.dailyLogs:
        cursor.execute(
            "INSERT INTO daily_logs (id, task_id, date, completed) VALUES (?, ?, ?, ?)",
            (l["id"], l["task_id"], l["date"], l["completed"])
        )

    for w in data.weightEntries:
        cursor.execute(
            "INSERT INTO weight_entries (id, date, weight_kg) VALUES (?, ?, ?)",
            (w["id"], w["date"], w["weight_kg"])
        )

    p = data.userProgress
    badges_str = json.dumps(p.get("badges_unlocked", []))
    cursor.execute(
        "UPDATE user_progress SET total_xp = ?, current_level = ?, badges_unlocked = ? WHERE id = 'main'",
        (p.get("total_xp", 0), p.get("current_level", 1), badges_str)
    )

    conn.commit()
    conn.close()
    return {"status": "success", "message": "Import completed successfully!"}
