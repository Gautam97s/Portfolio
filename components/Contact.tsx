"use client";

import React, { useState, useRef } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { SectionId } from "../types";
import { SITE_META } from "../constants";

export const Contact: React.FC = () => {
    const [status, setStatus] = useState<
        "idle" | "submitting" | "success" | "error"
    >("idle");

    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const formData = new FormData(e.target as HTMLFormElement);
            formData.append("access_key", "4f6c54ce-b6bc-410a-968f-2166332ce5c0");

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setStatus("success");
                formRef.current?.reset();
            } else {
                setStatus("error");
            }

            // Reset UI after 4 seconds
            setTimeout(() => setStatus("idle"), 4000);
        } catch (err) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 4000);
        }
    };

    return (
        <section
            id={SectionId.CONTACT}
            className="py-24 bg-gradient-to-b from-transparent to-primary/5 dark:to-dark/30 relative"
        >
            <div className="container mx-auto px-4 md:px-12 max-w-4xl">
                <div className="glass-panel rounded-3xl p-6 md:p-12 shadow-2xl overflow-hidden relative">
                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-3xl font-display font-bold mb-4">
                                Let's work together
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8">
                                Have a project in mind or just want to say hi? I'm currently
                                open for new opportunities.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                                        📧
                                    </div>
                                    <a
                                        href={`mailto:${SITE_META.email}`}
                                        className="hover:text-primary transition-colors font-medium"
                                    >
                                        {SITE_META.email}
                                    </a>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-black dark:text-orange-300">
                                        𝕏
                                    </div>
                                    <a
                                        href={SITE_META.socials.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary transition-colors font-medium"
                                    >
                                        @Gautamsharma905
                                    </a>

                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-[#0A66C2] dark:text-orange-300">
                                        In
                                    </div>
                                    <a
                                        href={SITE_META.socials.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary transition-colors font-medium"
                                    >
                                        Gautam Sharma
                                    </a>

                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="relative">
                            <form
                                ref={formRef}
                                onSubmit={handleSubmit}
                                action="#no-op"
                                className="space-y-4 relative z-10"
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium mb-1 ml-1"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        required
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-dark/60 border border-slate-200 dark:border-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium mb-1 ml-1"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        required
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-dark/60 border border-slate-200 dark:border-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium mb-1 ml-1"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={4}
                                        placeholder="Tell me about your project..."
                                        className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-dark/60 border border-slate-200 dark:border-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 ${status === "success"
                                        ? "bg-green-500 text-white"
                                        : status === "error"
                                            ? "bg-red-500 text-white"
                                            : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-lg"
                                        }`}
                                >
                                    {status === "idle" && (
                                        <>
                                            <span>Send Message</span> <Send size={18} />
                                        </>
                                    )}

                                    {status === "submitting" && (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    )}

                                    {status === "success" && (
                                        <>
                                            <span>Sent Successfully</span>
                                            <CheckCircle size={20} />
                                        </>
                                    )}

                                    {status === "error" && (
                                        <>
                                            <span>Error, Try Again</span>
                                            <AlertCircle size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
