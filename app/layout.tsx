"use client";

import "./globals.css";
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cleanupGSAP } from "@/lib/gsapCleanup";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();     // 👈 real route detection
  const [isDark, setIsDark] = useState(false);

  // theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  // load GSAP once and register plugins
  useEffect(() => {
    (async () => {
      try {
        const gsapModule = await import("gsap");
        const gsap = gsapModule.gsap || gsapModule.default || gsapModule;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);
        
        // Try to register ScrollToPlugin if available
        try {
          const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
          if (ScrollToPlugin) {
            gsap.registerPlugin(ScrollToPlugin);
          }
        } catch {
          // ScrollToPlugin might not be available or already registered
        }
      } catch { }
    })();
  }, []);

  // toggle theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // 🔥 CLEAN GSAP ON REAL ROUTE CHANGE
  // 🔥 CLEAN GSAP ON REAL ROUTE CHANGE
  useEffect(() => {
    // Disable browser's native scroll restoration
    if (typeof window !== "undefined" && window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Force scroll to top immediately on route change
    window.scrollTo(0, 0);

    setTimeout(async () => {
      try {
        const st = await import("gsap/ScrollTrigger");
        st.ScrollTrigger?.refresh?.();
      } catch { }
    }, 50);
  }, [pathname]);

  return (
    <html lang="en" className="scroll-smooth">
      <head />
      <body className="bg-light text-slate-800 dark:bg-dark dark:text-slate-100 transition-colors duration-300">

        {/* Background Blobs */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary blur-3xl animate-blob rounded-full mix-blend-multiply" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary blur-3xl animate-blob animation-delay-2000 rounded-full mix-blend-multiply" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-accent blur-3xl animate-blob animation-delay-4000 rounded-full mix-blend-multiply" />
        </div>

        <Header
          isDark={isDark}
          toggleTheme={() => setIsDark(p => !p)}
        />

        <main className="z-10 relative">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
