"use client";

import React, { useState, useEffect } from "react";
import { PLAYGROUND_TEMPLATES, PlaygroundTemplate } from "@/data/templates";
import { generateExplanation, FullExplanation } from "@/lib/explanationEngine";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import PlotVisualizer from "@/components/PlotVisualizer";
import StepByStep from "@/components/StepByStep";
import WhatHappened from "@/components/WhatHappened";
import WhySection from "@/components/WhySection";
import ChartStudio from "@/components/ChartStudio";
import ChartDecisionGuide from "@/components/ChartDecisionGuide";
import ColormapExplorer from "@/components/ColormapExplorer";
import Plot3DStudio from "@/components/Plot3DStudio";
import SubplotLayoutBuilder from "@/components/SubplotLayoutBuilder";
import MatplotlibAnatomy from "@/components/MatplotlibAnatomy";
import {
  Terminal,
  Sparkles,
  Layers,
  RotateCcw,
  Sliders,
  Code2,
  BookOpen,
  Zap,
  Box,
  Palette,
  LayoutGrid,
  TrendingUp,
  BarChart2,
  PieChart,
  Activity,
  CheckCircle2,
  Flame,
  HelpCircle,
} from "lucide-react";

// Fast Quick Chart Presets with Direct Code Mappings (Pink + Emerald Accents)
const QUICK_CHART_PRESETS = [
  {
    id: "p-line",
    name: "Line Plot",
    icon: "📈",
    category: "Curves",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 10, 50)\ny1 = np.sin(x) * 10 + 15\ny2 = np.cos(x) * 10 + 15\n\nplt.figure(figsize=(8, 4.5))\nplt.plot(x, y1, color="#EC4899", lw=2.5, marker="o", label="Sine Wave (Pink)")\nplt.plot(x, y2, color="#10B981", lw=2.5, ls="--", label="Cosine Wave (Green)")\n\nplt.title("Continuous Line Plot Demo")\nplt.xlabel("Time Horizon (s)")\nplt.ylabel("Signal Amplitude")\nplt.legend(loc="upper right")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "p-scatter",
    name: "Scatter Plot",
    icon: "✨",
    category: "Points",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\nx = np.random.rand(45) * 100\ny = x * 1.4 + np.random.randn(45) * 15\nsizes = np.random.rand(45) * 200 + 40\n\nplt.figure(figsize=(8, 4.5))\nplt.scatter(x, y, s=sizes, color="#10B981", alpha=0.85, edgecolors="#FFFFFF", label="Cohort Samples")\n\nplt.title("4D Scatter Distribution (X, Y, Size, Alpha)")\nplt.xlabel("Ad Spend ($K)")\nplt.ylabel("Revenue ($K)")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "p-bar",
    name: "Vertical Bar",
    icon: "📊",
    category: "Bars",
    code: `import matplotlib.pyplot as plt\n\nquarters = ["Q1", "Q2", "Q3", "Q4"]\nrevenue = [45, 68, 85, 110]\ncolors = ["#EC4899", "#10B981", "#F43F5E", "#34D399"]\n\nplt.figure(figsize=(8, 4.5))\nplt.bar(quarters, revenue, color=colors, width=0.55)\n\nplt.title("Quarterly Revenue Growth ($K)")\nplt.xlabel("Fiscal Quarter")\nplt.ylabel("Revenue ($K)")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "p-barh",
    name: "Horizontal Bar (barh)",
    icon: "📑",
    category: "Bars",
    code: `import matplotlib.pyplot as plt\n\nframeworks = ["Python", "JavaScript", "TypeScript", "Rust", "Go", "C++"]\npopularity = [48, 42, 35, 28, 22, 18]\ncolors = ["#EC4899", "#10B981", "#FB7185", "#34D399", "#F43F5E", "#059669"]\n\nplt.figure(figsize=(8, 4.5))\nplt.barh(frameworks, popularity, color=colors, height=0.55)\n\nplt.title("Developer Preference Index (barh)")\nplt.xlabel("Market Share (%)")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "p-hist",
    name: "Histogram",
    icon: "📉",
    category: "Stats",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ndata = np.random.normal(100, 15, 350)\n\nplt.figure(figsize=(8, 4.5))\nplt.hist(data, bins=16, color="#EC4899", edgecolor="#FFFFFF", alpha=0.85, label="Frequency Samples")\n\nplt.title("Gaussian Normal Frequency Histogram (μ=100, σ=15)")\nplt.xlabel("Score Interval")\nplt.ylabel("Observation Count")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "p-pie",
    name: "Pie Chart",
    icon: "🥧",
    category: "Stats",
    code: `import matplotlib.pyplot as plt\n\nlabels = ["Cloud Infra", "AI Services", "Cybersecurity", "DevOps Tools"]\nsizes = [42, 28, 18, 12]\ncolors = ["#EC4899", "#10B981", "#F43F5E", "#34D399"]\n\nplt.figure(figsize=(6.5, 6.5))\nplt.pie(sizes, labels=labels, colors=colors, autopct="%1.1f%%", explode=[0.06, 0, 0, 0], startangle=140)\nplt.title("Enterprise Budget Allocation")\nplt.show()`,
  },
  {
    id: "p-boxplot",
    name: "Box Plot",
    icon: "📦",
    category: "Stats",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ngroup1 = np.random.normal(50, 10, 40)\ngroup2 = np.random.normal(68, 15, 40)\ngroup3 = np.random.normal(42, 6, 40)\n\nplt.figure(figsize=(7.5, 4.5))\nplt.boxplot([group1, group2, group3], labels=["Control A", "Treatment B", "Variant C"], patch_artist=True)\n\nplt.title("Cohort Statistical Quartile Breakdown (boxplot)")\nplt.ylabel("Measured Score")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "p-violin",
    name: "Violin Plot",
    icon: "🎻",
    category: "Stats",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ndata1 = np.random.normal(65, 12, 60)\ndata2 = np.random.normal(80, 8, 60)\n\nplt.figure(figsize=(7.5, 4.5))\nplt.violinplot([data1, data2], showmeans=True, showmedians=True)\n\nplt.title("Kernel Density Violin Distribution (violinplot)")\nplt.xticks([1, 2], ["Method 1", "Method 2"])\nplt.ylabel("Latency (ms)")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "p-heatmap",
    name: "2D Heatmap",
    icon: "🔥",
    category: "Matrices",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\ncorr = np.array([\n    [1.00, 0.75, 0.40, -0.30],\n    [0.75, 1.00, 0.60, -0.45],\n    [0.40, 0.60, 1.00, -0.15],\n    [-0.30, -0.45, -0.15, 1.00]\n])\n\nplt.figure(figsize=(6.5, 5))\nplt.imshow(corr, cmap="PiYG", vmin=-1, vmax=1)\nplt.colorbar(label="Pearson Correlation (r)")\nplt.title("Correlation Matrix Heatmap (Pink-Green)")\nplt.xticks([0, 1, 2, 3], ["X1", "X2", "X3", "X4"])\nplt.yticks([0, 1, 2, 3], ["X1", "X2", "X3", "X4"])\nplt.show()`,
  },
  {
    id: "p-contour",
    name: "2D Contour",
    icon: "🗺️",
    category: "Matrices",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-3, 3, 35)\ny = np.linspace(-3, 3, 35)\nX, Y = np.meshgrid(x, y)\nZ = np.sin(np.sqrt(X**2 + Y**2))\n\nplt.figure(figsize=(7.5, 5))\nplt.contourf(X, Y, Z, levels=14, cmap="plasma")\nplt.colorbar(label="Potential")\nplt.title("Topographical 2D Contour Field (contourf)")\nplt.show()`,
  },
  {
    id: "p-surface",
    name: "3D Surface",
    icon: "🧊",
    category: "3D",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-3, 3, 22)\ny = np.linspace(-3, 3, 22)\nX, Y = np.meshgrid(x, y)\nZ = np.sin(np.sqrt(X**2 + Y**2))\n\nfig = plt.figure(figsize=(7.5, 5))\nax = fig.add_subplot(projection="3d")\nax.plot_surface(X, Y, Z, cmap="viridis", alpha=0.9)\n\nax.set_title("3D Neural Loss Surface (plot_surface)")\nax.set_xlabel("W1")\nax.set_ylabel("W2")\nax.set_zlabel("Cost J")\nplt.show()`,
  },
  {
    id: "p-wireframe",
    name: "3D Wireframe",
    icon: "🌐",
    category: "3D",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-2, 2, 20)\ny = np.linspace(-2, 2, 20)\nX, Y = np.meshgrid(x, y)\nZ = X**2 - Y**2\n\nfig = plt.figure(figsize=(7.5, 5))\nax = fig.add_subplot(projection="3d")\nax.plot_wireframe(X, Y, Z, color="#10B981", linewidth=1.2)\n\nax.set_title("3D Hyperbolic Saddle (plot_wireframe)")\nplt.show()`,
  },
  {
    id: "p-fill",
    name: "Area Fill (fill_between)",
    icon: "🌊",
    category: "Advanced",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 10, 60)\ny = np.sin(x) * 4 + 10\ny_upper = y + 2.5\ny_lower = y - 2.5\n\nplt.figure(figsize=(8, 4.5))\nplt.plot(x, y, color="#EC4899", lw=2.5, label="Expected Value")\nplt.fill_between(x, y_lower, y_upper, color="#EC4899", alpha=0.25, label="95% Confidence Band")\n\nplt.title("Shaded Confidence Region (fill_between)")\nplt.xlabel("Time Horizon (s)")\nplt.ylabel("Output Metric")\nplt.legend(loc="upper right")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "p-twinx",
    name: "Dual Y-Axis (twinx)",
    icon: "⚖️",
    category: "Advanced",
    code: `import matplotlib.pyplot as plt\n\nmonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]\ntemp = [5.2, 7.8, 12.1, 16.5, 21.0, 25.8]\nrain = [82, 65, 50, 42, 35, 22]\n\nfig, ax1 = plt.subplots(figsize=(7.5, 4.5))\nax1.plot(months, temp, color="#EC4899", lw=2.5, marker="o", label="Temp (°C)")\nax1.set_ylabel("Temperature (°C)", color="#EC4899")\n\nax2 = ax1.twinx()\nax2.bar(months, rain, color="#10B981", alpha=0.35, width=0.4, label="Rain (mm)")\nax2.set_ylabel("Precipitation (mm)", color="#10B981")\n\nplt.title("Dual-Axis Climate Trend (twinx)")\nplt.show()`,
  },
  {
    id: "p-subplots",
    name: "2x2 Subplots Grid",
    icon: "⊞",
    category: "Layouts",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nfig, axs = plt.subplots(2, 2, figsize=(8.5, 6), layout="constrained")\nfig.suptitle("2x2 Multi-Panel Analytics Dashboard", fontsize=13, fontweight="bold")\n\n# 1. Line\naxs[0, 0].plot([1, 2, 3, 4], [10, 25, 40, 65], color="#EC4899", lw=2.5, marker="o")\naxs[0, 0].set_title("Revenue Growth ($K)")\naxs[0, 0].grid(True, alpha=0.3)\n\n# 2. Bars\naxs[0, 1].bar(["Direct", "SEO", "Ads"], [120, 180, 240], color="#10B981")\naxs[0, 1].set_title("Lead Acquisition Channels")\naxs[0, 1].grid(True, alpha=0.3)\n\n# 3. Scatter\naxs[1, 0].scatter(np.random.rand(15)*10, np.random.rand(15)*50, color="#F43F5E", s=50)\naxs[1, 0].set_title("Session Duration vs Spend")\naxs[1, 0].grid(True, alpha=0.3)\n\n# 4. Pie\naxs[1, 1].pie([55, 30, 15], labels=["US", "EU", "APAC"], colors=["#EC4899", "#10B981", "#F43F5E"], autopct="%1.0f%%")\naxs[1, 1].set_title("Regional Distribution")\n\nplt.show()`,
  },
];

