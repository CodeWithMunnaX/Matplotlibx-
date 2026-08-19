"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { CommonMistake } from "@/data/lessons";

interface CommonMistakesProps {
  mistakes: CommonMistake[];
}

export default function CommonMistakes({ mistakes }: CommonMistakesProps) {
  if (!mistakes || mistakes.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-5 transition-colors">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-pink-500" />
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FA]">
          Common Developer Pitfalls & Fixes
        </h3>
      </div>

      <div className="space-y-4">
        {mistakes.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] space-y-3 text-xs"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
              {/* Bad Code */}
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 space-y-1.5">
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-[11px]">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Common Error (Avoid)</span>
                </div>
                <pre className="text-red-700 dark:text-red-300 text-[11px] overflow-x-auto">
                  {m.badCode}
                </pre>
              </div>

              {/* Good Code */}
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-200 dark:border-[#00D9C0]/25 space-y-1.5">
                <div className="flex items-center gap-1.5 text-teal-700 dark:text-[#00D9C0] font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Correct Approach</span>
                </div>
                <pre className="text-teal-800 dark:text-teal-300 text-[11px] overflow-x-auto">
                  {m.goodCode}
                </pre>
              </div>
            </div>

            <p className="text-slate-600 dark:text-[#8B93A7] leading-relaxed font-sans">
              {m.explanation}
            </p>

            <div className="text-[11px] text-amber-700 dark:text-[#FFB86B] font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro Tip: {m.proTip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
