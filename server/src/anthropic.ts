import Anthropic from "@anthropic-ai/sdk";
import type { NoteInput, OrganizeResult } from "./types.js";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to server/.env (see server/.env.example)."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

const SYSTEM_PROMPT = `You are an assistant that organizes a user's personal notes.

For each note you are given, decide:
- "category": a short, human-friendly category name (1-3 words, title case, e.g. "Work", "Recipes", "Trip Planning"). Reuse one of the existing categories if it genuinely fits; otherwise invent a new concise one. Do not create near-duplicate categories (e.g. "Work" and "Work Stuff").
- "tags": 1-5 short lowercase tags (single words or short phrases) capturing key topics, people, or entities mentioned.
- "summary": a plain-English summary in 1-2 sentences, written for someone skimming their notes list. If the note is very short, the summary can just restate it concisely.

Respond with ONLY a single JSON array and nothing else - no markdown code fences, no commentary before or after. Each array element must be an object of the exact shape:
{"id": "<the note's id, copied exactly>", "category": "<category>", "tags": ["<tag>", ...], "summary": "<summary>"}

Return exactly one result per note given, in any order, matching ids exactly.`;

function buildUserMessage(notes: NoteInput[], existingCategories: string[]): string {
  return JSON.stringify(
    {
      existingCategories,
      notes: notes.map((n) => ({ id: n.id, title: n.title, content: n.content })),
    },
    null,
    2
  );
}

function extractJsonArray(text: string): unknown {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("Model response did not contain a JSON array.");
  }
  return JSON.parse(text.slice(start, end + 1));
}

function coerceResults(raw: unknown, notes: NoteInput[]): OrganizeResult[] {
  if (!Array.isArray(raw)) {
    throw new Error("Model response was not a JSON array.");
  }

  const byId = new Map<string, Partial<OrganizeResult>>();
  for (const entry of raw) {
    if (entry && typeof entry === "object" && typeof (entry as any).id === "string") {
      byId.set((entry as any).id, entry as Partial<OrganizeResult>);
    }
  }

  return notes.map((note) => {
    const found = byId.get(note.id);
    const category =
      found && typeof found.category === "string" && found.category.trim()
        ? found.category.trim()
        : "Uncategorized";
    const tags =
      found && Array.isArray(found.tags)
        ? found.tags.filter((t): t is string => typeof t === "string").slice(0, 5)
        : [];
    const summary =
      found && typeof found.summary === "string" && found.summary.trim()
        ? found.summary.trim()
        : note.content.slice(0, 140);

    return { id: note.id, category, tags, summary };
  });
}

export async function organizeNotes(
  notes: NoteInput[],
  existingCategories: string[]
): Promise<OrganizeResult[]> {
  const anthropic = getClient();
  const model = process.env.CLAUDE_MODEL || "claude-sonnet-5";

  const response = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserMessage(notes, existingCategories) }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Model response contained no text.");
  }

  const parsed = extractJsonArray(textBlock.text);
  return coerceResults(parsed, notes);
}
