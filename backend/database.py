import sqlite3
import os
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(__file__), "winter_arc.db")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Tasks Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            created_date TEXT NOT NULL,
            current_streak INTEGER DEFAULT 0,
            longest_streak INTEGER DEFAULT 0
        )
    ''')

    # Daily Logs Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS daily_logs (
            id TEXT PRIMARY KEY,
            task_id TEXT NOT NULL,
            date TEXT NOT NULL,
            completed INTEGER NOT NULL,
            FOREIGN KEY (task_id) REFERENCES tasks (id)
        )
    ''')

    # Weight Entries Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS weight_entries (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            weight_kg REAL NOT NULL
        )
    ''')

    # Photos Table (Transformation Log)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS photos (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            image_data TEXT NOT NULL,
            notes TEXT DEFAULT '',
            created_at TEXT NOT NULL
        )
    ''')

    # User Progress Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_progress (
            id TEXT PRIMARY KEY,
            total_xp INTEGER DEFAULT 0,
            current_level INTEGER DEFAULT 1,
            badges_unlocked TEXT DEFAULT '[]'
        )
    ''')

    conn.commit()

    # Seed Default User Progress if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM user_progress")
    if cursor.fetchone()["cnt"] == 0:
        cursor.execute(
            "INSERT INTO user_progress (id, total_xp, current_level, badges_unlocked) VALUES ('main', 0, 1, '[]')"
        )
        conn.commit()

    # Seed Default Tactical Tasks if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM tasks")
    if cursor.fetchone()["cnt"] == 0:
        now_str = datetime.now().strftime("%Y-%m-%d")
        default_tasks = [
            ("t1", "Ice Bath / Cold Shock Therapy (42°F - 4 Mins)", "Fitness", now_str, 0, 0),
            ("t2", "Heavy Push Compound Execution (Upper A Matrix)", "Fitness", now_str, 0, 0),
            ("t3", "Deep Work Sprint (180 Mins Distributed Core)", "Discipline", now_str, 0, 0),
            ("t4", "Weighted 45lb Ruck Walk — 10,000 Step Milestone", "Fitness", now_str, 0, 0),
            ("t5", "10 Pages Hard Copy Strategic Reading + Zero Emissive Screens", "Mindset", now_str, 0, 0),
        ]
        cursor.executemany(
            "INSERT INTO tasks (id, name, category, created_date, current_streak, longest_streak) VALUES (?, ?, ?, ?, ?, ?)",
            default_tasks
        )
        conn.commit()

    conn.close()
