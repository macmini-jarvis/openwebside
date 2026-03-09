import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { productId, url, token } = await request.json();

  if (!productId || !url || !token) {
    return NextResponse.json(
      { verified: false, message: "필수 정보가 누락되었습니다" },
      { status: 400 }
    );
  }

  try {
    // 사이트 HTML 가져오기
    const res = await fetch(url, {
      headers: { "User-Agent": "OpenWebSide-Verifier/1.0" },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({
        verified: false,
        message: "사이트에 접속할 수 없습니다",
      });
    }

    const html = await res.text();

    // 메타 태그 확인
    const metaRegex = new RegExp(
      `<meta\\s+name=["']ows-verify["']\\s+content=["']${token}["']`,
      "i"
    );
    const metaRegex2 = new RegExp(
      `<meta\\s+content=["']${token}["']\\s+name=["']ows-verify["']`,
      "i"
    );

    if (!metaRegex.test(html) && !metaRegex2.test(html)) {
      return NextResponse.json({
        verified: false,
        message: "메타 태그를 찾을 수 없습니다. 태그를 추가한 후 다시 시도해주세요.",
      });
    }

    // 인증 성공 — DB 업데이트
    const supabase = await createClient();
    await supabase
      .from("site_verifications")
      .update({ status: "verified", verified_at: new Date().toISOString() })
      .eq("product_id", productId)
      .eq("token", token);

    return NextResponse.json({ verified: true });
  } catch {
    return NextResponse.json({
      verified: false,
      message: "인증 확인 중 오류가 발생했습니다",
    });
  }
}
