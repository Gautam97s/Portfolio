import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — All Work",
  description: "Browse all projects, case studies, and experiments.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

