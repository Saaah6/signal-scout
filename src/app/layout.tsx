import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IntelScout AI - Enterprise GTM Intelligence & Qualification",
  description: "Real-time AI crawler, technographics parser, and account qualification scoring engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative noise-overlay bg-white text-black">
        {/* Global Premium Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[-2] flex justify-center overflow-hidden">
          <div className="w-full h-full grid-bg absolute inset-0" />
          {/* Subtle gradient vignette to fade grid edges */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)]" />
        </div>
        
        {/* Premium Cursor Interactive Background */}
        <CursorGlow />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
