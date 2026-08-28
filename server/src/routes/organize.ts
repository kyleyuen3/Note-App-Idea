import { Router } from "express";
import { organizeNotes } from "../anthropic.js";
import type { NoteInput } from "../types.js";

export const organizeRouter = Router();

function isValidNote(value: unknown): value is NoteInput {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as any).id === "string" &&
    typeof (value as any).title === "string" &&
    typeof (value as any).content === "string"
  );
}

organizeRouter.post("/", async (req, res) => {
  const { notes, existingCategories } = req.body ?? {};

  if (!Array.isArray(notes) || notes.length === 0 || !notes.every(isValidNote)) {
    res.status(400).json({
      error: "Request body must include a non-empty `notes` array of {id, title, content}.",
    });
    return;
  }
  if (notes.length > 50) {
    res.status(400).json({ error: "Too many notes at once (limit 50). Organize in smaller batches." });
    return;
  }

  const categories = Array.isArray(existingCategories)
    ? existingCategories.filter((c): c is string => typeof c === "string")
    : [];

  try {
    const results = await organizeNotes(notes, categories);
    res.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to organize notes.";
    const status = message.includes("ANTHROPIC_API_KEY") ? 503 : 502;
    res.status(status).json({ error: message });
  }
});
