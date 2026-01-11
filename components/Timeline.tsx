"use client";

import React, { useEffect, useRef } from "react";
import { SectionId } from "../types";
import { EXPERIENCE } from "../constants";

export const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (reducedMotion) {
      if (lineRef.current) lineRef.current.style.height = "100%";
      const items = containerRef.current?.querySelectorAll(".timeline-item") ?? [];
      items.forEach((item) => {
        (item as HTMLElement).style.opacity = "1";
        (item as HTMLElement).style.transform = "translateX(0px)";
      });
      return;
    }

    let ctx: any = null;
    let gsapModule: any = null;
    let ScrollTriggerModule: any = null;

    (async () => {
      try {
        const g = await import("gsap");
        const st = await import("gsap/ScrollTrigger");
        const gsap = (g as any).gsap ?? (g as any).default ?? g;
        const ScrollTrigger = (st as any).ScrollTrigger ?? (st as any).default ?? st;

        gsap.registerPlugin(ScrollTrigger);
        gsapModule = gsap;
        ScrollTriggerModule = ScrollTrigger;

        ctx = gsap.context(() => {
          const root = containerRef.current;
          const lineEl = lineRef.current;
          if (!root || !lineEl) return;

          // Ensure initial state so fromTo works predictably
          gsap.set(lineEl, { height: "0%" });

          // animate vertical line growth with scrub
          gsap.fromTo(
            lineEl,
            { height: "0%" },
            {
              height: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top 60%",
                end: "bottom 80%",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }
          );

          // animate each timeline item in view
          const items = Array.from(root.querySelectorAll(".timeline-item"));
          items.forEach((item: any) => {
            gsap.fromTo(
              item,
              { x: -24, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                  once: false,
                },
              }
            );
          });
        }, containerRef);
      } catch (err) {
        // fail gracefully
        // console.warn("Timeline GSAP failed:", err);
      }
    })();

    return () => {
      try {
        ctx?.revert();
      } catch { }
      try {
        ScrollTriggerModule?.getAll?.()?.forEach((t: any) => t.kill?.());
      } catch { }
    };
  }, [reducedMotion]);

  return (
    <section id={SectionId.EXPERIENCE} ref={containerRef} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-8 md:px-12 max-w-4xl">
        <h2 className="text-3xl font-display font-bold mb-12 text-center">Experience</h2>

        <div className="relative pl-8 md:pl-0">
          {/* Vertical Line (Responsive) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 md:transform md:-translate-x-1/2">
            <div ref={lineRef} className="w-full bg-primary absolute top-0 left-0 h-full origin-top"></div>
          </div>

          <div className="space-y-12">
            {EXPERIENCE.map((item, index) => (
              <div
                key={item.id}
                className={`timeline-item relative flex flex-col md:flex-row items-center justify-between gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="w-full md:w-5/12">
                  <div className="glass-panel p-6 rounded-2xl border border-slate-100 dark:border-slate-900/50 shadow-sm hover:border-primary/50 transition-colors">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-teal-700 dark:text-teal-300 text-xs font-bold mb-2">
                      {item.year}
                    </span>
                    <h3 className="text-lg font-bold">{item.role}</h3>
                    <h4 className="text-md font-medium text-slate-500 mb-3">{item.company}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute -left-4 md:left-1/2 w-4 h-4 bg-white dark:bg-dark border-4 border-primary rounded-full transform -translate-x-1/2 z-10 shadow-[0_0_0_4px_rgba(153,246,228,0.2)]"></div>

                <div className="w-full md:w-5/12 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
