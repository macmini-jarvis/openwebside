import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/product-grid";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; user?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (params.q) {
    query = query.or(
      `title.ilike.%${params.q}%,description.ilike.%${params.q}%`
    );
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.user) {
    query = query.eq("user_id", params.user);
  }

  const { data: products } = await query.limit(50);

  return (
    <div className="px-4 md:px-6 py-6">
      {/* 히어로 */}
      {!params.q && !params.category && !params.user && (
        <section className="text-center py-10 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            웹사이트를 발견하고 공유하세요
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            직접 만든 웹사이트를 등록하고, 리뷰와 별점으로 추천하세요
          </p>
        </section>
      )}

      {/* 카테고리 칩 */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <Link
          href="/"
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${
            !params.category
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          전체
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/?category=${cat.slug}`}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${
              params.category === cat.slug
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>

      {/* 검색 결과 표시 */}
      {params.q && (
        <p className="text-sm text-muted-foreground mb-4">
          &quot;{params.q}&quot; 검색 결과 ({products?.length ?? 0}건)
        </p>
      )}

      <ProductGrid products={products ?? []} />
    </div>
  );
}
