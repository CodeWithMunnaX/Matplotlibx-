"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LESSONS, TRACKS, Lesson } from "@/data/lessons";
import { CheckCircle2, Circle, X, Search, BookOpen, ChevronDown, ChevronRight } from "lucide-react";

interface CourseSidebarProps {
  currentLessonId: string;
  completedIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseSidebar({
  currentLessonId,
  completedIds,
  isOpen,
  onClose,
}: CourseSidebarProps) {
  const [search, setSearch] = useState("");
  React.useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const [openTracks, setOpenTracks] = useState<Record<string, boolean>>({
    Beginner: true,
    "Essential Charts": true,
    "Subplots & Layouts": true,
    "Advanced Styling": true,
    "3D & Projects": true,
  });

  const toggleTrack = (track: string) => {
    setOpenTracks((prev) => ({ ...prev, [track]: !prev[track] }));
  };

  const filteredLessons = LESSONS.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white dark:bg-[#0B1021] border-l border-slate-200 dark:border-[#26304A] z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[#26304A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-500" />
            <h3 className="font-mono text-xs font-bold text-slate-900 dark:text-[#F5F7FA] uppercase tracking-wider">
              50-Topic Master Curriculum
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#16203B] text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-200 dark:border-[#26304A]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] text-xs font-mono text-slate-900 dark:text-[#F5F7FA] focus:outline-none"
            />
          </div>
        </div>

        {/* Lesson List by Track */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {TRACKS.map((track) => {
            const trackLessons = filteredLessons.filter((l) => l.track === track);
            if (trackLessons.length === 0) return null;
            const isOpenTrack = openTracks[track] ?? true;

            return (
              <div key={track} className="space-y-1">
                <button
                  onClick={() => toggleTrack(track)}
                  className="w-full flex items-center justify-between py-1.5 px-2 text-slate-500 font-bold uppercase tracking-wider text-[10px] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
                >
                  <span>{track} ({trackLessons.length})</span>
                  {isOpenTrack ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {isOpenTrack && (
                  <div className="space-y-1 pl-1">
                    {trackLessons.map((lesson) => {
                      const isActive = lesson.id === currentLessonId || lesson.slug === currentLessonId;
                      const isDone = completedIds.includes(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          href={`/lessons/${lesson.slug}`}
                          onClick={onClose}
                          className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                            isActive
                              ? "bg-teal-50 dark:bg-[#00D9C0]/10 text-teal-700 dark:text-[#00D9C0] font-bold border border-teal-300 dark:border-[#00D9C0]/30"
                              : "text-slate-600 dark:text-[#8B93A7] hover:bg-slate-100 dark:hover:bg-[#11182D] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
                          }`}
                        >
                          <span className="truncate pr-2">{lesson.title}</span>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
