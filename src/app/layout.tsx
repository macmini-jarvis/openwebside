import type { Metadata } from "next";
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
  title: "오픈웹사이드 - 웹사이트를 발견하고 공유하세요",
  description:
    "내가 만든 웹사이트를 등록하고, 다른 사람들의 웹사이트를 발견하세요. 리뷰와 별점으로 좋은 웹서비스를 추천합니다.",
  keywords: ["웹사이트 디렉토리", "웹서비스 추천", "사이트 리뷰", "한국 웹서비스"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
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
