"use client";

import React, { useState, useEffect } from "react";
import { X, Heart, ExternalLink, Sparkles } from "lucide-react";

export default function YouTubeSubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("matplotlibx_subscribe_seen");
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 45000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem("matplotlibx_subscribe_seen", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#0F162B] border border-slate-200 dark:border-[#26304A] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 text-center relative font-sans">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl border border-slate-200 dark:border-[#26304A] text-slate-400 hover:text-slate-700 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 mx-auto flex items-center justify-center text-red-600 dark:text-red-500 shadow-md">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-slate-900 dark:text-[#F5F7FA]">
            Master Python with Munna Kumar
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Subscribe to @CodeWithMunnaX for full Python, Data Science, AI & Machine Learning tutorials!
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5 font-mono text-xs">
          <a
            href="https://www.youtube.com/@CodeWithMunnaX?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/25 transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>Subscribe on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleClose}
            className="py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
