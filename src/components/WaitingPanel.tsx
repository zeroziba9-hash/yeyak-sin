"use client";

import { useEffect, useState } from "react";

export default function WaitingPanel({
  restaurantId,
  initialWaiting,
}: {
  restaurantId: number;
  initialWaiting: number;
}) {
  const [waiting, setWaiting] = useState(initialWaiting);

  useEffect(() => {
    const poll = async () => {
      const res = await fetch(`/api/restaurants/${restaurantId}/waiting`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setWaiting(data.waiting);
      }
    };

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [restaurantId]);

  const adjust = async (delta: number) => {
    const res = await fetch(`/api/restaurants/${restaurantId}/waiting`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta }),
    });
    if (res.ok) {
      const data = await res.json();
      setWaiting(data.waiting);
    }
  };

  return (
    <div className="glass-card mt-4 flex items-center justify-between rounded-2xl p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold text-zinc-500">
          실시간 대기 현황 · 3초마다 갱신
        </p>
        <p className="mt-1 text-2xl font-extrabold text-zinc-800">
          {waiting > 0 ? (
            <>
              <span className="gradient-text">{waiting}팀</span> 대기중
            </>
          ) : (
            "바로 입장 가능"
          )}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => adjust(-1)}
          className="h-10 w-10 rounded-full bg-white/80 font-bold text-zinc-600 shadow-sm transition-all hover:scale-105 hover:shadow-md"
          aria-label="대기 감소"
        >
          −
        </button>
        <button
          onClick={() => adjust(1)}
          className="gradient-brand h-10 w-10 rounded-full font-bold text-white shadow-md shadow-purple-500/30 transition-all hover:scale-105"
          aria-label="대기 증가"
        >
          +
        </button>
      </div>
    </div>
  );
}
