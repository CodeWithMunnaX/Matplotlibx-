export interface RealWorldDataset {
  id: string;
  name: string;
  category: "Cricket" | "Cinema" | "Tech" | "Climate" | "Business";
  icon: string;
  description: string;
  code: string;
}

export const REAL_WORLD_DATASETS: RealWorldDataset[] = [
  {
    id: "ipl-cricket",
    name: "IPL Cricket Run-Chase",
    category: "Cricket",
    icon: "🏏",
    description: "Compare over-by-over cumulative runs scored in an IPL T20 match (Team A vs Team B).",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\novers = np.arange(1, 21)\n# Cumulative runs scored per over\nteam_mumbai = np.array([8, 18, 27, 39, 52, 65, 74, 86, 98, 110, 122, 135, 149, 162, 175, 188, 201, 214, 225, 238])\nteam_chennai = np.array([12, 22, 34, 45, 59, 71, 80, 91, 105, 116, 128, 140, 155, 168, 182, 195, 209, 220, 232, 242])\n\nplt.figure(figsize=(8, 4.6))\nplt.plot(overs, team_mumbai, color="#EC4899", lw=2.5, marker="o", label="Mumbai Indians (238)")\nplt.plot(overs, team_chennai, color="#10B981", lw=2.5, marker="s", ls="--", label="Chennai Super Kings (242 - Won)")\n\nplt.title("IPL 2026 Final • Over-by-Over Worm Chart", fontsize=13, fontweight="bold")\nplt.xlabel("Over Number (1 - 20)")\nplt.ylabel("Cumulative Runs")\nplt.xticks(np.arange(1, 21, 2))\nplt.grid(True, alpha=0.3)\nplt.legend(loc="upper left")\nplt.show()`,
  },
  {
    id: "movie-box-office",
    name: "Indian Cinema Box Office",
    category: "Cinema",
    icon: "🎬",
    description: "Compare Opening Day vs Lifetime Worldwide Gross Collections across blockbuster films (in ₹ Crore).",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nmovies = ["Jawan", "Stree 2", "Animal", "Pathaan", "Kalki 2898 AD"]\nopening_day = [129, 76, 116, 106, 180]\nlifetime_gross = [1148, 874, 917, 1050, 1042]\n\nx = np.arange(len(movies))\nwidth = 0.35\n\nplt.figure(figsize=(8.5, 4.6))\nplt.bar(x - width/2, opening_day, width, label="Opening Day (₹ Cr)", color="#EC4899")\nplt.bar(x + width/2, lifetime_gross, width, label="Lifetime Gross (₹ Cr)", color="#10B981")\n\nplt.title("Indian Blockbusters: Day 1 vs Lifetime Box Office (₹ Cr)")\nplt.xlabel("Blockbuster Film Title")\nplt.ylabel("Worldwide Gross (₹ Crore)")\nplt.xticks(x, movies)\nplt.legend()\nplt.grid(True, alpha=0.3, axis="y")\nplt.show()`,
  },
  {
    id: "smartphone-share",
    name: "Global Smartphone Market Share",
    category: "Tech",
    icon: "📱",
    description: "Visual proportional breakdown of top smartphone manufacturers market share.",
    code: `import matplotlib.pyplot as plt\n\nbrands = ["Apple iPhone", "Samsung", "Xiaomi", "Vivo", "OPPO", "Others"]\nshare = [24.7, 21.3, 14.5, 9.8, 8.6, 21.1]\ncolors = ["#EC4899", "#10B981", "#F43F5E", "#34D399", "#A855F7", "#94A3B8"]\nexplode = [0.08, 0, 0, 0, 0, 0]\n\nplt.figure(figsize=(6.5, 6.5))\nplt.pie(share, labels=brands, colors=colors, autopct="%1.1f%%", explode=explode, startangle=140)\nplt.title("Global Smartphone Market Share Q4 (%)", fontsize=12, fontweight="bold")\nplt.show()`,
  },
  {
    id: "city-climate",
    name: "Climate: Temperature vs Rainfall",
    category: "Climate",
    icon: "🌡️",
    description: "Dual Y-axis chart analyzing monthly Average Temperature (°C) vs Monsoon Rainfall (mm).",
    code: `import matplotlib.pyplot as plt\n\nmonths = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]\ntemperature = [24, 28, 33, 30, 29, 27]\nmonsoon_rain = [2, 5, 25, 380, 240, 15]\n\nfig, ax1 = plt.subplots(figsize=(8, 4.6))\n\n# Left Axis: Temperature Line\nax1.plot(months, temperature, color="#EC4899", lw=3, marker="o", label="Avg Temp (°C)")\nax1.set_xlabel("Calendar Month")\nax1.set_ylabel("Temperature (°C)", color="#EC4899", fontweight="bold")\nax1.tick_params(axis="y", labelcolor="#EC4899")\nax1.grid(True, alpha=0.3)\n\n# Right Axis: Rainfall Bar\nax2 = ax1.twinx()\nax2.bar(months, monsoon_rain, color="#10B981", alpha=0.4, width=0.4, label="Rainfall (mm)")\nax2.set_ylabel("Precipitation (mm)", color="#10B981", fontweight="bold")\nax2.tick_params(axis="y", labelcolor="#10B981")\n\nplt.title("Mumbai Climate: Monthly Temperature vs Monsoon Rain")\nplt.show()`,
  },
  {
    id: "ad-spend-revenue",
    name: "Ad Spend vs E-Commerce Revenue",
    category: "Business",
    icon: "🛒",
    description: "Multivariate scatter plot analyzing Marketing Spend vs Generated Store Revenue across 40 campaigns.",
    code: `import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\nad_spend = np.random.uniform(5, 50, 40)\nrevenue = ad_spend * 3.8 + np.random.normal(0, 12, 40)\nteam_size = np.random.uniform(30, 180, 40)\n\nplt.figure(figsize=(8, 4.6))\nplt.scatter(ad_spend, revenue, s=team_size, color="#EC4899", alpha=0.75, edgecolors="#10B981", linewidths=1.5, label="Campaigns")\n\nplt.title("E-Commerce ROI: Ad Spend vs Revenue Generated ($K)")\nplt.xlabel("Marketing Budget ($K)")\nplt.ylabel("Revenue Generated ($K)")\nplt.grid(True, alpha=0.3)\nplt.legend()\nplt.show()`,
  },
];
