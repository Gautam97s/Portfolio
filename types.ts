export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  github: string;
}

export interface ExperienceItem {
  id: number;
  year: string;
  role: string;
  company: string;
  description: string;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'tools';
}

export enum SectionId {
  HERO = 'hero',
  ABOUT = 'about',
  PROJECTS = 'projects',
  EXPERIENCE = 'experience',
  CONTACT = 'contact',
}