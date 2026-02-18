import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🧵 실타래 - 그 분이 아직 곁에 계실 때",
  description: "링크 하나를 보내면, AI가 당신을 대신해 그분의 생애를 묻고 기록합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
