import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "오픈웹사이드 이용약관",
};

export default function TermsPage() {
  return (
    <div className="px-4 md:px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">이용약관</h1>
      <p className="text-xs text-muted-foreground mb-8">
        최종 수정일: 2026년 3월 11일
      </p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">제1조 (목적)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            본 약관은 오픈웹사이드(이하 &quot;서비스&quot;)의 이용에 관한
            조건과 절차, 운영자와 이용자의 권리·의무를 규정하는 것을
            목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">
            제2조 (서비스의 내용)
          </h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>웹사이트 등록 및 홍보 기능</li>
            <li>등록된 웹사이트에 대한 리뷰 및 평점 기능</li>
            <li>카테고리별 웹사이트 탐색 및 추천</li>
            <li>기타 서비스가 제공하는 관련 부가 기능</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">
            제3조 (이용자의 의무)
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            이용자는 다음 행위를 해서는 안 됩니다.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
            <li>허위 정보 등록 또는 타인의 정보를 도용하는 행위</li>
            <li>서비스의 운영을 방해하거나 비정상적인 접근을 시도하는 행위</li>
            <li>타인의 명예를 훼손하거나 불법적인 콘텐츠를 게시하는 행위</li>
            <li>스팸성 웹사이트 또는 악성 링크를 등록하는 행위</li>
            <li>
              기타 관련 법령 및 서비스 정책을 위반하는 행위
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">
            제4조 (서비스 이용 제한)
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            운영자는 이용자가 본 약관을 위반하거나 서비스의 정상적인 운영을
            방해하는 경우, 사전 통보 후 서비스 이용을 제한하거나 등록된
            콘텐츠를 삭제할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">
            제5조 (면책 사항)
          </h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>
              서비스에 등록된 외부 웹사이트의 내용, 안전성, 정확성에 대해
              운영자는 보증하지 않습니다.
            </li>
            <li>
              이용자가 외부 웹사이트를 이용하면서 발생한 문제에 대해 운영자는
              책임지지 않습니다.
            </li>
            <li>
              천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해
              운영자는 책임지지 않습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">
            제6조 (지적 재산권)
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            서비스의 디자인, 코드, 콘텐츠 등에 대한 지적 재산권은 운영자에게
            있습니다. 이용자가 등록한 웹사이트 정보의 저작권은 해당 이용자에게
            있으며, 서비스 내 표시 및 홍보 목적으로 사용됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">제7조 (약관 변경)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            본 약관은 필요에 따라 변경될 수 있으며, 변경 시 서비스 내 공지를
            통해 안내합니다. 변경된 약관은 공지한 날로부터 효력이 발생합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">제8조 (문의)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            서비스 이용에 관한 문의는 아래 이메일로 보내주세요.
          </p>
          <p className="text-sm mt-2">
            <a
              href="mailto:openwebside@gmail.com"
              className="text-primary hover:underline"
            >
              openwebside@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
