import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${robotoMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen w-full overflow-x-hidden flex flex-col relative noise-overlay bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Global Premium Grid Overlay */}
          <div className="fixed inset-0 pointer-events-none z-[-2] flex justify-center overflow-hidden">
            <div className="w-full h-full grid-bg absolute inset-0" />
            {/* Subtle gradient vignette to fade grid edges */}
            <div className="absolute inset-0 bg-vignette" />
          </div>
          
          {/* Premium Cursor Interactive Background */}
          <CursorGlow />
          
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
