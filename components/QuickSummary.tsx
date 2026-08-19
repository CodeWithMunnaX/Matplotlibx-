"use client";

import React from "react";
import { CheckCircle2, Bookmark, Sparkles } from "lucide-react";

interface QuickSummaryProps {
  summary: string[];
}

export default function QuickSummary({ summary }: QuickSummaryProps) {
  if (!summary || summary.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-4 transition-colors">
      <div className="flex items-center gap-2">
        <Bookmark className="w-4 h-4 text-teal-600 dark:text-[#00D9C0]" />
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FA]">
          Quick Lesson Takeaways
        </h3>
      </div>

      <ul className="space-y-2.5">
        {summary.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-[#8B93A7] font-sans leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-teal-500 dark:text-[#00D9C0] shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
