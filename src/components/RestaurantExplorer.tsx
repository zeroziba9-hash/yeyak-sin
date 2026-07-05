"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import RestaurantMap from "@/components/RestaurantMap";
import { haversineDistanceKm } from "@/lib/geo";
import { useFavorites } from "@/lib/useFavorites";

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
  const router = useRouter();
  const { favorites, toggle } = useFavorites();

  const [category, setCategory] = useState("전체");
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortMode, setSortMode] = useState<"default" | "distance">("default");
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const requestDistanceSort = () => {
    if (!navigator.geolocation) {
      setGeoError("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortMode("distance");
        setGeoError(null);
        setGeoLoading(false);
      },
      () => {
        setGeoError("위치 권한이 거부되었습니다. 브라우저 설정을 확인해주세요.");
        setGeoLoading(false);
      }
    );
  };

  const distanceOf = (r: Restaurant) =>
    userPos ? haversineDistanceKm(userPos.lat, userPos.lng, r.lat, r.lng) : null;

  const filtered = useMemo(() => {
    let list = restaurants;

    if (category !== "전체") {
      list = list.filter((r) => r.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q));
    }
    if (favoritesOnly) {
      list = list.filter((r) => favorites.has(r.id));
    }
    if (sortMode === "distance" && userPos) {
      list = [...list].sort(
        (a, b) =>
          haversineDistanceKm(userPos.lat, userPos.lng, a.lat, a.lng) -
          haversineDistanceKm(userPos.lat, userPos.lng, b.lat, b.lng)
      );
    }

    return list;
  }, [restaurants, category, search, favoritesOnly, favorites, sortMode, userPos]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="glass-card flex flex-col gap-2 border-b border-white/60 px-6 py-3">
        <div className="flex gap-2 overflow-x-auto">
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
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="음식점 이름 검색"
            className="min-w-0 flex-1 rounded-full border border-zinc-200 bg-white/80 px-4 py-1.5 text-sm focus:border-purple-400 focus:outline-none"
          />
          <button
            onClick={() => setFavoritesOnly((v) => !v)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
              favoritesOnly
                ? "gradient-brand text-white shadow-sm"
                : "bg-white/70 text-zinc-600 hover:bg-white"
            }`}
          >
            ♥ 찜한 곳만
          </button>
          <button
            onClick={requestDistanceSort}
            disabled={geoLoading}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition-all disabled:opacity-50 ${
              sortMode === "distance"
                ? "gradient-brand text-white shadow-sm"
                : "bg-white/70 text-zinc-600 hover:bg-white"
            }`}
          >
            📍 {geoLoading ? "위치 확인 중..." : "내 위치 가까운순"}
          </button>
        </div>
        {geoError && <p className="text-xs text-rose-500">{geoError}</p>}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 shrink-0 overflow-y-auto p-3">
          <div className="flex flex-col gap-2">
            {filtered.map((r) => {
              const distance = sortMode === "distance" ? distanceOf(r) : null;
              return (
                <div
                  key={r.id}
                  onClick={() => router.push(`/restaurants/${r.id}`)}
                  className="glass-card group flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div>
                    <p className="font-semibold text-zinc-800 transition-colors group-hover:text-purple-700">
                      {r.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {r.category} · {r.address}
                      {distance !== null && (
                        <span className="ml-1 font-semibold text-purple-500">
                          · {distance.toFixed(1)}km
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(r.id);
                      }}
                      aria-label="찜하기"
                      className={`text-lg transition-transform hover:scale-125 ${
                        favorites.has(r.id) ? "text-pink-500" : "text-zinc-300"
                      }`}
                    >
                      {favorites.has(r.id) ? "♥" : "♡"}
                    </button>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        r.waiting > 0
                          ? "bg-orange-100 text-orange-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {r.waiting > 0 ? `대기 ${r.waiting}팀` : "바로입장"}
                    </span>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="p-4 text-sm text-zinc-400">
                조건에 맞는 음식점이 없습니다.
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
