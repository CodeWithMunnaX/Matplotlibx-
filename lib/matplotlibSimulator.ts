// lib/matplotlibSimulator.ts
// Pure TypeScript In-Memory Matplotlib / Pyplot Simulation & Plot Engine
// Safe, zero-backend, rich SVG/Canvas geometry and color calculations

export type ChartType =
  | "line"
  | "scatter"
  | "bar"
  | "barh"
  | "hist"
  | "pie"
  | "boxplot"
  | "violin"
  | "imshow"
  | "contour"
  | "contourf"
  | "3d_surface"
  | "3d_wireframe"
  | "3d_scatter"
  | "3d_bar"
  | "errorbar"
  | "fill_between"
  | "stackplot"
  | "quiver"
  | "streamplot"
  | "polar"
  | "text"
  | "annotation"
  | "axline"
  | "axspan";

export interface LinePlotElement {
  type: "line";
  x: number[];
  y: number[];
  color?: string;
  linestyle?: string; // "-", "--", "-.", ":", "none"
  linewidth?: number;
  marker?: string; // "o", "s", "^", "D", "v", "*", ".", "x", "+"
  markersize?: number;
  markeredgecolor?: string;
  label?: string;
  alpha?: number;
  zorder?: number;
}

export interface ScatterPlotElement {
  type: "scatter";
  x: number[];
  y: number[];
  s?: number | number[]; // size
  c?: string | number[] | string[]; // color or value array
  cmap?: string;
  marker?: string;
  alpha?: number;
  edgecolors?: string;
  label?: string;
}

export interface BarPlotElement {
  type: "bar" | "barh";
  categories: (string | number)[];
  values: number[];
  width?: number;
  bottom?: number[];
  left?: number[];
  color?: string | string[];
  edgecolor?: string;
  label?: string;
  alpha?: number;
}

export interface HistPlotElement {
  type: "hist";
  data: number[];
  bins: number;
  binCounts: number[];
  binEdges: number[];
  color?: string;
  edgecolor?: string;
  density?: boolean;
  cumulative?: boolean;
  rwidth?: number;
  label?: string;
  alpha?: number;
}

export interface PiePlotElement {
  type: "pie";
  values: number[];
  labels?: string[];
  colors?: string[];
  explode?: number[];
  autopct?: string;
  startangle?: number;
  shadow?: boolean;
  donutHole?: number; // 0 = standard, 0.5 = donut
}

export interface BoxPlotDataset {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}

export interface BoxPlotElement {
  type: "boxplot";
  datasets: BoxPlotDataset[];
  vert?: boolean;
  patchArtist?: boolean;
  notch?: boolean;
  color?: string;
}

export interface ViolinPlotElement {
  type: "violin";
  datasets: { label: string; min: number; max: number; mean: number; median: number; data: number[] }[];
  showmeans?: boolean;
  showmedians?: boolean;
  color?: string;
}

export interface ImshowElement {
  type: "imshow";
  matrix: number[][];
  cmap: string;
  interpolation?: string;
  vmin?: number;
  vmax?: number;
  extent?: [number, number, number, number];
}

export interface ContourElement {
  type: "contour" | "contourf";
  X: number[][];
  Y: number[][];
  Z: number[][];
  levels: number;
  cmap: string;
}

export interface Plot3DElement {
  type: "3d_surface" | "3d_wireframe" | "3d_scatter" | "3d_bar";
  X?: number[][];
  Y?: number[][];
  Z?: number[][];
  points3D?: { x: number; y: number; z: number; c?: string; s?: number }[];
  bars3D?: { x: number; y: number; z: number; dx: number; dy: number; dz: number; color?: string }[];
  cmap?: string;
}

export interface ErrorBarElement {
  type: "errorbar";
  x: number[];
  y: number[];
  yerr?: number[];
  xerr?: number[];
  fmt?: string;
  color?: string;
  ecolor?: string;
  capsize?: number;
  label?: string;
}

export interface FillBetweenElement {
  type: "fill_between";
  x: number[];
  y1: number[];
  y2?: number[];
  color?: string;
  alpha?: number;
  label?: string;
}

export interface StackplotElement {
  type: "stackplot";
  x: number[];
  ySeries: number[][];
  labels?: string[];
  colors?: string[];
  alpha?: number;
}

export interface QuiverElement {
  type: "quiver";
  X: number[][];
  Y: number[][];
  U: number[][];
  V: number[][];
  color?: string;
}

export interface TextElement {
  type: "text";
  x: number;
  y: number;
  text: string;
  fontsize?: number;
  color?: string;
  fontweight?: string;
  bbox?: { boxstyle?: string; facecolor?: string; alpha?: number; edgecolor?: string };
}

