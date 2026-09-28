import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import FloatingGymBuddy from "@/components/FloatingGymBuddy";
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
  title: "AI_GYM_FITNESS & ASSISTANT | PhysioRecover AI",
  description:
    "Intelligent Clinical Physical Therapy, Joint Range-of-Motion (ROM), Form Biomechanics & Smart Gym Assistant by P. Durga Naik",
  authors: [{ name: "P. Durga Naik" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col relative bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <FloatingGymBuddy />
      </body>
    </html>
  );
}
