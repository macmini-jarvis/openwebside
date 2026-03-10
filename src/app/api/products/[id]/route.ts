import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`delete:${ip}`, 10, 60 * 1000);
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

  const { id } = await params;

  // 제품 조회 및 소유자 확인
  const { data: product } = await supabase
    .from("products")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (!product) {
    return NextResponse.json(
      { error: "사이트를 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  if (product.user_id !== user.id) {
    return NextResponse.json(
      { error: "본인이 등록한 사이트만 삭제할 수 있습니다" },
      { status: 403 }
    );
  }

  // products 삭제 (reviews, upvotes, site_verifications는 ON DELETE CASCADE로 자동 삭제)
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }

  revalidatePath("/");
  revalidatePath(`/products/${id}`);

  return NextResponse.json({ success: true });
}
