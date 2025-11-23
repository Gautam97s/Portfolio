// lib/gsapCleanup.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ensure plugin is registered globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function cleanupGSAP() {
  try {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  } catch (e) {}
  try {
    gsap.globalTimeline.clear();
  } catch (e) {}
  try {
    gsap.context(() => {}).revert();
  } catch (e) {}
}
