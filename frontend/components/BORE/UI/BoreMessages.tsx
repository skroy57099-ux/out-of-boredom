"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "../Types/ChatMessage";

interface BoreMessagesProps {
  messages: ChatMessage[];
}

export default function BoreMessages({
  messages,
}: BoreMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      className="
        flex-1
        overflow-y-auto
        px-4
        py-4
        space-y-4
        bg-slate-950
      "
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user"
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`
              max-w-[85%] 
              sm:max-w-[80%]
              whitespace-pre-wrap
              rounded-2xl
              px-4
              py-3
              text-sm
              leading-relaxed
              shadow-md
              ${
                message.role === "user"
                  ? "bg-cyan-600 text-white rounded-br-md"
                  : "bg-slate-800 text-slate-100 rounded-bl-md"
              }
            `}
          >
            {message.text}
          </div>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
