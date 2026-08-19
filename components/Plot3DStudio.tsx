"use client";

import React, { useState } from "react";
import { Sparkles, Box, RotateCw, Copy, Check, Sliders } from "lucide-react";
import { interpolateColormap } from "@/lib/matplotlibSimulator";

type Shape3D = "ripple" | "saddle" | "bowl" | "helix";

export default function Plot3DStudio() {
  const [shape, setShape] = useState<Shape3D>("ripple");
  const [elev, setElev] = useState<number>(30);
  const [azim, setAzim] = useState<number>(45);
  const [mode, setMode] = useState<"surface" | "wireframe" | "scatter">("surface");
  const [cmap, setCmap] = useState<string>("viridis");
  const [copied, setCopied] = useState<boolean>(false);

  const gridSize = 10;

  const generatePythonCode = (): string => {
    return `import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-3, 3, 30)\ny = np.linspace(-3, 3, 30)\nX, Y = np.meshgrid(x, y)\n${
      shape === "ripple"
        ? "Z = np.sin(np.sqrt(X**2 + Y**2))"
        : shape === "saddle"
        ? "Z = X**2 - Y**2"
        : "Z = X**2 + Y**2"
    }\n\nfig = plt.figure(figsize=(8, 6))\nax = fig.add_subplot(projection="3d")\n\n# Set Camera View Angle\nax.view_init(elev=${elev}, azim=${azim})\n\n${
      mode === "surface"
        ? `surf = ax.plot_surface(X, Y, Z, cmap="${cmap}", alpha=0.9)\nfig.colorbar(surf, shrink=0.5, aspect=8)`
        : mode === "wireframe"
        ? `ax.plot_wireframe(X, Y, Z, color="#00D9C0", lw=1.2)`
        : `ax.scatter(X, Y, Z, c=Z, cmap="${cmap}", s=40)`
    }\n\nax.set_title("3D Isometric Simulation")\nplt.show()`;
  };

  const code = generatePythonCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-200 dark:border-[#00D9C0]/30 text-xs font-mono text-teal-700 dark:text-[#00D9C0]">
            <Box className="w-3.5 h-3.5" />
            <span>3D Isometric Projection Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5F7FA] font-sans">
            3D Surface & Wireframe Mesh Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8B93A7] font-sans">
            Rotate continuous 3D scalar fields with camera elevation & azimuth sliders in real time.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] hover:bg-slate-200 dark:hover:bg-[#16203B] text-slate-700 dark:text-[#F5F7FA] font-mono text-xs transition-all self-start md:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied 3D Code!" : "Copy 3D Script"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 3D Visualizer Canvas (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
          <div
            className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] relative transition-transform duration-100 ease-out"
            style={{
              perspective: "900px",
              transformStyle: "preserve-3d",
              transform: `rotateX(${elev}deg) rotateZ(${azim}deg)`,
            }}
          >
            {Array.from({ length: gridSize }).map((_, r) => (
              <div key={`mesh-r-${r}`} className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {Array.from({ length: gridSize }).map((_, c) => {
                  const tX = (r - gridSize / 2) / (gridSize / 2);
                  const tY = (c - gridSize / 2) / (gridSize / 2);

                  let zVal = 0;
                  if (shape === "ripple") zVal = Math.sin(Math.sqrt(tX * tX + tY * tY) * Math.PI);
                  else if (shape === "saddle") zVal = tX * tX - tY * tY;
                  else if (shape === "bowl") zVal = tX * tX + tY * tY;
                  else zVal = Math.cos(tX * Math.PI) * Math.sin(tY * Math.PI);

                  const heightPx = zVal * 45;
                  const fill = interpolateColormap(cmap, (zVal + 1) / 2);

                  if (mode === "wireframe") {
                    return (
                      <div
                        key={`vox-${r}-${c}`}
                        className="absolute w-5 h-5 border border-teal-400/60"
                        style={{
                          left: `${c * 26}px`,
                          top: `${r * 26}px`,
                          transform: `translateZ(${heightPx}px)`,
                        }}
                      />
                    );
                  }

                  if (mode === "scatter") {
                    return (
                      <div
                        key={`vox-${r}-${c}`}
                        className="absolute w-3 h-3 rounded-full shadow-md"
                        style={{
                          left: `${c * 26 + 6}px`,
                          top: `${r * 26 + 6}px`,
                          transform: `translateZ(${heightPx}px)`,
                          backgroundColor: fill,
                        }}
                      />
                    );
                  }

                  return (
                    <div
                      key={`vox-${r}-${c}`}
                      className="absolute w-6 h-6 rounded-sm border border-black/20 shadow-sm"
                      style={{
                        left: `${c * 26}px`,
                        top: `${r * 26}px`,
                        transform: `translateZ(${heightPx}px)`,
                        backgroundColor: fill,
                        opacity: 0.9,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] space-y-4 font-mono text-xs">
          {/* Surface Geometry Shape */}
          <div className="space-y-2">
            <label className="text-slate-700 dark:text-[#F5F7FA] font-bold">3D Mathematical Surface</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "ripple", label: "Mexican Hat Ripple" },
                { id: "saddle", label: "Hyperbolic Saddle" },
                { id: "bowl", label: "Paraboloid Bowl" },
                { id: "helix", label: "Trig Wave Lattice" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShape(s.id as any)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    shape === s.id
                      ? "bg-teal-600 dark:bg-[#00D9C0] text-white dark:text-[#0B1021] border-transparent font-bold shadow-sm"
                      : "bg-white dark:bg-[#11182D] border-slate-200 dark:border-[#26304A] text-slate-600 dark:text-[#8B93A7]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Render Mode */}
          <div className="space-y-2">
            <label className="text-slate-700 dark:text-[#F5F7FA] font-bold">Render Mode</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "surface", label: "Surface" },
                { id: "wireframe", label: "Wireframe" },
                { id: "scatter", label: "Scatter 3D" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    mode === m.id
                      ? "bg-indigo-600 dark:bg-[#6366F1] text-white border-transparent font-bold shadow-sm"
                      : "bg-white dark:bg-[#11182D] border-slate-200 dark:border-[#26304A] text-slate-600 dark:text-[#8B93A7]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colormap Select */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-[#F5F7FA] font-bold">Colormap Palette</label>
            <select
              value={cmap}
              onChange={(e) => setCmap(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-slate-700 dark:text-[#F5F7FA]"
            >
              <option value="viridis">viridis (Perceptual Blue-Yellow)</option>
              <option value="plasma">plasma (Purple-Orange)</option>
              <option value="coolwarm">coolwarm (Diverging Red-Blue)</option>
              <option value="inferno">inferno (Dark Fire)</option>
              <option value="magma">magma (Purple Glow)</option>
            </select>
          </div>

          {/* Sliders */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#26304A]">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Elevation (elev)</span>
                <span>{elev}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={elev}
                onChange={(e) => setElev(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Azimuth (azim)</span>
                <span>{azim}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={azim}
                onChange={(e) => setAzim(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
