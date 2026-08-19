"use client";

import React from "react";
import { Terminal, CheckCircle2, AlertCircle, Clock, Layers } from "lucide-react";
import { FullExplanation } from "@/lib/explanationEngine";

interface OutputPanelProps {
  explanation: FullExplanation | null;
}

export default function OutputPanel({ explanation }: OutputPanelProps) {
  if (!explanation) {
    return (
      <div className="p-4 rounded-2xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-xs font-mono text-slate-500">
        Run Python code to inspect terminal output.
      </div>
    );
  }

  const { parsed, executionTimeMs, plotCount, axesCount } = explanation;
  const hasErrors = parsed.hasErrors;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-[#26304A] bg-white dark:bg-[#11182D] overflow-hidden shadow-sm dark:shadow-card font-mono text-xs transition-colors">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-[#26304A] bg-slate-50 dark:bg-[#0F162B]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-teal-600 dark:text-[#00D9C0]" />
          <span className="font-bold text-slate-900 dark:text-[#F5F7FA]">
            Python Console Output
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-[#8B93A7]">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{executionTimeMs}ms</span>
          </div>
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-teal-500" />
            <span>{plotCount} layers</span>
          </div>
        </div>
      </div>

      {/* Console Body */}
      <div className="p-4 bg-slate-900 text-[#F5F7FA] min-h-[90px] max-h-[220px] overflow-y-auto space-y-1">
        {hasErrors ? (
          <div className="space-y-1 text-red-400">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>Traceback (most recent call last):</span>
            </div>
            {parsed.errors.map((err, i) => (
              <div key={i} className="pl-4">
                {err}
              </div>
            ))}
          </div>
        ) : parsed.prints.length > 0 ? (
          parsed.prints.map((line, idx) => (
            <div key={idx} className="text-emerald-400 leading-relaxed">
              {line}
            </div>
          ))
        ) : (
          <div className="text-slate-500 italic">
            &gt; Figure rendered successfully ({axesCount} Axes, {plotCount} Marks). No stdout prints.
          </div>
        )}
      </div>
    </div>
  );
}
