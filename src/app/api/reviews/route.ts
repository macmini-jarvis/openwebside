import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`reviews:${ip}`, 10, 60 * 60 * 1000); // 시간당 10회
  if (!success) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { productId, rating, content } = await request.json();

  if (!productId || !rating || !content) {
    return NextResponse.json(
      { error: "필수 정보가 누락되었습니다" },
      { status: 400 }
    );
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "별점은 1~5 사이여야 합니다" },
      { status: 400 }
    );
  }

  // 이미 리뷰 작성 여부 확인
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "이미 리뷰를 작성하셨습니다" },
      { status: 409 }
    );
  }

  // 리뷰 저장
  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    user_id: user.id,
    rating,
    content,
  });

  if (error) {
    return NextResponse.json(
      { error: "리뷰 등록에 실패했습니다" },
      { status: 500 }
    );
  }

  // 평균 별점 및 리뷰 수 업데이트
  const { data: stats } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId);

  if (stats && stats.length > 0) {
    const avg =
      stats.reduce((sum, r) => sum + r.rating, 0) / stats.length;
    await supabase
      .from("products")
      .update({
        avg_rating: Math.round(avg * 10) / 10,
        review_count: stats.length,
      })
      .eq("id", productId);
  }

  return NextResponse.json({ success: true });
}
