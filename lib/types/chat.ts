export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatProvider {
  sendMessage: (message: string, context?: string) => Promise<string>;
  getSystemPrompt: () => string;
}

export interface ChatHookResult {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
}
