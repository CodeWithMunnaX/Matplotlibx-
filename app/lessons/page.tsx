"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LESSONS, TRACKS, Lesson } from "@/data/lessons";
import { getProgress } from "@/lib/storage";
import LessonCard from "@/components/LessonCard";
import ProgressBar from "@/components/ProgressBar";
import { Sparkles, Search, BookOpen, ArrowLeft, Zap } from "lucide-react";

export default function LessonsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const prog = getProgress();
    setCompletedLessons(prog.completedLessons || []);
  }, []);

  const totalLessons = LESSONS.length;
  const completedCount = completedLessons.length;

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
    <div className="min-h-screen bg-[#F4F6FB] dark:bg-[#0B1021] text-slate-900 dark:text-[#F5F7FA] py-8 pb-24 space-y-8 animate-fade-in transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-200 dark:border-[#00D9C0]/30 text-xs font-mono text-teal-700 dark:text-[#00D9C0]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Curriculum Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F5F7FA] font-sans">
              All 50 Matplotlib Master Topics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8B93A7] font-sans max-w-xl">
              Structured progressive path from beginner pyplot foundations to 3D surface visualizations and executive dashboards.
            </p>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <ProgressBar completedCount={completedCount} totalCount={totalLessons} />
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Track Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] font-mono text-xs w-full sm:w-auto">
            {["All", ...TRACKS].map((track) => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  selectedTrack === track
                    ? "bg-teal-600 dark:bg-[#00D9C0] text-white dark:text-[#0B1021] font-bold shadow-sm"
                    : "text-slate-600 dark:text-[#8B93A7] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
                }`}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-xs font-mono text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Lessons Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isCompleted={completedLessons.includes(lesson.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
