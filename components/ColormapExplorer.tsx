"use client";

import React, { useState } from "react";
import { COLORMAPS, interpolateColormap } from "@/lib/matplotlibSimulator";
import { Sparkles, Palette, Copy, Check, Info } from "lucide-react";

export default function ColormapExplorer() {
  const [selectedCmap, setSelectedCmap] = useState<string>("viridis");
  const [copied, setCopied] = useState<boolean>(false);

  const colormapList = Object.keys(COLORMAPS);

  const handleCopy = () => {
    navigator.clipboard.writeText(`cmap="${selectedCmap}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-200 dark:border-[#00D9C0]/30 text-xs font-mono text-teal-700 dark:text-[#00D9C0]">
            <Palette className="w-3.5 h-3.5" />
            <span>Matplotlib Colormaps & Palettes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5F7FA] font-sans">
            Colormap Spectrum Explorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8B93A7] font-sans">
            Explore 20+ continuous and diverging colormaps with real-time gradient scales and heatmap simulations.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] hover:bg-slate-200 dark:hover:bg-[#16203B] text-slate-700 dark:text-[#F5F7FA] font-mono text-xs transition-all self-start md:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied snippet!" : `Copy cmap="${selectedCmap}"`}</span>
        </button>
      </div>

      {/* Grid of Colormap Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {colormapList.map((cmapName) => {
          const isSelected = selectedCmap === cmapName;
          return (
            <button
              key={cmapName}
              onClick={() => setSelectedCmap(cmapName)}
              className={`p-3 rounded-2xl border text-left space-y-2 transition-all ${
                isSelected
                  ? "bg-teal-50/50 dark:bg-[#00D9C0]/10 border-teal-500 dark:border-[#00D9C0] shadow-sm"
                  : "bg-slate-50 dark:bg-[#0B1021] border-slate-200 dark:border-[#26304A] hover:border-slate-300 dark:hover:border-[#344265]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">
                  {cmapName}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-[#00D9C0] animate-pulse" />
                )}
              </div>

              {/* Gradient Preview Bar */}
              <div
                className="w-full h-5 rounded-lg border border-black/10 shadow-inner"
                style={{
                  background: `linear-gradient(to right, ${Array.from({ length: 10 }, (_, i) =>
                    interpolateColormap(cmapName, i / 9)
                  ).join(", ")})`,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Selected Colormap Detailed Live Preview */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Large Continuous Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-900 dark:text-[#F5F7FA]">Continuous Gradient Range</span>
            <span className="text-teal-600 dark:text-[#00D9C0]">cmap=&quot;{selectedCmap}&quot;</span>
          </div>
          <div
            className="w-full h-12 rounded-xl border border-slate-200 dark:border-[#26304A] shadow-inner"
            style={{
              background: `linear-gradient(to right, ${Array.from({ length: 20 }, (_, i) =>
                interpolateColormap(selectedCmap, i / 19)
              ).join(", ")})`,
            }}
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0.0 (Min / Dark)</span>
            <span>0.5 (Midpoint)</span>
            <span>1.0 (Max / Light)</span>
          </div>
        </div>

        {/* Right: Simulated 8x8 Wave Matrix Preview */}
        <div className="space-y-3 flex flex-col items-center">
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-[#F5F7FA] self-start">
            2D Matrix Scalar Field Simulation
          </span>
          <div className="grid grid-cols-8 gap-0.5 p-1.5 rounded-xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A]">
            {Array.from({ length: 8 }).map((_, r) =>
              Array.from({ length: 8 }).map((_, c) => {
                const z = Math.sin((r / 7) * Math.PI) * Math.cos((c / 7) * Math.PI);
                const t = (z + 1) / 2;
                const fill = interpolateColormap(selectedCmap, t);
                return (
                  <div
                    key={`c-${r}-${c}`}
                    style={{ backgroundColor: fill }}
                    className="w-6 h-6 rounded-[2px]"
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
