"use client";

import React, { useEffect, useRef } from "react";
import { SectionId } from "../types";
import { SKILLS } from "../constants";
import { SpotifyCard } from "./SpotifyCard";

export const About: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const skillsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Respect user's reduced motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        let ctx: any = null;
        let ScrollTriggerModule: any = null;
        let gsapModule: any = null;

        (async () => {
            try {
                const g = await import("gsap");
                const st = await import("gsap/ScrollTrigger");

                gsapModule = (g as any).gsap ?? (g as any).default ?? g;
                ScrollTriggerModule =
                    (st as any).ScrollTrigger ?? (st as any).default ?? st;

                // Register plugin safely
                try {
                    gsapModule.registerPlugin(ScrollTriggerModule);
                } catch { }

                ctx = gsapModule.context(() => {
                    const root = containerRef.current;
                    if (!root) return;

                    // About section text reveal
                    const aboutChildren = root.querySelectorAll(".about-content > *");

                    gsapModule.fromTo(
                        aboutChildren,
                        { y: 40, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            stagger: 0.08,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: root.querySelector(".about-content"),
                                start: "top 80%",
                                toggleActions: "play none none reverse",
                                invalidateOnRefresh: true,
                            },
                        }
                    );

                    // Skill pill animations
                    const pills =
                        skillsRef.current?.querySelectorAll(".skill-pill") ?? [];

                    if (pills.length > 0) {
                        gsapModule.fromTo(
                            pills,
                            { scale: 0.85, opacity: 0 },
                            {
                                scale: 1,
                                opacity: 1,
                                duration: 0.45,
                                stagger: 0.04,
                                ease: "back.out(1.6)",
                                scrollTrigger: {
                                    trigger: skillsRef.current,
                                    start: "top 85%",
                                    toggleActions: "play none none reverse",
                                    invalidateOnRefresh: true,
                                },
                            }
                        );
                    }
                }, containerRef);
            } catch (err) {
                // Silent fail — no GSAP means no animation but no crash
            }
        })();

        return () => {
            try {
                ctx?.revert();
            } catch { }
            try {
                ScrollTriggerModule?.getAll?.()?.forEach((t: any) => t.kill());
            } catch { }
        };
    }, []);

    return (
        <section id={SectionId.ABOUT} ref={containerRef} className="py-24 relative">
            <div className="container mx-auto px-8 md:px-12">
                <div className="grid md:grid-cols-2 gap-12 items-center about-content">
                    {/* LEFT COLUMN */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                            About Me
                        </h2>

                        <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                            <p>
                                I'm a multidisciplinary full-stack developer working across
                                frontend, backend, and AI/ML. I love designing smooth user
                                experiences, architecting reliable systems, and building
                                intelligent features that turn complex ideas into simple, useful
                                products.
                            </p>

                            <p>
                                What I Do <br />
                                - Build full-stack web apps <br />
                                - Design intuitive user experiences <br />
                                - Develop AI/ML-powered features <br />
                                - Experiment with automation & emerging tech <br />
                                - Ship fast prototypes and production-ready systems
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden bg-white/80 dark:bg-dark/60">
                        {/* Decorative background element - strictly behind content */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl z-0 pointer-events-none"></div>

                        <h3 className="text-xl font-bold mb-6 relative z-10">
                            Technologies & Tools
                        </h3>

                        <div
                            ref={skillsRef}
                            className="flex flex-wrap gap-3 relative z-10"
                        >
                            {SKILLS.map((skill) => (
                                <span
                                    key={skill.name}
                                    className="skill-pill px-4 py-2 bg-white/50 dark:bg-dark/40 border border-white/40 dark:border-slate-900/50 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-dark/60 transition-colors cursor-default"
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-orange-50 dark:bg-dark/60 rounded-2xl border border-orange-100 dark:border-slate-900/50 flex items-start gap-4 relative z-10">
                            <div className="text-4xl">⚡</div>

                            <div>
                                <h4 className="font-bold text-sm mb-1">Currently learning</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Learning about Python libraries and machine learning models, and applying them to my real-life projects.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spotify Card */}
                <div className="mt-12">
                    <SpotifyCard />
                </div>
            </div>
        </section>
    );
};
