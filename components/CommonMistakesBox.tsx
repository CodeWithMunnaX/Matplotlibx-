"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Sparkles, Code2, Wrench } from "lucide-react";

export interface MistakeItem {
  id: string;
  errorName: string;
  errorSnippet: string;
  whyItHappens: string;
  proFix: string;
  fixSnippet: string;
}

interface CommonMistakesBoxProps {
  category?: string;
  customMistakes?: MistakeItem[];
}

const DEFAULT_MISTAKES: Record<string, MistakeItem[]> = {
  default: [
    {
      id: "dim-mismatch",
      errorName: "ValueError: x and y must have same first dimension",
      errorSnippet: `x = [1, 2, 3, 4]        # 4 elements\ny = [10, 20, 30, 40, 50] # 5 elements\nplt.plot(x, y)          # ❌ Crashes with ValueError`,
      whyItHappens: "Matplotlib requires each X coordinate to map to exactly one Y coordinate. If len(x) != len(y), plotting is impossible.",
      proFix: "Always ensure both arrays or lists have the exact same length.",
      fixSnippet: `x = [1, 2, 3, 4, 5]     # 5 elements\ny = [10, 20, 30, 40, 50] # 5 elements\nplt.plot(x, y)          # ✅ Works perfectly`,
    },
    {
      id: "missing-legend",
      errorName: "Legend not showing despite label='...' specified",
      errorSnippet: `plt.plot(x, y1, label="Revenue")\nplt.plot(x, y2, label="Cost")\n# ❌ Missing plt.legend() call! Legend never appears on canvas.`,
      whyItHappens: "Matplotlib registers labels internally, but won't draw the legend box unless you explicitly tell it to render.",
      proFix: "Always call plt.legend(loc='upper right') before plt.show().",
      fixSnippet: `plt.plot(x, y1, label="Revenue")\nplt.plot(x, y2, label="Cost")\nplt.legend(loc="upper right") # ✅ Legend renders cleanly\nplt.show()`,
    },
    {
      id: "baseline-non-zero",
      errorName: "Misleading Bar Chart Baseline (Not starting at 0)",
      errorSnippet: `plt.bar(["A", "B"], [102, 105])\nplt.ylim(100, 106) # ❌ Distorts visually; B looks 3x larger than A!`,
      whyItHappens: "Bar charts encode numerical values by length. Truncating the Y-axis baseline distorts human visual perception.",
      proFix: "Always anchor the numerical axis of bar charts at 0 (plt.ylim(bottom=0)).",
      fixSnippet: `plt.bar(["A", "B"], [102, 105])\nplt.ylim(0, 120)   # ✅ Accurate proportional visual representation\nplt.show()`,
    },
  ],
  hist: [
    {
      id: "hist-pre-aggregated",
      errorName: "Passing pre-aggregated counts to plt.hist()",
      errorSnippet: `categories = ["Men", "Women"]\ncounts = [45, 55]\nplt.hist(counts) # ❌ Creates a histogram of counts, not the distribution!`,
      whyItHappens: "plt.hist() automatically bins RAW continuous numerical data. If data is already counted/aggregated, use plt.bar().",
      proFix: "Use plt.hist() only for raw arrays and plt.bar() for pre-counted categories.",
      fixSnippet: `plt.bar(categories, counts) # ✅ Correct function for pre-aggregated counts`,
    },
  ],
  pie: [
    {
      id: "pie-too-many-slices",
      errorName: "Too many categories in Pie Chart (> 7 slices)",
      errorSnippet: `categories = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]\nplt.pie(sizes) # ❌ Unreadable slice collisions and label overlapping`,
      whyItHappens: "Human eyes cannot easily compare 2D slice angles across more than 5-6 categories.",
      proFix: "Group smaller categories into an 'Others' slice or use Horizontal Bar plt.barh().",
      fixSnippet: `plt.barh(categories, sizes) # ✅ Much easier to read and rank`,
    },
  ],
};

export default function CommonMistakesBox({ category, customMistakes }: CommonMistakesBoxProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mistakes =
    customMistakes ||
    (category && DEFAULT_MISTAKES[category.toLowerCase()]) ||
    DEFAULT_MISTAKES.default;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white dark:bg-[#1C152D] rounded-3xl p-6 border border-pink-100 dark:border-[#2D2248] shadow-card space-y-4 font-sans transition-colors">
      <div className="flex items-center justify-between gap-3 border-b border-pink-100 dark:border-[#2D2248] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-mono font-bold text-zinc-900 dark:text-[#FDF2F8] uppercase tracking-wider">
              Common Beginner Mistakes & Pro Fixes
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Avoid the top errors and bad plotting practices that trip up new Python developers
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 font-bold">
          Troubleshooting
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {mistakes.map((m) => {
          const isExpanded = expandedId === m.id;
          return (
            <div
              key={m.id}
              className="rounded-2xl border border-pink-100 dark:border-[#2D2248] bg-pink-50/30 dark:bg-[#151022] overflow-hidden transition-all"
            >
              {/* Header Accordion */}
              <button
                onClick={() => toggleExpand(m.id)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-pink-50/60 dark:hover:bg-[#1C152D] transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-[#FDF2F8]">
                    {m.errorName}
                  </span>
                </div>
                <div className="text-zinc-400 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Collapsible Body */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3.5 border-t border-pink-100/60 dark:border-[#2D2248] pt-3 text-xs">
                  {/* Why it happens */}
                  <div className="space-y-1">
                    <span className="font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Why This Happens:
                    </span>
                    <p className="text-zinc-600 dark:text-zinc-300 pl-4 leading-relaxed">
                      {m.whyItHappens}
                    </p>
                  </div>

                  {/* Wrong Code */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold">
                      Incorrect Code:
                    </span>
                    <pre className="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200 font-mono text-[11px] overflow-x-auto">
                      <code>{m.errorSnippet}</code>
                    </pre>
                  </div>

                  {/* Pro Fix */}
                  <div className="space-y-1 pt-1">
                    <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Pro Fix & Solution:
                    </span>
                    <p className="text-zinc-600 dark:text-zinc-300 pl-4 leading-relaxed">
                      {m.proFix}
                    </p>
                  </div>

                  {/* Correct Code */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold">
                      Recommended Fix Code:
                    </span>
                    <pre className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 font-mono text-[11px] overflow-x-auto">
                      <code>{m.fixSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
