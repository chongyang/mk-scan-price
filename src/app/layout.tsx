import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MK Price Checker',
  description: 'Scan QR codes to check product prices and inventory',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
} 