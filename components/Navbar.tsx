"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Code2,
  HelpCircle,
  FileText,
  Sun,
  Moon,
  Menu,
  X,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import CheatsheetModal from "./CheatsheetModal";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);

  const navLinks = [
    { href: "/lessons/matplotlib-introduction", label: "Curriculum", icon: BookOpen },
    { href: "/playground", label: "Playground", icon: Code2 },
    { href: "/playground?tab=guide", label: "Decision Guide", icon: HelpCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 dark:bg-[#0E0B16]/95 border-b border-pink-100 dark:border-[#2D2248] transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-emerald-400 p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0E0B16] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-zinc-900 dark:text-[#FDF2F8] font-sans leading-none">
                Matplotlib<span className="text-pink-600 dark:text-pink-400">X</span>
              </span>
              <span className="text-[11px] font-sans text-zinc-500 dark:text-zinc-400 mt-0.5">
                By @CodeWithMunnaX
              </span>
            </div>
          </Link>

          {/* Clean Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href.split("?")[0].split("#")[0]);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    isActive
                      ? "bg-pink-50 dark:bg-pink-500/15 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/40 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/50 dark:hover:bg-[#1C152D]"
                  }`}
                >
                  <Icon className="w-4 h-4 text-pink-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => setIsCheatsheetOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-[#1C152D] transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cheatsheet</span>
            </button>
          </nav>

          {/* Right Action Suite */}
          <div className="flex items-center gap-3">
            {/* YouTube Channel Link */}
            <a
              href="https://www.youtube.com/@CodeWithMunnaX"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-mono text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all shadow-sm group"
            >
              <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>@CodeWithMunnaX</span>
            </a>

            {/* Start Free CTA */}
            <Link
              href="/lessons/matplotlib-introduction"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono text-xs font-bold shadow-pink-sm transition-all hover:scale-105"
            >
              <span>Start Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
              className="p-2 rounded-xl border border-pink-200 dark:border-[#2D2248] bg-white dark:bg-[#1C152D] text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-[#241B3B] transition-all shadow-sm"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-emerald-400" />
              ) : (
                <Moon className="w-4 h-4 text-pink-600" />
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-pink-200 dark:border-[#2D2248] text-zinc-700 dark:text-[#FDF2F8]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 space-y-2 bg-white dark:bg-[#0E0B16] border-b border-pink-100 dark:border-[#2D2248] animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-mono font-bold text-zinc-800 dark:text-[#FDF2F8] hover:bg-pink-50 dark:hover:bg-[#1C152D]"
              >
                <link.icon className="w-4 h-4 text-pink-500" />
                <span>{link.label}</span>
              </Link>
            ))}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCheatsheetOpen(true);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-[#1C152D]"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Quick Matplotlib Cheatsheet</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            <a
              href="https://www.youtube.com/@CodeWithMunnaX"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-600 text-white font-mono text-xs font-bold shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>@CodeWithMunnaX on YouTube</span>
            </a>
          </div>
        )}
      </header>

      {/* Cheatsheet Modal */}
      {isCheatsheetOpen && <CheatsheetModal onClose={() => setIsCheatsheetOpen(false)} />}
    </>
  );
}
