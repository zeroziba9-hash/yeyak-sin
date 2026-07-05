"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import RestaurantMap from "@/components/RestaurantMap";

type Restaurant = {
  id: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  waiting: number;
};

const CATEGORIES = ["전체", "한식", "양식", "일식", "중식", "카페"];

export default function RestaurantExplorer({
  restaurants,
  kakaoKey,
}: {
  restaurants: Restaurant[];
  kakaoKey: string;
}) {
  const [category, setCategory] = useState("전체");

  const filtered = useMemo(
    () =>
      category === "전체"
        ? restaurants
        : restaurants.filter((r) => r.category === category),
    [restaurants, category]
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="glass-card flex gap-2 overflow-x-auto border-b border-white/60 px-6 py-3">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
              category === c
                ? "gradient-brand text-white shadow-md shadow-purple-500/30"
                : "bg-white/70 text-zinc-600 hover:bg-white hover:shadow-sm"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 shrink-0 overflow-y-auto p-3">
          <div className="flex flex-col gap-2">
            {filtered.map((r) => (
              <Link
                key={r.id}
                href={`/restaurants/${r.id}`}
                className="glass-card group flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div>
                  <p className="font-semibold text-zinc-800 transition-colors group-hover:text-purple-700">
                    {r.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {r.category} · {r.address}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                    r.waiting > 0
                      ? "bg-orange-100 text-orange-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {r.waiting > 0 ? `대기 ${r.waiting}팀` : "바로입장"}
                </span>
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="p-4 text-sm text-zinc-400">
                해당 카테고리의 음식점이 없습니다.
              </p>
            )}
          </div>
        </aside>
        <main className="flex-1 p-3 pl-0">
          <div className="h-full w-full overflow-hidden rounded-2xl shadow-lg shadow-purple-500/10">
            <RestaurantMap restaurants={filtered} kakaoKey={kakaoKey} />
          </div>
        </main>
      </div>
    </div>
  );
}
