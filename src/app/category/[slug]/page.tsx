import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/product-grid";
import { getCategoryBySlug } from "@/lib/categories";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "카테고리를 찾을 수 없습니다" };

  return {
    title: `${category.icon} ${category.name} - 무료 웹서비스 모음`,
    description: `${category.name} 분야의 무료 웹사이트와 웹서비스를 찾아보세요. 리뷰와 별점으로 검증된 유용한 사이트를 추천합니다.`,
    openGraph: {
      title: `${category.name} - 무료 웹서비스 모음 | 오픈웹사이드`,
      description: `${category.name} 분야의 무료 웹사이트와 웹서비스를 찾아보세요.`,
      url: `https://openwebside.com/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { sub } = await searchParams;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "approved")
    .eq("category", slug)
    .order("created_at", { ascending: false });

  if (sub) {
    query = query.eq("sub_category", sub);
  }

  const { data: products } = await query.limit(50);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="px-4 md:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {category.icon} {category.name}
        </h1>
        <div className="flex gap-2 mt-3 flex-wrap">
          <Link href={`/category/${slug}`}>
            <Badge variant={!sub ? "default" : "outline"}>전체</Badge>
          </Link>
          {category.subcategories.map((s) => (
            <Link key={s.slug} href={`/category/${slug}?sub=${s.slug}`}>
              <Badge variant={sub === s.slug ? "default" : "outline"}>
                {s.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <ProductGrid products={products ?? []} currentUserId={user?.id} />
    </div>
  );
}
