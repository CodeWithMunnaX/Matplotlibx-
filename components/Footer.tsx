"use client";

import React from "react";
import Link from "next/link";
import { Heart, TrendingUp, Sparkles, BookOpen, Code2, HelpCircle, FileText, ArrowUpRight } from "lucide-react";
import { TRACKS } from "@/data/lessons";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#0E0B16] border-t border-pink-100 dark:border-[#2D2248] pt-14 pb-12 text-zinc-600 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Instructor */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-emerald-400 p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0E0B16] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
              <span className="font-black text-lg text-zinc-900 dark:text-[#FDF2F8] font-sans">
                Matplotlib<span className="text-pink-600 dark:text-pink-400">X</span>
              </span>
            </Link>

            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 font-sans">
              An interactive visual laboratory for Python Data Visualization & Scientific Plotting. Zero backend required — runs 100% in your browser.
            </p>

            <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
              Created with <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500" /> by{" "}
              <a
                href="https://www.youtube.com/@CodeWithMunnaX"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 dark:text-pink-400 font-bold hover:underline"
              >
                Munna Kumar (@CodeWithMunnaX)
              </a>
            </div>
          </div>

          {/* Col 2: Curriculum Tracks */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-[#FDF2F8]">
              Master Curriculum
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              {TRACKS.map((track) => (
                <li key={track}>
                  <Link
                    href={`/lessons#${track.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>Track: {track}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Interactive Visual Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-[#FDF2F8]">
              Interactive Labs
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/playground" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                  Playground Python IDE
                </Link>
              </li>
              <li>
                <Link href="/playground?tab=guide" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                  Chart Decision Guide (15 Charts)
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                  3D Surface & Wireframe Studio
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                  Subplot Layout Builder
                </Link>
              </li>
              <li>
                <Link href="/#anatomy" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                  Matplotlib Figure Anatomy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Community & Socials */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-[#FDF2F8]">
              Official Channels
            </h4>
            <div className="flex flex-col space-y-2.5 text-xs font-sans">
              <a
                href="https://www.youtube.com/@CodeWithMunnaX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
              >
                <div className="w-6 h-6 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center text-red-600">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <span>YouTube @CodeWithMunnaX</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href="https://www.linkedin.com/in/munna-kumar-93234b241"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0-.01-3.3 1.65 1.65 0 0 0 .01 3.3m1.4 9.74V9.93H5.06v8.57h2.8z" />
                  </svg>
                </div>
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href="https://www.instagram.com/codewithmunnax"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group"
              >
                <div className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 flex items-center justify-center text-pink-600">
                  <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                </div>
                <span>Instagram @codewithmunnax</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Tech Badges */}
        <div className="pt-8 border-t border-pink-100 dark:border-[#2D2248] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-zinc-500 dark:text-zinc-400">
          <p>© 2026 MatplotlibX. Created with pride by Munna Kumar (@CodeWithMunnaX).</p>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              100% In-Browser AST Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30">
              Free & Open
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
