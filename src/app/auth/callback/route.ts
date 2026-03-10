import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/";
  // 오픈 리다이렉트 방지: 상대 경로만 허용
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // users 테이블에 프로필 없으면 생성
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existing) {
        const meta = data.user.user_metadata;
        await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          nickname:
            meta?.full_name ?? meta?.name ?? data.user.email?.split("@")[0],
          avatar_url: meta?.avatar_url ?? null,
        });

        // 닉네임 설정 페이지로 이동
        return NextResponse.redirect(`${origin}/auth/login?setup=true`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth`);
}
