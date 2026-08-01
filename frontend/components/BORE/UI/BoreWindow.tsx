"use client";

import { useState } from "react";

import BoreGreeting from "./BoreGreeting";
import BoreMessages from "./BoreMessages";
import BoreInput from "./BoreInput";
import BoreTyping from "./BoreTyping";

import type { ChatMessage } from "../Types/ChatMessage";

import { boreConversation } from "../Core/ConversationEngine";

export default function BoreWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  async function handleSend(message: string) {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = boreConversation.process(message);

    const boreReply: ChatMessage = {
      id: crypto.randomUUID(),
      role: "bore",
      text: response.message,
      title: response.title,
      mood: response.mood,
    };

    setMessages((prev) => [...prev, boreReply]);

    setIsTyping(false);
  }

  return (
    <div
      className="
        flex
        flex-col

        h-[560px]
        w-[380px]

        overflow-hidden

        rounded-2xl
        border
        border-slate-700

        bg-slate-950

        shadow-2xl
      "
    >
      <BoreGreeting />

      <BoreMessages messages={messages} />

      {isTyping && <BoreTyping />}

      <BoreInput onSend={handleSend} />
    </div>
  );
}
