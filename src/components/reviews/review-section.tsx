"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Review } from "@/types/database";
import { useRouter } from "next/navigation";

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  currentUserId?: string;
}

export function ReviewSection({
  productId,
  reviews,
  currentUserId,
}: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const hasReviewed = reviews.some((r) => r.user_id === currentUserId);

  const handleSubmit = async () => {
    if (!currentUserId) {
      toast.error("로그인이 필요합니다");
      return;
    }
    if (rating === 0) {
      toast.error("별점을 선택해주세요");
      return;
    }
    if (!content.trim()) {
      toast.error("리뷰 내용을 작성해주세요");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, content: content.trim() }),
    });

    if (res.ok) {
      toast.success("리뷰가 등록되었습니다");
      setRating(0);
      setContent("");
      router.refresh();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "리뷰 등록에 실패했습니다");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        리뷰 ({reviews.length}개)
      </h2>

      {/* 리뷰 작성 폼 */}
      {currentUserId && !hasReviewed && (
        <div className="border rounded-lg p-4 mb-6 space-y-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i)}
              >
                <Star
                  className={`h-6 w-6 cursor-pointer transition-colors ${
                    i <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-sm text-muted-foreground ml-2">
                {rating}점
              </span>
            )}
          </div>
          <Textarea
            placeholder="이 웹사이트에 대한 리뷰를 작성해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={1000}
          />
          <Button onClick={handleSubmit} disabled={loading} size="sm">
            {loading ? "등록 중..." : "리뷰 등록"}
          </Button>
        </div>
      )}

      {!currentUserId && (
        <p className="text-sm text-muted-foreground mb-6">
          리뷰를 작성하려면 로그인해주세요.
        </p>
      )}

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={review.user?.avatar_url ?? undefined} />
                <AvatarFallback className="text-xs">
                  {review.user?.nickname?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {review.user?.nickname ?? "알 수 없음"}
              </span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(review.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{review.content}</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
          </p>
        )}
      </div>
    </div>
  );
}
