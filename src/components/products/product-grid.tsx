"use client";

import { ProductCard } from "./product-card";
import { Globe } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types/database";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Globe className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p className="text-lg font-medium">등록된 웹사이트가 없습니다</p>
        <p className="text-sm mt-1 mb-4">첫 번째로 사이트를 등록해보세요!</p>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          사이트 등록하기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
