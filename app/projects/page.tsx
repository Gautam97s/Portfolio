// app/projects/page.tsx
import React from "react";
import { Projects } from "../../components/Projects"; // adjust path if your components folder is elsewhere

export const metadata = {
  title: "Projects — All Work",
  description: "Browse all projects, case studies, and experiments.",
};

export default function ProjectsPage() {
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
