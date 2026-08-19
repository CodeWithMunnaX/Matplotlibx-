"use client";

import React, { useState } from "react";
import {
  ListOrdered,
  CheckCircle2,
  Terminal,
  Code2,
  Sparkles,
  Layers,
  Filter,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Cpu,
} from "lucide-react";
import { StepExplanation } from "@/lib/explanationEngine";

interface StepByStepProps {
  steps: StepExplanation[];
}

export default function StepByStep({ steps }: StepByStepProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeStep, setActiveStep] = useState<number | null>(null);

  if (!steps || steps.length === 0) return null;

  // Filter steps by category if selected
  const filteredSteps = steps.filter((step) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "plot") return step.badgeType === "plot";
    if (selectedCategory === "data") return step.badgeType === "data";
    if (selectedCategory === "style") return step.badgeType === "style";
    if (selectedCategory === "setup") return step.badgeType === "setup";
    return true;
  });

  const counts = {
    all: steps.length,
    plot: steps.filter((s) => s.badgeType === "plot").length,
    data: steps.filter((s) => s.badgeType === "data").length,
    style: steps.filter((s) => s.badgeType === "style").length,
  };

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-4 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-[#26304A] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-200 dark:border-[#00D9C0]/30 flex items-center justify-center text-teal-600 dark:text-[#00D9C0]">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FA]">
              Step-by-Step Execution Trace
            </h3>
            <span className="text-[11px] text-slate-500 font-sans">
              AST Parser pipeline sequence
            </span>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#16203B] text-slate-600 dark:text-[#8B93A7] border border-slate-200 dark:border-[#26304A]">
          {steps.length} Operations
        </span>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
            selectedCategory === "all"
              ? "bg-teal-600 dark:bg-[#00D9C0] text-white dark:text-[#0B1021] shadow-sm"
              : "bg-slate-100 dark:bg-[#0B1021] text-slate-600 dark:text-[#8B93A7] hover:bg-slate-200 dark:hover:bg-[#16203B]"
          }`}
        >
          All ({counts.all})
        </button>

        {counts.plot > 0 && (
          <button
            onClick={() => setSelectedCategory("plot")}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              selectedCategory === "plot"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-slate-100 dark:bg-[#0B1021] text-slate-600 dark:text-[#8B93A7] hover:bg-slate-200 dark:hover:bg-[#16203B]"
            }`}
          >
            🎨 Plotting ({counts.plot})
          </button>
        )}

        {counts.data > 0 && (
          <button
            onClick={() => setSelectedCategory("data")}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              selectedCategory === "data"
                ? "bg-teal-600 dark:bg-[#00D9C0] text-white dark:text-[#0B1021] shadow-sm"
                : "bg-slate-100 dark:bg-[#0B1021] text-slate-600 dark:text-[#8B93A7] hover:bg-slate-200 dark:hover:bg-[#16203B]"
            }`}
          >
            📊 Data ({counts.data})
          </button>
        )}

        {counts.style > 0 && (
          <button
            onClick={() => setSelectedCategory("style")}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              selectedCategory === "style"
                ? "bg-pink-500 text-white shadow-sm"
                : "bg-slate-100 dark:bg-[#0B1021] text-slate-600 dark:text-[#8B93A7] hover:bg-slate-200 dark:hover:bg-[#16203B]"
            }`}
          >
            ✨ Styling ({counts.style})
          </button>
        )}
      </div>

      {/* Scrollable Compact Step Timeline (Capped height to prevent awkward long empty space) */}
      <div className="max-h-[380px] overflow-y-auto pr-1.5 space-y-2.5 custom-scrollbar">
        {filteredSteps.map((step) => {
          const badgeStyles = {
            setup: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30",
            data: "bg-teal-50 dark:bg-[#00D9C0]/10 text-teal-700 dark:text-[#00D9C0] border-teal-200 dark:border-[#00D9C0]/30",
            plot: "bg-amber-50 dark:bg-[#FFB86B]/10 text-amber-700 dark:text-[#FFB86B] border-amber-200 dark:border-[#FFB86B]/30",
            style: "bg-pink-50 dark:bg-[#FF5C7A]/10 text-pink-700 dark:text-[#FF5C7A] border-pink-200 dark:border-[#FF5C7A]/30",
            output: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
          }[step.badgeType] || "bg-slate-100 text-slate-700";

          const isExpanded = activeStep === step.stepNumber;

          return (
            <div
              key={step.stepNumber}
              onClick={() => setActiveStep(isExpanded ? null : step.stepNumber)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isExpanded
                  ? "bg-teal-50/40 dark:bg-[#00D9C0]/5 border-teal-400 dark:border-[#00D9C0]/40 shadow-sm"
                  : "bg-slate-50 dark:bg-[#0B1021] border-slate-200 dark:border-[#26304A] hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {/* Row Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-[#16203B] text-slate-700 dark:text-[#F5F7FA] font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">
                    {step.stepNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badgeStyles}`}>
                    {step.actionTitle}
                  </span>
                  <span className="text-xs text-slate-800 dark:text-[#F5F7FA] font-sans font-medium line-clamp-1">
                    {step.description}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">Line {step.lineNumber}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Code Snippet */}
              <div className="mt-2 pl-7">
                <code className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-[11px] font-mono text-teal-700 dark:text-[#00D9C0] inline-block max-w-full overflow-x-auto">
                  {step.codeSnippet}
                </code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
