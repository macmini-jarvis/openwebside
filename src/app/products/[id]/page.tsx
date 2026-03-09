import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getCategoryName, getSubcategoryName } from "@/lib/categories";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, ExternalLink } from "lucide-react";
import { UpvoteButton } from "@/components/products/upvote-button";
import { ReviewSection } from "@/components/reviews/review-section";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (!product) notFound();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, user:users(id, nickname, avatar_url)")
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasUpvoted = false;
  if (user) {
    const { data } = await supabase
      .from("upvotes")
      .select("id")
      .eq("product_id", id)
      .eq("user_id", user.id)
      .single();
    hasUpvoted = !!data;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex gap-4 items-start">
        <div className="shrink-0 w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
          {product.logo_url ? (
            <img
              src={product.logo_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-muted-foreground">
              {product.title.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
          >
            {product.url}
            <ExternalLink className="h-3 w-3" />
          </a>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary">
              {getCategoryName(product.category)}
            </Badge>
            <Badge variant="outline">
              {getSubcategoryName(product.category, product.sub_category)}
            </Badge>
            {product.avg_rating > 0 && (
              <span className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {product.avg_rating.toFixed(1)} ({product.review_count}개 리뷰)
              </span>
            )}
          </div>
        </div>
        <UpvoteButton
          productId={product.id}
          initialCount={product.upvote_count}
          initialUpvoted={hasUpvoted}
        />
      </div>

      {/* 설명 */}
      <p className="mt-6 text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      <Separator className="my-8" />

      {/* 리뷰 */}
      <ReviewSection
        productId={product.id}
        reviews={reviews ?? []}
        currentUserId={user?.id}
      />
    </div>
  );
}
