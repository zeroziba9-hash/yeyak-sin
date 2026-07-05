"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  sender: string;
  content: string;
  createdAt: string;
};

export default function ChatPanel({ restaurantId }: { restaurantId: number }) {
  const [role, setRole] = useState<"user" | "owner">("user");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/restaurants/${restaurantId}/chat`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setMessages(data);
      });

    const source = new EventSource(`/api/restaurants/${restaurantId}/chat/stream`);
    source.onmessage = (event) => {
      const message: ChatMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      cancelled = true;
      source.close();
    };
  }, [restaurantId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const content = input;
    setInput("");

    await fetch(`/api/restaurants/${restaurantId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: role, content }),
    });
  };

  return (
    <div className="glass-card mt-4 overflow-hidden rounded-2xl shadow-sm">
      <div className="flex items-center justify-between border-b border-white/60 px-4 py-3">
        <h2 className="flex items-center gap-1.5 text-lg font-bold text-zinc-800">
          💬 실시간 상담
        </h2>
        <div className="flex gap-1 rounded-full bg-zinc-100/80 p-1 text-xs">
          <button
            onClick={() => setRole("user")}
            className={`rounded-full px-3 py-1 font-semibold transition-all ${
              role === "user"
                ? "gradient-brand text-white shadow-sm"
                : "text-zinc-500"
            }`}
          >
            고객으로 보기
          </button>
          <button
            onClick={() => setRole("owner")}
            className={`rounded-full px-3 py-1 font-semibold transition-all ${
              role === "owner"
                ? "gradient-brand text-white shadow-sm"
                : "text-zinc-500"
            }`}
          >
            사장님으로 보기
          </button>
        </div>
      </div>

      <div className="flex h-72 flex-col gap-2 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="m-auto text-sm text-zinc-400">
            아직 대화가 없습니다. 메시지를 보내보세요.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === role ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                m.sender === role
                  ? "gradient-brand text-white"
                  : "bg-white/90 text-zinc-800"
              }`}
            >
              <p className="mb-0.5 text-[10px] opacity-70">
                {m.sender === "owner" ? "사장님" : "고객"}
              </p>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex gap-2 border-t border-white/60 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={role === "user" ? "문의할 내용을 입력하세요" : "답변을 입력하세요"}
          className="flex-1 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
        />
        <button
          type="submit"
          className="gradient-brand rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/30 transition-transform hover:scale-105"
        >
          전송
        </button>
      </form>
    </div>
  );
}
