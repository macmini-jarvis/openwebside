"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteButtonProps {
  productId: string;
  productTitle: string;
}

export function DeleteButton({ productId, productTitle }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "삭제에 실패했습니다");
        return;
      }

      toast.success("사이트가 삭제되었습니다");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("삭제 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-destructive">정말 삭제하시겠습니까?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
        >
          {loading ? "삭제 중..." : "삭제"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border hover:bg-muted transition-colors disabled:opacity-50"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-destructive rounded-lg border hover:border-destructive/30 transition-colors"
      title={`"${productTitle}" 삭제`}
    >
      <Trash2 className="h-4 w-4" />
      삭제
    </button>
  );
}
