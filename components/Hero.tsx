"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Code2,
  BookOpen,
  Layers,
  Box,
  TrendingUp,
  BarChart3,
  Zap,
  CheckCircle2,
  Play,
  Flame,
} from "lucide-react";
import PlotVisualizer from "./PlotVisualizer";
import { parsePythonMatplotlib } from "@/lib/parser";

const HERO_PRESETS = [
  {
    id: "waves",
    label: "📈 Harmonic Waves",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 10, 80)\ny1 = np.sin(x) * 8 + 12\ny2 = np.cos(x) * 8 + 12\nx_pts = np.linspace(0, 10, 10)\ny_pts = np.sin(x_pts) * 8 + 12\n\nplt.figure(figsize=(7.5, 4.2))\nplt.plot(x, y1, color="#EC4899", lw=3, label="Signal Wave (Pink)")\nplt.plot(x, y2, color="#10B981", lw=2.5, ls="--", label="Phase Cosine (Emerald)")\nplt.scatter(x_pts, y_pts, color="#F43F5E", s=75, edgecolors="#FFFFFF", zorder=4, label="Sample Points")\nplt.fill_between(x, y1 - 2, y1 + 2, color="#EC4899", alpha=0.15)\n\nplt.title("Matplotlib 2026 • Live Vector Rendering Engine")\nplt.xlabel("Time Domain (t)")\nplt.ylabel("Signal Amplitude")\nplt.legend(loc="upper right")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "bars",
    label: "📊 Revenue Growth",
    code: `import matplotlib.pyplot as plt\n\nquarters = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"]\nrevenue = [45, 62, 78, 95, 118, 142]\ncolors = ["#EC4899", "#10B981", "#F43F5E", "#34D399", "#DB2777", "#059669"]\n\nplt.figure(figsize=(7.5, 4.2))\nplt.bar(quarters, revenue, color=colors, width=0.55, label="Quarterly Revenue ($K)")\nplt.title("Enterprise Growth & Performance ($K)")\nplt.xlabel("Fiscal Period")\nplt.ylabel("Revenue ($K)")\nplt.grid(True, alpha=0.3)\nplt.legend()\nplt.show()`,
  },
  {
    id: "scatter",
    label: "✨ 4D Scatter Cohort",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\nx = np.random.rand(40) * 100\ny = x * 1.3 + np.random.randn(40) * 15\nsizes = np.random.rand(40) * 180 + 40\n\nplt.figure(figsize=(7.5, 4.2))\nplt.scatter(x, y, s=sizes, color="#10B981", alpha=0.85, edgecolors="#FFFFFF", label="Customer Cohort")\nplt.title("Multivariate Customer Lifetime Value Analysis")\nplt.xlabel("Acquisition Cost ($)")\nplt.ylabel("Lifetime Spend ($)")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "pie",
    label: "🥧 Market Share",
    code: `import matplotlib.pyplot as plt\n\nlabels = ["Cloud Infrastructure", "AI & ML Platforms", "Cybersecurity", "DevOps Tools"]\nsizes = [42, 28, 18, 12]\ncolors = ["#EC4899", "#10B981", "#FB7185", "#34D399"]\n\nplt.figure(figsize=(6, 4.5))\nplt.pie(sizes, labels=labels, colors=colors, autopct="%1.1f%%", explode=[0.06, 0, 0, 0], startangle=140)\nplt.title("Enterprise Tech Spending Breakdown")\nplt.show()`,
  },
];

export default function Hero() {
  const [activeHeroPreset, setActiveHeroPreset] = useState<string>("waves");
  const activeCode = HERO_PRESETS.find((p) => p.id === activeHeroPreset)?.code || HERO_PRESETS[0].code;
  const parsed = parsePythonMatplotlib(activeCode);

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Background Pink & Emerald Aura Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-pink-500/15 via-emerald-400/15 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 text-xs font-mono font-bold text-pink-700 dark:text-pink-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
            <span>Interactive Matplotlib Visual Masterclass 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-[#FDF2F8] font-sans tracking-tight leading-[1.1]">
            Write Code.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-emerald-500">
              See Plots.
            </span>{" "}
            Master Data Visualization.
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed">
            A next-generation interactive learning platform for Python Data Visualization. Master Matplotlib through live vector graphics, 3D surface rotations, multi-subplot grids, and 50 comprehensive visual master lessons by Munna Kumar (@CodeWithMunnaX).
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/lessons/matplotlib-introduction"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono text-xs font-black shadow-lg shadow-pink-500/25 dark:shadow-[0_0_25px_rgba(236,72,153,0.35)] transition-all hover:scale-105"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Lesson 01 (Beginner)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#1C152D] border border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-[#241B3B] text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold transition-all hover:scale-105 shadow-card"
            >
              <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Free Playground Lab</span>
            </Link>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>50 Master Topics</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pink-500" />
              <span>100% In-Browser AST Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>3D Surface Visualizer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pink-500" />
              <span>Free Forever</span>
            </div>
          </div>
        </div>

        {/* Live Hero Plot Showcase with Interactive Switcher Tabs */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {HERO_PRESETS.map((preset) => {
              const isActive = activeHeroPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActiveHeroPreset(preset.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-pink-sm"
                      : "bg-white dark:bg-[#1C152D] border border-pink-100 dark:border-[#2D2248] text-zinc-600 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-300 shadow-sm"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <PlotVisualizer figure={parsed.figure} />
        </div>
      </div>
    </section>
  );
}
