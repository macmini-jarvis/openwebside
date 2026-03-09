import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/product-grid";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; user?: string }>;
}

function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "오픈웹사이드",
    url: "https://openwebside.com",
    description:
      "내가 만든 웹사이트를 무료로 홍보하고, 다양한 무료 웹사이트를 발견하세요.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://openwebside.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
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
      <JsonLd />
      {/* 히어로 */}
      {!params.q && !params.category && !params.user && (
        <section className="text-center py-10 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            무료 웹사이트 홍보 & 유용한 웹서비스 모음
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            내가 만든 웹사이트를 무료로 등록하고 홍보하세요.
            <br className="hidden sm:block" />
            다양한 무료 웹사이트를 찾고 이용할 수 있습니다.
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
