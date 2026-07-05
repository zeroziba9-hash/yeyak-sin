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
    <div className="mt-4">
      <h2 className="text-lg font-bold text-zinc-800">
        리뷰 <span className="gradient-text">{reviews.length}</span>개
      </h2>

      <form
        onSubmit={submit}
        className="glass-card mt-3 flex flex-col gap-2 rounded-2xl p-4 shadow-sm"
      >
        <div className="flex gap-2">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            className="flex-1 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rounded-full border border-zinc-200 bg-white/80 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
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
          className="rounded-2xl border border-zinc-200 bg-white/80 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
          rows={2}
        />
        <button
          type="submit"
          disabled={submitting}
          className="gradient-brand self-end rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/30 transition-transform hover:scale-105 disabled:opacity-50"
        >
          리뷰 등록
        </button>
      </form>

      <ul className="mt-4 flex flex-col gap-2">
        {reviews.map((r) => (
          <li key={r.id} className="glass-card rounded-2xl p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-800">{r.nickname}</span>
              <span className="text-amber-500">{"★".repeat(r.rating)}</span>
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
