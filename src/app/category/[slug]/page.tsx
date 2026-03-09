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

      <ProductGrid products={products ?? []} />
    </div>
  );
}
