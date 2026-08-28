import { useEffect, useMemo, useState } from "react";
import type { Note } from "./types";
import { createNote, loadNotes, saveNotes } from "./lib/storage";
import { organizeNotes } from "./lib/api";
import { NoteEditor } from "./components/NoteEditor";
import { NoteCard } from "./components/NoteCard";
import { Sidebar } from "./components/Sidebar";

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [organizingIds, setOrganizingIds] = useState<Set<string>>(new Set());
  const [isOrganizingAll, setIsOrganizingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const note of notes) {
      if (note.category) counts.set(note.category, (counts.get(note.category) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [notes]);

  const uncategorizedCount = useMemo(() => notes.filter((n) => !n.category).length, [notes]);

  const visibleNotes = useMemo(() => {
    let result = notes;

    if (selectedCategory === "__uncategorized__") {
      result = result.filter((n) => !n.category);
    } else if (selectedCategory) {
      result = result.filter((n) => n.category === selectedCategory);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return [...result].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, selectedCategory, search]);

  function addNote(title: string, content: string) {
    setNotes((prev) => [createNote(title, content), ...prev]);
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function editNote(id: string, title: string, content: string) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title, content, updatedAt: Date.now() } : n))
    );
  }

  async function organizeOne(id: string) {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    setError(null);
    setOrganizingIds((prev) => new Set(prev).add(id));
    try {
      const [result] = await organizeNotes([note], categories.map((c) => c.name));
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, category: result.category, tags: result.tags, summary: result.summary }
            : n
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to organize note.");
    } finally {
      setOrganizingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function organizeAll() {
    const targets = notes.filter((n) => !n.category);
    if (targets.length === 0) return;
    setError(null);
    setIsOrganizingAll(true);
    setOrganizingIds(new Set(targets.map((n) => n.id)));
    try {
      const results = await organizeNotes(
        targets.slice(0, 50),
        categories.map((c) => c.name)
      );
      const byId = new Map(results.map((r) => [r.id, r]));
      setNotes((prev) =>
        prev.map((n) => {
          const r = byId.get(n.id);
          return r ? { ...n, category: r.category, tags: r.tags, summary: r.summary } : n;
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to organize notes.");
    } finally {
      setIsOrganizingAll(false);
      setOrganizingIds(new Set());
    }
  }

  function handleTagClick(tag: string) {
    setSearch(tag);
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>🧠 AI Note Organizer</h1>
        <div className="app__header-actions">
          <input
            className="search"
            type="search"
            placeholder="Search notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn--primary"
            onClick={organizeAll}
            disabled={isOrganizingAll || uncategorizedCount === 0}
          >
            {isOrganizingAll ? "Organizing…" : `Organize all (${uncategorizedCount})`}
          </button>
        </div>
      </header>

      {error && (
        <div className="banner banner--error">
          {error}{" "}
          <span className="banner__hint">
            (Make sure the server is running and ANTHROPIC_API_KEY is set in server/.env)
          </span>
        </div>
      )}

      <div className="app__body">
        <Sidebar
          categories={categories}
          uncategorizedCount={uncategorizedCount}
          totalCount={notes.length}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <main className="main">
          <NoteEditor onCreate={addNote} />

          {visibleNotes.length === 0 ? (
            <p className="empty-state">
              {notes.length === 0
                ? "No notes yet — add one above to get started."
                : "No notes match this view."}
            </p>
          ) : (
            <div className="note-grid">
              {visibleNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isOrganizing={organizingIds.has(note.id)}
                  onDelete={deleteNote}
                  onOrganize={organizeOne}
                  onTagClick={handleTagClick}
                  onEditContent={editNote}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
