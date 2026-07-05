import { subscribe, unsubscribe } from "@/lib/chatBus";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurantId = Number(id);

  let currentController: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(controller) {
      currentController = controller;
      subscribe(restaurantId, controller);
      // initial comment to open the connection immediately
      controller.enqueue(new TextEncoder().encode(": connected\n\n"));
    },
    cancel() {
      unsubscribe(restaurantId, currentController);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
