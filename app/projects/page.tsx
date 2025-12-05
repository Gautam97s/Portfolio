// app/projects/page.tsx
"use client";

import React, { useEffect } from "react";
import { Projects } from "../../components/Projects"; // adjust path if your components folder is elsewhere

export default function ProjectsPage() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'instant' });
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
