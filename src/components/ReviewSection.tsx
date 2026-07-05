"use client";

import { useState } from "react";

type Review = {
  id: number;
  nickname: string;
  rating: number;
  content: string;
  createdAt: string;
};

export default function ReviewSection({
  restaurantId,
  initialReviews,
}: {
  restaurantId: number;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [nickname, setNickname] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !content) return;
    setSubmitting(true);

    const res = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, rating, content }),
    });

    if (res.ok) {
      const review = await res.json();
      setReviews([review, ...reviews]);
      setNickname("");
      setContent("");
      setRating(5);
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold">리뷰 {reviews.length}개</h2>

      <form onSubmit={submit} className="mt-3 flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
        <div className="flex gap-2">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm"
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rounded border border-zinc-300 px-3 py-2 text-sm"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                ★ {n}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰 내용을 남겨주세요"
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
          rows={2}
        />
        <button
          type="submit"
          disabled={submitting}
          className="self-end rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          리뷰 등록
        </button>
      </form>

      <ul className="mt-4 flex flex-col gap-3">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-lg border border-zinc-100 p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{r.nickname}</span>
              <span className="text-amber-600">{"★".repeat(r.rating)}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-600">{r.content}</p>
          </li>
        ))}
        {reviews.length === 0 && (
          <p className="text-sm text-zinc-400">아직 리뷰가 없습니다.</p>
        )}
      </ul>
    </div>
  );
}
