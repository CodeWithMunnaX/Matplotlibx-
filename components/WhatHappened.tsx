"use client";

import React from "react";
import { Eye } from "lucide-react";

export default function WhatHappened({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-3 transition-colors h-fit">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 text-teal-600 dark:text-[#00D9C0]" />
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FA]">
          What Just Happened?
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8B93A7] leading-relaxed font-sans">
        {text}
      </p>
    </div>
  );
}
