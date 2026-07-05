import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WaitingPanel from "@/components/WaitingPanel";
import ReviewSection from "@/components/ReviewSection";

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
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← 목록으로
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {restaurant.category} · {restaurant.address}
          </p>
          {avgRating && (
            <p className="mt-1 text-sm font-medium text-amber-600">
              ★ {avgRating} ({restaurant.reviews.length}개 리뷰)
            </p>
          )}
        </div>
      </div>

      <WaitingPanel restaurantId={restaurant.id} initialWaiting={restaurant.waiting} />

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
