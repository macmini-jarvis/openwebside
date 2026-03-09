import { Category } from "@/types/database";

export const CATEGORIES: Category[] = [
  {
    name: "AI 도구",
    slug: "ai",
    icon: "🤖",
    subcategories: [
      { name: "AI 이미지 생성", slug: "ai-image" },
      { name: "AI 글쓰기 / 번역", slug: "ai-writing" },
      { name: "AI 음악 / 오디오", slug: "ai-audio" },
      { name: "AI 영상 생성", slug: "ai-video" },
      { name: "AI 챗봇 / 상담", slug: "ai-chatbot" },
      { name: "AI 기타", slug: "ai-other" },
    ],
  },
  {
    name: "유틸리티",
    slug: "utility",
    icon: "🛠️",
    subcategories: [
      { name: "파일 변환", slug: "file-convert" },
      { name: "이미지 편집", slug: "image-edit" },
      { name: "텍스트 / 코드 도구", slug: "text-code" },
      { name: "계산기 / 측정", slug: "calculator" },
    ],
  },
  {
    name: "라이프스타일",
    slug: "lifestyle",
    icon: "💬",
    subcategories: [
      { name: "심리 상담 / 멘탈케어", slug: "mental-health" },
      { name: "건강 / 운동", slug: "health-fitness" },
      { name: "연애 / 인간관계", slug: "relationship" },
      { name: "종교 / 철학", slug: "religion" },
    ],
  },
  {
    name: "학습 / 정보",
    slug: "education",
    icon: "📚",
    subcategories: [
      { name: "어학 / 번역", slug: "language" },
      { name: "교육 플랫폼", slug: "education-platform" },
      { name: "정보 / 뉴스", slug: "news" },
    ],
  },
  {
    name: "비즈니스 / 생산성",
    slug: "business",
    icon: "💼",
    subcategories: [
      { name: "마케팅 도구", slug: "marketing" },
      { name: "프로젝트 관리", slug: "project-management" },
      { name: "디자인 도구", slug: "design" },
      { name: "SaaS / 구독", slug: "saas" },
    ],
  },
  {
    name: "엔터테인먼트",
    slug: "entertainment",
    icon: "🎮",
    subcategories: [
      { name: "웹 게임", slug: "web-game" },
      { name: "커뮤니티 / SNS", slug: "community" },
      { name: "미디어 / 스트리밍", slug: "media" },
    ],
  },
  {
    name: "쇼핑 / 금융",
    slug: "shopping",
    icon: "🛒",
    subcategories: [
      { name: "비교 / 추천", slug: "compare" },
      { name: "재테크 / 투자", slug: "finance" },
      { name: "커머스", slug: "commerce" },
    ],
  },
];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategoryName(categorySlug: string, subSlug: string) {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories.find((s) => s.slug === subSlug)?.name;
}

export function getCategoryName(slug: string) {
  return getCategoryBySlug(slug)?.name;
}
