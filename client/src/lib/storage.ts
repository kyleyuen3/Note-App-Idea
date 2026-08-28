import type { Note } from "../types";

const STORAGE_KEY = "ai-note-organizer:notes:v1";

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // localStorage can throw if disabled or full; notes just won't persist.
  }
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createNote(title: string, content: string): Note {
  const now = Date.now();
  return {
    id: makeId(),
    title: title.trim() || "Untitled note",
    content: content.trim(),
    createdAt: now,
    updatedAt: now,
    category: null,
    tags: [],
    summary: null,
  };
}
