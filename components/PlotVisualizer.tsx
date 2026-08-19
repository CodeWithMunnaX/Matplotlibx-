"use client";

import React, { useState, useRef } from "react";
import {
  FigureState,
  AxesState,
  PlotElement,
  LinePlotElement,
  ScatterPlotElement,
  BarPlotElement,
  HistPlotElement,
  PiePlotElement,
  BoxPlotElement,
  ImshowElement,
  ContourElement,
  Plot3DElement,
  ErrorBarElement,
  FillBetweenElement,
  StackplotElement,
  TextElement,
  AnnotationElement,
  AxLineElement,
  interpolateColormap,
} from "@/lib/matplotlibSimulator";
import {
  Download,
  Maximize2,
  Grid as GridIcon,
  Sparkles,
  Eye,
  Info,
  ZoomIn,
  RefreshCw,
} from "lucide-react";

interface PlotVisualizerProps {
  figure: FigureState;
}

export default function PlotVisualizer({ figure }: PlotVisualizerProps) {
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; px: number; py: number } | null>(null);
  const [showGridOverride, setShowGridOverride] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nrows = figure.nrows || 1;
  const ncols = figure.ncols || 1;

  const handleDownloadSVG = () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector("svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `matplotlib_plot_${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector("svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const svgSize = svgEl.getBoundingClientRect();
    canvas.width = svgSize.width * 2; // 2x resolution
    canvas.height = svgSize.height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    img.onload = () => {
      ctx.fillStyle = "#0B1021";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `matplotlib_plot_${Date.now()}.png`;
      link.click();
    };
  };

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card overflow-hidden flex flex-col">
      {/* Visualizer Top Bar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-[#26304A] bg-slate-50/50 dark:bg-[#0B1021]/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00D9C0] animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-[#F5F7FA]">
            Interactive Matplotlib Canvas ({figure.figsize[0]}x{figure.figsize[1]} in • {nrows}x{ncols} Subplots)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hoverCoord && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-200 dark:border-[#00D9C0]/30 text-[11px] font-mono text-teal-700 dark:text-[#00D9C0]">
              <span>X: {hoverCoord.x.toFixed(2)}</span>
              <span>Y: {hoverCoord.y.toFixed(2)}</span>
            </div>
          )}

          <button
            onClick={() => setShowGridOverride((prev) => (prev === null ? false : !prev))}
            title="Toggle Grid Guidelines"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#26304A] hover:bg-slate-200 dark:hover:bg-[#16203B] text-slate-600 dark:text-[#8B93A7] transition-all text-xs flex items-center gap-1"
          >
            <GridIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Grid</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            title="Download Vector SVG"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#26304A] hover:bg-slate-200 dark:hover:bg-[#16203B] text-slate-600 dark:text-[#8B93A7] transition-all text-xs flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">SVG</span>
          </button>

          <button
            onClick={handleDownloadPNG}
            title="Export High-Res PNG (300 DPI)"
            className="px-3 py-1 rounded-lg bg-teal-600 dark:bg-[#00D9C0] hover:bg-teal-700 dark:hover:bg-[#00D9C0]/90 text-white dark:text-[#0B1021] font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Display Grid */}
      <div
        ref={containerRef}
        className="p-4 sm:p-6 bg-slate-50 dark:bg-[#0B1021] flex-1 flex flex-col items-center justify-center min-h-[380px] overflow-auto relative"
      >
        {figure.suptitle && (
          <div className="w-full text-center mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-[#F5F7FA] font-sans">
              {figure.suptitle}
            </h2>
          </div>
        )}

        <div
          className="w-full grid gap-4 items-center justify-center"
          style={{
            gridTemplateColumns: `repeat(${ncols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${nrows}, minmax(0, 1fr))`,
            maxWidth: "100%",
          }}
        >
          {figure.axes.map((ax, idx) => (
            <SingleAxesRenderer
              key={ax.id || idx}
              axes={ax}
              gridOverride={showGridOverride}
              onHover={setHoverCoord}
              onLeave={() => setHoverCoord(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// SINGLE AXES RENDERER COMPONENT
// ----------------------------------------------------
interface SingleAxesProps {
  axes: AxesState;
  gridOverride: boolean | null;
  onHover: (coord: { x: number; y: number; px: number; py: number }) => void;
  onLeave: () => void;
}

function SingleAxesRenderer({ axes, gridOverride, onHover, onLeave }: SingleAxesProps) {
  // Check if this is a Pie Chart
  const pieElement = axes.elements.find((e) => e.type === "pie") as PiePlotElement | undefined;
  if (pieElement) {
    return <PieChartRenderer element={pieElement} title={axes.title} />;
  }

  // Check if this is a 3D plot
  const is3D = axes.is3D || axes.elements.some((e) => e.type.startsWith("3d"));
  if (is3D) {
    return <Plot3DRenderer axes={axes} />;
  }

  // SVG Dimension Metrics
  const W = 620;
  const H = 380;
  const padL = 60;
  const padR = axes.colorbar ? 75 : 30;
  const padT = axes.title ? 45 : 25;
  const padB = axes.xlabel ? 50 : 35;

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // Calculate Data Bounds across elements
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  let hasData = false;

  for (const el of axes.elements) {
    if (el.type === "line" || el.type === "scatter" || el.type === "errorbar" || el.type === "fill_between") {
      const xs = (el as any).x || [];
      const ys = (el as any).y || (el as any).y1 || [];
      for (const val of xs) {
        if (typeof val === "number" && !isNaN(val)) {
          minX = Math.min(minX, val);
          maxX = Math.max(maxX, val);
          hasData = true;
        }
      }
      for (const val of ys) {
        if (typeof val === "number" && !isNaN(val)) {
          minY = Math.min(minY, val);
          maxY = Math.max(maxY, val);
          hasData = true;
        }
      }
    } else if (el.type === "bar" || el.type === "barh") {
      const vals = el.values || [];
      const cats = el.categories || [];
      hasData = true;
      if (el.type === "bar") {
        minX = 0;
        maxX = Math.max(1, cats.length);
        minY = Math.min(0, ...vals);
        maxY = Math.max(1, ...vals);
      } else {
        minX = Math.min(0, ...vals);
        maxX = Math.max(1, ...vals);
        minY = 0;
        maxY = Math.max(1, cats.length);
      }
    } else if (el.type === "hist") {
      hasData = true;
      const edges = el.binEdges || [0, 10];
      const counts = el.binCounts || [0];
      minX = Math.min(...edges);
      maxX = Math.max(...edges);
      minY = 0;
      maxY = Math.max(...counts) * 1.15;
    } else if (el.type === "boxplot") {
      hasData = true;
      minX = 0;
      maxX = el.datasets.length + 1;
      const allVals = el.datasets.flatMap((d) => [d.min, d.max, ...d.outliers]);
      minY = Math.min(...allVals);
      maxY = Math.max(...allVals);
    } else if (el.type === "imshow" || el.type === "contour" || el.type === "contourf") {
      hasData = true;
      const matrix = (el as any).matrix || (el as any).Z || [[1, 2], [3, 4]];
      minX = 0;
      maxX = matrix[0]?.length || 2;
      minY = 0;
      maxY = matrix.length || 2;
    }
  }

  if (!hasData) {
    minX = 0;
    maxX = 10;
    minY = 0;
    maxY = 10;
  }

  // Override bounds with explicit xlim / ylim if set
  if (axes.xlim) {
    minX = axes.xlim[0];
    maxX = axes.xlim[1];
  }
  if (axes.ylim) {
    minY = axes.ylim[0];
    maxY = axes.ylim[1];
  }

  // Pad slightly if min == max
  if (minX === maxX) {
    minX -= 1;
    maxX += 1;
  }
  if (minY === maxY) {
    minY -= 1;
    maxY += 1;
  }

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;

  // Coordinate Conversion Functions
  const toPx = (x: number) => padL + ((x - minX) / spanX) * plotW;
  const toPy = (y: number) => padT + (1 - (y - minY) / spanY) * plotH;

  const toDataX = (px: number) => minX + ((px - padL) / plotW) * spanX;
  const toDataY = (py: number) => minY + (1 - (py - padT) / plotH) * spanY;

  // Ticks Generation
  const numTicksX = 5;
  const numTicksY = 5;

  const xTicks = axes.xticks?.values || Array.from({ length: numTicksX }, (_, i) => minX + (i * spanX) / (numTicksX - 1));
  const yTicks = axes.yticks?.values || Array.from({ length: numTicksY }, (_, i) => minY + (i * spanY) / (numTicksY - 1));

  const showGrid = gridOverride !== null ? gridOverride : (axes.grid ?? true);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;

    if (px >= padL && px <= padL + plotW && py >= padT && py <= padT + plotH) {
      const dataX = toDataX(px);
      const dataY = toDataY(py);
      onHover({ x: dataX, y: dataY, px, py });
    } else {
      onLeave();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 rounded-2xl bg-white dark:bg-[#0F162B] border border-slate-200 dark:border-[#26304A] transition-all">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto max-h-[420px] select-none font-sans"
        onMouseMove={handleMouseMove}
        onMouseLeave={onLeave}
      >
        {/* Background Canvas Box */}
        <rect
          x={padL}
          y={padT}
          width={plotW}
          height={plotH}
          fill="transparent"
          className="transition-colors"
        />

        {/* 1. GRID LINES */}
        {showGrid && (
          <g className="opacity-40">
            {xTicks.map((val, i) => {
              const px = toPx(val);
              if (px < padL - 1 || px > padL + plotW + 1) return null;
              return (
                <line
                  key={`gx-${i}`}
                  x1={px}
                  y1={padT}
                  x2={px}
                  y2={padT + plotH}
                  stroke="#64748B"
                  strokeDasharray="4,4"
                  strokeWidth="1"
                />
              );
            })}
            {yTicks.map((val, i) => {
              const py = toPy(val);
              if (py < padT - 1 || py > padT + plotH + 1) return null;
              return (
                <line
                  key={`gy-${i}`}
                  x1={padL}
                  y1={py}
                  x2={padL + plotW}
                  y2={py}
                  stroke="#64748B"
                  strokeDasharray="4,4"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}

        {/* 2. PLOT ELEMENTS (Lines, Bars, Scatter, Imshow, etc.) */}
        <g clipPath={`url(#clip-${axes.id})`}>
          <defs>
            <clipPath id={`clip-${axes.id}`}>
              <rect x={padL} y={padT} width={plotW} height={plotH} />
            </clipPath>
          </defs>

          {axes.elements.map((el, elIdx) => {
            // A. LINE PLOT
            if (el.type === "line") {
              const xs = Array.isArray(el.x) ? el.x : [];
              const ys = Array.isArray(el.y) ? el.y : [];
              if (xs.length === 0) return null;

              const pathD = xs
                .map((xVal, i) => {
                  const px = toPx(xVal);
                  const py = toPy(ys[i] ?? 0);
                  return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
                })
                .join(" ");

              return (
                <g key={`line-${elIdx}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={el.color || "#6366F1"}
                    strokeWidth={el.linewidth || 2.5}
                    strokeDasharray={
                      el.linestyle === "--"
                        ? "6,5"
                        : el.linestyle === ":"
                        ? "2,4"
                        : el.linestyle === "-."
                        ? "7,3,2,3"
                        : undefined
                    }
                    opacity={el.alpha ?? 1.0}
                    className="transition-all duration-300"
                  />
                  {/* Markers */}
                  {el.marker &&
                    xs.map((xVal, i) => {
                      const px = toPx(xVal);
                      const py = toPy(ys[i] ?? 0);
                      const size = el.markersize || 6;
                      return (
                        <circle
                          key={`m-${i}`}
                          cx={px}
                          cy={py}
                          r={size / 2}
                          fill={el.color || "#6366F1"}
                          stroke="#0B1021"
                          strokeWidth="1.5"
                          opacity={el.alpha ?? 1.0}
                        />
                      );
                    })}
                </g>
              );
            }

            // B. SCATTER PLOT
            if (el.type === "scatter") {
              const xs = Array.isArray(el.x) ? el.x : [];
              const ys = Array.isArray(el.y) ? el.y : [];
              return (
                <g key={`scatter-${elIdx}`}>
                  {xs.map((xVal, i) => {
                    const px = toPx(xVal);
                    const py = toPy(ys[i] ?? 0);
                    const size = Array.isArray(el.s) ? el.s[i] || 50 : el.s || 50;
                    const r = Math.sqrt(size) * 0.8;
                    const colorVal = Array.isArray(el.c) ? el.c[i] : el.c;
                    const fill =
                      typeof colorVal === "number"
                        ? interpolateColormap(el.cmap || "viridis", (colorVal - minY) / spanY)
                        : colorVal || "#6366F1";

                    return (
                      <circle
                        key={`sc-${i}`}
                        cx={px}
                        cy={py}
                        r={Math.max(2, r)}
                        fill={fill}
                        stroke={el.edgecolors || "#0B1021"}
                        strokeWidth="1"
                        opacity={el.alpha ?? 0.85}
                        className="transition-transform hover:scale-125"
                      />
                    );
                  })}
                </g>
              );
            }

            // C. BAR CHART
            if (el.type === "bar") {
              const cats = el.categories;
              const vals = el.values;
              const colWidth = (plotW / cats.length) * (el.width || 0.6);

              return (
                <g key={`bar-${elIdx}`}>
                  {vals.map((v, i) => {
                    const centerPx = padL + ((i + 0.5) / cats.length) * plotW;
                    const x = centerPx - colWidth / 2;
                    const y0 = toPy(el.bottom ? el.bottom[i] || 0 : 0);
                    const y1 = toPy(v + (el.bottom ? el.bottom[i] || 0 : 0));
                    const barY = Math.min(y0, y1);
                    const barH = Math.abs(y0 - y1);
                    const color = Array.isArray(el.color) ? el.color[i] : el.color || "#6366F1";

                    return (
                      <rect
                        key={`b-${i}`}
                        x={x}
                        y={barY}
                        width={colWidth}
                        height={barH}
                        fill={color}
                        stroke={el.edgecolor || "none"}
                        opacity={el.alpha ?? 1.0}
                        rx="3"
                        className="transition-all hover:brightness-110"
                      />
                    );
                  })}
                </g>
              );
            }

            // D. HORIZONTAL BAR (barh)
            if (el.type === "barh") {
              const cats = el.categories;
              const vals = el.values;
              const rowHeight = (plotH / cats.length) * (el.width || 0.6);

              return (
                <g key={`barh-${elIdx}`}>
                  {vals.map((v, i) => {
                    const centerPy = padT + ((i + 0.5) / cats.length) * plotH;
                    const y = centerPy - rowHeight / 2;
                    const x0 = toPx(0);
                    const x1 = toPx(v);
                    const barX = Math.min(x0, x1);
                    const barW = Math.abs(x1 - x0);
                    const color = Array.isArray(el.color) ? el.color[i] : el.color || "#00D9C0";

                    return (
                      <rect
                        key={`bh-${i}`}
                        x={barX}
                        y={y}
                        width={barW}
                        height={rowHeight}
                        fill={color}
                        opacity={el.alpha ?? 1.0}
                        rx="3"
                        className="transition-all hover:brightness-110"
                      />
                    );
                  })}
                </g>
              );
            }

            // E. HISTOGRAM
            if (el.type === "hist") {
              const edges = el.binEdges;
              const counts = el.binCounts;

              return (
                <g key={`hist-${elIdx}`}>
                  {counts.map((count, i) => {
                    const x0 = toPx(edges[i]);
                    const x1 = toPx(edges[i + 1]);
                    const y0 = toPy(0);
                    const y1 = toPy(count);
                    const barW = Math.max(1, x1 - x0);
                    const barH = Math.abs(y0 - y1);

                    return (
                      <rect
                        key={`h-${i}`}
                        x={x0}
                        y={y1}
                        width={barW}
                        height={barH}
                        fill={el.color || "#6366F1"}
                        stroke={el.edgecolor || "#0B1021"}
                        strokeWidth="1"
                        opacity={el.alpha ?? 0.85}
                      />
                    );
                  })}
                </g>
              );
            }

            // F. BOXPLOT
            if (el.type === "boxplot") {
              return (
                <g key={`bp-${elIdx}`}>
                  {el.datasets.map((d, i) => {
                    const cx = padL + ((i + 1) / (el.datasets.length + 1)) * plotW;
                    const boxW = 35;
                    const pyMin = toPy(d.min);
                    const pyQ1 = toPy(d.q1);
                    const pyMed = toPy(d.median);
                    const pyQ3 = toPy(d.q3);
                    const pyMax = toPy(d.max);

                    return (
                      <g key={`box-${i}`}>
                        {/* Whiskers */}
                        <line x1={cx} y1={pyMin} x2={cx} y2={pyQ1} stroke="#6366F1" strokeWidth="1.5" />
                        <line x1={cx} y1={pyQ3} x2={cx} y2={pyMax} stroke="#6366F1" strokeWidth="1.5" />
                        <line x1={cx - 10} y1={pyMin} x2={cx + 10} y2={pyMin} stroke="#6366F1" strokeWidth="1.5" />
                        <line x1={cx - 10} y1={pyMax} x2={cx + 10} y2={pyMax} stroke="#6366F1" strokeWidth="1.5" />

                        {/* IQR Box */}
                        <rect
                          x={cx - boxW / 2}
                          y={pyQ3}
                          width={boxW}
                          height={Math.abs(pyQ1 - pyQ3)}
                          fill={el.patchArtist ? "#6366F1" : "transparent"}
                          fillOpacity="0.3"
                          stroke="#6366F1"
                          strokeWidth="2"
                          rx="2"
                        />

                        {/* Median Line */}
                        <line
                          x1={cx - boxW / 2}
                          y1={pyMed}
                          x2={cx + boxW / 2}
                          y2={pyMed}
                          stroke="#FFB86B"
                          strokeWidth="2.5"
                        />

                        {/* Outlier dots */}
                        {d.outliers.map((outVal, oIdx) => (
                          <circle
                            key={`out-${oIdx}`}
                            cx={cx}
                            cy={toPy(outVal)}
                            r="3"
                            fill="#FF5C7A"
                            stroke="#0B1021"
                          />
                        ))}
                      </g>
                    );
                  })}
                </g>
              );
            }

            // G. IMSHOW (Matrix Heatmap)
            if (el.type === "imshow") {
              const matrix = el.matrix;
              const rows = matrix.length;
              const cols = matrix[0]?.length || 1;
              const cellW = plotW / cols;
              const cellH = plotH / rows;

              let mMin = el.vmin !== undefined ? el.vmin : Infinity;
              let mMax = el.vmax !== undefined ? el.vmax : -Infinity;
              if (el.vmin === undefined || el.vmax === undefined) {
                for (const row of matrix) {
                  for (const v of row) {
                    mMin = Math.min(mMin, v);
                    mMax = Math.max(mMax, v);
                  }
                }
              }
              const mSpan = mMax - mMin || 1;

              return (
                <g key={`imshow-${elIdx}`}>
                  {matrix.map((row, r) =>
                    row.map((val, c) => {
                      const t = (val - mMin) / mSpan;
                      const fill = interpolateColormap(el.cmap || "viridis", t);
                      const x = padL + c * cellW;
                      const y = padT + r * cellH;

                      return (
                        <g key={`cell-${r}-${c}`}>
                          <rect
                            x={x}
                            y={y}
                            width={cellW}
                            height={cellH}
                            fill={fill}
                            stroke="#0B1021"
                            strokeWidth="0.5"
                          />
                          {rows <= 6 && cols <= 6 && (
                            <text
                              x={x + cellW / 2}
                              y={y + cellH / 2 + 4}
                              textAnchor="middle"
                              fill="#FFFFFF"
                              fontSize="10"
                              fontWeight="bold"
                              className="pointer-events-none drop-shadow"
                            >
                              {val.toFixed(1)}
                            </text>
                          )}
                        </g>
                      );
                    })
                  )}
                </g>
              );
            }

            // H. FILL BETWEEN
            if (el.type === "fill_between") {
              const xs = el.x;
              const y1s = el.y1;
              const y2s = el.y2 || xs.map(() => 0);

              let poly = "";
              for (let i = 0; i < xs.length; i++) {
                poly += `${i === 0 ? "M" : "L"} ${toPx(xs[i])} ${toPy(y1s[i])} `;
              }
              for (let i = xs.length - 1; i >= 0; i--) {
                poly += `L ${toPx(xs[i])} ${toPy(y2s[i])} `;
              }
              poly += "Z";

              return (
                <path
                  key={`fill-${elIdx}`}
                  d={poly}
                  fill={el.color || "#6366F1"}
                  opacity={el.alpha ?? 0.3}
                />
              );
            }

            // I. AXLINE (Horizontal / Vertical Guide)
            if (el.type === "axline") {
              if (el.orientation === "horizontal") {
                const py = toPy(el.val);
                return (
                  <line
                    key={`axl-${elIdx}`}
                    x1={padL}
                    y1={py}
                    x2={padL + plotW}
                    y2={py}
                    stroke={el.color || "#FF5C7A"}
                    strokeWidth={el.linewidth || 1.5}
                    strokeDasharray="5,4"
                  />
                );
              } else {
                const px = toPx(el.val);
                return (
                  <line
                    key={`axl-${elIdx}`}
                    x1={px}
                    y1={padT}
                    x2={px}
                    y2={padT + plotH}
                    stroke={el.color || "#FF5C7A"}
                    strokeWidth={el.linewidth || 1.5}
                    strokeDasharray="5,4"
                  />
                );
              }
            }

            // J. ANNOTATION
            if (el.type === "annotation") {
              const px = toPx(el.xy[0]);
              const py = toPy(el.xy[1]);
              const textPx = toPx(el.xytext[0]);
              const textPy = toPy(el.xytext[1]);

              return (
                <g key={`ann-${elIdx}`}>
                  {/* Arrow line */}
                  <line
                    x1={textPx}
                    y1={textPy}
                    x2={px}
                    y2={py}
                    stroke={el.color || "#00D9C0"}
                    strokeWidth="1.8"
                    markerEnd={`url(#arrow-${axes.id})`}
                  />
                  <defs>
                    <marker
                      id={`arrow-${axes.id}`}
                      markerWidth="8"
                      markerHeight="8"
                      refX="6"
                      refY="4"
                      orient="auto"
                    >
                      <path d="M 0 0 L 8 4 L 0 8 Z" fill={el.color || "#00D9C0"} />
                    </marker>
                  </defs>
                  <text
                    x={textPx}
                    y={textPy - 6}
                    fill={el.color || "#00D9C0"}
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {el.text}
                  </text>
                </g>
              );
            }

            return null;
          })}
        </g>

        {/* 3. SPINES (Borders) */}
        <g stroke="#475569" strokeWidth="1.5">
          {/* Bottom */}
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} />
          {/* Left */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} />
          {/* Top */}
          <line x1={padL} y1={padT} x2={padL + plotW} y2={padT} strokeOpacity="0.4" />
          {/* Right */}
          <line x1={padL + plotW} y1={padT} x2={padL + plotW} y2={padT + plotH} strokeOpacity="0.4" />
        </g>

        {/* 4. TICKS & TICK LABELS */}
        <g fontSize="10" fill="#94A3B8" className="font-mono">
          {/* X Ticks */}
          {axes.xticks?.labels
            ? axes.xticks.labels.map((lbl, i) => {
                const px = padL + ((i + 0.5) / (axes.xticks?.labels?.length || 1)) * plotW;
                return (
                  <text key={`xtl-${i}`} x={px} y={padT + plotH + 16} textAnchor="middle">
                    {lbl}
                  </text>
                );
              })
            : xTicks.map((val, i) => {
                const px = toPx(val);
                if (px < padL - 1 || px > padL + plotW + 1) return null;
                return (
                  <g key={`xt-${i}`}>
                    <line x1={px} y1={padT + plotH} x2={px} y2={padT + plotH + 4} stroke="#94A3B8" strokeWidth="1" />
                    <text x={px} y={padT + plotH + 16} textAnchor="middle">
                      {Math.abs(val) >= 1000 ? `${(val / 1000).toFixed(0)}K` : val.toFixed(Number.isInteger(val) ? 0 : 1)}
                    </text>
                  </g>
                );
              })}

          {/* Y Ticks */}
          {axes.yticks?.labels
            ? axes.yticks.labels.map((lbl, i) => {
                const py = padT + ((i + 0.5) / (axes.yticks?.labels?.length || 1)) * plotH;
                return (
                  <text key={`ytl-${i}`} x={padL - 8} y={py + 3} textAnchor="end">
                    {lbl}
                  </text>
                );
              })
            : yTicks.map((val, i) => {
                const py = toPy(val);
                if (py < padT - 1 || py > padT + plotH + 1) return null;
                return (
                  <g key={`yt-${i}`}>
                    <line x1={padL - 4} y1={py} x2={padL} y2={py} stroke="#94A3B8" strokeWidth="1" />
                    <text x={padL - 8} y={py + 3} textAnchor="end">
                      {Math.abs(val) >= 1000 ? `${(val / 1000).toFixed(0)}K` : val.toFixed(Number.isInteger(val) ? 0 : 1)}
                    </text>
                  </g>
                );
              })}
        </g>

        {/* 5. AXES TITLE & AXIS LABELS */}
        {axes.title && (
          <text
            x={padL + plotW / 2}
            y={padT - 12}
            textAnchor="middle"
            fill="#F5F7FA"
            fontSize="13"
            fontWeight="bold"
            className="dark:fill-[#F5F7FA] fill-slate-900"
          >
            {axes.title}
          </text>
        )}

        {axes.xlabel && (
          <text
            x={padL + plotW / 2}
            y={H - 8}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="11"
            fontWeight="600"
          >
            {axes.xlabel}
          </text>
        )}

        {axes.ylabel && (
          <text
            x={16}
            y={padT + plotH / 2}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="11"
            fontWeight="600"
            transform={`rotate(-90 16 ${padT + plotH / 2})`}
          >
            {axes.ylabel}
          </text>
        )}

        {/* 6. LEGEND */}
        {axes.legend && (
          <g transform={`translate(${padL + plotW - 120}, ${padT + 12})`}>
            <rect
              width="110"
              height={Math.max(30, axes.elements.filter((e) => (e as any).label).length * 18 + 12)}
              fill="#0B1021"
              fillOpacity="0.85"
              stroke="#26304A"
              strokeWidth="1"
              rx="6"
            />
            {axes.elements
              .filter((e) => (e as any).label)
              .map((el, lIdx) => {
                const label = (el as any).label;
                const col = (el as any).color || "#6366F1";
                return (
                  <g key={`leg-${lIdx}`} transform={`translate(10, ${lIdx * 18 + 16})`}>
                    <line x1="0" y1="0" x2="16" y2="0" stroke={col} strokeWidth="2.5" />
                    <circle cx="8" cy="0" r="3" fill={col} />
                    <text x="22" y="3" fill="#F5F7FA" fontSize="9" fontWeight="bold">
                      {label}
                    </text>
                  </g>
                );
              })}
          </g>
        )}

        {/* 7. COLORBAR */}
        {axes.colorbar && (
          <g transform={`translate(${padL + plotW + 16}, ${padT})`}>
            <defs>
              <linearGradient id={`cb-grad-${axes.id}`} x1="0" y1="1" x2="0" y2="0">
                {Array.from({ length: 10 }, (_, i) => (
                  <stop
                    key={i}
                    offset={`${i * 11}%`}
                    stopColor={interpolateColormap(axes.colorbar?.cmap || "viridis", i / 9)}
                  />
                ))}
              </linearGradient>
            </defs>
            <rect width="14" height={plotH} fill={`url(#cb-grad-${axes.id})`} rx="2" stroke="#26304A" />
            <text x="20" y="10" fill="#94A3B8" fontSize="9" fontWeight="bold">Max</text>
            <text x="20" y={plotH} fill="#94A3B8" fontSize="9" fontWeight="bold">Min</text>
            {axes.colorbar.label && (
              <text
                x="32"
                y={plotH / 2}
                fill="#94A3B8"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(90 32 ${plotH / 2})`}
              >
                {axes.colorbar.label}
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}

// ----------------------------------------------------
// PIE CHART RENDERER
// ----------------------------------------------------
function PieChartRenderer({ element, title }: { element: PiePlotElement; title?: string }) {
  const W = 400;
  const H = 340;
  const cx = W / 2;
  const cy = H / 2 + (title ? 10 : 0);
  const r = 110;

  const total = element.values.reduce((a, b) => a + b, 0) || 1;
  const defaultColors = ["#6366F1", "#00D9C0", "#FFB86B", "#FF5C7A", "#38EF7D", "#3B82F6"];

  let currentAngle = (element.startangle || 0) * (Math.PI / 180);

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#0F162B] border border-slate-200 dark:border-[#26304A]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[400px] h-auto">
        {title && (
          <text
            x={cx}
            y={24}
            textAnchor="middle"
            fill="#F5F7FA"
            fontSize="14"
            fontWeight="bold"
            className="dark:fill-[#F5F7FA] fill-slate-900"
          >
            {title}
          </text>
        )}

        {element.values.map((v, i) => {
          const sliceAngle = (v / total) * 2 * Math.PI;
          const endAngle = currentAngle + sliceAngle;
          const midAngle = currentAngle + sliceAngle / 2;

          const explodeOffset = element.explode ? element.explode[i] || 0 : 0;
          const explodeX = Math.cos(midAngle) * explodeOffset * 40;
          const explodeY = Math.sin(midAngle) * explodeOffset * 40;

          const x1 = cx + explodeX + Math.cos(currentAngle) * r;
          const y1 = cy + explodeY + Math.sin(currentAngle) * r;
          const x2 = cx + explodeX + Math.cos(endAngle) * r;
          const y2 = cy + explodeY + Math.sin(endAngle) * r;

          const largeArc = sliceAngle > Math.PI ? 1 : 0;
          const pathD = `M ${cx + explodeX} ${cy + explodeY} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

          const color = element.colors ? element.colors[i] : defaultColors[i % defaultColors.length];
          const pctText = `${Math.round((v / total) * 100)}%`;
          const labelText = element.labels ? element.labels[i] : "";

          // Label placement
          const textR = r * 0.65;
          const tx = cx + explodeX + Math.cos(midAngle) * textR;
          const ty = cy + explodeY + Math.sin(midAngle) * textR;

          currentAngle = endAngle;

          return (
            <g key={`pie-${i}`} className="transition-transform hover:scale-105">
              <path d={pathD} fill={color} stroke="#0B1021" strokeWidth="2" />
              <text
                x={tx}
                y={ty + 4}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="bold"
                className="drop-shadow"
              >
                {pctText}
              </text>
              {labelText && (
                <text
                  x={cx + explodeX + Math.cos(midAngle) * (r + 18)}
                  y={cy + explodeY + Math.sin(midAngle) * (r + 18) + 4}
                  textAnchor={Math.cos(midAngle) >= 0 ? "start" : "end"}
                  fill="#94A3B8"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {labelText}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ----------------------------------------------------
// 3D PLOT ISOMETRIC RENDERER
// ----------------------------------------------------
function Plot3DRenderer({ axes }: { axes: AxesState }) {
  const [rotX, setRotX] = useState(30);
  const [rotZ, setRotZ] = useState(45);

  const el3D = axes.elements.find((e) => e.type.startsWith("3d")) as Plot3DElement | undefined;
  const cmap = el3D?.cmap || "viridis";

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#0F162B] border border-slate-200 dark:border-[#26304A] space-y-3">
      <div className="flex items-center justify-between w-full px-2">
        <span className="text-xs font-mono font-bold text-teal-600 dark:text-[#00D9C0] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          3D Projected Viewport
        </span>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
          <span>Elevation: {rotX}°</span>
          <span>Azimuth: {rotZ}°</span>
        </div>
      </div>

      <div
        className="w-full h-[280px] sm:h-[320px] flex items-center justify-center relative overflow-hidden"
        style={{ perspective: "800px" }}
      >
        <div
          className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] relative transition-transform duration-100 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
          }}
        >
          {/* Wireframe / Surface Grid Mesh */}
          {Array.from({ length: 8 }).map((_, r) => (
            <div key={`mesh-r-${r}`} className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {Array.from({ length: 8 }).map((_, c) => {
                const tX = (r - 3.5) / 3.5;
                const tY = (c - 3.5) / 3.5;
                const zVal = Math.sin(Math.sqrt(tX * tX + tY * tY) * Math.PI);
                const heightPx = zVal * 40;
                const fill = interpolateColormap(cmap, (zVal + 1) / 2);

                return (
                  <div
                    key={`voxel-${r}-${c}`}
                    className="absolute w-6 h-6 rounded-sm border border-teal-400/40 shadow-sm"
                    style={{
                      left: `${c * 28}px`,
                      top: `${r * 28}px`,
                      transform: `translateZ(${heightPx}px)`,
                      backgroundColor: fill,
                      opacity: 0.85,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Rotation Sliders */}
      <div className="grid grid-cols-2 gap-4 w-full px-4 pt-2 border-t border-slate-200 dark:border-[#26304A] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Elev:</span>
          <input
            type="range"
            min="0"
            max="90"
            value={rotX}
            onChange={(e) => setRotX(Number(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Azim:</span>
          <input
            type="range"
            min="0"
            max="360"
            value={rotZ}
            onChange={(e) => setRotZ(Number(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
