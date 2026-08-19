"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Copy, Check, FileText, Sparkles, BookOpen } from "lucide-react";

interface CheatsheetSection {
  title: string;
  items: { code: string; desc: string }[];
}

const CHEATSHEET_DATA: CheatsheetSection[] = [
  {
    title: "1. Basic Plotting & Lines",
    items: [
      { code: "import matplotlib.pyplot as plt", desc: "Standard global alias" },
      { code: "plt.plot(x, y, color='#6366F1', lw=2)", desc: "2D line plot with custom stroke" },
      { code: "plt.plot(x, y, ls='--', marker='o')", desc: "Dashed line with circle markers" },
      { code: "plt.fill_between(x, y1, y2, alpha=0.3)", desc: "Shade area between curves" },
      { code: "plt.show()", desc: "Render figure to display" },
    ],
  },
  {
    title: "2. Titles, Labels & Legends",
    items: [
      { code: "plt.title('Headline', loc='left', fontsize=14)", desc: "Add formatted title" },
      { code: "plt.xlabel('Time (s)', fontsize=11)", desc: "Set X-axis label with units" },
      { code: "plt.ylabel('Amplitude (V)')", desc: "Set Y-axis label" },
      { code: "plt.legend(loc='best', ncol=2)", desc: "Render positioned legend box" },
      { code: "plt.grid(True, ls='--', alpha=0.3)", desc: "Enable background gridlines" },
    ],
  },
  {
    title: "3. Chart Types",
    items: [
      { code: "plt.bar(categories, values, color='teal')", desc: "Vertical bar chart" },
      { code: "plt.barh(categories, values, height=0.5)", desc: "Horizontal bar leaderboard" },
      { code: "plt.scatter(x, y, s=sizes, c=y, cmap='viridis')", desc: "Multivariate scatter plot" },
      { code: "plt.hist(data, bins=15, density=True)", desc: "Probability density histogram" },
      { code: "plt.pie(sizes, labels=labels, autopct='%1.1f%%')", desc: "Proportional pie chart" },
      { code: "plt.boxplot(data, patch_artist=True)", desc: "Quartile statistical boxplot" },
      { code: "plt.violinplot(data, showmedians=True)", desc: "Violin density distribution" },
      { code: "plt.imshow(matrix, cmap='coolwarm')", desc: "2D matrix heatmap" },
      { code: "plt.contourf(X, Y, Z, levels=12, cmap='plasma')", desc: "2D filled contour field" },
    ],
  },
  {
    title: "4. Subplots & Object-Oriented Layouts",
    items: [
      { code: "fig, ax = plt.subplots(figsize=(8, 5))", desc: "Create OO figure and axes" },
      { code: "fig, axs = plt.subplots(2, 2, layout='constrained')", desc: "2x2 grid with auto padding" },
      { code: "ax2 = ax1.twinx()", desc: "Create secondary right-hand Y-axis" },
      { code: "plt.subplot2grid((2, 2), (0, 0), colspan=2)", desc: "Span multiple columns" },
      { code: "fig.tight_layout(pad=1.5)", desc: "Eliminate label collisions" },
    ],
  },
  {
    title: "5. 3D Visualizations & Styling",
    items: [
      { code: "ax = fig.add_subplot(projection='3d')", desc: "Initialize 3D projection" },
      { code: "ax.plot_surface(X, Y, Z, cmap='viridis')", desc: "Render 3D continuous surface" },
      { code: "ax.plot_wireframe(X, Y, Z, lw=1.2)", desc: "Transparent 3D wireframe mesh" },
      { code: "plt.style.use('dark_background')", desc: "Apply cyber dark theme" },
      { code: "plt.savefig('fig.png', dpi=300, bbox_inches='tight')", desc: "High-resolution export" },
    ],
  },
];

export default function CheatsheetModal({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Prevent background body scrolling while modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#0F162B] border border-slate-200 dark:border-[#26304A] rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden font-sans"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-[#26304A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-200 dark:border-[#00D9C0]/30 flex items-center justify-center text-teal-700 dark:text-[#00D9C0]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-[#F5F7FA]">
                Matplotlib Quick Reference Cheatsheet
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                50 Most Used Python Data Visualization Methods & Syntax
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#26304A] hover:bg-slate-100 dark:hover:bg-[#16203B] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-[#26304A] bg-slate-50 dark:bg-[#0B1021] shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search functions (e.g. plot, subplots, scatter, colormap, hist, pie)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-xs font-mono text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Cheatsheet Content Grid with Dedicated Scroll Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar overscroll-contain">
          {CHEATSHEET_DATA.map((section, idx) => {
            const filteredItems = section.items.filter(
              (it) =>
                it.code.toLowerCase().includes(search.toLowerCase()) ||
                it.desc.toLowerCase().includes(search.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-[#00D9C0]">
                  {section.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredItems.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] flex flex-col justify-between space-y-2 group hover:border-teal-500/50 transition-all"
                    >
                      <span className="text-xs text-slate-600 dark:text-[#8B93A7] font-sans">{item.desc}</span>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs font-mono text-indigo-600 dark:text-[#6366F1] truncate">
                          {item.code}
                        </code>
                        <button
                          onClick={() => handleCopy(item.code)}
                          className="p-1 rounded-lg text-slate-400 hover:text-teal-500 shrink-0 transition-colors"
                          title="Copy snippet"
                        >
                          {copiedCode === item.code ? (
                            <Check className="w-3.5 h-3.5 text-teal-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
