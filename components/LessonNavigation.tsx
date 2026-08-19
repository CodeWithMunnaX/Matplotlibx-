"use client";

import React from "react";
import Link from "next/link";
import { Lesson } from "@/data/lessons";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

interface LessonNavigationProps {
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  currentLesson: Lesson;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
}

export default function LessonNavigation({
  prevLesson,
  nextLesson,
  currentLesson,
  isCompleted = false,
  onToggleComplete,
}: LessonNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card font-mono text-xs transition-colors">
      {/* Previous Lesson */}
      {prevLesson ? (
        <Link
          href={`/lessons/${prevLesson.slug}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-[#26304A] hover:bg-slate-100 dark:hover:bg-[#16203B] text-slate-700 dark:text-[#F5F7FA] transition-all w-full sm:w-auto justify-center sm:justify-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <div className="text-left">
            <div className="text-[10px] text-slate-500">Previous</div>
            <div className="font-bold truncate max-w-[140px]">{prevLesson.title.split(". ")[1]}</div>
          </div>
        </Link>
      ) : (
        <div className="w-full sm:w-auto" />
      )}

      {/* Center Complete Toggle */}
      {onToggleComplete && (
        <button
          onClick={onToggleComplete}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all ${
            isCompleted
              ? "bg-teal-50 dark:bg-[#00D9C0]/10 text-teal-700 dark:text-[#00D9C0] border-teal-300 dark:border-[#00D9C0]/40 font-bold shadow-sm"
              : "bg-slate-100 dark:bg-[#0B1021] text-slate-600 dark:text-[#8B93A7] border-slate-200 dark:border-[#26304A] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isCompleted ? "text-teal-500 dark:text-[#00D9C0]" : ""}`} />
          <span>{isCompleted ? "Lesson Completed" : "Mark as Complete"}</span>
        </button>
      )}

      {/* Next Lesson */}
      {nextLesson ? (
        <Link
          href={`/lessons/${nextLesson.slug}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 dark:bg-[#00D9C0] hover:bg-teal-700 dark:hover:bg-[#00D9C0]/90 text-white dark:text-[#0B1021] font-bold shadow-md shadow-teal-500/20 dark:shadow-[0_0_15px_rgba(0,217,192,0.35)] transition-all w-full sm:w-auto justify-center sm:justify-end"
        >
          <div className="text-right">
            <div className="text-[10px] opacity-80">Next Lesson</div>
            <div className="font-black truncate max-w-[140px]">{nextLesson.title.split(". ")[1]}</div>
          </div>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <div className="w-full sm:w-auto" />
      )}
    </div>
  );
}
