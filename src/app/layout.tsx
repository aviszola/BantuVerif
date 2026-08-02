import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BantuVerif — Platform Verifikasi Bantuan Sosial Berbasis Konsensus Komunitas",
  description: "Platform ekosistem web terpercaya untuk verifikasi bantuan sosial (Bansos) transparan, adil, dan berbasis konsensus komunitas di Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-background text-on-surface">
        {children}
      </body>
    </html>
  );
}
