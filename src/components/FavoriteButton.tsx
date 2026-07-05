"use client";

import { useFavorites } from "@/lib/useFavorites";

export default function FavoriteButton({ restaurantId }: { restaurantId: number }) {
  const { favorites, toggle } = useFavorites();
  const active = favorites.has(restaurantId);

  return (
    <button
      onClick={() => toggle(restaurantId)}
      aria-label="찜하기"
      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all hover:scale-105 ${
        active
          ? "bg-pink-100 text-pink-600"
          : "bg-white/70 text-zinc-500 hover:bg-white"
      }`}
    >
      {active ? "♥ 찜 완료" : "♡ 찜하기"}
    </button>
  );
}
