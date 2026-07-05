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
      <div className="flex gap-2 overflow-x-auto border-b border-zinc-200 px-6 py-3">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              category === c
                ? "bg-black text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 shrink-0 overflow-y-auto border-r border-zinc-200">
          {filtered.map((r) => (
            <Link
              key={r.id}
              href={`/restaurants/${r.id}`}
              className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 hover:bg-zinc-50"
            >
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-zinc-500">
                  {r.category} · {r.address}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                  r.waiting > 0
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
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
        </aside>
        <main className="flex-1">
          <RestaurantMap restaurants={filtered} kakaoKey={kakaoKey} />
        </main>
      </div>
    </div>
  );
}
