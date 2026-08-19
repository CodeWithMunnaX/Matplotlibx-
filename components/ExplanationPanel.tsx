"use client";

import React from "react";
import { Sparkles, Brain, Lightbulb, Code2 } from "lucide-react";
import { Lesson, ConceptItem } from "@/data/lessons";

interface ExplanationPanelProps {
  lesson: Lesson;
  onLoadSnippet?: (snippet: string) => void;
}

export default function ExplanationPanel({ lesson, onLoadSnippet }: ExplanationPanelProps) {
  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-6 transition-colors">
      {/* Title & Overview */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-[#00D9C0]/10 text-teal-700 dark:text-[#00D9C0] font-mono text-xs font-bold border border-teal-200 dark:border-[#00D9C0]/30">
            {lesson.category}
          </span>
          <span className="text-xs font-mono text-slate-500 dark:text-[#8B93A7]">
            {lesson.estimatedTime}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F5F7FA] font-sans">
          {lesson.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-[#8B93A7] leading-relaxed font-sans">
          {lesson.overview}
        </p>
      </div>

      {/* Mental Model Analogy Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/25 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400">
          <Brain className="w-4 h-4" />
          <span>Mental Model Intuition</span>
        </div>
        <p className="text-xs sm:text-sm text-indigo-950 dark:text-[#F5F7FA] leading-relaxed font-sans">
          {lesson.mentalModel}
        </p>
      </div>

      {/* Core Concepts */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FA]">
          Core Concepts & Mechanics
        </h3>

        <div className="space-y-3">
          {lesson.concepts.map((concept, idx) => (
            <div
              key={concept.id || idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-[#F5F7FA]">
                  {concept.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-[#16203B] text-slate-600 dark:text-[#8B93A7]">
                  {concept.tag}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#8B93A7] leading-relaxed">
                {concept.explanation}
              </p>

              <div className="p-2.5 rounded-xl bg-teal-50/50 dark:bg-[#00D9C0]/5 border border-teal-200 dark:border-[#00D9C0]/20 text-xs text-teal-900 dark:text-[#00D9C0] flex items-start gap-2">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">{concept.intuition}</span>
              </div>

              {concept.codeSnippet && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A]">
                  <code className="text-xs font-mono text-indigo-600 dark:text-[#6366F1]">
                    {concept.codeSnippet}
                  </code>
                  {onLoadSnippet && (
                    <button
                      onClick={() => onLoadSnippet(concept.codeSnippet)}
                      className="text-[11px] font-mono font-bold text-teal-600 dark:text-[#00D9C0] hover:underline"
                    >
                      Try Snippet
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
