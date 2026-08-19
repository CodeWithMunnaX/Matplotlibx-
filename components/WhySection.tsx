"use client";

import React from "react";
import { HelpCircle, Brain, Sparkles, Lightbulb } from "lucide-react";

interface WhySectionProps {
  whyExplanation: {
    title: string;
    description: string;
    mentalModel: string;
    proTip: string;
  };
}

export default function WhySection({ whyExplanation }: WhySectionProps) {
  if (!whyExplanation) return null;

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-5 transition-colors h-fit">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FA]">
          Why Do We Code It This Way?
        </h3>
      </div>

      <div className="space-y-4 text-xs font-sans">
        <div className="space-y-1.5">
          <h4 className="font-bold text-slate-900 dark:text-[#F5F7FA]">
            {whyExplanation.title}
          </h4>
          <p className="text-slate-600 dark:text-[#8B93A7] leading-relaxed">
            {whyExplanation.description}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/25 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-indigo-800 dark:text-indigo-400">
            <Brain className="w-3.5 h-3.5" />
            <span>Under The Hood Intuition</span>
          </div>
          <p className="text-indigo-950 dark:text-[#F5F7FA] leading-relaxed">
            {whyExplanation.mentalModel}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-[#FFB86B]/10 border border-amber-200 dark:border-[#FFB86B]/30 text-amber-900 dark:text-[#FFB86B] flex items-start gap-2">
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed">{whyExplanation.proTip}</span>
        </div>
      </div>
    </div>
  );
}
