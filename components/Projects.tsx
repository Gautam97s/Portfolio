"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { SectionId } from '../types';
import { PROJECTS } from '../constants';
import { useRouter } from "next/navigation";

interface ProjectsProps {
  limit?: number;
  onViewAll?: () => void;
  title?: string;
  description?: string;
  showViewAllButton?: boolean;
}

export const Projects: React.FC<ProjectsProps> = ({
  limit,
  onViewAll,
  title = "Selected Works",
  description = "A collection of projects that demonstrate my ability to ship high-quality, production-ready code.",
  showViewAllButton = false
}) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const displayedProjects = (limit && !expanded) ? PROJECTS.slice(0, limit) : PROJECTS;
  const shouldShowButton = showViewAllButton && limit && PROJECTS.length > limit;

  useEffect(() => {
    // Use a small timeout to ensure DOM is ready when switching views
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray('.project-card');

        // Reset any previous GSAP settings
        gsap.set(cards, { clearProps: "all" });

        // Batch animation for smoother performance with ScrollTrigger
        ScrollTrigger.batch(".project-card", {
          onEnter: (elements) => {
            gsap.fromTo(elements,
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                overwrite: 'auto'
              }
            );
          },
          once: true
        });
      }, containerRef);

      return () => ctx.revert();
    }, 50);

    return () => clearTimeout(timer);
  }, [displayedProjects]); // Re-run when the list of projects changes

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const image = card.querySelector('img');
    const overlay = card.querySelector('.card-overlay');
    const icons = card.querySelectorAll('.project-icon');

    // Animate Card Lift & Shadow
    gsap.to(card, {
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.15)",
      duration: 0.4,
      ease: "power3.out",
      overwrite: 'auto' // Ensure this doesn't conflict with entrance animation if triggered early
    });

    // Animate Image Scale
    if (image) {
      gsap.to(image, {
        scale: 1.1,
        duration: 0.6,
        ease: "power3.out"
      });
    }

    // Animate Overlay
    if (overlay) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3
      });
    }

    // Animate Icons Pop
    if (icons.length) {
      gsap.to(icons, {
        scale: 1.2,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(2)"
      });
    }
  };

  // SINGLE handleViewAllClick implementation (no duplicate)
  const handleViewAllClick = () => {
    if (onViewAll) {
      // If parent gave a handler, use it
      onViewAll();
      return;
    }

    // Prefer full-page projects route if router is available
    try {
      if (router && typeof router.push === "function") {
        router.push("/projects");
        return;
      }
    } catch {
      // ignore and fallback
    }

    // Fallback: toggle expanded within the same page
    setExpanded(prev => !prev);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const image = card.querySelector('img');
    const overlay = card.querySelector('.card-overlay');
    const icons = card.querySelectorAll('.project-icon');

    // Reset Card
    gsap.to(card, {
      y: 0,
      scale: 1,
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // Revert to shadow-sm
      duration: 0.4,
      ease: "power3.out",
      overwrite: 'auto'
    });

    // Reset Image
    if (image) {
      gsap.to(image, {
        scale: 1,
        duration: 0.6,
        ease: "power3.out"
      });
    }

    // Reset Overlay
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3
      });
    }

    // Reset Icons
    if (icons.length) {
      gsap.to(icons, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <section id={SectionId.PROJECTS} ref={containerRef} className="py-24 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen">
      <div className="container mx-auto px-8 md:px-12">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{title}</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              className="project-card group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm cursor-pointer opacity-0"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative overflow-hidden aspect-video">
                <div className="card-overlay absolute inset-0 bg-slate-900/20 opacity-0 z-10 pointer-events-none"></div>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover origin-center"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                  <div className="flex gap-3">
                    <a
                      href={project.github}
                      className="project-icon text-slate-400 hover:text-primary transition-colors origin-center"
                      title="View Code"
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={20} />
                    </a>

                    <a
                      href={project.link}
                      className="project-icon text-slate-400 hover:text-primary transition-colors origin-center"
                      title="View Live"
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={20} />
                    </a>

                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {shouldShowButton && (
          <div className="flex justify-center">
            <button
              onClick={handleViewAllClick}
              className="group relative px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold overflow-hidden flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
            >
              <span className="relative z-10">{expanded ? "Show Less" : "Show More Projects"}</span>
              <ArrowRight size={18} className={`relative z-10 transition-transform ${expanded ? "rotate-180" : "group-hover:translate-x-1"}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
