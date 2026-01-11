"use client";

import React, { useRef, useEffect } from "react";
import { ArrowRight, Download } from "lucide-react";
import { SectionId } from "../types";
import { SITE_META } from "../constants";

export const Hero: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const textRef = useRef<HTMLParagraphElement | null>(null);
    const btnRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Don't run animations on server or when user prefers reduced motion
        if (typeof window === "undefined") return;
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            // Make sure elements are visible if reduced motion is requested
            if (titleRef.current) titleRef.current.style.opacity = "1";
            if (textRef.current) textRef.current.style.opacity = "1";
            if (btnRef.current) btnRef.current.style.opacity = "1";
            return;
        }

        let ctx: any = null;
        let gsapModule: any = null;

        (async () => {
            try {
                const g = await import("gsap");
                gsapModule = (g as any).gsap ?? (g as any).default ?? g;

                // no ScrollTrigger used here, but keep dynamic import pattern if needed later
                ctx = gsapModule.context(() => {
                    const tl = gsapModule.timeline({ defaults: { ease: "power3.out" } });

                    tl.fromTo(
                        titleRef.current,
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 1, delay: 0.2 }
                    )
                        .fromTo(
                            textRef.current,
                            { y: 30, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.8 },
                            "-=0.5"
                        )
                        .fromTo(
                            btnRef.current,
                            { y: 20, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.6 },
                            "-=0.4"
                        );
                }, containerRef);
            } catch (err) {
                // fail quietly — UI still works without animations
                // console.warn("GSAP failed to load", err);
            }
        })();

        return () => {
            try {
                ctx?.revert();
            } catch { }
            try {
                // if ScrollTrigger was registered/used elsewhere, kill instances to be safe
                const st = (gsapModule?.ScrollTrigger ?? (window as any).ScrollTrigger) as any;
                st?.getAll?.()?.forEach((t: any) => t.kill?.());
            } catch { }
        };
    }, []);

    return (
        <section
            id={SectionId.HERO}
            ref={containerRef}
            className="min-h-screen flex items-center pt-24 pb-32 md:pt-20 md:pb-0 relative"
        >
            <div className="container mx-auto px-8 md:px-12 relative z-10">
                <div className="max-w-3xl">
                    <div className="inline-block mb-4 mt-4 md:mt-5 px-3 py-1 rounded-full bg-primary/20 text-teal-700 dark:text-teal-300 text-sm font-semibold tracking-wide backdrop-blur-sm border border-primary/20">
                        Available for freelance
                    </div>

                    <h1
                        ref={titleRef}
                        className="font-display font-bold text-6xl md:text-8xl leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400"
                    >
                        Turning <br />
                        <span className="italic font-serif text-slate-800 dark:text-slate-100"> ideas <br />
                            into products.</span>
                    </h1>


                    <p
                        ref={textRef}
                        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-xl leading-relaxed"
                    >
                        {SITE_META.tagline} I'm {SITE_META.name}, and I like creating modern products that can address real issues.
                    </p>

                    <div ref={btnRef} className="flex flex-wrap gap-4">
                        <a
                            href={"/projects"}
                            className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold overflow-hidden flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                        >
                            <span className="relative z-10">View Work</span>
                            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        </a>

                        <a
                            href="/Resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            download="Resume.pdf"
                            className="px-8 py-4 glass-panel rounded-full font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-white/40 dark:hover:bg-white/10 transition-all hover:scale-105"
                        >
                            <Download size={18} />
                            <span>Resume</span>
                        </a>

                    </div>
                </div>
            </div>

            {/* Decorative gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-light dark:from-dark to-transparent pointer-events-none" />
        </section>
    );
};
