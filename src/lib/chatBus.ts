type ChatMessagePayload = {
  id: number;
  restaurantId: number;
  sender: string;
  content: string;
  createdAt: string;
};

const subscribers = new Map<number, Set<ReadableStreamDefaultController>>();

export function subscribe(restaurantId: number, controller: ReadableStreamDefaultController) {
  if (!subscribers.has(restaurantId)) {
    subscribers.set(restaurantId, new Set());
  }
  subscribers.get(restaurantId)!.add(controller);
}

export function unsubscribe(restaurantId: number, controller: ReadableStreamDefaultController) {
  subscribers.get(restaurantId)?.delete(controller);
}

export function publish(restaurantId: number, message: ChatMessagePayload) {
  const encoder = new TextEncoder();
  const chunk = encoder.encode(`data: ${JSON.stringify(message)}\n\n`);

  for (const controller of subscribers.get(restaurantId) ?? []) {
    try {
      controller.enqueue(chunk);
    } catch {
      // stream already closed, drop it
      subscribers.get(restaurantId)?.delete(controller);
    }
  }
}
