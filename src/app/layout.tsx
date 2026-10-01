import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CivicFix – Report. Track. Resolve.',
  description: 'Digital Reporting and Resolution System for Public Infrastructure Damage',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
