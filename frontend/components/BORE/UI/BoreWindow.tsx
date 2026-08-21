"use client";

import { useState } from "react";

import BoreGreeting from "./BoreGreeting";
import BoreMessages from "./BoreMessages";
import BoreInput from "./BoreInput";
import BoreTyping from "./BoreTyping";

import type { ChatMessage } from "../Types/ChatMessage";

import { boreConversation } from "../Core/ConversationEngine";

export default function BoreWindow() {
  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [isTyping, setIsTyping] =
    useState(false);

  async function handleSend(
    message: string
  ) {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),

      role: "user",

      text: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setIsTyping(true);

    try {
      // ====================================================
      // First: existing BORE V2 brain
      // ====================================================

      const localResponse =
        boreConversation.process(message);

      // ====================================================
      // Check whether the local engine has a response
      // that requires the LLM.
      // ====================================================

      const shouldUseLLM =
        localResponse.title ===
          "BORE Intelligence";

      if (!shouldUseLLM) {
        const boreReply: ChatMessage = {
          id: crypto.randomUUID(),

          role: "bore",

          text:
            localResponse.message,

          title:
            localResponse.title,

          mood:
            localResponse.mood,
        };

        setMessages((prev) => [
          ...prev,
          boreReply,
        ]);

        return;
      }

      // ====================================================
      // LLM PATH
      // ====================================================

      const history = [
        ...messages,
        userMessage,
      ]
        .slice(-10)
        .map((item) => ({
          role:
            item.role === "user"
              ? ("user" as const)
              : ("bore" as const),

          message:
            item.text,
        }));

      const response =
        await fetch(
          "/api/bore",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message,

              context: {
                source:
                  "portfolio",

                history,
              },
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ??
            "BORE LLM request failed."
        );
      }

      // ====================================================
      // LLM Response
      // ====================================================

      const boreReply: ChatMessage = {
        id: crypto.randomUUID(),

        role: "bore",

        text:
          data.text,

        title:
          "BORE",

        mood:
          "speaking",
      };

      setMessages((prev) => [
        ...prev,
        boreReply,
      ]);

    } catch (error) {

      console.error(
        "BORE chat error:",
        error
      );

      const errorReply: ChatMessage = {
        id: crypto.randomUUID(),

        role: "bore",

        title:
          "BORE",

        mood:
          "error",

        text:
          "My external intelligence layer isn't responding right now. The local portfolio knowledge is still online.",
      };

      setMessages((prev) => [
        ...prev,
        errorReply,
      ]);

    } finally {
      setIsTyping(false);
    }
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

      <BoreMessages
        messages={messages}
      />

      {isTyping && (
        <BoreTyping />
      )}

      <BoreInput
        onSend={handleSend}
      />
    </div>
  );
}