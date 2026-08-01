export interface ChatMessage {
  id: string;

  role: "user" | "bore";

  text: string;

  title?: string;

  mood?: string;
}