export interface AnnotationElement {
  type: "annotation";
  text: string;
  xy: [number, number];
  xytext: [number, number];
  fontsize?: number;
  color?: string;
  arrowprops?: { facecolor?: string; edgecolor?: string; arrowstyle?: string; lw?: number };
}

export interface AxLineElement {
  type: "axline";
  orientation: "horizontal" | "vertical";
  val: number;
  color?: string;
  linestyle?: string;
  linewidth?: number;
  alpha?: number;
}

export interface AxSpanElement {
  type: "axspan";
  orientation: "horizontal" | "vertical";
  min: number;
  max: number;
  color?: string;
  alpha?: number;
}

export type PlotElement =
  | LinePlotElement
  | ScatterPlotElement
  | BarPlotElement
  | HistPlotElement
  | PiePlotElement
  | BoxPlotElement
  | ViolinPlotElement
  | ImshowElement
  | ContourElement
  | Plot3DElement
  | ErrorBarElement
  | FillBetweenElement
  | StackplotElement
  | QuiverElement
  | TextElement
  | AnnotationElement
  | AxLineElement
  | AxSpanElement;

export interface AxesState {
  id: string;
  row: number;
  col: number;
  rowspan?: number;
  colspan?: number;
  title?: string;
  titleFontSize?: number;
  titleColor?: string;
  xlabel?: string;
  ylabel?: string;
  zlabel?: string;
  xlim?: [number, number];
  ylim?: [number, number];
  zlim?: [number, number];
  xscale?: "linear" | "log";
  yscale?: "linear" | "log";
  grid?: boolean;
  gridColor?: string;
  gridStyle?: string;
  gridAlpha?: number;
  legend?: boolean;
  legendLoc?: string;
  legendNcol?: number;
  legendFrame?: boolean;
  spines?: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
    color?: string;
  };
  xticks?: { values: number[]; labels?: string[] };
  yticks?: { values: number[]; labels?: string[] };
  colorbar?: { label?: string; cmap: string; min?: number; max?: number };
  isPolar?: boolean;
  is3D?: boolean;
  hasTwinX?: boolean;
  tickColor?: string;
  elevation?: number; // 3D camera elevation
  azimuth?: number; // 3D camera azimuth
  elements: PlotElement[];
}

export interface FigureState {
  figsize: [number, number];
  dpi: number;
  facecolor: string;
  suptitle?: string;
  suptitleFontSize?: number;
  axes: AxesState[];
  nrows: number;
  ncols: number;
  layout: "normal" | "tight" | "constrained";
  style: string;
}

// ----------------------------------------------------
// COLORMAPS DICTIONARY (RGB Gradient Stops)
// ----------------------------------------------------
export const COLORMAPS: Record<string, [number, number, number][]> = {
  viridis: [
    [68, 1, 84],
    [72, 40, 120],
    [62, 74, 137],
    [49, 104, 142],
    [38, 130, 142],
    [31, 158, 137],
    [53, 183, 121],
    [109, 205, 89],
    [180, 222, 44],
    [253, 231, 37],
  ],
  plasma: [
    [13, 8, 135],
    [75, 3, 161],
    [126, 3, 168],
    [168, 34, 150],
    [203, 70, 121],
    [229, 107, 93],
    [248, 149, 64],
    [253, 195, 40],
    [240, 249, 33],
  ],
  inferno: [
    [0, 0, 4],
    [40, 11, 84],
    [101, 21, 110],
    [159, 42, 99],
    [212, 72, 66],
    [245, 125, 21],
    [250, 193, 39],
    [252, 255, 164],
  ],
  magma: [
    [0, 0, 4],
    [34, 17, 79],
    [81, 18, 124],
    [130, 37, 129],
    [182, 54, 121],
    [230, 81, 100],
    [251, 136, 97],
    [254, 195, 139],
    [252, 253, 191],
  ],
  cividis: [
    [0, 32, 76],
    [28, 53, 95],
    [65, 73, 105],
    [100, 94, 112],
    [135, 116, 118],
    [174, 140, 120],
    [216, 168, 114],
    [255, 200, 95],
    [255, 234, 70],
  ],
  coolwarm: [
    [59, 76, 192],
    [104, 138, 238],
    [160, 192, 252],
    [212, 226, 245],
    [242, 217, 207],
    [244, 165, 130],
    [217, 95, 68],
    [180, 4, 38],
  ],
  cool: [
    [0, 255, 255],
    [128, 128, 255],
    [255, 0, 255],
  ],
  spring: [
    [255, 0, 255],
    [255, 128, 128],
    [255, 255, 0],
  ],
  summer: [
    [0, 128, 102],
    [128, 192, 51],
    [255, 255, 0],
  ],
  autumn: [
    [255, 0, 0],
    [255, 128, 0],
    [255, 255, 0],
  ],
  winter: [
    [0, 0, 255],
    [0, 128, 200],
    [0, 255, 128],
  ],
  rainbow: [
    [128, 0, 255],
    [0, 0, 255],
    [0, 255, 255],
    [0, 255, 0],
    [255, 255, 0],
    [255, 0, 0],
  ],
  jet: [
    [0, 0, 128],
    [0, 0, 255],
    [0, 255, 255],
    [255, 255, 0],
    [255, 0, 0],
    [128, 0, 0],
  ],
  Blues: [
    [247, 251, 255],
    [198, 219, 239],
    [107, 174, 214],
    [33, 113, 181],
    [8, 48, 107],
  ],
  Reds: [
    [255, 245, 240],
    [252, 187, 161],
    [251, 106, 74],
    [203, 24, 29],
    [103, 0, 13],
  ],
  Greens: [
    [247, 252, 245],
    [199, 233, 192],
    [116, 196, 118],
    [35, 139, 69],
    [0, 68, 27],
  ],
  Purples: [
    [252, 251, 253],
    [218, 218, 235],
    [158, 154, 200],
    [106, 81, 163],
    [63, 0, 125],
  ],
  Oranges: [
    [255, 245, 235],
    [253, 208, 162],
    [253, 141, 60],
    [217, 72, 1],
    [127, 39, 4],
  ],
  ocean: [
    [0, 0, 0],
    [0, 38, 115],
    [0, 102, 153],
    [0, 179, 134],
    [128, 255, 128],
    [255, 255, 255],
  ],
  terrain: [
    [51, 51, 153],
    [0, 153, 51],
    [204, 204, 102],
    [153, 102, 51],
    [255, 255, 255],
  ],
};

