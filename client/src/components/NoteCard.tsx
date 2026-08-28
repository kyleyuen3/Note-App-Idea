import type { Note } from "../types";

interface Props {
  note: Note;
  isOrganizing: boolean;
  onDelete: (id: string) => void;
  onOrganize: (id: string) => void;
  onTagClick: (tag: string) => void;
  onEditContent: (id: string, title: string, content: string) => void;
}

export function NoteCard({ note, isOrganizing, onDelete, onOrganize, onTagClick, onEditContent }: Props) {
  return (
    <article className="note-card">
      <header className="note-card__header">
        <input
          className="note-card__title"
          value={note.title}
          onChange={(e) => onEditContent(note.id, e.target.value, note.content)}
        />
        {note.category && <span className="badge">{note.category}</span>}
      </header>

      <textarea
        className="note-card__content"
        value={note.content}
        rows={3}
        onChange={(e) => onEditContent(note.id, note.title, e.target.value)}
      />

      {note.summary && (
        <p className="note-card__summary">
          <strong>Summary: </strong>
          {note.summary}
        </p>
      )}

      {note.tags.length > 0 && (
        <div className="note-card__tags">
          {note.tags.map((tag) => (
            <button key={tag} className="tag" onClick={() => onTagClick(tag)}>
              #{tag}
            </button>
          ))}
        </div>
      )}

      <footer className="note-card__footer">
        <button
          className="btn btn--small"
          onClick={() => onOrganize(note.id)}
          disabled={isOrganizing}
        >
          {isOrganizing ? "Organizing…" : note.category ? "Re-organize" : "Organize with AI"}
        </button>
        <button className="btn btn--small btn--danger" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </footer>
    </article>
  );
}
