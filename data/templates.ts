// data/templates.ts
// Preloaded code snippets & templates for MatplotlibX Playground (100% English)

export interface PlaygroundTemplate {
  id: string;
  category: "Line & Curves" | "Bars & Columns" | "Statistical" | "Matrices & Fields" | "Subplots" | "3D Visuals" | "Financial";
  title: string;
  chartType: string;
  description: string;
  code: string;
}

export const PLAYGROUND_TEMPLATES: PlaygroundTemplate[] = [
  // ==========================================
  // 1. LINE & CURVES
  // ==========================================
  {
    id: "t-sine-cosine",
    category: "Line & Curves",
    chartType: "Line Plot",
    title: "Dual Sine & Cosine Waves",
    description: "Continuous harmonic trigonometry curves with custom color styling and legend.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 4 * np.pi, 100)\ny1 = np.sin(x)\ny2 = np.cos(x)\n\nplt.figure(figsize=(8, 4.5))\nplt.plot(x, y1, color="#6366F1", lw=2.5, label="y = sin(x)")\nplt.plot(x, y2, color="#00D9C0", lw=2.5, ls="--", label="y = cos(x)")\n\nplt.title("Harmonic Waves (Sine & Cosine)")\nplt.xlabel("Angle (Radians)")\nplt.ylabel("Amplitude")\nplt.legend(loc="upper right")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "t-damped-oscillation",
    category: "Line & Curves",
    chartType: "Line Plot",
    title: "Damped Harmonic Oscillation",
    description: "Exponential decay envelope multiplied by a sinusoidal wave.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nt = np.linspace(0, 10, 150)\nenvelope = np.exp(-t * 0.4)\nsignal = envelope * np.cos(2 * np.pi * t)\n\nplt.figure(figsize=(8, 4.5))\nplt.plot(t, signal, color="#00D9C0", lw=2.5, label="Damped Signal")\nplt.plot(t, envelope, color="#FFB86B", ls=":", lw=1.8, label="Decay Envelope")\nplt.plot(t, -envelope, color="#FFB86B", ls=":", lw=1.8)\n\nplt.title("Physics: Damped Harmonic Oscillation")\nplt.xlabel("Time (s)")\nplt.ylabel("Displacement (m)")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "t-fill-between-band",
    category: "Line & Curves",
    chartType: "Fill Between",
    title: "Confidence Interval Shaded Band (fill_between)",
    description: "Shaded upper and lower uncertainty margin around trajectory.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 10, 60)\ny = np.sin(x) * 4 + 10\ny_upper = y + 2.2\ny_lower = y - 2.2\n\nplt.figure(figsize=(8, 4.5))\nplt.plot(x, y, color="#6366F1", lw=2.5, label="Estimated Mean")\nplt.fill_between(x, y_lower, y_upper, color="#6366F1", alpha=0.25, label="95% Confidence Band")\n\nplt.title("Time-Series Forecast with Confidence Interval")\nplt.xlabel("Timeline (Days)")\nplt.ylabel("Output Metric")\nplt.legend(loc="upper right")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "t-step-plot",
    category: "Line & Curves",
    chartType: "Step Plot",
    title: "Digital Step Signal",
    description: "Discrete step function jumps representing digital clock pulses.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.arange(0, 8, 0.5)\ny = np.sin(x) > 0 # Binary High / Low\n\nplt.figure(figsize=(8, 4))\nplt.plot(x, y, color="#FF5C7A", lw=2.5, marker="o")\nplt.title("Digital Logic Clock Pulses (High / Low)")\nplt.xlabel("Clock Cycles")\nplt.ylabel("Logic Level (0 / 1)")\nplt.ylim(-0.2, 1.2)\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },

  // ==========================================
  // 2. BARS & COLUMNS
  // ==========================================
  {
    id: "t-framework-rankings",
    category: "Bars & Columns",
    chartType: "Horizontal Bar",
    title: "Tech Stack Popularity Ranking (barh)",
    description: "Horizontal bar leaderboard with colorful custom accents.",
    code: `import matplotlib.pyplot as plt\n\ntechs = ["Python", "JavaScript", "TypeScript", "Rust", "Go", "C++"]\nshare = [48, 42, 35, 28, 22, 18]\ncolors = ["#6366F1", "#00D9C0", "#FFB86B", "#FF5C7A", "#38EF7D", "#3B82F6"]\n\nplt.figure(figsize=(8, 4.5))\nplt.barh(techs, share, color=colors, height=0.55)\nplt.title("Developer Preference Index 2026", loc="left")\nplt.xlabel("Adoption Share (%)")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "t-stacked-budget",
    category: "Bars & Columns",
    chartType: "Vertical Bar",
    title: "Stacked Department Budget Breakdown (bar)",
    description: "3-layer stacked vertical bar chart tracking total costs.",
    code: `import matplotlib.pyplot as plt\n\nquarters = ["Q1", "Q2", "Q3", "Q4"]\nengineering = [50, 65, 70, 85]\nmarketing = [30, 40, 45, 55]\noperations = [20, 22, 25, 30]\n\nplt.figure(figsize=(7.5, 4.5))\nplt.bar(quarters, engineering, label="Engineering", color="#6366F1", width=0.5)\nplt.bar(quarters, marketing, bottom=engineering, label="Marketing", color="#00D9C0", width=0.5)\n\n# Sum bottom for third layer\nbottom_3 = [engineering[i] + marketing[i] for i in range(4)]\nplt.bar(quarters, operations, bottom=bottom_3, label="Operations", color="#FFB86B", width=0.5)\n\nplt.title("Quarterly Departmental Budget Spending ($K)")\nplt.ylabel("Total Outlay ($K)")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },

  // ==========================================
  // 3. STATISTICAL & DISTRIBUTIONS
  // ==========================================
  {
    id: "t-normal-histogram",
    category: "Statistical",
    chartType: "Histogram",
    title: "Gaussian Normal Distribution Histogram (hist)",
    description: "Frequency distribution with 16 bins and observation counts.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ndata = np.random.normal(loc=100, scale=15, size=400)\n\nplt.figure(figsize=(8, 4.5))\nplt.hist(data, bins=16, color="#6366F1", edgecolor="#0B1021", alpha=0.85, label="Samples")\n\nplt.title("Gaussian Normal Frequency Histogram (μ=100, σ=15)")\nplt.xlabel("Score Interval")\nplt.ylabel("Observation Count")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "t-multivariate-scatter",
    category: "Statistical",
    chartType: "Scatter Plot",
    title: "Multivariate Scatter with Viridis Colormap",
    description: "4-dimensional scatter plot mapping X, Y, Size, and Color intensity.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\nx = np.random.rand(60) * 100\ny = x * 1.5 + np.random.randn(60) * 20\nsizes = np.random.rand(60) * 200 + 40\ncolors = y\n\nplt.figure(figsize=(8, 5))\nplt.scatter(x, y, s=sizes, c=colors, cmap="viridis", alpha=0.85, edgecolors="#F5F7FA")\nplt.colorbar(label="Yield Metric")\nplt.title("Multivariate Performance Distribution")\nplt.xlabel("Ad Budget ($K)")\nplt.ylabel("Customer Conversions")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "t-pie-breakdown",
    category: "Statistical",
    chartType: "Pie Chart",
    title: "Market Share Proportion Slices (pie)",
    description: "Categorical proportions with custom color slice palette and percentages.",
    code: `import matplotlib.pyplot as plt\n\nlabels = ["Cloud Infrastructure", "AI & ML Services", "Cybersecurity", "DevOps Tools"]\nsizes = [42, 28, 18, 12]\ncolors = ["#6366F1", "#00D9C0", "#FFB86B", "#FF5C7A"]\n\nplt.figure(figsize=(6.5, 6.5))\nplt.pie(sizes, labels=labels, colors=colors, autopct="%1.1f%%", startangle=140)\nplt.title("Enterprise Tech Budget Allocation")\nplt.show()`,
  },
  {
    id: "t-multi-boxplot",
    category: "Statistical",
    chartType: "Box Plot",
    title: "Three-Cohort Boxplot Comparison (boxplot)",
    description: "Quartile spreads (Q1, Median, Q3, Outliers) across 3 test groups.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ngroup1 = np.random.normal(50, 10, 40)\ngroup2 = np.random.normal(68, 15, 40)\ngroup3 = np.random.normal(42, 6, 40)\n\nplt.figure(figsize=(7.5, 4.5))\nplt.boxplot([group1, group2, group3], labels=["Control A", "Treatment B", "Variant C"], patch_artist=True)\nplt.title("Cohort Statistical Quartile Breakdown")\nplt.ylabel("Measured Score")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },
  {
    id: "t-violin-density",
    category: "Statistical",
    chartType: "Violin Plot",
    title: "Kernel Density Violin Distribution (violinplot)",
    description: "Smooth probability density distribution with mean and median markers.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ndata1 = np.random.normal(65, 12, 60)\ndata2 = np.random.normal(80, 8, 60)\n\nplt.figure(figsize=(7.5, 4.5))\nplt.violinplot([data1, data2], showmeans=True, showmedians=True)\nplt.title("API Latency Distribution Across Algorithms (ms)")\nplt.xticks([1, 2], ["Algorithm V1", "Algorithm V2 Optimized"])\nplt.ylabel("Response Latency (ms)")\nplt.grid(True, alpha=0.3)\nplt.show()`,
  },

  // ==========================================
  // 4. MATRICES & FIELDS
  // ==========================================
  {
    id: "t-correlation-heatmap",
    category: "Matrices & Fields",
    chartType: "Heatmap (imshow)",
    title: "Feature Correlation Heatmap (imshow)",
    description: "Pearson correlation coefficient matrix with coolwarm colormap.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\ncorr = np.array([\n    [1.00, 0.75, 0.40, -0.30],\n    [0.75, 1.00, 0.60, -0.45],\n    [0.40, 0.60, 1.00, -0.15],\n    [-0.30, -0.45, -0.15, 1.00]\n])\n\nplt.figure(figsize=(6, 5))\nplt.imshow(corr, cmap="coolwarm", vmin=-1, vmax=1)\nplt.colorbar(label="Pearson Correlation (r)")\nplt.title("Feature Correlation Matrix Heatmap")\nplt.xticks([0, 1, 2, 3], ["X1", "X2", "X3", "X4"])\nplt.yticks([0, 1, 2, 3], ["X1", "X2", "X3", "X4"])\nplt.show()`,
  },
  {
    id: "t-contour-potential",
    category: "Matrices & Fields",
    chartType: "Contour Plot",
    title: "Filled 2D Contour Potential Field (contourf)",
    description: "Continuous isoline field with plasma gradient shading.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-3, 3, 40)\ny = np.linspace(-3, 3, 40)\nX, Y = np.meshgrid(x, y)\nZ = np.sin(np.sqrt(X**2 + Y**2))\n\nplt.figure(figsize=(7, 5))\nplt.contourf(X, Y, Z, levels=14, cmap="plasma")\nplt.colorbar(label="Gravitational Potential")\nplt.title("Topographical 2D Contour Field")\nplt.show()`,
  },

  // ==========================================
  // 5. SUBPLOTS & LAYOUTS
  // ==========================================
  {
    id: "t-2x2-dashboard",
    category: "Subplots",
    chartType: "Subplots Grid",
    title: "2x2 Multi-Panel Analytics Dashboard",
    description: "Unified 4-quadrant layout combining line, bar, scatter, and pie charts.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nfig, axs = plt.subplots(2, 2, figsize=(8.5, 6), layout="constrained")\nfig.suptitle("Quarterly SaaS Performance Dashboard", fontsize=14, fontweight="bold")\n\n# 1. Line\naxs[0, 0].plot([1, 2, 3, 4], [10, 25, 40, 65], color="#6366F1", lw=2.5, marker="o")\naxs[0, 0].set_title("Revenue Growth ($K)", loc="left")\naxs[0, 0].grid(True, alpha=0.3)\n\n# 2. Bars\naxs[0, 1].bar(["Direct", "SEO", "Ads"], [120, 180, 240], color="#00D9C0")\naxs[0, 1].set_title("Lead Acquisition Channels", loc="left")\naxs[0, 1].grid(True, alpha=0.3)\n\n# 3. Scatter\naxs[1, 0].scatter(np.random.rand(15)*10, np.random.rand(15)*50, color="#FFB86B", s=50)\naxs[1, 0].set_title("Session Duration vs Spend", loc="left")\naxs[1, 0].grid(True, alpha=0.3)\n\n# 4. Pie\naxs[1, 1].pie([55, 30, 15], labels=["US", "EU", "APAC"], colors=["#6366F1", "#00D9C0", "#FF5C7A"], autopct="%1.0f%%")\naxs[1, 1].set_title("Regional Distribution", loc="left")\n\nplt.show()`,
  },
  {
    id: "t-twin-axes-dual",
    category: "Subplots",
    chartType: "Twinx Axes",
    title: "Dual Y-Axis (twinx) Climate Trend",
    description: "Plotting Temperature (°C) and Rainfall (mm) on synchronized time axis.",
    code: `import matplotlib.pyplot as plt\n\nmonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]\ntemp = [4.5, 6.2, 10.8, 15.4, 21.0, 26.2]\nrain = [85, 68, 52, 40, 32, 20]\n\nfig, ax1 = plt.subplots(figsize=(7.5, 4.5))\nax1.plot(months, temp, color="#FF5C7A", lw=2.5, marker="o", label="Temp (°C)")\nax1.set_ylabel("Temperature (°C)", color="#FF5C7A")\n\nax2 = ax1.twinx()\nax2.bar(months, rain, color="#00D9C0", alpha=0.35, width=0.4, label="Rain (mm)")\nax2.set_ylabel("Precipitation (mm)", color="#00D9C0")\n\nplt.title("Dual-Axis Climate Trends")\nplt.show()`,
  },

  // ==========================================
  // 6. 3D VISUALIZATIONS
  // ==========================================
  {
    id: "t-3d-loss-surface",
    category: "3D Visuals",
    chartType: "3D Surface",
    title: "3D Loss Surface Landscape (plot_surface)",
    description: "Isometric 3D continuous surface projection with viridis gradient.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-3, 3, 25)\ny = np.linspace(-3, 3, 25)\nX, Y = np.meshgrid(x, y)\nZ = np.sin(np.sqrt(X**2 + Y**2))\n\nfig = plt.figure(figsize=(7.5, 5.5))\nax = fig.add_subplot(projection="3d")\nax.plot_surface(X, Y, Z, cmap="viridis", alpha=0.9)\n\nax.set_title("3D Neural Network Loss Surface")\nax.set_xlabel("Weight W1")\nax.set_ylabel("Weight W2")\nax.set_zlabel("Cost J(W)")\nplt.show()`,
  },
  {
    id: "t-3d-wireframe-saddle",
    category: "3D Visuals",
    chartType: "3D Wireframe",
    title: "3D Wireframe Hyperbolic Saddle (plot_wireframe)",
    description: "Transparent 3D wire mesh of hyperbolic paraboloid.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-2, 2, 20)\ny = np.linspace(-2, 2, 20)\nX, Y = np.meshgrid(x, y)\nZ = X**2 - Y**2\n\nfig = plt.figure(figsize=(7.5, 5))\nax = fig.add_subplot(projection="3d")\nax.plot_wireframe(X, Y, Z, color="#00D9C0", linewidth=1.2)\n\nax.set_title("3D Hyperbolic Paraboloid Saddle Wireframe")\nplt.show()`,
  },

  // ==========================================
  // 7. FINANCIAL & TIME-SERIES
  // ==========================================
  {
    id: "t-candlestick-stock",
    category: "Financial",
    chartType: "Candlestick (OHLC)",
    title: "Stock Candlestick Price Action (OHLC)",
    description: "Open-High-Low-Close price candles with bullish and bearish color coding.",
    code: `import matplotlib.pyplot as plt\n\ndays = [1, 2, 3, 4, 5, 6, 7]\nopens = [100, 104, 102, 108, 112, 110, 115]\nhighs = [106, 109, 107, 115, 118, 116, 122]\nlows = [98, 101, 99, 105, 109, 107, 112]\ncloses = [104, 102, 108, 112, 110, 115, 120]\n\nfig, ax = plt.subplots(figsize=(8, 4.5))\nfor i in range(len(days)):\n    c = "#00D9C0" if closes[i] >= opens[i] else "#FF5C7A"\n    ax.plot([days[i], days[i]], [lows[i], highs[i]], color=c, lw=1.5)\n    ax.bar(days[i], abs(closes[i] - opens[i]), bottom=min(opens[i], closes[i]), color=c, width=0.4)\n\nax.set_title("Stock Price Candlestick Trend (OHLC)")\nax.set_xlabel("Day")\nax.set_ylabel("Price ($)")\nax.grid(True, alpha=0.3)\nplt.show()`,
  },
];
