// Progress storage for the Vice Trophy Guide: earned trophy names live in
// localStorage under one key, and move in and out as a JSON file.
export const STORAGE_KEY = 'vice-trophy-guide-progress-v1';

export function loadEarnedNames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((n) => typeof n === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

export function saveEarnedNames(earnedNames) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earnedNames]));
  } catch {
    // Private mode or a full store: the checklist still works in memory.
  }
}

export function downloadProgressFile(earnedNames) {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earnedNames] }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'vice-trophy-guide-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}

export async function readProgressFile(file) {
  const parsed = JSON.parse(await file.text());
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('Not a progress file: expected a JSON array or an object with an "earned" array.');
  return new Set(names.filter((n) => typeof n === 'string'));
}
