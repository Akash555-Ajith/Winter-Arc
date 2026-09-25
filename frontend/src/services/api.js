const API_BASE = '/api';

export async function fetchTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(name, category) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category }),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function deleteTask(taskId) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

export async function fetchLogs(date = null) {
  const url = date ? `${API_BASE}/logs?date=${date}` : `${API_BASE}/logs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export async function toggleTaskLog(taskId, date) {
  const res = await fetch(`${API_BASE}/logs/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id: taskId, date }),
  });
  if (!res.ok) throw new Error('Failed to toggle task log');
  return res.json();
}

export async function fetchWeightEntries() {
  const res = await fetch(`${API_BASE}/weight`);
  if (!res.ok) throw new Error('Failed to fetch weight entries');
  return res.json();
}

export async function addWeightEntry(date, weightKg) {
  const res = await fetch(`${API_BASE}/weight`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, weight_kg: parseFloat(weightKg) }),
  });
  if (!res.ok) throw new Error('Failed to add weight entry');
  return res.json();
}

export async function deleteWeightEntry(entryId) {
  const res = await fetch(`${API_BASE}/weight/${entryId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete weight entry');
  return res.json();
}

export async function fetchPhotos() {
  const res = await fetch(`${API_BASE}/photos`);
  if (!res.ok) throw new Error('Failed to fetch photos');
  return res.json();
}

export async function uploadPhoto(date, imageData, notes = '') {
  const res = await fetch(`${API_BASE}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, image_data: imageData, notes }),
  });
  if (!res.ok) throw new Error('Failed to upload photo');
  return res.json();
}

export async function deletePhoto(photoId) {
  const res = await fetch(`${API_BASE}/photos/${photoId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete photo');
  return res.json();
}

export async function fetchUserProgress() {
  const res = await fetch(`${API_BASE}/progress`);
  if (!res.ok) throw new Error('Failed to fetch user progress');
  return res.json();
}

export async function fetchRecap(days = 7) {
  const res = await fetch(`${API_BASE}/recap?days=${days}`);
  if (!res.ok) throw new Error('Failed to fetch recap');
  return res.json();
}

export async function exportDataJson() {
  const res = await fetch(`${API_BASE}/export`);
  if (!res.ok) throw new Error('Failed to export data');
  return res.json();
}

export async function importDataJson(backupObject) {
  const res = await fetch(`${API_BASE}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backupObject),
  });
  if (!res.ok) throw new Error('Failed to import data');
  return res.json();
}

export async function resetAllData() {
  const res = await fetch(`${API_BASE}/reset`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset all data');
  return res.json();
}
