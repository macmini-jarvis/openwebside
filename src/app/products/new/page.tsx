"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/categories";
import { toast } from "sonner";
import { CheckCircle, Copy, Loader2 } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"form" | "verify">("form");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // 폼 상태
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // 인증 상태
  const [verifyToken, setVerifyToken] = useState("");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
      }
    };
    checkAuth();
  }, []);

  const selectedCategory = CATEGORIES.find((c) => c.slug === category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !url || !description || !category || !subCategory) {
      toast.error("모든 필수 항목을 입력해주세요");
      return;
    }

    // URL 형식 체크
    try {
      new URL(url);
    } catch {
      toast.error("올바른 URL을 입력해주세요 (https://...)");
      return;
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 제품 등록
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        title,
        url,
        description,
        category,
        sub_category: subCategory,
        logo_url: logoUrl || null,
        screenshots: [],
        tags: [],
        user_id: user.id,
        status: "pending",
        avg_rating: 0,
        review_count: 0,
        upvote_count: 0,
      })
      .select()
      .single();

    if (error) {
      toast.error("등록에 실패했습니다: " + error.message);
      setLoading(false);
      return;
    }

    // 인증 토큰 생성
    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await supabase.from("site_verifications").insert({
      product_id: product.id,
      token,
      status: "pending",
    });

    setProductId(product.id);
    setVerifyToken(token);
    setStep("verify");
    setLoading(false);
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, url, token: verifyToken }),
      });

      const result = await res.json();

      if (result.verified) {
        toast.success("인증 완료! 관리자 심사 후 공개됩니다.");
        router.push("/");
      } else {
        toast.error(result.message ?? "메타 태그를 찾을 수 없습니다");
      }
    } catch {
      toast.error("인증 확인에 실패했습니다");
    }
    setVerifying(false);
  };

  const copyMetaTag = () => {
    navigator.clipboard.writeText(
      `<meta name="ows-verify" content="${verifyToken}">`
    );
    toast.success("복사되었습니다");
  };

  if (step === "verify") {
    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>사이트 소유권 인증</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              아래 메타 태그를 사이트의{" "}
              <code className="bg-muted px-1 rounded">&lt;head&gt;</code> 안에
              추가해주세요.
            </p>

            <div className="bg-muted p-3 rounded-lg font-mono text-sm break-all flex items-start gap-2">
              <code className="flex-1">
                &lt;meta name=&quot;ows-verify&quot;
                content=&quot;{verifyToken}&quot;&gt;
              </code>
              <Button variant="ghost" size="icon" onClick={copyMetaTag}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              메타 태그를 추가한 후 &quot;인증 확인&quot; 버튼을 눌러주세요.
              인증 후 관리자 심사를 거쳐 사이트가 공개됩니다.
            </p>

            <Button
              onClick={handleVerify}
              disabled={verifying}
              className="w-full"
            >
              {verifying ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              인증 확인
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>웹사이트 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">사이트 이름 *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: OpenWebSide"
                maxLength={50}
              />
            </div>

            <div>
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="description">설명 *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="사이트에 대한 간단한 설명을 작성해주세요"
                maxLength={500}
                rows={3}
              />
            </div>

            <div>
              <Label>카테고리 *</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v ?? ""); setSubCategory(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <div>
                <Label>하위 카테고리 *</Label>
                <Select value={subCategory} onValueChange={(v) => setSubCategory(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="하위 카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory.subcategories.map((sub) => (
                      <SelectItem key={sub.slug} value={sub.slug}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="logo">로고 URL (선택)</Label>
              <Input
                id="logo"
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              다음: 소유권 인증
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
