import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RestaurantMap from "@/components/RestaurantMap";

export default async function Home() {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 px-6 py-4">
        <h1 className="text-xl font-bold">예약의 신 🍽️</h1>
        <p className="text-sm text-zinc-500">
          내 주변 음식점 실시간 웨이팅 확인
        </p>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 shrink-0 overflow-y-auto border-r border-zinc-200">
          {restaurants.map((r) => (
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
        </aside>
        <main className="flex-1">
          <RestaurantMap
            restaurants={restaurants}
            kakaoKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ""}
          />
        </main>
      </div>
    </div>
  );
}
