"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  TrendingUp,
  BarChart2,
  PieChart,
  Activity,
  Layers,
  Box,
  LayoutGrid,
  CheckCircle2,
  AlertTriangle,
  Play,
  Copy,
  Check,
  Search,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";

export interface ChartGuideItem {
  id: string;
  name: string;
  syntax: string;
  icon: string;
  category: "Trend & Continuous" | "Comparison & Ranking" | "Distributions & Statistics" | "Part-to-Whole" | "Matrices & Spatial" | "Multi-Axis & 3D";
  whenToUse: string;
  idealCondition: string;
  realWorldExample: string;
  avoidWhen: string;
  proTip: string;
  codeSnippet: string;
}

export const CHART_DECISION_GUIDE_DATA: ChartGuideItem[] = [
  {
    id: "guide-line",
    name: "Line Plot (plt.plot)",
    syntax: "plt.plot(x, y, color='...', lw=2, ls='--')",
    icon: "📈",
    category: "Trend & Continuous",
    whenToUse: "Continuous data over time, trajectory tracking, forecasting, signal processing.",
    idealCondition: "When the X-axis is a continuous domain (Time, Date, Seconds, Temperature, Age) and your goal is to show direction, trend velocity, or cyclical cycles.",
    realWorldExample: "1-year stock price history, monthly temperature variations, sensor sine wave outputs.",
    avoidWhen: "When data consists of unordered, discrete text categories with no logical continuity (e.g., Department names).",
    proTip: "Keep lines to <= 4 per figure. Always provide label='...' and call plt.legend().",
    codeSnippet: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 10, 50)\ny = np.sin(x)\nplt.figure(figsize=(7.5, 4.5))\nplt.plot(x, y, color="#EC4899", lw=2.5, label="Signal Trajectory")\nplt.title("Continuous Trend Progression")\nplt.xlabel("Time (s)")\nplt.ylabel("Amplitude")\nplt.grid(True, alpha=0.3)\nplt.legend()\nplt.show()`,
  },
  {
    id: "guide-scatter",
    name: "Scatter Plot (plt.scatter)",
    syntax: "plt.scatter(x, y, s=sizes, c=colors, cmap='viridis')",
    icon: "✨",
    category: "Trend & Continuous",
    whenToUse: "Exploring correlations between two continuous variables, clustering, and outlier detection.",
    idealCondition: "When investigating whether variable Y changes in response to variable X ('Does revenue increase with marketing spend?').",
    realWorldExample: "Study duration vs exam scores, marketing ad budget vs customer sales, house square footage vs sale price.",
    avoidWhen: "When both variables are non-numeric categories or data is already pre-aggregated.",
    proTip: "Apply alpha=0.6 transparency to reveal dense overlapping clusters and use cmap='viridis' for 4D color-mapping.",
    codeSnippet: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\nx = np.random.rand(50) * 100\ny = x * 1.5 + np.random.randn(50) * 15\nplt.figure(figsize=(7.5, 4.5))\nplt.scatter(x, y, color="#10B981", s=60, alpha=0.8)\nplt.title("Bivariate Correlation Analysis")\nplt.xlabel("Ad Spend ($K)")\nplt.ylabel("Revenue ($K)")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "guide-bar",
    name: "Vertical Bar Chart (plt.bar)",
    syntax: "plt.bar(categories, values, width=0.6, color='...')",
    icon: "📊",
    category: "Comparison & Ranking",
    whenToUse: "Comparing discrete quantities across a moderate set of distinct categories (4 to 8 items).",
    idealCondition: "When comparing exact numerical values across distinct groups where order is discrete and non-continuous.",
    realWorldExample: "Quarterly corporate revenue across Q1–Q4, departmental annual expenses, monthly output across regional branches.",
    avoidWhen: "When you have > 12 categories (labels will overlap—use Horizontal Bar instead) or continuous time-series.",
    proTip: "Always anchor the numerical Y-axis baseline at 0 (plt.ylim(0, ...)) to avoid visual distortion.",
    codeSnippet: `import matplotlib.pyplot as plt\n\ncategories = ["Q1", "Q2", "Q3", "Q4"]\nrevenue = [45, 68, 85, 110]\nplt.figure(figsize=(7.5, 4.5))\nplt.bar(categories, revenue, color="#EC4899", width=0.55)\nplt.title("Quarterly Revenue Comparison ($K)")\nplt.xlabel("Fiscal Quarter")\nplt.ylabel("Revenue ($K)")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "guide-barh",
    name: "Horizontal Bar Chart (plt.barh)",
    syntax: "plt.barh(categories, values, height=0.6)",
    icon: "📑",
    category: "Comparison & Ranking",
    whenToUse: "Displaying ranked leaderboards (Top 10) or categories with long descriptive text labels.",
    idealCondition: "When category labels are lengthy strings that would overlap or require ugly rotation on a vertical chart.",
    realWorldExample: "Top 10 programming languages ranked by adoption, global country populations, customer survey response rankings.",
    avoidWhen: "Chronological time-series data (time naturally flows horizontally from left to right).",
    proTip: "Sort the dataset in descending order before plotting so the top-ranked item appears at the top.",
    codeSnippet: `import matplotlib.pyplot as plt\n\ntechs = ["Python", "JavaScript", "TypeScript", "Rust", "Go"]\nshare = [48, 42, 35, 28, 22]\nplt.figure(figsize=(7.5, 4.5))\nplt.barh(techs, share, color="#10B981", height=0.55)\nplt.title("Developer Preference Index Leaderboard (%)")\nplt.xlabel("Adoption Share (%)")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "guide-hist",
    name: "Histogram (plt.hist)",
    syntax: "plt.hist(data, bins=15, density=True, color='...')",
    icon: "📉",
    category: "Distributions & Statistics",
    whenToUse: "Analyzing frequency distributions, spread, skewness, and probability density curves of continuous data.",
    idealCondition: "When you have a raw numerical dataset and need to discover which numeric range contains the highest concentration of samples.",
    realWorldExample: "Employee salary distribution, web server response latencies (ms), customer transaction amounts.",
    avoidWhen: "Plotting pre-aggregated categorical counts (use Bar Chart instead).",
    proTip: "Choose bin count carefully (bins=15 or 20). Too few bins hide important details; too many bins create jagged noise.",
    codeSnippet: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ndata = np.random.normal(100, 15, 300)\nplt.figure(figsize=(7.5, 4.5))\nplt.hist(data, bins=15, color="#EC4899", edgecolor="#FFFFFF", alpha=0.85)\nplt.title("Sample Frequency Distribution (Gaussian Normal)")\nplt.xlabel("Score Interval")\nplt.ylabel("Observation Count")\nplt.show()`,
  },
  {
    id: "guide-pie",
    name: "Pie / Donut Chart (plt.pie)",
    syntax: "plt.pie(sizes, labels=labels, autopct='%1.1f%%', explode=...)",
    icon: "🥧",
    category: "Part-to-Whole",
    whenToUse: "Showing static proportion breakdowns of a 100% total across very few categories (3 to 5 max).",
    idealCondition: "When proportions sum to 100% and you want to highlight the dominant share among a small set of segments.",
    realWorldExample: "Operating system market share (Android vs iOS), corporate budget expense allocations across 4 departments.",
    avoidWhen: "When displaying > 5 categories (slices become illegible) or comparing percentage changes over time.",
    proTip: "Use autopct='%1.1f%%' to format percentage labels and explode=[0.08, 0, 0] to emphasize key slices.",
    codeSnippet: `import matplotlib.pyplot as plt\n\nlabels = ["Cloud", "AI & ML", "Security", "DevOps"]\nsizes = [40, 30, 20, 10]\ncolors = ["#EC4899", "#10B981", "#FB7185", "#34D399"]\nplt.figure(figsize=(6, 6))\nplt.pie(sizes, labels=labels, colors=colors, autopct="%1.1f%%", explode=[0.06, 0, 0, 0], startangle=140)\nplt.title("Enterprise Budget Breakdown")\nplt.show()`,
  },
  {
    id: "guide-boxplot",
    name: "Box & Whisker Plot (plt.boxplot)",
    syntax: "plt.boxplot(data, labels=labels, patch_artist=True)",
    icon: "📦",
    category: "Distributions & Statistics",
    whenToUse: "Comparing 5-number statistical summaries (Min, Q1, Median, Q3, Max, Outliers) across multiple cohorts.",
    idealCondition: "When comparing distributions and evaluating variance, medians, and anomaly outliers across 2 or more groups.",
    realWorldExample: "Salary distributions across 3 departments, benchmark inference times across 3 Machine Learning algorithms.",
    avoidWhen: "Presenting to non-technical stakeholders unfamiliar with quartile statistics (use Bar Chart with error bars).",
    proTip: "Pass patch_artist=True so boxes are rendered with clean color fills instead of plain wireframes.",
    codeSnippet: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ng1 = np.random.normal(50, 10, 40)\ng2 = np.random.normal(65, 15, 40)\nplt.figure(figsize=(7.5, 4.5))\nplt.boxplot([g1, g2], labels=["Cohort A", "Cohort B"], patch_artist=True)\nplt.title("Cohort Statistical Quartile Breakdown")\nplt.ylabel("Measured Score")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "guide-violin",
    name: "Violin Plot (plt.violinplot)",
    syntax: "plt.violinplot(dataset, showmeans=True, showmedians=True)",
    icon: "🎻",
    category: "Distributions & Statistics",
    whenToUse: "Combining box plot quartiles with smooth kernel probability density curves for multimodal datasets.",
    idealCondition: "When data exhibits multiple peaks (bimodal distributions) that standard box plots fail to capture.",
    realWorldExample: "Daily user session durations (morning vs evening peaks), server latency distributions across database versions.",
    avoidWhen: "Small sample sizes (N < 30) where kernel density smoothing becomes inaccurate.",
    proTip: "Enable showmeans=True and showmedians=True simultaneously for complete statistical clarity.",
    codeSnippet: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ndata = [np.random.normal(60, 10, 50), np.random.normal(80, 8, 50)]\nplt.figure(figsize=(7.5, 4.5))\nplt.violinplot(data, showmeans=True, showmedians=True)\nplt.title("Kernel Probability Density Distribution")\nplt.xticks([1, 2], ["Method 1", "Method 2"])\nplt.ylabel("Execution Time (ms)")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "guide-heatmap",
    name: "Heatmap / 2D Matrix (plt.imshow)",
    syntax: "plt.imshow(matrix, cmap='coolwarm', vmin=-1, vmax=1)",
    icon: "🔥",
    category: "Matrices & Spatial",
    whenToUse: "Inspecting 2D tabular grids, feature correlation matrices, confusion matrices, or pixel arrays.",
    idealCondition: "When exploring 2D matrix values and detecting high vs low patterns via continuous color gradient mapping.",
    realWorldExample: "Machine Learning feature correlation matrix (Pearson r: -1 to +1), 24-hour weekly user activity grids.",
    avoidWhen: "Visualizing 1D sequential series data.",
    proTip: "Always append plt.colorbar(label='...') to provide a clear numerical scale for color intensities.",
    codeSnippet: `import matplotlib.pyplot as plt\nimport numpy as np\n\ncorr = np.array([[1.0, 0.7, -0.4], [0.7, 1.0, 0.5], [-0.4, 0.5, 1.0]])\nplt.figure(figsize=(6, 5))\nplt.imshow(corr, cmap="PiYG", vmin=-1, vmax=1)\nplt.colorbar(label="Pearson Correlation (r)")\nplt.title("Feature Correlation Matrix Heatmap")\nplt.xticks([0, 1, 2], ["X1", "X2", "X3"])\nplt.yticks([0, 1, 2], ["X1", "X2", "X3"])\nplt.show()`,
  },
  {
    id: "guide-contour",
    name: "2D Contour Plot (plt.contour / plt.contourf)",
    syntax: "plt.contourf(X, Y, Z, levels=14, cmap='plasma')",
    icon: "🗺️",
    category: "Matrices & Spatial",
    whenToUse: "Visualizing continuous 3D mathematical fields or topographical elevations on a 2D surface with isolines.",
    idealCondition: "When a continuous output Z is governed by two independent variables X and Y (Z = f(X, Y)).",
    realWorldExample: "Topographical terrain elevation maps, atmospheric pressure isobars, neural network loss contour projections.",
    avoidWhen: "Discrete categorical data.",
    proTip: "Use plt.contourf() for smooth filled gradient bands and overlay plt.contour() for crisp contour boundary lines.",
    codeSnippet: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-3, 3, 30)\ny = np.linspace(-3, 3, 30)\nX, Y = np.meshgrid(x, y)\nZ = np.sin(np.sqrt(X**2 + Y**2))\nplt.figure(figsize=(7, 5))\nplt.contourf(X, Y, Z, levels=12, cmap="plasma")\nplt.colorbar(label="Potential Energy")\nplt.title("Topographical 2D Contour Field")\nplt.show()`,
  },
  {
    id: "guide-3d-surface",
    name: "3D Surface Plot (ax.plot_surface)",
    syntax: "ax.plot_surface(X, Y, Z, cmap='viridis', alpha=0.9)",
    icon: "🧊",
    category: "Multi-Axis & 3D",
    whenToUse: "Visualizing true 3-dimensional surfaces, physics wave equations, and loss landscape optimization.",
    idealCondition: "When communicating physical 3D geometry (X, Y, Z) or complex multi-parameter loss surfaces.",
    realWorldExample: "Gradient Descent optimization loss surface, 3D mechanical topography, electromagnetic field potential.",
    avoidWhen: "Simple 2D data (never turn a 2D bar chart into a 3D bar chart; it distorts readability).",
    proTip: "Use the MatplotlibX 3D interactive viewer to rotate the 3D surface 360 degrees via mouse drag.",
    codeSnippet: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-3, 3, 20)\ny = np.linspace(-3, 3, 20)\nX, Y = np.meshgrid(x, y)\nZ = np.sin(np.sqrt(X**2 + Y**2))\nfig = plt.figure(figsize=(7.5, 5))\nax = fig.add_subplot(projection="3d")\nax.plot_surface(X, Y, Z, cmap="viridis", alpha=0.9)\nax.set_title("3D Neural Network Loss Surface")\nax.set_xlabel("W1")\nax.set_ylabel("W2")\nax.set_zlabel("Cost J")\nplt.show()`,
  },
  {
    id: "guide-fill-between",
    name: "Area Fill (plt.fill_between)",
    syntax: "plt.fill_between(x, y1, y2, color='...', alpha=0.3)",
    icon: "🌊",
    category: "Trend & Continuous",
    whenToUse: "Highlighting uncertainty intervals, error bands (+- margin), or shaded regions between two trajectories.",
    idealCondition: "When displaying a predicted trend line accompanied by its confidence bounds (e.g. 95% Confidence Interval).",
    realWorldExample: "Stock price Bollinger Bands, weather forecast temperature spans (Daily Minimum vs Maximum).",
    avoidWhen: "Discrete categorical data with no continuous connection.",
    proTip: "Set alpha=0.25 on the filled area so underlying gridlines and primary trajectory lines remain visible.",
    codeSnippet: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 10, 50)\ny = np.sin(x) * 4 + 10\nplt.figure(figsize=(7.5, 4.5))\nplt.plot(x, y, color="#EC4899", lw=2.5, label="Expected Mean")\nplt.fill_between(x, y - 2, y + 2, color="#EC4899", alpha=0.25, label="95% Confidence Band")\nplt.title("Forecast with Confidence Interval")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "guide-twinx",
    name: "Dual Y-Axis (ax.twinx)",
    syntax: "ax2 = ax1.twinx()",
    icon: "⚖️",
    category: "Multi-Axis & 3D",
    whenToUse: "Plotting two distinct metrics that share the exact same X timeline but operate on different units and scales.",
    idealCondition: "When analyzing correlations between two series with different metrics (e.g., Temperature in deg C vs Rainfall in mm).",
    realWorldExample: "Stock Price ($) vs Daily Trading Volume (Shares), Website Visitors (Count) vs Conversion Rate (%).",
    avoidWhen: "When both variables share the same unit—plot them on a single shared Y-axis instead.",
    proTip: "Color-match the left Y-axis tick labels to curve 1 and the right Y-axis tick labels to curve 2.",
    codeSnippet: `import matplotlib.pyplot as plt\n\nmonths = ["Jan", "Feb", "Mar", "Apr"]\ntemp = [5, 10, 18, 24]\nrain = [80, 55, 40, 25]\nfig, ax1 = plt.subplots(figsize=(7.5, 4.5))\nax1.plot(months, temp, color="#EC4899", lw=2.5, marker="o", label="Temp (°C)")\nax1.set_ylabel("Temperature (°C)", color="#EC4899")\nax2 = ax1.twinx()\nax2.bar(months, rain, color="#10B981", alpha=0.35, width=0.4, label="Rain (mm)")\nax2.set_ylabel("Precipitation (mm)", color="#10B981")\nplt.title("Dual-Axis Climate Trends")\nplt.show()`,
  },
  {
    id: "guide-subplots",
    name: "Multi-Subplots Grid (plt.subplots)",
    syntax: "fig, axs = plt.subplots(nrows, ncols, layout='constrained')",
    icon: "⊞",
    category: "Multi-Axis & 3D",
    whenToUse: "Presenting multiple complementary analytical views together in a single synchronized executive figure.",
    idealCondition: "When displaying multiple facets of a dataset simultaneously without overcrowding a single plot.",
    realWorldExample: "Executive KPI Dashboard: 1. MRR Line Plot, 2. Acquisition Bar Chart, 3. Engagement Scatter, 4. Regional Pie.",
    avoidWhen: "Overcrowding more than 6 subplots into a small figure without enlarging figsize.",
    proTip: "Always include layout='constrained' or call fig.tight_layout() to prevent label collisions.",
    codeSnippet: `import matplotlib.pyplot as plt\n\nfig, axs = plt.subplots(1, 2, figsize=(8, 4), layout="constrained")\naxs[0].plot([1, 2, 3], [10, 20, 30], color="#EC4899", lw=2)\naxs[0].set_title("Metric Trend")\naxs[1].bar(["A", "B", "C"], [5, 8, 4], color="#10B981")\naxs[1].set_title("Categorical Distribution")\nplt.show()`,
  },
];

