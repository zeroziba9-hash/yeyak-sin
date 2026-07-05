import { prisma } from "@/lib/prisma";
import RestaurantExplorer from "@/components/RestaurantExplorer";

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
      <RestaurantExplorer
        restaurants={restaurants}
        kakaoKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ""}
      />
    </div>
  );
}
