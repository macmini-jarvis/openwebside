import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function isAllowedUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "https:") return false;
    const hostname = parsed.hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("172.") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`verify:${ip}`, 5, 60 * 1000); // 분당 5회
  if (!success) {
    return NextResponse.json(
      { verified: false, message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { verified: false, message: "로그인이 필요합니다" },
      { status: 401 }
    );
  }

  const { productId, url, token } = await request.json();

  if (!productId || !url || !token) {
    return NextResponse.json(
      { verified: false, message: "필수 정보가 누락되었습니다" },
      { status: 400 }
    );
  }

  // SSRF 방지: HTTPS + 공개 도메인만 허용
  if (!isAllowedUrl(url)) {
    return NextResponse.json(
      { verified: false, message: "허용되지 않는 URL입니다. HTTPS 공개 도메인만 가능합니다." },
      { status: 400 }
    );
  }

  // 제품 소유권 확인
  const { data: product } = await supabase
    .from("products")
    .select("user_id")
    .eq("id", productId)
    .single();

  if (!product || product.user_id !== user.id) {
    return NextResponse.json(
      { verified: false, message: "본인의 제품만 인증할 수 있습니다" },
      { status: 403 }
    );
  }

  try {
    // 사이트 HTML 가져오기
    const res = await fetch(url, {
      headers: { "User-Agent": "OpenWebSide-Verifier/1.0" },
      signal: AbortSignal.timeout(5000),
      redirect: "error",
    });

    if (!res.ok) {
      return NextResponse.json({
        verified: false,
        message: "사이트에 접속할 수 없습니다",
      });
    }

    const html = await res.text();

    // 메타 태그 확인 (ReDoS 방지: 토큰 이스케이프)
    const escaped = escapeRegex(token);
    const metaRegex = new RegExp(
      `<meta\\s+name=["']ows-verify["']\\s+content=["']${escaped}["']`,
      "i"
    );
    const metaRegex2 = new RegExp(
      `<meta\\s+content=["']${escaped}["']\\s+name=["']ows-verify["']`,
      "i"
    );

    if (!metaRegex.test(html) && !metaRegex2.test(html)) {
      return NextResponse.json({
        verified: false,
        message: "메타 태그를 찾을 수 없습니다. 태그를 추가한 후 다시 시도해주세요.",
      });
    }

    // 인증 성공 — DB 업데이트
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
