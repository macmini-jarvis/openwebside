import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, updated_at")
    .eq("status", "approved")
    .order("updated_at", { ascending: false });

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map(
    (product) => ({
      url: `https://openwebside.com/products/${product.id}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `https://openwebside.com/category/${cat.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [
    {
      url: "https://openwebside.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
