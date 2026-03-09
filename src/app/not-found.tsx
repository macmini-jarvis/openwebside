import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground mt-2">페이지를 찾을 수 없습니다</p>
      <Button render={<Link href="/" />} className="mt-4">
        홈으로 돌아가기
      </Button>
    </div>
  );
}
