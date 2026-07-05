import { prisma } from "@/lib/prisma";

export async function GET() {
  const restaurants = await prisma.restaurant.findMany({
    include: { _count: { select: { reviews: true } } },
    orderBy: { id: "asc" },
  });
  return Response.json(restaurants);
}
