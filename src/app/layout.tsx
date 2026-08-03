import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "BantuVerif — Platform Verifikasi Bantuan Sosial Berbasis Konsensus Komunitas",
  description:
    "Platform ekosistem web terpercaya untuk verifikasi bantuan sosial (Bansos) transparan, adil, dan berbasis konsensus komunitas di Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-background text-on-surface flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 pb-[60px] lg:pb-0">
          {children}
        </div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