// Interpolate colormap value t in [0, 1] to RGB hex string
export function interpolateColormap(cmapName: string = "viridis", t: number): string {
  const normT = Math.max(0, Math.min(1, isNaN(t) ? 0.5 : t));
  const palette = COLORMAPS[cmapName] || COLORMAPS.viridis;
  const n = palette.length;
  const idx = normT * (n - 1);
  const low = Math.floor(idx);
  const high = Math.min(n - 1, Math.ceil(idx));
  const frac = idx - low;

  const [r1, g1, b1] = palette[low];
  const [r2, g2, b2] = palette[high];

  const r = Math.round(r1 + (r2 - r1) * frac);
  const g = Math.round(g1 + (g2 - g1) * frac);
  const b = Math.round(b1 + (b2 - b1) * frac);

  return `rgb(${r}, ${g}, ${b})`;
}

// ----------------------------------------------------
// DEFAULT PALETTE COLORS
// ----------------------------------------------------
export const DEFAULT_COLORS = [
  "#6366F1", // Indigo
  "#00D9C0", // Neon Teal
  "#FFB86B", // Amber
  "#FF5C7A", // Rose
  "#38EF7D", // Emerald
  "#3B82F6", // Blue
  "#A855F7", // Purple
  "#EC4899", // Pink
  "#F97316", // Orange
  "#06B6D4", // Cyan
];

// ----------------------------------------------------
// HELPER: Create Fresh Figure & Axes
// ----------------------------------------------------
export function createDefaultFigure(): FigureState {
  return {
    figsize: [8, 5],
    dpi: 100,
    facecolor: "transparent",
    axes: [
      {
        id: "ax_0_0",
        row: 0,
        col: 0,
        spines: { top: true, right: true, bottom: true, left: true },
        elements: [],
      },
    ],
    nrows: 1,
    ncols: 1,
    layout: "normal",
    style: "default",
  };
}

