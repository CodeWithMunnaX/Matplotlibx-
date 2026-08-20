"use client";

import React, { useState, useEffect } from "react";
import { X, Play, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { Lesson } from "@/data/lessons";

interface LessonVideoModalProps {
  lesson?: Lesson;
  onClose: () => void;
}

export const OFFICIAL_YOUTUBE_VIDEO_ID = "7SoF2pcQcA8";
export const OFFICIAL_YOUTUBE_URL = "https://youtu.be/7SoF2pcQcA8";
export const OFFICIAL_YOUTUBE_THUMBNAIL = `https://img.youtube.com/vi/${OFFICIAL_YOUTUBE_VIDEO_ID}/maxresdefault.jpg`;
export const OFFICIAL_YOUTUBE_THUMBNAIL_FALLBACK = `https://img.youtube.com/vi/${OFFICIAL_YOUTUBE_VIDEO_ID}/hqdefault.jpg`;

export function YouTubeIcon({ className = "w-4 h-4 fill-current" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function LessonVideoModal({ lesson, onClose }: LessonVideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(OFFICIAL_YOUTUBE_THUMBNAIL);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overscroll-contain animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#1C152D] border border-pink-100 dark:border-[#2D2248] rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col font-sans max-h-[92vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 dark:border-[#2D2248] bg-pink-50/40 dark:bg-[#151022] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-500 shadow-sm">
              <YouTubeIcon className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-[#FDF2F8]">
                {lesson ? `Video Tutorial: ${lesson.title}` : "Matplotlib Full Course Masterclass"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                Official Video by Munna Kumar (@CodeWithMunnaX)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-pink-200 dark:border-[#2D2248] hover:bg-pink-50 dark:hover:bg-[#241B3B] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Embed / High-Res Thumbnail Preview */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="relative w-full aspect-video rounded-2xl bg-zinc-950 border border-pink-200 dark:border-[#2D2248] overflow-hidden shadow-lg group">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${OFFICIAL_YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                title="Matplotlib Tutorial by Munna Kumar"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="relative w-full h-full cursor-pointer flex items-center justify-center"
              >
                {/* Real YouTube Video Thumbnail */}
                <img
                  src={thumbSrc}
                  onError={() => setThumbSrc(OFFICIAL_YOUTUBE_THUMBNAIL_FALLBACK)}
                  alt="Matplotlib Video Thumbnail by CodeWithMunnaX"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                />

                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Big Glowing YouTube Play Button */}
                <div className="absolute flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-3xl bg-red-600/95 group-hover:bg-red-600 text-white flex items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-all">
                    <Play className="w-9 h-9 fill-current ml-1" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold tracking-wide">
                    Click to Play Video
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Links & Channel Badge */}
          <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-[#151022] border border-pink-100 dark:border-[#2D2248] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600">
                <YouTubeIcon className="w-4 h-4 fill-current" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-zinc-900 dark:text-[#FDF2F8]">
                  CodeWithMunnaX Official Matplotlib Guide
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
                  Like, share & subscribe for more Python Data Science tutorials
                </p>
              </div>
            </div>

            <a
              href={OFFICIAL_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold shadow-md shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <YouTubeIcon className="w-4 h-4 fill-current" />
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
