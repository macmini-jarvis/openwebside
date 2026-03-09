"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ExternalLink } from "lucide-react";
import { getCategoryName } from "@/lib/categories";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer h-full group">
        <CardContent className="p-4">
          <div className="flex gap-3">
            {/* 로고 */}
            <div className="shrink-0 w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden ring-1 ring-border">
              {product.logo_url ? (
                <img
                  src={product.logo_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
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
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