interface ChartDecisionGuideProps {
  onSelectChartCode?: (code: string) => void;
}

export default function ChartDecisionGuide({ onSelectChartCode }: ChartDecisionGuideProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    "All",
    "Trend & Continuous",
    "Comparison & Ranking",
    "Distributions & Statistics",
    "Part-to-Whole",
    "Matrices & Spatial",
    "Multi-Axis & 3D",
  ];

  const filtered = CHART_DECISION_GUIDE_DATA.filter((item) => {
    const matchesCategory = selectedCategory === "All" ? true : item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.whenToUse.toLowerCase().includes(search.toLowerCase()) ||
      item.idealCondition.toLowerCase().includes(search.toLowerCase()) ||
      item.realWorldExample.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="bg-white dark:bg-[#1C152D] rounded-3xl p-6 sm:p-8 border border-pink-100 dark:border-[#2D2248] shadow-card space-y-6 transition-colors font-sans">
      {/* Guide Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-100 dark:border-[#2D2248] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 text-xs font-mono font-bold text-pink-700 dark:text-pink-300">
            <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
            <span>Master Chart Selection Decision Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-[#FDF2F8]">
            When to Use Which Chart? (Decision Guide & Reference)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Complete condition-based decision guide with exact use-cases, real-world examples, pro tips, and ready-to-run Python syntax for every chart type.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-pink-sm"
                  : "bg-white dark:bg-[#151022] border border-pink-100 dark:border-[#2D2248] text-zinc-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
          <input
            type="text"
            placeholder="Search chart or condition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-[#151022] border border-pink-200 dark:border-[#2D2248] text-xs font-mono text-zinc-900 dark:text-[#FDF2F8] focus:outline-none focus:border-pink-500 shadow-sm"
          />
        </div>
      </div>

      {/* Chart Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#151022] border border-pink-100/90 dark:border-[#2D2248] hover:border-pink-300 dark:hover:border-pink-500/50 shadow-sm hover:shadow-card transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 border-b border-pink-100 dark:border-[#2D2248] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-[#FDF2F8] font-mono group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-400">{item.category}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 font-bold">
                  {item.syntax.split("(")[0]}
                </span>
              </div>

              {/* Conditions & Details */}
              <div className="space-y-2.5 text-xs font-sans">
                <div className="space-y-1">
                  <span className="font-bold text-zinc-800 dark:text-[#FDF2F8] flex items-center gap-1 font-mono text-[11px] text-pink-600 dark:text-pink-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    When to Use (Ideal Condition):
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed pl-4">
                    {item.idealCondition}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-zinc-800 dark:text-[#FDF2F8] flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    Real-World Example:
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed pl-4">
                    {item.realWorldExample}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-[#FFB86B]/10 border border-amber-200 dark:border-[#FFB86B]/25 text-[11px] text-amber-900 dark:text-[#FFB86B] flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                  <span><strong>When to Avoid:</strong> {item.avoidWhen}</span>
                </div>
              </div>
            </div>

            {/* Code & Actions Footer */}
            <div className="pt-2 space-y-2 border-t border-pink-100 dark:border-[#2D2248]">
              <div className="flex items-center justify-between gap-2">
                <code className="text-[11px] font-mono text-pink-700 dark:text-pink-300 truncate max-w-[240px]">
                  {item.syntax}
                </code>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(item.id, item.codeSnippet)}
                    className="p-1.5 rounded-lg border border-pink-200 dark:border-[#2D2248] hover:bg-pink-50 dark:hover:bg-[#1C152D] text-zinc-500 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
                    title="Copy Python Code"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {onSelectChartCode && (
                    <button
                      onClick={() => onSelectChartCode(item.codeSnippet)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-[11px] font-mono font-bold transition-all shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Try Plot</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
