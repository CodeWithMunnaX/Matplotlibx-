"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Play,
  Sliders,
  RefreshCw,
  BarChart2,
  PieChart,
  TrendingUp,
  ScatterChart as ScatterIcon,
  Layers,
  Box,
  LayoutGrid,
  Activity,
  Maximize2,
  Code2,
} from "lucide-react";
import PlotVisualizer from "./PlotVisualizer";
import { parsePythonMatplotlib } from "@/lib/parser";

type ChartKind =
  | "line"
  | "bar"
  | "barh"
  | "scatter"
  | "hist"
  | "pie"
  | "boxplot"
  | "violin"
  | "heatmap"
  | "contour"
  | "3d_surface"
  | "3d_wireframe"
  | "fill_between"
  | "twinx"
  | "subplots";

interface ChartOption {
  id: ChartKind;
  label: string;
  category: string;
  icon?: any;
}

const ALL_CHART_TYPES: ChartOption[] = [
  { id: "line", label: "Line Plot", category: "Standard" },
  { id: "scatter", label: "Scatter Plot", category: "Standard" },
  { id: "bar", label: "Vertical Bar", category: "Standard" },
  { id: "barh", label: "Horizontal Bar", category: "Standard" },
  { id: "hist", label: "Histogram", category: "Statistical" },
  { id: "pie", label: "Pie Chart", category: "Statistical" },
  { id: "boxplot", label: "Box Plot", category: "Statistical" },
  { id: "violin", label: "Violin Plot", category: "Statistical" },
  { id: "heatmap", label: "2D Heatmap", category: "Matrices" },
  { id: "contour", label: "2D Contour", category: "Matrices" },
  { id: "fill_between", label: "Area Fill", category: "Advanced" },
  { id: "twinx", label: "Dual Y-Axis", category: "Advanced" },
  { id: "3d_surface", label: "3D Surface", category: "3D Visuals" },
  { id: "3d_wireframe", label: "3D Wireframe", category: "3D Visuals" },
  { id: "subplots", label: "2x2 Subplots", category: "Layouts" },
];