export default function PlaygroundPage() {
  const [activeMode, setActiveMode] = useState<
    "editor" | "guide" | "studio" | "colormaps" | "3d" | "subplots" | "anatomy"
  >("editor");
  const [activePresetId, setActivePresetId] = useState<string>("p-line");
  const [code, setCode] = useState<string>(QUICK_CHART_PRESETS[0].code);
  const [explanation, setExplanation] = useState<FullExplanation | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    const initialExp = generateExplanation(QUICK_CHART_PRESETS[0].code);
    setExplanation(initialExp);
  }, []);

  const handleRunCode = (newCode: string) => {
    setIsRunning(true);
    setTimeout(() => {
      const exp = generateExplanation(newCode);
      setExplanation(exp);
      setIsRunning(false);
    }, 180);
  };

  const handleSelectQuickPreset = (preset: (typeof QUICK_CHART_PRESETS)[0]) => {
    setActivePresetId(preset.id);
    setCode(preset.code);
    handleRunCode(preset.code);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0E0B16] text-zinc-900 dark:text-[#FDF2F8] py-8 pb-24 space-y-8 animate-fade-in transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Playground Top Header */}
        <div className="bg-white dark:bg-[#1C152D] rounded-3xl p-6 sm:p-8 border border-pink-100 dark:border-[#2D2248] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 text-xs font-mono font-bold text-pink-700 dark:text-pink-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
              <span>Interactive Matplotlib Laboratory Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-[#FDF2F8] font-sans">
              Free Plotting & Visualization Lab
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-2xl leading-relaxed">
              Explore 15+ chart types with 1-click presets, study the master chart decision matrix, or visually build multi-panel figure subplots.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap rounded-2xl bg-pink-50/70 dark:bg-[#151022] p-1.5 border border-pink-200/60 dark:border-[#2D2248] font-mono text-xs gap-1 self-start md:self-auto">
            {[
              { id: "editor", label: "Code Lab", icon: Code2 },
              { id: "guide", label: "Decision Guide", icon: HelpCircle },
              { id: "studio", label: "Chart Studio", icon: Sliders },
              { id: "colormaps", label: "Colormaps", icon: Palette },
              { id: "3d", label: "3D Studio", icon: Box },
              { id: "subplots", label: "Subplots", icon: LayoutGrid },
              { id: "anatomy", label: "Anatomy", icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMode(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-pink-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-300"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MODE 1: CODE EDITOR + 1-CLICK QUICK CHART PRESETS */}
        {activeMode === "editor" && (
          <div className="space-y-8">
            {/* Ultra-Prominent 1-Click Chart Selector Bar */}
            <div className="bg-white dark:bg-[#1C152D] rounded-3xl p-5 sm:p-6 border border-pink-100 dark:border-[#2D2248] shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-100 dark:border-[#2D2248] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400 shadow-sm">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-mono font-bold text-zinc-900 dark:text-[#FDF2F8] uppercase tracking-wider">
                      1-Click Instant Chart Selector (15 Chart Types)
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
                      Click any chart below to instantly load Python code & render live graph
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveMode("guide")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>When to Use Which Chart?</span>
                  </button>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 font-bold">
                    15 Presets
                  </span>
                </div>
              </div>

              {/* Responsive Horizontal Wrap Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_CHART_PRESETS.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectQuickPreset(preset)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-mono font-bold transition-all hover:scale-105 ${
                        isActive
                          ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-500 shadow-md shadow-pink-500/25"
                          : "bg-white dark:bg-[#151022] border-pink-100 dark:border-[#2D2248] text-zinc-700 dark:text-zinc-300 hover:border-pink-300 dark:hover:border-pink-500/40 hover:text-pink-600 dark:hover:text-pink-300 shadow-sm"
                      }`}
                    >
                      <span className="text-sm">{preset.icon}</span>
                      <span>{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Split Workspace: Monaco Code Editor (Left) & Live Vector Plot Output (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Python IDE Editor & Output (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <CodeEditor
                  initialCode={code}
                  onRun={handleRunCode}
                  isRunning={isRunning}
                  height="360px"
                  title="Playground Python IDE • Edit & Run"
                />

                <OutputPanel explanation={explanation} />
              </div>

              {/* Right: Live Visualizer & Breakdown (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                {explanation && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                        <Layers className="w-4 h-4" />
                        Live Vector Plot Output
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Interactive • Zoom & SVG Export
                      </span>
                    </div>
                    <PlotVisualizer figure={explanation.parsed.figure} />
                  </div>
                )}

                {explanation && (
                  <div className="space-y-6">
                    <WhatHappened text={explanation.whatHappened} />
                    <StepByStep steps={explanation.steps} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: CHART DECISION GUIDE */}
        {activeMode === "guide" && (
          <ChartDecisionGuide
            onSelectChartCode={(guideCode) => {
              setCode(guideCode);
              setActiveMode("editor");
              handleRunCode(guideCode);
            }}
          />
        )}

        {/* MODE 3: CHART STUDIO (Visual Parameter Builder) */}
        {activeMode === "studio" && (
          <ChartStudio
            onOpenInEditor={(studioCode) => {
              setCode(studioCode);
              setActiveMode("editor");
              handleRunCode(studioCode);
            }}
          />
        )}

        {/* MODE 4: COLORMAPS */}
        {activeMode === "colormaps" && <ColormapExplorer />}

        {/* MODE 5: 3D STUDIO */}
        {activeMode === "3d" && <Plot3DStudio />}

        {/* MODE 6: SUBPLOTS BUILDER */}
        {activeMode === "subplots" && <SubplotLayoutBuilder />}

        {/* MODE 7: FIGURE ANATOMY */}
        {activeMode === "anatomy" && <MatplotlibAnatomy />}
      </div>
    </div>
  );
}
