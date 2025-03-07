import { useState } from "react";
import { Message, ChatProvider, ChatHookResult } from "../types/chat";
import { GeminiProvider } from "../providers/gemini-provider";

export function useChat(provider: ChatProvider = new GeminiProvider()): ChatHookResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);

      // Get context from previous messages
      const context = messages
        .slice(-4)
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

      // Get response from provider
      const response = await provider.sendMessage(content, context);

      // Add assistant message
      const assistantMessage: Message = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}
