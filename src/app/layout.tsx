import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '健康美人 - 40代からの美と健康',
  description: '毎日の食事と運動を記録して、もっと自分らしく健康に。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
