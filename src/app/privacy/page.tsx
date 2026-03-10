import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "오픈웹사이드 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="px-4 md:px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">개인정보처리방침</h1>
      <p className="text-xs text-muted-foreground mb-8">
        최종 수정일: 2026년 3월 11일
      </p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. 수집하는 개인정보</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            오픈웹사이드(이하 &quot;서비스&quot;)는 Google OAuth를 통한 로그인 시
            다음 정보를 수집합니다.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
            <li>이메일 주소</li>
            <li>프로필 이름</li>
            <li>프로필 이미지 URL</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">
            2. 개인정보 수집 및 이용 목적
          </h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>회원 식별 및 로그인 관리</li>
            <li>웹사이트 등록, 리뷰, 추천 기능 제공</li>
            <li>서비스 개선 및 통계 분석</li>
            <li>문의 대응 및 고객 지원</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">
            3. 개인정보 보유 및 파기
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            회원 탈퇴 시 수집된 개인정보는 지체 없이 파기합니다. 단, 관련
            법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. 제3자 제공</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            서비스는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
            단, 법령에 의한 요청이 있는 경우는 예외로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. 외부 서비스</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            서비스는 다음 외부 서비스를 이용하며, 각 서비스의 개인정보처리방침이
            적용됩니다.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
            <li>
              <strong>Supabase</strong> — 인증 및 데이터 저장
            </li>
            <li>
              <strong>Google Analytics / Google Ads</strong> — 방문 통계 및 광고
            </li>
            <li>
              <strong>Vercel</strong> — 웹사이트 호스팅
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">6. 쿠키 사용</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            서비스는 로그인 세션 유지 및 사이트 이용 분석을 위해 쿠키를
            사용합니다. 브라우저 설정에서 쿠키를 차단할 수 있으나, 일부 기능
            이용이 제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">7. 이용자의 권리</h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>개인정보 열람, 수정, 삭제 요청</li>
            <li>회원 탈퇴를 통한 개인정보 삭제</li>
            <li>마케팅 수신 거부</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">8. 문의</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            개인정보 관련 문의는 아래 이메일로 보내주세요.
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