export default function ChartStudio({ onOpenInEditor }: { onOpenInEditor?: (code: string) => void }) {
  const [chartKind, setChartKind] = useState<ChartKind>("line");
  const [color, setColor] = useState<string>("#6366F1");
  const [linestyle, setLinestyle] = useState<string>("-");
  const [marker, setMarker] = useState<string>("o");
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("Interactive Visual Studio");
  const [copied, setCopied] = useState<boolean>(false);

  // Generate Python Matplotlib Code based on user selections
  const generatePythonCode = (): string => {
    switch (chartKind) {
      case "line":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 10, 50)\ny = np.sin(x) * 10 + 15\n\nplt.figure(figsize=(7.5, 4.5))\nplt.plot(x, y, color="${color}", lw=2.5, ls="${linestyle}"${marker !== "none" ? `, marker="${marker}"` : ""}${showLegend ? ', label="Signal Trajectory"' : ""})\n\nplt.title("${title}")\nplt.xlabel("Time Horizon (t)")\nplt.ylabel("Measurement (Units)")\n${showLegend ? "plt.legend()\n" : ""}${showGrid ? "plt.grid(True, alpha=0.3)\n" : ""}plt.show()`;

      case "bar":
        return `import matplotlib.pyplot as plt\n\ncategories = ["Q1", "Q2", "Q3", "Q4"]\nvalues = [45, 68, 85, 110]\n\nplt.figure(figsize=(7.5, 4.5))\nplt.bar(categories, values, color="${color}", width=0.55${showLegend ? ', label="Quarterly Revenue ($K)"' : ""})\n\nplt.title("${title}")\nplt.xlabel("Fiscal Quarter")\nplt.ylabel("Revenue ($K)")\n${showLegend ? "plt.legend()\n" : ""}${showGrid ? "plt.grid(True, alpha=0.3)\n" : ""}plt.show()`;

      case "barh":
        return `import matplotlib.pyplot as plt\n\nframeworks = ["React", "Next.js", "Vue", "Svelte", "Angular"]\npopularity = [48, 42, 30, 25, 20]\n\nplt.figure(figsize=(7.5, 4.5))\nplt.barh(frameworks, popularity, color="${color}", height=0.55${showLegend ? ', label="Adoption Share (%)"' : ""})\n\nplt.title("${title}")\nplt.xlabel("Developer Share (%)")\n${showLegend ? "plt.legend()\n" : ""}${showGrid ? "plt.grid(True, alpha=0.3)\n" : ""}plt.show()`;

      case "scatter":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\nx = np.random.rand(40) * 100\ny = x * 1.5 + np.random.randn(40) * 15\nsizes = np.random.rand(40) * 150 + 40\n\nplt.figure(figsize=(7.5, 4.5))\nplt.scatter(x, y, s=sizes, color="${color}", alpha=0.85${showLegend ? ', label="Sample Cohort"' : ""})\n\nplt.title("${title}")\nplt.xlabel("Ad Spend ($K)")\nplt.ylabel("Revenue ($K)")\n${showLegend ? "plt.legend()\n" : ""}${showGrid ? "plt.grid(True, alpha=0.3)\n" : ""}plt.show()`;

      case "hist":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ndata = np.random.normal(100, 15, 300)\n\nplt.figure(figsize=(7.5, 4.5))\nplt.hist(data, bins=14, color="${color}", edgecolor="#0B1021", alpha=0.85${showLegend ? ', label="Frequency"' : ""})\n\nplt.title("${title}")\nplt.xlabel("Score Intervals")\nplt.ylabel("Frequency Count")\n${showLegend ? "plt.legend()\n" : ""}${showGrid ? "plt.grid(True, alpha=0.3)\n" : ""}plt.show()`;

      case "pie":
        return `import matplotlib.pyplot as plt\n\nlabels = ["Product A", "Product B", "Product C", "Product D"]\nsizes = [40, 30, 20, 10]\ncolors = ["#6366F1", "#00D9C0", "#FFB86B", "#FF5C7A"]\n\nplt.figure(figsize=(6, 6))\nplt.pie(sizes, labels=labels, colors=colors, autopct="%1.0f%%", startangle=140)\nplt.title("${title}")\nplt.show()`;

      case "boxplot":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ngroup1 = np.random.normal(50, 10, 40)\ngroup2 = np.random.normal(68, 15, 40)\ngroup3 = np.random.normal(42, 6, 40)\n\nplt.figure(figsize=(7.5, 4.5))\nplt.boxplot([group1, group2, group3], labels=["Cohort A", "Cohort B", "Cohort C"], patch_artist=True)\nplt.title("${title}")\nplt.ylabel("Measured Variance")\n${showGrid ? "plt.grid(True, alpha=0.3)\n" : ""}plt.show()`;

      case "violin":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\nd1 = np.random.normal(60, 12, 50)\nd2 = np.random.normal(75, 8, 50)\n\nplt.figure(figsize=(7.5, 4.5))\nplt.violinplot([d1, d2], showmeans=True, showmedians=True)\nplt.title("${title}")\nplt.xticks([1, 2], ["Method 1", "Method 2"])\nplt.ylabel("Execution Time (ms)")\n${showGrid ? "plt.grid(True, alpha=0.3)\n" : ""}plt.show()`;

      case "heatmap":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\ncorr = np.array([\n    [1.0, 0.7, 0.4, -0.2],\n    [0.7, 1.0, 0.5, -0.4],\n    [0.4, 0.5, 1.0, -0.1],\n    [-0.2, -0.4, -0.1, 1.0]\n])\n\nplt.figure(figsize=(6, 5))\nplt.imshow(corr, cmap="viridis")\nplt.colorbar(label="Correlation (r)")\nplt.title("${title}")\nplt.xticks([0, 1, 2, 3], ["X1", "X2", "X3", "X4"])\nplt.yticks([0, 1, 2, 3], ["X1", "X2", "X3", "X4"])\nplt.show()`;

      case "contour":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-3, 3, 30)\ny = np.linspace(-3, 3, 30)\nX, Y = np.meshgrid(x, y)\nZ = np.sin(np.sqrt(X**2 + Y**2))\n\nplt.figure(figsize=(7, 5))\nplt.contourf(X, Y, Z, levels=12, cmap="plasma")\nplt.colorbar(label="Potential")\nplt.title("${title}")\nplt.show()`;

      case "fill_between":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 10, 60)\ny = np.sin(x) * 5 + 10\ny_upper = y + 2.5\ny_lower = y - 2.5\n\nplt.figure(figsize=(7.5, 4.5))\nplt.plot(x, y, color="${color}", lw=2.5, label="Expected Mean")\nplt.fill_between(x, y_lower, y_upper, color="${color}", alpha=0.25, label="95% Confidence Band")\nplt.title("${title}")\nplt.xlabel("Horizon (s)")\nplt.ylabel("Confidence Bounds")\n${showLegend ? "plt.legend()\n" : ""}${showGrid ? "plt.grid(True, alpha=0.3)\n" : ""}plt.show()`;

      case "twinx":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\nmonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]\ntemp = [5.2, 7.8, 12.1, 16.5, 21.0, 25.8]\nrain = [82, 65, 50, 42, 35, 22]\n\nfig, ax1 = plt.subplots(figsize=(7.5, 4.5))\nax1.plot(months, temp, color="#FF5C7A", lw=2.5, marker="o", label="Temp (°C)")\nax1.set_ylabel("Temperature (°C)", color="#FF5C7A")\n\nax2 = ax1.twinx()\nax2.bar(months, rain, color="#00D9C0", alpha=0.35, width=0.4, label="Rain (mm)")\nax2.set_ylabel("Rainfall (mm)", color="#00D9C0")\n\nplt.title("${title}")\nplt.show()`;

      case "3d_surface":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-3, 3, 20)\ny = np.linspace(-3, 3, 20)\nX, Y = np.meshgrid(x, y)\nZ = np.sin(np.sqrt(X**2 + Y**2))\n\nfig = plt.figure(figsize=(7.5, 5))\nax = fig.add_subplot(projection="3d")\nax.plot_surface(X, Y, Z, cmap="viridis", alpha=0.9)\nax.set_title("${title}")\nax.set_xlabel("X Axis")\nax.set_ylabel("Y Axis")\nax.set_zlabel("Z Elevation")\nplt.show()`;

      case "3d_wireframe":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-2, 2, 18)\ny = np.linspace(-2, 2, 18)\nX, Y = np.meshgrid(x, y)\nZ = X**2 - Y**2\n\nfig = plt.figure(figsize=(7.5, 5))\nax = fig.add_subplot(projection="3d")\nax.plot_wireframe(X, Y, Z, color="${color}", linewidth=1.2)\nax.set_title("${title}")\nplt.show()`;

      case "subplots":
        return `import matplotlib.pyplot as plt\nimport numpy as np\n\nfig, axs = plt.subplots(2, 2, figsize=(8, 6), layout="constrained")\nfig.suptitle("${title}", fontsize=13, fontweight="bold")\n\naxs[0, 0].plot([1, 2, 3, 4], [10, 20, 15, 30], color="#6366F1", lw=2)\naxs[0, 0].set_title("Line Metric")\n\naxs[0, 1].bar(["A", "B", "C"], [50, 80, 65], color="#00D9C0")\naxs[0, 1].set_title("Categorical Bar")\n\naxs[1, 0].scatter([1, 2, 3, 4], [4, 2, 6, 8], color="#FFB86B", s=60)\naxs[1, 0].set_title("Scatter Cohort")\n\naxs[1, 1].pie([60, 25, 15], labels=["X", "Y", "Z"], colors=["#6366F1", "#00D9C0", "#FF5C7A"])\naxs[1, 1].set_title("Pie Distribution")\n\nplt.show()`;

      default:
        return `import matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [4, 5, 6], color="${color}")\nplt.title("${title}")\nplt.show()`;
    }
  };

  const currentCode = generatePythonCode();
  const parsed = parsePythonMatplotlib(currentCode);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-6 transition-colors">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-200 dark:border-[#00D9C0]/30 text-xs font-mono text-teal-700 dark:text-[#00D9C0]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Chart Studio • 15+ Visualizers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5F7FA] font-sans">
            Visual Chart Builder & Code Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8B93A7] font-sans">
            Select any chart type below, tweak parameters visually, and watch live preview & Python code update instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenInEditor && (
            <button
              onClick={() => onOpenInEditor(currentCode)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 dark:bg-[#00D9C0] hover:bg-teal-700 dark:hover:bg-[#00D9C0]/90 text-white dark:text-[#0B1021] font-mono text-xs font-bold transition-all shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Edit in Python Lab</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] hover:bg-slate-200 dark:hover:bg-[#16203B] text-slate-700 dark:text-[#F5F7FA] font-mono text-xs transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Code!" : "Copy Python Code"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5 p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] text-xs font-mono">
          {/* Chart Type Selector Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-700 dark:text-[#F5F7FA] font-bold">
                Select Chart Type (15 Models)
              </label>
              <span className="text-[10px] text-teal-600 dark:text-[#00D9C0]">
                Active: {chartKind.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 max-h-[190px] overflow-y-auto pr-1 custom-scrollbar">
              {ALL_CHART_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setChartKind(t.id)}
                  className={`py-2 px-2 rounded-xl border text-center transition-all text-[11px] ${
                    chartKind === t.id
                      ? "bg-teal-600 dark:bg-[#00D9C0] text-white dark:text-[#0B1021] border-transparent font-bold shadow-sm"
                      : "bg-white dark:bg-[#11182D] border-slate-200 dark:border-[#26304A] text-slate-600 dark:text-[#8B93A7] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Picker */}
          <div className="space-y-2">
            <label className="text-slate-700 dark:text-[#F5F7FA] font-bold">Accent Color</label>
            <div className="flex items-center gap-2">
              {[
                "#6366F1", // Indigo
                "#00D9C0", // Teal
                "#FFB86B", // Amber
                "#FF5C7A", // Rose
                "#38EF7D", // Emerald
                "#3B82F6", // Blue
                "#A855F7", // Purple
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-lg transition-transform ${
                    color === c ? "ring-2 ring-white scale-110" : "opacity-80 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Linestyle & Marker for Line & Curves */}
          {(chartKind === "line" || chartKind === "fill_between") && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-[#F5F7FA] font-bold">Line Style</label>
                <select
                  value={linestyle}
                  onChange={(e) => setLinestyle(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-slate-700 dark:text-[#F5F7FA]"
                >
                  <option value="-">Solid (-)</option>
                  <option value="--">Dashed (--)</option>
                  <option value=":">Dotted (:)</option>
                  <option value="-.">Dash-Dot (-.)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-[#F5F7FA] font-bold">Marker</label>
                <select
                  value={marker}
                  onChange={(e) => setMarker(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-slate-700 dark:text-[#F5F7FA]"
                >
                  <option value="o">Circle (o)</option>
                  <option value="s">Square (s)</option>
                  <option value="^">Triangle (^)</option>
                  <option value="*">Star (*)</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
          )}

          {/* Chart Title Input */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-[#F5F7FA] font-bold">Chart Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-slate-900 dark:text-[#F5F7FA]"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#26304A]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded accent-teal-500"
              />
              <span>Enable Background Grid</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLegend}
                onChange={(e) => setShowLegend(e.target.checked)}
                className="rounded accent-teal-500"
              />
              <span>Render Series Legend</span>
            </label>
          </div>
        </div>

        {/* Live Preview & Python Code Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <PlotVisualizer figure={parsed.figure} />

          {/* Live Generated Code Snippet */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-teal-600 dark:text-[#00D9C0]">Generated Matplotlib Script</span>
              <button
                onClick={handleCopy}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-xs font-mono text-slate-700 dark:text-[#F5F7FA] overflow-x-auto max-h-[140px]">
              {currentCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
