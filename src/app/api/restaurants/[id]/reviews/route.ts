import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { nickname, rating, content } = body;

  if (!nickname || !rating || !content) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      restaurantId: Number(id),
      nickname,
      rating: Number(rating),
      content,
    },
  });

  return Response.json(review, { status: 201 });
}
