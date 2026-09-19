import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Receipt Shield — Evidence-based expense verification",
  description:
    "Cross-reference expense claims against independent sources. Decision-ready case files in under one minute.",
  keywords: ["expense verification", "receipt verification", "evidence-based audit", "expense management"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#0a0a12] text-[#ededf4]">
        {children}
      </body>
    </html>
  );
}
