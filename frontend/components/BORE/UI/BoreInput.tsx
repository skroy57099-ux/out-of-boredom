"use client";

import { useState, KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";

interface BoreInputProps {
  onSend: (message: string) => void;
}

export default function BoreInput({ onSend }: BoreInputProps) {
  const [input, setInput] = useState("");

  function sendMessage() {
    const message = input.trim();

    if (!message) return;

    onSend(message);
    setInput("");
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className="
        border-t
        border-slate-800
        bg-slate-900
        p-4
      "
    >
      <div
        className="
          flex
          items-end
          gap-3
        "
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask BORE about this portfolio..."
          rows={1}
          className="
            flex-1
            resize-none
            rounded-xl
            border
            border-slate-700
            bg-slate-950
            px-4
            py-3
            text-sm
            text-slate-100
            placeholder:text-slate-500

            outline-none

            focus:border-cyan-500
            focus:ring-1
            focus:ring-cyan-500
          "
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="
            flex
            h-12
            w-12
            items-center
            justify-center

            rounded-xl

            bg-cyan-600
            text-white

            transition-all
            duration-200

            hover:bg-cyan-500

            disabled:cursor-not-allowed
            disabled:bg-slate-700
            disabled:text-slate-500
          "
        >
          <SendHorizontal size={18} />
        </button>
      </div>

      <p
        className="
          mt-2
          text-xs
          text-slate-500
        "
      >
        Press <span className="text-slate-400">Enter</span> to send •{" "}
        <span className="text-slate-400">Shift + Enter</span> for a new line
      </p>
    </div>
  );
}
