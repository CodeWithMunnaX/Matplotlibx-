"use client";

import React from "react";
import { Zap, Award } from "lucide-react";

interface ProgressBarProps {
  completedCount: number;
  totalCount: number;
}

export default function ProgressBar({ completedCount, totalCount }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((completedCount / (totalCount || 1)) * 100));

  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="flex items-center justify-between text-zinc-800 dark:text-[#FDF2F8]">
        <span className="flex items-center gap-1.5 font-bold">
          <Zap className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
          Course Progress
        </span>
        <span className="text-pink-600 dark:text-pink-400 font-black">
          {completedCount} / {totalCount} ({percent}%)
        </span>
      </div>

      <div className="w-full h-2.5 rounded-full bg-pink-100/60 dark:bg-[#151022] overflow-hidden p-0.5 border border-pink-200/80 dark:border-[#2D2248]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
