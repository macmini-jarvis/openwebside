import type { Metadata } from "next";
import { Bug, Lightbulb, Megaphone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "문의하기",
  description: "버그 제보, 기능 요청, 광고 문의 등 오픈웹사이드에 대한 문의를 보내주세요.",
};

export default function ContactPage() {
  return (
    <div className="px-4 md:px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">문의하기</h1>
      <p className="text-muted-foreground mb-8">
        아래 이메일로 문의해주세요. 빠르게 확인하고 답변드리겠습니다.
      </p>

      <div className="space-y-4 mb-10">
        <div className="flex items-start gap-3 p-4 border rounded-xl">
          <Bug className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-sm">버그 제보</h2>
            <p className="text-xs text-muted-foreground mt-1">
              사이트 이용 중 오류를 발견하셨나요? 어떤 상황에서 발생했는지 알려주시면 빠르게 수정하겠습니다.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 border rounded-xl">
          <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-sm">기능 요청</h2>
            <p className="text-xs text-muted-foreground mt-1">
              이런 기능이 있었으면 좋겠다 싶은 것이 있다면 자유롭게 제안해주세요.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 border rounded-xl">
          <Megaphone className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-sm">광고 / 제휴 문의</h2>
            <p className="text-xs text-muted-foreground mt-1">
              광고 게재, 제휴 협력 등 비즈니스 관련 문의를 보내주세요.
            </p>
          </div>
        </div>
      </div>

      <div className="border rounded-xl p-6 bg-muted/30 text-center">
        <Mail className="h-6 w-6 mx-auto mb-3 text-primary" />
        <p className="text-sm text-muted-foreground mb-2">문의 이메일</p>
        <a
          href="mailto:openwebside@gmail.com"
          className="text-lg font-semibold text-primary hover:underline"
        >
          openwebside@gmail.com
        </a>
        <p className="text-xs text-muted-foreground mt-3">
          보통 1~2일 이내에 답변드립니다.
        </p>
      </div>
    </div>
  );
}
