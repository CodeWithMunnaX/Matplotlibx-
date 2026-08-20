"use client";

import React, { useState } from "react";
import { REAL_WORLD_DATASETS, RealWorldDataset } from "@/data/realWorldDatasets";
import { Sparkles, Database, ArrowRight, Play, Check } from "lucide-react";

interface RealWorldDataSwitcherProps {
  onSelectDataset: (code: string) => void;
}

export default function RealWorldDataSwitcher({ onSelectDataset }: RealWorldDataSwitcherProps) {
  const [selectedId, setSelectedId] = useState<string>("ipl-cricket");

  const handleSelect = (ds: RealWorldDataset) => {
    setSelectedId(ds.id);
    onSelectDataset(ds.code);
  };

  return (
    <div className="bg-white dark:bg-[#1C152D] rounded-3xl p-5 border border-pink-100 dark:border-[#2D2248] shadow-card space-y-3 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-100/80 dark:border-[#2D2248] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-zinc-900 dark:text-[#FDF2F8] uppercase tracking-wider">
              Real-World Datasets (1-Click Switcher)
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Switch from abstract numbers to relatable Cricket, Cinema & Business charts
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-bold">
          5 Curated Datasets
        </span>
      </div>

      {/* Dataset Pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {REAL_WORLD_DATASETS.map((ds) => {
          const isSelected = selectedId === ds.id;
          return (
            <button
              key={ds.id}
              onClick={() => handleSelect(ds)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-mono font-bold transition-all hover:scale-105 ${
                isSelected
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-500 shadow-md shadow-pink-500/25"
                  : "bg-white dark:bg-[#151022] border-pink-100 dark:border-[#2D2248] text-zinc-700 dark:text-zinc-300 hover:border-pink-300 dark:hover:border-pink-500/40 hover:text-pink-600 dark:hover:text-pink-300 shadow-sm"
              }`}
            >
              <span className="text-sm">{ds.icon}</span>
              <span>{ds.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
