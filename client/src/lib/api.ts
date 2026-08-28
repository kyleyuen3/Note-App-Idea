import type { Note, OrganizeResult } from "../types";

export async function organizeNotes(
  notes: Note[],
  existingCategories: string[]
): Promise<OrganizeResult[]> {
  const res = await fetch("/api/organize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      notes: notes.map((n) => ({ id: n.id, title: n.title, content: n.content })),
      existingCategories,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return body.results as OrganizeResult[];
}
