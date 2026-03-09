"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface UpvoteButtonProps {
  productId: string;
  initialCount: number;
  initialUpvoted: boolean;
}

export function UpvoteButton({
  productId,
  initialCount,
  initialUpvoted,
}: UpvoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleToggle = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/upvotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const result = await res.json();

      if (result.action === "added") {
        setCount((c) => c + 1);
        setUpvoted(true);
      } else {
        setCount((c) => c - 1);
        setUpvoted(false);
      }
    } catch {
      toast.error("오류가 발생했습니다");
    }
    setLoading(false);
  };

  return (
    <Button
      variant={upvoted ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className="flex flex-col items-center gap-0.5 h-auto py-2 px-3"
    >
      <ThumbsUp className={`h-4 w-4 ${upvoted ? "fill-current" : ""}`} />
      <span className="text-xs">{count}</span>
    </Button>
  );
}
