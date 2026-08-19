"use client";

import React, { useState } from "react";
import { Sparkles, Info, Code2, Layers, CheckCircle2, ChevronRight } from "lucide-react";

interface AnatomyPart {
  id: string;
  name: string;
  objectType: string;
  description: string;
  pyplotSyntax: string;
  ooSyntax: string;
  proTip: string;
  category: "Container" | "Coordinates" | "Data Mark" | "Annotation";
}

const ANATOMY_PARTS: Record<string, AnatomyPart> = {
  figure: {
    id: "figure",
    name: "Figure (The Canvas)",
    objectType: "matplotlib.figure.Figure",
    description: "The top-level container window holding all axes panels, suptitles, colorbars, and overall canvas dimensions.",
    pyplotSyntax: "plt.figure(figsize=(8, 5), dpi=100)",
    ooSyntax: "fig, ax = plt.subplots(figsize=(8, 5))",
    proTip: "Dimensions are in physical inches, converted to pixels via DPI (Pixels = Inches * DPI).",
    category: "Container",
  },
  axes: {
    id: "axes",
    name: "Axes (The Plot Area)",
    objectType: "matplotlib.axes.Axes",
    description: "The actual bounding box containing data coordinates, lines, bars, titles, and ticks. A single Figure can contain multiple Axes (subplots).",
    pyplotSyntax: "plt.subplot(2, 2, 1)",
    ooSyntax: "ax = fig.add_subplot() or axs[0, 1]",
    proTip: "Don't confuse 'Axes' (the entire plot instance) with a 1D 'Axis' coordinate line.",
    category: "Container",
  },
  spines: {
    id: "spines",
    name: "Spines (Borders)",
    objectType: "matplotlib.spines.Spine",
    description: "The 4 bounding box borders (top, bottom, left, right) that frame the plotting area.",
    pyplotSyntax: "plt.gca().spines['top'].set_visible(False)",
    ooSyntax: "ax.spines['top'].set_visible(False)\nax.spines['left'].set_position('zero')",
    proTip: "Hide top and right spines to give reports a modern, high-impact publication aesthetic.",
    category: "Coordinates",
  },
  ticks: {
    id: "ticks",
    name: "Ticks & Locators",
    objectType: "matplotlib.axis.Tick",
    description: "The small tick marks along the X and Y axes indicating numerical coordinate intervals.",
    pyplotSyntax: "plt.xticks([0, 2, 4, 6])",
    ooSyntax: "ax.set_xticks([0, 2, 4, 6])\nax.tick_params(axis='x', rotation=45)",
    proTip: "Use `tick_params(rotation=45)` when dates or text strings overlap.",
    category: "Coordinates",
  },
  ticklabels: {
    id: "ticklabels",
    name: "Tick Labels",
    objectType: "matplotlib.text.Text",
    description: "The printed numerical values or category strings stamped next to each tick notch.",
    pyplotSyntax: "plt.yticks([10, 20], ['$10K', '$20K'])",
    ooSyntax: "ax.set_yticklabels(['$10K', '$20K'])",
    proTip: "Pair `set_xticks` immediately before `set_xticklabels` to avoid index mismatch warnings.",
    category: "Coordinates",
  },
  title: {
    id: "title",
    name: "Title & Suptitle",
    objectType: "matplotlib.text.Text",
    description: "The headline text at the top of the axes or master figure summary.",
    pyplotSyntax: "plt.title('Revenue Trend', loc='left', fontsize=14)",
    ooSyntax: "ax.set_title('Revenue Trend', loc='left')\nfig.suptitle('Master Dashboard')",
    proTip: "Left-aligned titles (`loc='left'`) are standard in modern journalism and tech dashboards.",
    category: "Annotation",
  },
  labels: {
    id: "labels",
    name: "Axis Labels (X & Y)",
    objectType: "matplotlib.text.Text",
    description: "Descriptive measurement unit labels indicating what quantity each axis represents.",
    pyplotSyntax: "plt.xlabel('Time (s)')\nplt.ylabel('Voltage (mV)')",
    ooSyntax: "ax.set_xlabel('Time (s)')\nax.set_ylabel('Voltage (mV)')",
    proTip: "Always include explicit physical units in parentheses, e.g. 'Revenue ($ Millions)'.",
    category: "Annotation",
  },
  legend: {
    id: "legend",
    name: "Legend Box",
    objectType: "matplotlib.legend.Legend",
    description: "The key box matching colors and markers to labeled data series.",
    pyplotSyntax: "plt.legend(loc='upper right', framealpha=0.9)",
    ooSyntax: "ax.legend(loc='best', ncol=2)",
    proTip: "Use `loc='best'` to let Matplotlib mathematically compute the cleanest unoccupied corner.",
    category: "Annotation",
  },
  line: {
    id: "line",
    name: "Line2D (Data Curve)",
    objectType: "matplotlib.lines.Line2D",
    description: "The continuous geometric path connecting $(x_i, y_i)$ data coordinates.",
    pyplotSyntax: "plt.plot(x, y, color='#6366F1', lw=2.5, ls='--')",
    ooSyntax: "line, = ax.plot(x, y, color='#6366F1', lw=2.5)",
    proTip: "Use `zorder=3` to ensure lines render cleanly above background grid lines.",
    category: "Data Mark",
  },
  markers: {
    id: "markers",
    name: "Markers (Data Points)",
    objectType: "matplotlib.lines.Line2D / PathCollection",
    description: "Individual geometric symbols (circles, squares, triangles) marking exact collection coordinates.",
    pyplotSyntax: "plt.plot(x, y, marker='o', markersize=8)",
    ooSyntax: "ax.scatter(x, y, s=50, marker='s', c=y, cmap='viridis')",
    proTip: "Hollow markers (`mfc='#0B1021', mec='#00D9C0'`) look stunning on dark backgrounds.",
    category: "Data Mark",
  },
  grid: {
    id: "grid",
    name: "Grid Guidelines",
    objectType: "matplotlib.lines.Line2D (Grid)",
    description: "Dashed reference lines extending from tick marks across the plot background.",
    pyplotSyntax: "plt.grid(True, linestyle='--', alpha=0.3)",
    ooSyntax: "ax.grid(True, linestyle='--', alpha=0.3, color='#344265')",
    proTip: "Keep grid alpha around `0.2 - 0.35` so it guides the eye without overwhelming data.",
    category: "Coordinates",
  },
};

