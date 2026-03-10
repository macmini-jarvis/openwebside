"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { getCategoryName } from "@/lib/categories";
import { ExternalLink, Check, X } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types/database";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "openwebside@gmail.com";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/");
        return;
      }
      loadProducts("pending");
    };
    checkAdmin();
  }, []);

  const loadProducts = async (status: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: true });
    setProducts(data ?? []);
    setLoading(false);
  };

  const handleTabChange = (value: string) => {
    setTab(value);
    loadProducts(value);
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("승인에 실패했습니다");
    } else {
      toast.success("승인되었습니다");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleReject = async (id: string) => {
    const reason = rejectReasons[id];
    if (!reason?.trim()) {
      toast.error("거절 사유를 입력해주세요");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({
        status: "rejected",
        reject_reason: reason.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("거절 처리에 실패했습니다");
    } else {
      toast.success("거절 처리되었습니다");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">관리자 페이지</h1>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="pending">심사 대기</TabsTrigger>
          <TabsTrigger value="approved">승인됨</TabsTrigger>
          <TabsTrigger value="rejected">거절됨</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {loading ? (
            <p className="text-muted-foreground text-center py-8">
              로딩 중...
            </p>
          ) : products.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {tab === "pending"
                ? "대기 중인 사이트가 없습니다"
                : "항목이 없습니다"}
            </p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {product.title}
                        </CardTitle>
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {product.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <Badge variant="secondary">
                        {getCategoryName(product.category)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {product.description}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      등록일:{" "}
                      {new Date(product.created_at).toLocaleDateString("ko-KR")}
                    </p>

                    {tab === "pending" && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(product.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(product.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            거절
                          </Button>
                        </div>
                        <Textarea
                          placeholder="거절 사유 (거절 시 필수)"
                          value={rejectReasons[product.id] ?? ""}
                          onChange={(e) =>
                            setRejectReasons((prev) => ({
                              ...prev,
                              [product.id]: e.target.value,
                            }))
                          }
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {tab === "rejected" && product.reject_reason && (
                      <p className="text-sm text-destructive">
                        거절 사유: {product.reject_reason}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
