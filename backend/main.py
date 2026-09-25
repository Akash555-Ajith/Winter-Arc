import json
import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, get_db
from models import (
    TaskCreate, ToggleLogRequest,
    WeightCreate, PhotoCreate, UserProgressResponse, BackupData
)

app = FastAPI(title="Winter Arc Tactical API", version="1.2.0")

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

def calculate_global_streaks(conn):
    """Calculates global streak: consecutive days where 100% of tasks were completed."""
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM tasks")
    task_rows = cursor.fetchall()
    if not task_rows:
        return {"current_streak": 0, "longest_streak": 0}

    total_task_count = len(task_rows)

    cursor.execute("SELECT date, COUNT(*) as done_cnt FROM daily_logs WHERE completed = 1 GROUP BY date")
    date_done_map = {row["date"]: row["done_cnt"] for row in cursor.fetchall()}

    now = datetime.now()
    today_str = now.strftime("%Y-%m-%d")

    current_streak = 0
    longest_streak = 0
    check_date = now

    if date_done_map.get(today_str, 0) < total_task_count:
        check_date = now - timedelta(days=1)

    while True:
        d_str = check_date.strftime("%Y-%m-%d")
        if date_done_map.get(d_str, 0) >= total_task_count:
            current_streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    all_dates = sorted(list(date_done_map.keys()))
    temp_streak = 0
    for d_str in all_dates:
        if date_done_map[d_str] >= total_task_count:
            temp_streak += 1
            if temp_streak > longest_streak:
                longest_streak = temp_streak
        else:
            temp_streak = 0

    if current_streak > longest_streak:
        longest_streak = current_streak

    return {"current_streak": current_streak, "longest_streak": longest_streak}

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

    global_streaks = calculate_global_streaks(conn)
    best_streak = max(global_streaks["current_streak"], global_streaks["longest_streak"])
    calc = calculate_level_from_xp(total_xp)
    current_level = calc["level"]

    # 12 New Achievements List & Rules:
    # 1. 1-day streak
    if "streak_1" not in new_unlocked and best_streak >= 1:
        new_unlocked.append("streak_1")
        changed = True

    # 2. 10-day streak
    if "streak_10" not in new_unlocked and best_streak >= 10:
        new_unlocked.append("streak_10")
        changed = True

    # 3. 30-day streak
    if "streak_30" not in new_unlocked and best_streak >= 30:
        new_unlocked.append("streak_30")
        changed = True

    # 4. 50-day streak
    if "streak_50" not in new_unlocked and best_streak >= 50:
        new_unlocked.append("streak_50")
        changed = True

    # 5. 70-day streak
    if "streak_70" not in new_unlocked and best_streak >= 70:
        new_unlocked.append("streak_70")
        changed = True

    # 6. 90-day streak
    if "streak_90" not in new_unlocked and best_streak >= 90:
        new_unlocked.append("streak_90")
        changed = True

    # 7. Level 2
    if "level_2" not in new_unlocked and current_level >= 2:
        new_unlocked.append("level_2")
        changed = True

    # 8. Level 10
    if "level_10" not in new_unlocked and current_level >= 10:
        new_unlocked.append("level_10")
        changed = True

    # 9. Level 25
    if "level_25" not in new_unlocked and current_level >= 25:
        new_unlocked.append("level_25")
        changed = True

    # 10. Level 50
    if "level_50" not in new_unlocked and current_level >= 50:
        new_unlocked.append("level_50")
        changed = True

    # 11. Level 75
    if "level_75" not in new_unlocked and current_level >= 75:
        new_unlocked.append("level_75")
        changed = True

    # 12. Level 100
    if "level_100" not in new_unlocked and current_level >= 100:
        new_unlocked.append("level_100")
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

    cursor.execute("SELECT current_streak FROM tasks WHERE id = ?", (req.task_id,))
    task = cursor.fetchone()
    streak = task["current_streak"] if task else 0
    streak_bonus = min(streak, 10)

    cursor.execute("SELECT COUNT(*) as cnt FROM tasks")
    total_tasks = cursor.fetchone()["cnt"]
    cursor.execute("SELECT COUNT(*) as cnt FROM daily_logs WHERE date = ? AND completed = 1", (req.date,))
    completed_today = cursor.fetchone()["cnt"]

    perfect_day_bonus = 25 if (completed_today >= total_tasks and total_tasks > 0) else 0

    cursor.execute("SELECT total_xp, current_level FROM user_progress WHERE id = 'main'")
    prog = cursor.fetchone()
    total_xp = prog["total_xp"]
    old_level = prog["current_level"]

    xp_change = (10 + streak_bonus + perfect_day_bonus) if new_completed == 1 else -(10 + streak_bonus)
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

