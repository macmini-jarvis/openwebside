import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { productId } = await request.json();

  // 이미 추천했는지 확인
  const { data: existing } = await supabase
    .from("upvotes")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // 추천 취소
    await supabase.from("upvotes").delete().eq("id", existing.id);
    await supabase.rpc("decrement_upvote", { p_id: productId });
    return NextResponse.json({ action: "removed" });
  }

  // 추천 추가
  await supabase.from("upvotes").insert({
    product_id: productId,
    user_id: user.id,
  });
  await supabase.rpc("increment_upvote", { p_id: productId });

  return NextResponse.json({ action: "added" });
}
