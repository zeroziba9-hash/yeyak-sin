import { prisma } from "@/lib/prisma";
import { publish } from "@/lib/chatBus";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const messages = await prisma.chatMessage.findMany({
    where: { restaurantId: Number(id) },
    orderBy: { createdAt: "asc" },
  });

  return Response.json(messages);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { sender, content } = await request.json();

  if (!sender || !content) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const message = await prisma.chatMessage.create({
    data: { restaurantId: Number(id), sender, content },
  });

  publish(Number(id), {
    id: message.id,
    restaurantId: message.restaurantId,
    sender: message.sender,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  });

  return Response.json(message, { status: 201 });
}
