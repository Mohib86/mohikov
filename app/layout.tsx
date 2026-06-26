import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Escape from Tarkov - MohiKov',
  description: 'Quest tracker, loot maps, ammo & armor reference, and a live Goons tracker.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
