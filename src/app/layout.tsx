import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "しん²スタディ | たのしくまなぼう！",
  description: "3さいからのたのしい学習教材コレクション。日本地図クイズなど、あそびながらまなべるコンテンツがいっぱい！",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Enable pseudo-class :active instantly on iOS/iPadOS Safari */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener("touchstart", function(){}, {passive: true});`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
