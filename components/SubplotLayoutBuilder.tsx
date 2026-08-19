"use client";

import React, { useState } from "react";
import { Sparkles, LayoutGrid, Copy, Check, Info, RefreshCw } from "lucide-react";
import PlotVisualizer from "./PlotVisualizer";
import { parsePythonMatplotlib } from "@/lib/parser";

export default function SubplotLayoutBuilder() {
  const [nrows, setNrows] = useState<number>(2);
  const [ncols, setNcols] = useState<number>(2);
  const [sharex, setSharex] = useState<boolean>(false);
  const [sharey, setSharey] = useState<boolean>(false);
  const [useConstrained, setUseConstrained] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate python subplots script
  const generateCode = (): string => {
    return `import matplotlib.pyplot as plt\nimport numpy as np\n\n# Create ${nrows}x${ncols} Subplot Grid\nfig, axs = plt.subplots(\n    ${nrows}, ${ncols},\n    figsize=(${ncols * 4}, ${nrows * 3}),\n    ${sharex ? "sharex=True, " : ""}${sharey ? "sharey=True, " : ""}${useConstrained ? 'layout="constrained"' : ""}\n)\n\nfig.suptitle("Multi-Panel ${nrows}x${ncols} Operations Grid", fontsize=14, fontweight="bold")\n\nx = np.linspace(0, 10, 40)\ncolors = ["#6366F1", "#00D9C0", "#FFB86B", "#FF5C7A", "#38EF7D", "#3B82F6"]\n\n# Iterate and populate each panel\nfor i, ax in enumerate(np.array(axs).flat):\n    col = colors[i % len(colors)]\n    ax.plot(x, np.sin(x + i), color=col, lw=2.5, label=f"Metric {i+1}")\n    ax.set_title(f"Subplot Panel {i+1}", loc="left")\n    ax.grid(True, alpha=0.3)\n    ax.legend(loc="upper right", fontsize=9)\n\nplt.show()`;
  };

  const code = generateCode();
  const parsed = parsePythonMatplotlib(code);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-200 dark:border-[#00D9C0]/30 text-xs font-mono text-teal-700 dark:text-[#00D9C0]">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid & Subplots Designer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5F7FA] font-sans">
            Multi-Panel Subplot Layout Builder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8B93A7] font-sans">
            Configure subplots, synchronized axes (sharex/sharey), and constrained layout engines visually.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] hover:bg-slate-200 dark:hover:bg-[#16203B] text-slate-700 dark:text-[#F5F7FA] font-mono text-xs transition-all self-start md:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied Subplot Code!" : "Copy Subplots Code"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] space-y-5 font-mono text-xs">
          {/* Preset Layouts */}
          <div className="space-y-2">
            <label className="text-slate-700 dark:text-[#F5F7FA] font-bold">Standard Layout Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { r: 1, c: 2, label: "1x2 Side-by-Side" },
                { r: 2, c: 1, label: "2x1 Vertical Stack" },
                { r: 2, c: 2, label: "2x2 Quadrant Grid" },
                { r: 2, c: 3, label: "2x3 Executive Grid" },
              ].map((p) => (
                <button
                  key={`${p.r}x${p.c}`}
                  onClick={() => {
                    setNrows(p.r);
                    setNcols(p.c);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    nrows === p.r && ncols === p.c
                      ? "bg-teal-600 dark:bg-[#00D9C0] text-white dark:text-[#0B1021] border-transparent font-bold shadow-sm"
                      : "bg-white dark:bg-[#11182D] border-slate-200 dark:border-[#26304A] text-slate-600 dark:text-[#8B93A7]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders for rows/cols */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-[#26304A]">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Rows:</span>
                <span className="font-bold text-teal-600 dark:text-[#00D9C0]">{nrows}</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                value={nrows}
                onChange={(e) => setNrows(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Columns:</span>
                <span className="font-bold text-teal-600 dark:text-[#00D9C0]">{ncols}</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                value={ncols}
                onChange={(e) => setNcols(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Synchronization Options */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#26304A]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sharex}
                onChange={(e) => setSharex(e.target.checked)}
                className="rounded accent-teal-500"
              />
              <span>sharex=True (Sync X Scales)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sharey}
                onChange={(e) => setSharey(e.target.checked)}
                className="rounded accent-teal-500"
              />
              <span>sharey=True (Sync Y Scales)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useConstrained}
                onChange={(e) => setUseConstrained(e.target.checked)}
                className="rounded accent-teal-500"
              />
              <span>layout=&quot;constrained&quot;</span>
            </label>
          </div>
        </div>

        {/* Right Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <PlotVisualizer figure={parsed.figure} />
        </div>
      </div>
    </div>
  );
}
