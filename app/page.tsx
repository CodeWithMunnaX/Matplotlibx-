"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LESSONS, TRACKS, Lesson } from "@/data/lessons";
import { getProgress, resetProgress } from "@/lib/storage";
import Hero from "@/components/Hero";
import LessonCard from "@/components/LessonCard";
import MatplotlibAnatomy from "@/components/MatplotlibAnatomy";
import ProgressBar from "@/components/ProgressBar";
import {
  Sparkles,
  BookOpen,
  Search,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Zap,
  TrendingUp,
  Layers,
  Box,
  Palette,
  RotateCcw,
  Sliders,
  Play,
  Grid,
} from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const prog = getProgress();
    setCompletedLessons(prog.completedLessons || []);
  }, []);

  const totalLessons = LESSONS.length; // 50
  const completedCount = completedLessons.length;

  const handleReset = () => {
    if (confirm("Reset all lesson progress and start fresh?")) {
      resetProgress();
      setCompletedLessons([]);
    }
  };

  const filteredLessons = LESSONS.filter((lesson) => {
    const matchesTrack = selectedTrack === "All" || lesson.track === selectedTrack;
    const matchesSearch =
      searchQuery.trim() === "" ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0E0B16] text-zinc-900 dark:text-[#FDF2F8] space-y-16 pb-24 animate-fade-in transition-colors">
      {/* 1. HERO SECTION */}
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 2. LEARNING JOURNEY DASHBOARD */}
        <section className="bg-white dark:bg-[#1C152D] rounded-3xl p-6 sm:p-8 border border-pink-100 dark:border-[#2D2248] shadow-card space-y-5 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Your Matplotlib Journey
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-[#FDF2F8] font-sans">
                {completedCount} / {totalLessons} Lessons Completed
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                Master 2D curves, statistical distributions, subplots, and 3D surface landscapes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/lessons/matplotlib-introduction"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono text-xs font-black shadow-md shadow-pink-500/25 dark:shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all hover:scale-105"
              >
                <span>{completedCount > 0 ? "Resume Learning" : "Start Lesson 01"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {completedCount > 0 && (
                <button
                  onClick={handleReset}
                  title="Reset Progress"
                  className="p-2.5 rounded-2xl border border-pink-200 dark:border-[#2D2248] hover:bg-pink-50 dark:hover:bg-[#151022] text-zinc-500 dark:text-zinc-400 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <ProgressBar completedCount={completedCount} totalCount={totalLessons} />
        </section>

        {/* 3. INTERACTIVE MATPLOTLIB ANATOMY SECTION */}
        <section id="anatomy" className="scroll-mt-20">
          <MatplotlibAnatomy />
        </section>

        {/* 4. LESSONS CATALOG & SEARCH */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-[#FDF2F8] font-sans">
                50-Topic Master Curriculum
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                From beginner Pyplot basics to advanced 3D projections & executive dashboards
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type="text"
                placeholder="Search 50 topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-[#1C152D] border border-pink-200 dark:border-[#2D2248] text-xs font-mono text-zinc-900 dark:text-[#FDF2F8] focus:outline-none focus:border-pink-500 shadow-sm"
              />
            </div>
          </div>

          {/* Track Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#1C152D] border border-pink-100 dark:border-[#2D2248] font-mono text-xs shadow-sm">
            {["All", ...TRACKS].map((track) => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  selectedTrack === track
                    ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-pink-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-300 hover:bg-pink-50/60 dark:hover:bg-[#151022]"
                }`}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isCompleted={completedLessons.includes(lesson.id)}
              />
            ))}
          </div>
        </section>

        {/* 5. PLAYGROUND & LABS CALLOUT BANNER */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-pink-900/10 via-rose-900/10 to-emerald-900/10 dark:from-[#1C152D] dark:to-[#151022] border border-pink-200 dark:border-[#2D2248] shadow-card flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-zinc-900 dark:text-[#FDF2F8] font-sans">
              Explore the Free Interactive Playground
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans max-w-xl">
              Experiment with 15+ pre-built templates, rotate 3D surfaces in real time, customize colormap gradients, and design multi-panel figure subplots.
            </p>
          </div>

          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono text-xs font-black shadow-lg shadow-pink-500/25 dark:shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all shrink-0 hover:scale-105"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch Free Playground</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
