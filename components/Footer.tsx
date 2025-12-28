"use client";

import React from "react";
import { SITE_META } from "../constants";

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-950">
      <div className="container mx-auto px-6">
        <p>
          Designed and Developed by {SITE_META.name}.
        </p>
        <p>
          © {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
