from pydantic import BaseModel
from typing import List, Optional

class TaskCreate(BaseModel):
    name: str
    category: str = "General"

class TaskResponse(BaseModel):
    id: str
    name: str
    category: str
    created_date: str
    current_streak: int
    longest_streak: int

class ToggleLogRequest(BaseModel):
    task_id: str
    date: str  # YYYY-MM-DD

class WeightCreate(BaseModel):
    date: str  # YYYY-MM-DD
    weight_kg: float

class WeightResponse(BaseModel):
    id: str
    date: str
    weight_kg: float

class UserProgressResponse(BaseModel):
    total_xp: int
    current_level: int
    xp_in_level: int
    xp_required_for_level: int
    badges_unlocked: List[str]

class BackupData(BaseModel):
    version: int = 1
    exportedAt: str
    tasks: List[dict]
    dailyLogs: List[dict]
    weightEntries: List[dict]
    userProgress: dict