@app.get("/api/photos")
def get_photos():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM photos ORDER BY date DESC")
    photos = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return photos

@app.post("/api/photos")
def upload_photo(photo: PhotoCreate):
    conn = get_db()
    cursor = conn.cursor()
    photo_id = str(uuid.uuid4())[:8]
    created_at = datetime.now().isoformat()
    cursor.execute(
        "INSERT INTO photos (id, date, image_data, notes, created_at) VALUES (?, ?, ?, ?, ?)",
        (photo_id, photo.date, photo.image_data, photo.notes or "", created_at)
    )
    conn.commit()
    conn.close()
    return {"id": photo_id, "date": photo.date, "notes": photo.notes or "", "created_at": created_at}

@app.delete("/api/photos/{photo_id}")
def delete_photo(photo_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM photos WHERE id = ?", (photo_id,))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.get("/api/progress", response_model=UserProgressResponse)
def get_progress():
    conn = get_db()
    cursor = conn.cursor()
    check_and_unlock_badges(conn)
    cursor.execute("SELECT * FROM user_progress WHERE id = 'main'")
    row = cursor.fetchone()

    global_streaks = calculate_global_streaks(conn)
    conn.close()

    total_xp = row["total_xp"]
    badges = json.loads(row["badges_unlocked"])
    calc = calculate_level_from_xp(total_xp)
    user_name = dict(row).get("user_name") or "Akash Ajith"

    return {
        "user_name": user_name,
        "total_xp": total_xp,
        "current_level": calc["level"],
        "xp_in_level": calc["xp_in_level"],
        "xp_required_for_level": calc["xp_required"],
        "global_streak": global_streaks["current_streak"],
        "longest_global_streak": global_streaks["longest_streak"],
        "badges_unlocked": badges
    }

@app.post("/api/reset")
def reset_all_data():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks")
    cursor.execute("DELETE FROM daily_logs")
    cursor.execute("DELETE FROM weight_entries")
    cursor.execute("DELETE FROM photos")
    cursor.execute(
        "UPDATE user_progress SET total_xp = 0, current_level = 1, badges_unlocked = '[]', user_name = 'Akash Ajith' WHERE id = 'main'"
    )
    conn.commit()
    conn.close()
    return {"status": "success", "message": "All tasks and telemetry reset successfully!"}

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

    cursor.execute("SELECT * FROM photos")
    photos = [dict(row) for row in cursor.fetchall()]

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
        "photos": photos,
        "userProgress": prog
    }

@app.post("/api/import")
def import_data(data: BackupData):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM tasks")
    cursor.execute("DELETE FROM daily_logs")
    cursor.execute("DELETE FROM weight_entries")
    cursor.execute("DELETE FROM photos")

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

    if data.photos:
        for p in data.photos:
            cursor.execute(
                "INSERT INTO photos (id, date, image_data, notes, created_at) VALUES (?, ?, ?, ?, ?)",
                (p["id"], p["date"], p["image_data"], p.get("notes", ""), p.get("created_at", datetime.now().isoformat()))
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
