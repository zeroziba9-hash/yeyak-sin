import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WaitingPanel from "@/components/WaitingPanel";
import ReviewSection from "@/components/ReviewSection";
import ChatPanel from "@/components/ChatPanel";
import FavoriteButton from "@/components/FavoriteButton";

export default async function RestaurantDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: Number(id) },
    include: { reviews: { orderBy: { createdAt: "desc" } } },
  });

  if (!restaurant) notFound();

  const avgRating =
    restaurant.reviews.length > 0
      ? (
          restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) /
          restaurant.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-500 transition-colors hover:text-purple-600"
      >
        ← 목록으로
      </Link>

      <div className="glass-card mt-4 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700">
            {restaurant.category}
          </span>
          <FavoriteButton restaurantId={restaurant.id} />
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-zinc-800">
          {restaurant.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{restaurant.address}</p>
        {avgRating && (
          <p className="mt-2 text-sm font-bold text-amber-500">
            ★ {avgRating}{" "}
            <span className="font-medium text-zinc-500">
              ({restaurant.reviews.length}개 리뷰)
            </span>
          </p>
        )}
      </div>

      <WaitingPanel restaurantId={restaurant.id} initialWaiting={restaurant.waiting} />

      <ChatPanel restaurantId={restaurant.id} />

      <ReviewSection
        restaurantId={restaurant.id}
        initialReviews={restaurant.reviews.map((r) => ({
          id: r.id,
          nickname: r.nickname,
          rating: r.rating,
          content: r.content,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
