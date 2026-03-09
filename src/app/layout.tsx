import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openwebside.com"),
  title: {
    default: "오픈웹사이드 - 무료 웹사이트 홍보 & 유용한 웹서비스 모음",
    template: "%s | 오픈웹사이드",
  },
  description:
    "내가 만든 웹사이트를 무료로 홍보하고, 다양한 무료 웹사이트를 발견하세요. AI 도구, 유틸리티, 학습 플랫폼 등 유용한 웹서비스를 리뷰와 별점으로 추천합니다.",
  keywords: [
    "무료 웹사이트 홍보",
    "웹사이트 등록",
    "무료 웹서비스 모음",
    "웹사이트 디렉토리",
    "웹서비스 추천",
    "사이트 리뷰",
    "무료 도구 모음",
    "AI 도구 추천",
    "한국 웹서비스",
    "무료 사이트 모음",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://openwebside.com",
    siteName: "오픈웹사이드",
    title: "오픈웹사이드 - 무료 웹사이트 홍보 & 유용한 웹서비스 모음",
    description:
      "내가 만든 웹사이트를 무료로 홍보하세요. 다양한 무료 웹서비스를 찾고 이용할 수 있습니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "오픈웹사이드 - 무료 웹사이트 홍보 & 유용한 웹서비스 모음",
    description:
      "내가 만든 웹사이트를 무료로 홍보하세요. 다양한 무료 웹서비스를 찾고 이용할 수 있습니다.",
  },
  alternates: {
    canonical: "https://openwebside.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "LNRSf2aWqO4gbTnMC5V0hg1Iy2AGJR35KaNnL-R1vms",
  },
  other: {
    "ows-verify": "3a7db0c98b9a4c61",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18003602035"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18003602035');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Header />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
