"use client";

import React from "react";
import { X, Play, ExternalLink, Sparkles } from "lucide-react";
import { Lesson } from "@/data/lessons";

interface LessonVideoModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export default function LessonVideoModal({ lesson, onClose }: LessonVideoModalProps) {
  React.useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overscroll-contain animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#0F162B] border border-slate-200 dark:border-[#26304A] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col font-sans max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-[#26304A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-[#F5F7FA]">
                Video Masterclass: {lesson.title}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                By Munna Kumar (@CodeWithMunnaX)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#26304A] hover:bg-slate-100 dark:hover:bg-[#16203B] text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Embed / Banner */}
        <div className="p-6 space-y-4">
          <div className="relative w-full aspect-video rounded-2xl bg-slate-900 border border-slate-200 dark:border-[#26304A] overflow-hidden flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <Play className="w-7 h-7 fill-current ml-1" />
            </div>

            <div className="space-y-1 max-w-md">
              <h4 className="text-base font-bold text-white">
                Matplotlib Full Masterclass 2026 Tutorial
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                Watch full Hindi & English in-depth breakdown for Topic {lesson.number}: {lesson.title.split(". ")[1]}
              </p>
            </div>

            <a
              href="https://www.youtube.com/@CodeWithMunnaX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold shadow-lg transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>Watch on YouTube Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Subscribe for weekly Data Science & Python uploads</span>
            <span className="text-teal-600 dark:text-[#00D9C0] font-bold">@CodeWithMunnaX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
