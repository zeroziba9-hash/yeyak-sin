import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RestaurantExplorer from "@/components/RestaurantExplorer";

export default async function Home() {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="flex flex-1 flex-col">
      <header className="glass-card flex items-center justify-between border-b border-white/60 px-6 py-5 shadow-sm">
        <div>
          <h1 className="gradient-text text-2xl font-extrabold tracking-tight">
            예약의 신 🍽️
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            내 주변 음식점 실시간 웨이팅 확인
          </p>
        </div>
        <Link
          href="/admin"
          className="shrink-0 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-600 shadow-sm transition-all hover:bg-white hover:text-purple-600"
        >
          🔧 사장님 대시보드
        </Link>
      </header>
      <RestaurantExplorer
        restaurants={restaurants}
        kakaoKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ""}
      />
    </div>
  );
}
