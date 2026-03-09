import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/product-grid";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import {
  Trophy,
  ThumbsUp,
  Star,
  Flame,
  ArrowRight,
  Newspaper,
  TrendingUp,
  Sparkles,
  Globe,
} from "lucide-react";
import { getCategoryName } from "@/lib/categories";
import type { Product } from "@/types/database";

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

function RankingItem({
  rank,
  product,
}: {
  rank: number;
  product: Product;
}) {
  const isTop3 = rank <= 3;
  const medals = ["", "🥇", "🥈", "🥉"];

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors group"
    >
      <span
        className={`text-sm font-bold w-6 text-center ${
          isTop3 ? "text-base" : "text-muted-foreground"
        }`}
      >
        {isTop3 ? medals[rank] : rank}
      </span>
      <div className="shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center overflow-hidden">
        {product.logo_url ? (
          <img
            src={product.logo_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold text-muted-foreground">
            {product.title.charAt(0)}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
          {product.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {getCategoryName(product.category)}
        </p>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <ThumbsUp className="h-3 w-3" />
        {product.upvote_count}
      </div>
    </Link>
  );
}

const AI_NEWS = [
  {
    title: "GPT-5 출시 — 멀티모달 성능 대폭 향상",
    tag: "AI",
    time: "2시간 전",
  },
  {
    title: "구글, Gemini 2.5 Pro 무료 공개",
    tag: "AI",
    time: "5시간 전",
  },
  {
    title: "네이버, HyperCLOVA X 웹 도구 출시",
    tag: "국내",
    time: "8시간 전",
  },
  {
    title: "Figma AI, 디자인 자동 생성 기능 베타",
    tag: "디자인",
    time: "12시간 전",
  },
  {
    title: "Vercel, 서버리스 GPU 지원 발표",
    tag: "개발",
    time: "1일 전",
  },
];

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

  // 인기 랭킹 (추천순)
  const { data: topProducts } = await supabase
    .from("products")
    .select("*")
    .eq("status", "approved")
    .order("upvote_count", { ascending: false })
    .limit(10);

  // 최근 등록
  const { data: recentProducts } = await supabase
    .from("products")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(5);

  const isFiltered = params.q || params.category || params.user;

  return (
    <div className="px-4 md:px-6 py-6 max-w-[1400px] mx-auto">
      <JsonLd />

      {/* 히어로 */}
      {!isFiltered && (
        <section className="relative py-12 md:py-16 text-center mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-transparent rounded-2xl -z-10" />
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary tracking-wider uppercase">
              Open Web Side
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            무료 웹사이트 홍보 &<br className="sm:hidden" /> 유용한 웹서비스 모음
          </h1>
          <p className="text-muted-foreground mt-4 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            내가 만든 웹사이트를 무료로 등록하고 홍보하세요.
            <br className="hidden sm:block" />
            다양한 무료 웹사이트를 찾고 이용할 수 있습니다.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Link
              href="/products/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              무료로 사이트 등록
            </Link>
          </div>
        </section>
      )}

      {/* 카테고리 칩 */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <Link
          href="/"
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
            !params.category
              ? "bg-primary text-primary-foreground border-primary"
              : "hover:bg-muted"
          }`}
        >
          전체
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/?category=${cat.slug}`}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
              params.category === cat.slug
                ? "bg-primary text-primary-foreground border-primary"
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

      {/* 메인 2컬럼 레이아웃 */}
      <div className="flex gap-6 mt-2">
        {/* 왼쪽: 제품 목록 */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={products ?? []} />
        </div>

        {/* 오른쪽: 사이드바 */}
        <aside className="hidden lg:block w-80 shrink-0 space-y-6">
          {/* 인기 랭킹 */}
          <div className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                인기 랭킹
              </h2>
              <span className="text-xs text-muted-foreground">추천순</span>
            </div>
            {topProducts && topProducts.length > 0 ? (
              <div className="space-y-0.5">
                {topProducts.map((product, i) => (
                  <RankingItem
                    key={product.id}
                    rank={i + 1}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">아직 등록된 사이트가 없습니다</p>
                <p className="text-xs mt-1">
                  첫 번째 사이트를 등록해보세요!
                </p>
              </div>
            )}
          </div>

          {/* 최근 등록 */}
          <div className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                최근 등록
              </h2>
            </div>
            {recentProducts && recentProducts.length > 0 ? (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                      {product.logo_url ? (
                        <img
                          src={product.logo_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">
                          {product.title.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {product.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">새로운 사이트가 곧 등록됩니다</p>
              </div>
            )}
          </div>

          {/* AI / 테크 뉴스 */}
          <div className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-blue-500" />
                AI / 테크 뉴스
              </h2>
            </div>
            <div className="space-y-3">
              {AI_NEWS.map((news, i) => (
                <div
                  key={i}
                  className="group cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 text-xs font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {news.tag}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug group-hover:text-primary transition-colors">
                        {news.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {news.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 카테고리 바로가기 */}
          <div className="border rounded-xl p-4">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-green-500" />
              카테고리
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
