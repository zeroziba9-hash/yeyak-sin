import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: Number(id) },
    include: { reviews: { orderBy: { createdAt: "desc" } } },
  });

  if (!restaurant) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(restaurant);
}
