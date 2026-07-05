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
    <div className="mt-6 flex items-center justify-between rounded-lg border border-zinc-200 p-4">
      <div>
        <p className="text-xs text-zinc-500">실시간 대기 현황 (3초마다 갱신)</p>
        <p className="text-2xl font-bold">
          {waiting > 0 ? `${waiting}팀 대기중` : "바로 입장 가능"}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => adjust(-1)}
          className="h-9 w-9 rounded-full border border-zinc-300 font-bold hover:bg-zinc-100"
          aria-label="대기 감소"
        >
          −
        </button>
        <button
          onClick={() => adjust(1)}
          className="h-9 w-9 rounded-full border border-zinc-300 font-bold hover:bg-zinc-100"
          aria-label="대기 증가"
        >
          +
        </button>
      </div>
    </div>
  );
}
