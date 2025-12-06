"use client";

import React, { useEffect } from "react";
import { Projects } from "../../components/Projects";
import { gsapSmoothScroll } from "@/lib/smoothScroll";

export default function ProjectsPage() {
  useEffect(() => {
    // Scroll to top when component mounts using GSAP smooth scroll
    (async () => {
      await gsapSmoothScroll(0, {
        duration: 1,
        ease: "power2.inOut"
      });
    })();
  }, []);

  return (
    <div className="pt-20">
      <Projects
        // do not pass `limit` so it will show all projects
        title="All Projects"
        description="Browse my complete portfolio of web applications, experiments, and open source contributions."
        showViewAllButton={false} // hide inner button on this page
      />
    </div>
  );
}
