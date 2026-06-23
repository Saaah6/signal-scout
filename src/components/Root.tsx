import React from 'react';
import { ThemeProvider } from "next-themes";
import CursorGlow from "@/components/CursorGlow";
import App from "@/components/App";
import AuthProvider from "@/components/AuthProvider";

export default function Root() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <div className="fixed inset-0 pointer-events-none z-[-2] flex justify-center overflow-hidden">
          <div className="w-full h-full grid-bg absolute inset-0" />
          <div className="absolute inset-0 bg-vignette" />
        </div>
        <CursorGlow />
        <div className="relative z-10 flex flex-col min-h-screen">
          <App />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
