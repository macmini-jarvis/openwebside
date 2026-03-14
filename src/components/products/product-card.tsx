"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ExternalLink, Trash2 } from "lucide-react";
import { getCategoryName } from "@/lib/categories";
import { toast } from "sonner";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
  currentUserId?: string;
}

export function ProductCard({ product, currentUserId }: ProductCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const router = useRouter();
  const isOwner = currentUserId === product.user_id;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "삭제에 실패했습니다");
        return;
      }
      toast.success(`"${product.title}" 사이트가 삭제되었습니다`);
      setDeleted(true);
      router.refresh();
    } catch {
      toast.error("삭제 중 오류가 발생했습니다");
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (deleted) return null;

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer h-full group">
        <CardContent className="p-4">
          <div className="flex gap-3">
            {/* 로고 */}
            <div className="shrink-0 w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden ring-1 ring-border">
              {product.logo_url ? (
                <Image
                  src={product.logo_url}
                  alt={product.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-xl font-bold text-muted-foreground">
                  {product.title.charAt(0)}
                </span>
              )}
            </div>

            {/* 정보 */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <ExternalLink className="h-3 w-3 text-muted-foreground/50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <Badge variant="secondary" className="text-xs font-normal">
                  {getCategoryName(product.category) ?? product.category}
                </Badge>
                {product.avg_rating > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {product.avg_rating.toFixed(1)}
                    <span className="text-muted-foreground/60">
                      ({product.review_count})
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <ThumbsUp className="h-3 w-3" />
                  {product.upvote_count}
                </span>
              </div>
            </div>

            {/* 삭제 버튼 (소유자만) */}
            {isOwner && (
              <div className="shrink-0 self-center" onClick={(e) => e.preventDefault()}>
                {confirming ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-2 py-1 text-xs font-medium rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
                    >
                      {deleting ? "..." : "확인"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setConfirming(false);
                      }}
                      disabled={deleting}
                      className="px-2 py-1 text-xs font-medium rounded-md border hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setConfirming(true);
                    }}
                    className="p-1.5 text-muted-foreground/50 hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
