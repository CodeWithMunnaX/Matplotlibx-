"use client";

import React from "react";
import Link from "next/link";
import { Lesson } from "@/data/lessons";
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  BarChart2,
  PieChart,
  Activity,
  Layers,
  Box,
  LayoutGrid,
  Flame,
  Code2,
} from "lucide-react";

interface LessonCardProps {
  lesson: Lesson;
  isCompleted?: boolean;
}

export default function LessonCard({ lesson, isCompleted = false }: LessonCardProps) {
  // Category Icons mapping
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("basic") || cat.includes("line")) return TrendingUp;
    if (cat.includes("bar") || cat.includes("compar")) return BarChart2;
    if (cat.includes("pie") || cat.includes("prop")) return PieChart;
    if (cat.includes("stat") || cat.includes("hist") || cat.includes("box")) return Activity;
    if (cat.includes("3d") || cat.includes("surface")) return Box;
    if (cat.includes("subplot") || cat.includes("layout")) return LayoutGrid;
    return Layers;
  };

  const CategoryIcon = getCategoryIcon(lesson.category);

  // Parse lesson order number (e.g., from "16. Box Plots..." or ID)
  const titleNumberMatch = lesson.title.match(/^(\d+)\.\s*(.*)$/);
  const lessonNumber = titleNumberMatch ? titleNumberMatch[1] : lesson.id.replace(/\D/g, "") || "•";
  const cleanTitle = titleNumberMatch ? titleNumberMatch[2] : lesson.title;

  const difficultyColors = {
    Beginner: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
    Intermediate: "bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-500/30",
    Advanced: "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30",
  }[lesson.difficulty] || "bg-pink-50 text-pink-700 border-pink-200";

  return (
    <Link
      href={`/lessons/${lesson.slug}`}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1C152D] border border-pink-100/90 dark:border-[#2D2248] hover:border-pink-300 dark:hover:border-pink-500/50 shadow-card hover:shadow-pink-md transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
    >
      {/* Subtle Card Top Accent Glow on Hover */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-4">
        {/* Top Badges & Meta */}
        <div className="flex items-center justify-between gap-2">
          {/* Category Pill with Icon */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider bg-pink-50/70 dark:bg-[#151022] text-pink-700 dark:text-pink-300 border border-pink-200/70 dark:border-[#2D2248]">
            <CategoryIcon className="w-3 h-3 text-pink-500 shrink-0" />
            <span className="truncate max-w-[130px]">{lesson.category}</span>
          </div>

          {/* Difficulty & Status */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${difficultyColors}`}>
              {lesson.difficulty}
            </span>
            {isCompleted ? (
              <div className="flex items-center text-emerald-600 dark:text-emerald-400" title="Completed">
                <CheckCircle2 className="w-4 h-4 fill-emerald-100 dark:fill-emerald-500/20" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-300 dark:border-[#2D2248] group-hover:border-pink-400 transition-colors" />
            )}
          </div>
        </div>

        {/* Title Area with Stylized Lesson Number */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/15 dark:from-pink-500/20 dark:to-rose-500/20 border border-pink-200 dark:border-pink-500/30 flex items-center justify-center text-xs font-mono font-black text-pink-700 dark:text-pink-300 shrink-0 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-rose-600 group-hover:text-white transition-all shadow-sm">
            {lessonNumber}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-[#FDF2F8] font-sans group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-1 leading-snug">
              {cleanTitle}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 font-sans">
              {lesson.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 mt-4 border-t border-pink-100/70 dark:border-[#2D2248] flex items-center justify-between font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-50 dark:bg-[#151022] border border-zinc-200/60 dark:border-[#2D2248]">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{lesson.estimatedTime}</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 font-bold group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-rose-600 group-hover:text-white transition-all shadow-sm">
          <span>{isCompleted ? "Review" : "Start"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
