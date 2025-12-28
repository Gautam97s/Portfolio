"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun, Github, ArrowLeft } from "lucide-react";
import { SectionId } from "../types";
import { SITE_META } from "../constants";
import { useRouter, usePathname } from "next/navigation";
import { gsapSmoothScroll } from "@/lib/smoothScroll";

interface HeaderProps {
    isDark: boolean;
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // scroll detection
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
    }, [isMenuOpen]);

    // close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // escape to close mobile menu
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const navLinks = [
        { name: "About", href: `#${SectionId.ABOUT}` },
        { name: "Projects", href: "/projects" },
        { name: "Experience", href: `#${SectionId.EXPERIENCE}` },
        { name: "Contact", href: `#${SectionId.CONTACT}` },
    ];

    // helper: smooth scroll to a hash on the current page using GSAP
    const scrollToHash = async (hash: string) => {
        await gsapSmoothScroll(hash, {
            duration: 1.2,
            offset: 80, // Account for fixed header
            ease: "power2.inOut"
        });
    };

    // Robust nav click handler:
    // - For full page routes ("/projects"), do NOT preventDefault: let <Link> do its job.
    // - For hashes: if not on "/", navigate to "/" then scroll after mount; otherwise scroll immediately.
    const handleNavClick = useCallback(
        async (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
            setIsMenuOpen(false);

            // HASH LINKS (in-page anchors)
            if (href.startsWith("#")) {
                e.preventDefault();

                if (pathname !== "/") {
                    // Navigate to home route first (without hash in path)
                    await router.push("/");
                    // Wait for route change and DOM to be ready, then scroll with GSAP
                    setTimeout(async () => {
                        await gsapSmoothScroll(href, {
                            duration: 1.2,
                            offset: 80,
                            ease: "power2.inOut"
                        });
                    }, 300);
                } else {
                    // already on home, just scroll
                    await scrollToHash(href);
                }

                return;
            }

            // FULL PAGE ROUTES (start with "/")
            // Let Link or anchor handle it — do not preventDefault
            return;
        },
        [router, pathname]
    );

    // logo click: always go to root (real navigation) and scroll top after navigation completes
    const handleLogoClick = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();
            setIsMenuOpen(false);

            // If already on root, just scroll to top using GSAP
            if (pathname === "/") {
                await gsapSmoothScroll(0, {
                    duration: 1,
                    ease: "power2.inOut"
                });
                return;
            }

            await router.push("/");
            setTimeout(async () => {
                await gsapSmoothScroll(0, {
                    duration: 1,
                    ease: "power2.inOut"
                });
            }, 80);
        },
        [router, pathname]
    );

    const onClickLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) =>
        handleNavClick(e, href);

    const onMobileLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) =>
        handleNavClick(e, href);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-4" : "py-6"
                }`}
        >
            <div className="container mx-auto px-6 max-w-5xl">
                <nav
                    className={`glass-panel rounded-full px-4 md:px-6 py-3 flex items-center justify-between shadow-lg transition-all duration-300 ${isScrolled ? "bg-opacity-90" : "bg-opacity-60"
                        }`}
                >
                    {/* Logo - use button/anchor that triggers router.push to "/" */}
                    <a
                        href="/"
                        onClick={handleLogoClick}
                        className="text-xl font-display font-bold tracking-tighter hover:text-primary transition-colors flex items-center gap-2"
                    >
                        {/* Show a small back icon on mobile if on /projects */}
                        {pathname === "/projects" && <ArrowLeft size={18} className="md:hidden" />}
                        {SITE_META.name}.
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <ul className="flex space-x-6 text-sm font-medium">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    {link.href.startsWith("/") ? (
                                        // Full page route: use Link and let Next handle navigation
                                        <Link
                                            href={link.href}
                                            className="hover:text-primary transition-colors relative group cursor-pointer"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.name}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                        </Link>
                                    ) : (
                                        // Hash link: handle via onClick (scroll or navigate-then-scroll)
                                        <a
                                            href={link.href}
                                            onClick={(e) => onClickLink(e, link.href)}
                                            className="hover:text-primary transition-colors relative group cursor-pointer"
                                        >
                                            {link.name}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-800 mx-4"></div>

                        <div className="flex items-center space-x-4">
                            <a
                                href={SITE_META.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Github size={18} />
                            </a>

                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                                aria-label="Toggle Theme"
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-1" aria-label="Toggle Theme">
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button
                            onClick={() => setIsMenuOpen((s) => !s)}
                            className="p-1 hover:text-primary transition-colors"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 p-4 md:hidden">
                    <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-4 shadow-xl animate-in slide-in-from-top-5 fade-in duration-200">
                        {navLinks.map((link) =>
                            link.href.startsWith("/") ? (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium py-2 border-b border-slate-200 dark:border-slate-900/50 last:border-0 hover:text-primary hover:pl-2 transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => onMobileLink(e, link.href)}
                                    className="text-lg font-medium py-2 border-b border-slate-200 dark:border-slate-900/50 last:border-0 hover:text-primary hover:pl-2 transition-all"
                                >
                                    {link.name}
                                </a>
                            )
                        )}

                        <div className="flex items-center space-x-4 pt-4">
                            <a
                                href={SITE_META.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                GitHub
                            </a>

                            <a
                                href={SITE_META.socials.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Twitter
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
