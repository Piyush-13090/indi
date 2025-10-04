export interface Comment {
  id: string | number;
  text: string;
  author?: string; // author as string, matches your backend
  authorId?: string;
  likes?: number;
  children?: Comment[];
  parentId?: string | number | null;
  timestamp?: string;
}