// ----------------------------------------------------
// NUMPY MATH UTILS FOR PYTHON SCRIPTS
// ----------------------------------------------------
export const np = {
  pi: Math.PI,
  e: Math.E,

  linspace(start: number, stop: number, num: number = 50): number[] {
    if (num <= 1) return [start];
    const step = (stop - start) / (num - 1);
    const result: number[] = [];
    for (let i = 0; i < num; i++) {
      result.push(start + i * step);
    }
    return result;
  },

  arange(start: number, stop?: number, step: number = 1): number[] {
    if (stop === undefined) {
      stop = start;
      start = 0;
    }
    const result: number[] = [];
    if (step > 0) {
      for (let v = start; v < stop; v += step) {
        result.push(Math.round(v * 10000) / 10000);
      }
    } else if (step < 0) {
      for (let v = start; v > stop; v += step) {
        result.push(Math.round(v * 10000) / 10000);
      }
    }
    return result;
  },

  sin(arr: number[] | number): any {
    if (Array.isArray(arr)) return arr.map((v) => Math.sin(v));
    return Math.sin(arr);
  },

  cos(arr: number[] | number): any {
    if (Array.isArray(arr)) return arr.map((v) => Math.cos(v));
    return Math.cos(arr);
  },

  tan(arr: number[] | number): any {
    if (Array.isArray(arr)) return arr.map((v) => Math.tan(v));
    return Math.tan(arr);
  },

  exp(arr: number[] | number): any {
    if (Array.isArray(arr)) return arr.map((v) => Math.exp(v));
    return Math.exp(arr);
  },

  log(arr: number[] | number): any {
    if (Array.isArray(arr)) return arr.map((v) => Math.log(v));
    return Math.log(arr);
  },

  sqrt(arr: number[] | number): any {
    if (Array.isArray(arr)) return arr.map((v) => Math.sqrt(v));
    return Math.sqrt(arr);
  },

  array(data: any): any {
    return Array.isArray(data) ? data : [data];
  },

  random: {
    seedState: 42,
    seed(s: number) {
      this.seedState = s % 2147483647;
      if (this.seedState <= 0) this.seedState += 2147483646;
    },
    next(): number {
      this.seedState = (this.seedState * 16807) % 2147483647;
      return (this.seedState - 1) / 2147483646;
    },
    rand(n: number = 1): number[] {
      const res: number[] = [];
      for (let i = 0; i < n; i++) res.push(Math.round(this.next() * 1000) / 1000);
      return res;
    },
    randn(n: number = 1): number[] {
      const res: number[] = [];
      for (let i = 0; i < n; i++) {
        let u = 0,
          v = 0;
        while (u === 0) u = this.next();
        while (v === 0) v = this.next();
        const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        res.push(Math.round(num * 1000) / 1000);
      }
      return res;
    },
    randint(low: number, high: number, size: number = 1): number[] {
      const res: number[] = [];
      for (let i = 0; i < size; i++) {
        res.push(Math.floor(this.next() * (high - low)) + low);
      }
      return res;
    },
    normal(loc: number = 0, scale: number = 1, size: number = 100): number[] {
      const raw = this.randn(size);
      return raw.map((v) => Math.round((loc + v * scale) * 1000) / 1000);
    },
  },

  meshgrid(x: number[], y: number[]): [number[][], number[][]] {
    const X: number[][] = [];
    const Y: number[][] = [];
    for (let i = 0; i < y.length; i++) {
      const rowX: number[] = [];
      const rowY: number[] = [];
      for (let j = 0; j < x.length; j++) {
        rowX.push(x[j]);
        rowY.push(y[i]);
      }
      X.push(rowX);
      Y.push(rowY);
    }
    return [X, Y];
  },
};

// ----------------------------------------------------
// STATS HELPER FOR BOXPLOTS & HISTOGRAMS
// ----------------------------------------------------
export function calculateBoxplotStats(label: string, data: number[]): BoxPlotDataset {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  if (n === 0) return { label, min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] };

  const getPercentile = (p: number) => {
    const idx = (n - 1) * p;
    const low = Math.floor(idx);
    const high = Math.ceil(idx);
    return sorted[low] + (sorted[high] - sorted[low]) * (idx - low);
  };

  const q1 = getPercentile(0.25);
  const median = getPercentile(0.5);
  const q3 = getPercentile(0.75);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const inliers = sorted.filter((v) => v >= lowerFence && v <= upperFence);
  const outliers = sorted.filter((v) => v < lowerFence || v > upperFence);

  const min = inliers.length > 0 ? inliers[0] : sorted[0];
  const max = inliers.length > 0 ? inliers[inliers.length - 1] : sorted[n - 1];

  return { label, min, q1, median, q3, max, outliers };
}

export function calculateHistogramBins(
  data: number[],
  numBins: number = 10
): { binCounts: number[]; binEdges: number[] } {
  if (data.length === 0) return { binCounts: [], binEdges: [] };
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const binWidth = span / numBins;

  const binEdges: number[] = [];
  for (let i = 0; i <= numBins; i++) {
    binEdges.push(min + i * binWidth);
  }

  const binCounts = new Array(numBins).fill(0);
  for (const val of data) {
    let binIdx = Math.floor((val - min) / binWidth);
    if (binIdx >= numBins) binIdx = numBins - 1;
    if (binIdx < 0) binIdx = 0;
    binCounts[binIdx]++;
  }

  return { binCounts, binEdges };
}
