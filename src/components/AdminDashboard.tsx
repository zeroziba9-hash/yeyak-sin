"use client";

import Link from "next/link";
import { useState } from "react";

type Restaurant = {
  id: number;
  name: string;
  category: string;
  waiting: number;
  _count: { reviews: number };
};

export default function AdminDashboard({
  initialRestaurants,
}: {
  initialRestaurants: Restaurant[];
}) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);

  const adjust = async (id: number, delta: number) => {
    const res = await fetch(`/api/restaurants/${id}/waiting`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta }),
    });
    if (res.ok) {
      const data = await res.json();
      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? { ...r, waiting: data.waiting } : r))
      );
    }
  };

  const totalWaiting = restaurants.reduce((sum, r) => sum + r.waiting, 0);
  const waitingCount = restaurants.filter((r) => r.waiting > 0).length;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
      <h1 className="gradient-text text-2xl font-extrabold">사장님 관리 대시보드</h1>
      <p className="mt-1 text-sm text-zinc-500">
        전체 매장의 실시간 대기 현황을 한눈에 확인하고 조정하세요.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-4 text-center shadow-sm">
          <p className="text-xs font-semibold text-zinc-500">전체 매장</p>
          <p className="mt-1 text-2xl font-extrabold text-zinc-800">
            {restaurants.length}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center shadow-sm">
          <p className="text-xs font-semibold text-zinc-500">대기중 매장</p>
          <p className="mt-1 text-2xl font-extrabold text-orange-500">
            {waitingCount}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center shadow-sm">
          <p className="text-xs font-semibold text-zinc-500">전체 대기 팀 수</p>
          <p className="mt-1 text-2xl font-extrabold text-purple-600">
            {totalWaiting}팀
          </p>
        </div>
      </div>

      <div className="glass-card mt-6 divide-y divide-white/60 overflow-hidden rounded-2xl shadow-sm">
        {restaurants.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between px-5 py-3"
          >
            <div>
              <Link
                href={`/restaurants/${r.id}`}
                className="font-semibold text-zinc-800 hover:text-purple-600"
              >
                {r.name}
              </Link>
              <p className="text-xs text-zinc-500">
                {r.category} · 리뷰 {r._count.reviews}개
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  r.waiting > 0
                    ? "bg-orange-100 text-orange-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {r.waiting > 0 ? `대기 ${r.waiting}팀` : "바로입장"}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => adjust(r.id, -1)}
                  className="h-8 w-8 rounded-full bg-white/80 font-bold text-zinc-600 shadow-sm transition-all hover:scale-105 hover:shadow-md"
                  aria-label="대기 감소"
                >
                  −
                </button>
                <button
                  onClick={() => adjust(r.id, 1)}
                  className="gradient-brand h-8 w-8 rounded-full font-bold text-white shadow-md shadow-purple-500/30 transition-all hover:scale-105"
                  aria-label="대기 증가"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