export default function MatplotlibAnatomy() {
  const [selectedPartId, setSelectedPartId] = useState<string>("figure");
  const activePart = ANATOMY_PARTS[selectedPartId] || ANATOMY_PARTS.figure;

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-200 dark:border-[#00D9C0]/30 text-xs font-mono text-teal-700 dark:text-[#00D9C0]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Visual Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5F7FA] font-sans">
            Anatomy of a Matplotlib Figure
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8B93A7] font-sans">
            Click any component on the visual diagram to inspect its role, hierarchy, and Python API code.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {Object.values(ANATOMY_PARTS).map((part) => (
            <button
              key={part.id}
              onClick={() => setSelectedPartId(part.id)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                selectedPartId === part.id
                  ? "bg-teal-600 dark:bg-[#00D9C0] text-white dark:text-[#0B1021] border-transparent font-bold shadow-sm"
                  : "bg-slate-100 dark:bg-[#0B1021] border-slate-200 dark:border-[#26304A] text-slate-600 dark:text-[#8B93A7] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
              }`}
            >
              {part.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive SVG Diagram (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-[#0B1021] rounded-2xl p-4 border border-slate-200 dark:border-[#26304A] flex flex-col items-center justify-center">
          <svg viewBox="0 0 540 380" className="w-full h-auto max-h-[380px] select-none font-sans">
            {/* 1. FIGURE BOUNDARY */}
            <rect
              x="10"
              y="10"
              width="520"
              height="360"
              rx="12"
              fill={selectedPartId === "figure" ? "rgba(0, 217, 192, 0.08)" : "transparent"}
              stroke={selectedPartId === "figure" ? "#00D9C0" : "#334155"}
              strokeWidth={selectedPartId === "figure" ? "2.5" : "1.5"}
              strokeDasharray={selectedPartId === "figure" ? "none" : "6,6"}
              onClick={() => setSelectedPartId("figure")}
              className="cursor-pointer transition-all hover:stroke-[#00D9C0]"
            />
            <text x="24" y="32" fill="#64748B" fontSize="11" fontWeight="bold" className="font-mono">
              Figure Canvas (figsize)
            </text>

            {/* 2. TITLE */}
            <g
              onClick={() => setSelectedPartId("title")}
              className="cursor-pointer transition-all"
            >
              <rect
                x="140"
                y="28"
                width="260"
                height="30"
                rx="6"
                fill={selectedPartId === "title" ? "rgba(0, 217, 192, 0.2)" : "transparent"}
                stroke={selectedPartId === "title" ? "#00D9C0" : "transparent"}
              />
              <text
                x="270"
                y="48"
                textAnchor="middle"
                fill={selectedPartId === "title" ? "#00D9C0" : "#F5F7FA"}
                fontSize="14"
                fontWeight="bold"
                className="dark:fill-[#F5F7FA] fill-slate-900"
              >
                Figure Title (ax.set_title)
              </text>
            </g>

            {/* 3. AXES AREA */}
            <rect
              x="60"
              y="70"
              width="420"
              height="240"
              fill={selectedPartId === "axes" ? "rgba(99, 102, 241, 0.12)" : "transparent"}
              stroke={selectedPartId === "axes" ? "#6366F1" : "transparent"}
              strokeWidth="2"
              onClick={() => setSelectedPartId("axes")}
              className="cursor-pointer transition-all"
            />

            {/* 4. GRID */}
            <g
              onClick={() => setSelectedPartId("grid")}
              className="cursor-pointer transition-all"
            >
              {[130, 200, 270, 340, 410].map((gx, i) => (
                <line
                  key={`gx-${i}`}
                  x1={gx}
                  y1="70"
                  x2={gx}
                  y2="310"
                  stroke={selectedPartId === "grid" ? "#00D9C0" : "#475569"}
                  strokeDasharray="4,4"
                  strokeWidth={selectedPartId === "grid" ? "1.5" : "0.8"}
                  strokeOpacity={selectedPartId === "grid" ? "0.9" : "0.35"}
                />
              ))}
              {[120, 170, 220, 270].map((gy, i) => (
                <line
                  key={`gy-${i}`}
                  x1="60"
                  y1={gy}
                  x2="480"
                  y2={gy}
                  stroke={selectedPartId === "grid" ? "#00D9C0" : "#475569"}
                  strokeDasharray="4,4"
                  strokeWidth={selectedPartId === "grid" ? "1.5" : "0.8"}
                  strokeOpacity={selectedPartId === "grid" ? "0.9" : "0.35"}
                />
              ))}
            </g>

            {/* 5. LINE PLOT */}
            <g onClick={() => setSelectedPartId("line")} className="cursor-pointer">
              <path
                d="M 90 280 Q 180 100 270 200 T 450 110"
                fill="none"
                stroke={selectedPartId === "line" ? "#00D9C0" : "#6366F1"}
                strokeWidth={selectedPartId === "line" ? "4" : "3"}
                className="transition-all"
              />
            </g>

            {/* 6. MARKERS */}
            <g onClick={() => setSelectedPartId("markers")} className="cursor-pointer">
              {[
                { cx: 90, cy: 280 },
                { cx: 180, cy: 150 },
                { cx: 270, cy: 200 },
                { cx: 360, cy: 155 },
                { cx: 450, cy: 110 },
              ].map((pt, i) => (
                <circle
                  key={`pt-${i}`}
                  cx={pt.cx}
                  cy={pt.cy}
                  r={selectedPartId === "markers" ? "7" : "5"}
                  fill={selectedPartId === "markers" ? "#FFB86B" : "#00D9C0"}
                  stroke="#0B1021"
                  strokeWidth="2"
                  className="transition-all"
                />
              ))}
            </g>

            {/* 7. LEGEND BOX */}
            <g
              onClick={() => setSelectedPartId("legend")}
              className="cursor-pointer transition-all"
              transform="translate(360, 80)"
            >
              <rect
                width="110"
                height="45"
                rx="6"
                fill="#0B1021"
                stroke={selectedPartId === "legend" ? "#00D9C0" : "#334155"}
                strokeWidth={selectedPartId === "legend" ? "2" : "1"}
              />
              <line x1="12" y1="18" x2="32" y2="18" stroke="#6366F1" strokeWidth="2" />
              <circle cx="22" cy="18" r="3" fill="#00D9C0" />
              <text x="40" y="22" fill="#F5F7FA" fontSize="10" fontWeight="bold">
                Series Label
              </text>
              <text x="12" y="36" fill="#64748B" fontSize="8">
                Legend (ax.legend)
              </text>
            </g>

            {/* 8. SPINES */}
            <g onClick={() => setSelectedPartId("spines")} className="cursor-pointer">
              <line
                x1="60"
                y1="310"
                x2="480"
                y2="310"
                stroke={selectedPartId === "spines" ? "#FF5C7A" : "#64748B"}
                strokeWidth={selectedPartId === "spines" ? "3" : "1.5"}
              />
              <line
                x1="60"
                y1="70"
                x2="60"
                y2="310"
                stroke={selectedPartId === "spines" ? "#FF5C7A" : "#64748B"}
                strokeWidth={selectedPartId === "spines" ? "3" : "1.5"}
              />
              <line
                x1="60"
                y1="70"
                x2="480"
                y2="70"
                stroke={selectedPartId === "spines" ? "#FF5C7A" : "#334155"}
                strokeWidth={selectedPartId === "spines" ? "3" : "1"}
              />
              <line
                x1="480"
                y1="70"
                x2="480"
                y2="310"
                stroke={selectedPartId === "spines" ? "#FF5C7A" : "#334155"}
                strokeWidth={selectedPartId === "spines" ? "3" : "1"}
              />
            </g>

            {/* 9. TICKS & TICK LABELS */}
            <g
              onClick={() => setSelectedPartId("ticks")}
              className="cursor-pointer font-mono"
              fontSize="10"
              fill={selectedPartId === "ticks" ? "#00D9C0" : "#94A3B8"}
            >
              {[130, 200, 270, 340, 410].map((gx, i) => (
                <g key={`xnot-${i}`}>
                  <line x1={gx} y1="310" x2={gx} y2="316" stroke="#94A3B8" strokeWidth="1.5" />
                  <text x={gx} y="330" textAnchor="middle">
                    {i * 2}
                  </text>
                </g>
              ))}
              {[120, 170, 220, 270].map((gy, i) => (
                <g key={`ynot-${i}`}>
                  <line x1="54" y1={gy} x2="60" y2={gy} stroke="#94A3B8" strokeWidth="1.5" />
                  <text x="48" y={gy + 4} textAnchor="end">
                    {40 - i * 10}
                  </text>
                </g>
              ))}
            </g>

            {/* 10. X & Y LABELS */}
            <g onClick={() => setSelectedPartId("labels")} className="cursor-pointer">
              <text
                x="270"
                y="355"
                textAnchor="middle"
                fill={selectedPartId === "labels" ? "#00D9C0" : "#94A3B8"}
                fontSize="12"
                fontWeight="bold"
              >
                X-Axis Label (ax.set_xlabel)
              </text>
              <text
                x="20"
                y="190"
                textAnchor="middle"
                fill={selectedPartId === "labels" ? "#00D9C0" : "#94A3B8"}
                fontSize="12"
                fontWeight="bold"
                transform="rotate(-90 20 190)"
              >
                Y-Axis Label (ax.set_ylabel)
              </text>
            </g>
          </svg>
        </div>

        {/* Right: Component Detail Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-[#0B1021] rounded-2xl p-5 border border-slate-200 dark:border-[#26304A] space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-[#00D9C0]/10 text-teal-700 dark:text-[#00D9C0] font-mono text-[11px] font-bold">
              {activePart.category}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {activePart.objectType}
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-900 dark:text-[#F5F7FA] font-sans">
            {activePart.name}
          </h3>

          <p className="text-xs text-slate-600 dark:text-[#8B93A7] leading-relaxed font-sans">
            {activePart.description}
          </p>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-[#6366F1] flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5" />
                Object-Oriented API (Recommended)
              </span>
              <pre className="p-2.5 rounded-xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-xs font-mono text-teal-700 dark:text-[#00D9C0] overflow-x-auto">
                {activePart.ooSyntax}
              </pre>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-500 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5" />
                Pyplot Function Equivalent
              </span>
              <pre className="p-2.5 rounded-xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-xs font-mono text-slate-700 dark:text-[#F5F7FA] overflow-x-auto">
                {activePart.pyplotSyntax}
              </pre>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-[#FFB86B]/10 border border-amber-200 dark:border-[#FFB86B]/30 text-xs text-amber-900 dark:text-[#FFB86B] space-y-1 font-sans">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Pro Tip:
            </span>
            <p className="text-[11px] leading-relaxed">{activePart.proTip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
