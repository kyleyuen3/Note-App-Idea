export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  category: string | null;
  tags: string[];
  summary: string | null;
}

export interface OrganizeResult {
  id: string;
  category: string;
  tags: string[];
  summary: string;
}
