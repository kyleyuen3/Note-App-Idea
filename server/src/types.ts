export interface NoteInput {
  id: string;
  title: string;
  content: string;
}

export interface OrganizeResult {
  id: string;
  category: string;
  tags: string[];
  summary: string;
}
