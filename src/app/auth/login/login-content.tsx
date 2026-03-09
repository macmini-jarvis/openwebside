"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSetup = searchParams.get("setup") === "true";
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!isSetup) return;
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("nickname")
          .eq("id", user.id)
          .single();
        if (data?.nickname) setNickname(data.nickname);
      }
    };
    loadProfile();
  }, [isSetup]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSaveNickname = async () => {
    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요");
      return;
    }
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("users")
      .update({ nickname: nickname.trim() })
      .eq("id", user.id);

    if (error) {
      toast.error("닉네임 저장에 실패했습니다");
    } else {
      toast.success("닉네임이 설정되었습니다");
      router.push("/");
    }
    setLoading(false);
  };

  if (isSetup) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>닉네임 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="리뷰에 표시될 이름"
                maxLength={20}
              />
            </div>
            <Button
              onClick={handleSaveNickname}
              disabled={loading}
              className="w-full"
            >
              {loading ? "저장 중..." : "시작하기"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} variant="outline" className="w-full">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google로 로그인
          </Button>
          {searchParams.get("error") && (
            <p className="text-sm text-destructive text-center mt-3">
              로그인에 실패했습니다. 다시 시도해주세요.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
