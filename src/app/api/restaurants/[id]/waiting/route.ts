import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: Number(id) },
    select: { waiting: true },
  });

  if (!restaurant) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(restaurant);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { delta } = await request.json();

  const current = await prisma.restaurant.findUnique({
    where: { id: Number(id) },
    select: { waiting: true },
  });

  if (!current) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const nextWaiting = Math.max(0, current.waiting + Number(delta));

  const restaurant = await prisma.restaurant.update({
    where: { id: Number(id) },
    data: { waiting: nextWaiting },
    select: { waiting: true },
  });

  return Response.json(restaurant);
}
