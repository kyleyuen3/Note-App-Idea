import { useState } from "react";

interface Props {
  onCreate: (title: string, content: string) => void;
}

export function NoteEditor({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    onCreate(title, content);
    setTitle("");
    setContent("");
  }

  return (
    <form className="note-editor" onSubmit={handleSubmit}>
      <input
        className="note-editor__title"
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="note-editor__content"
        placeholder="Jot something down..."
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="note-editor__actions">
        <button type="submit" className="btn btn--primary">
          Add note
        </button>
      </div>
    </form>
  );
}
