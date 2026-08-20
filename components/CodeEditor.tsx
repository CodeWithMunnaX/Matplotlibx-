"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Sparkles,
  Loader2,
  Code2,
  Download,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import Editor, { loader } from "@monaco-editor/react";
import { downloadNotebook, openInGoogleColab } from "@/lib/notebookGenerator";

if (typeof window !== "undefined") {
  loader.config({
    paths: {
      vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs",
    },
  });
}

export interface CodeEditorExample {
  title?: string;
  label?: string;
  description?: string;
  code: string;
}

interface CodeEditorProps {
  initialCode: string;
  onRun: (code: string) => void;
  isRunning?: boolean;
  onReset?: () => void;
  examples?: CodeEditorExample[];
  height?: string;
  title?: string;
  lessonName?: string;
}

export default function CodeEditor({
  initialCode,
  onRun,
  isRunning = false,
  onReset,
  examples = [],
  height = "260px",
  title = "Python / Matplotlib Editor",
  lessonName = "Matplotlib Practice",
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasMonacoError, setHasMonacoError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadIpynb = () => {
    downloadNotebook({
      title: lessonName || title,
      description: "Interactive Python Matplotlib code generated on MatplotlibX platform.",
      code,
      filename: lessonName || "matplotlib_notebook",
    });
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleOpenColab = () => {
    openInGoogleColab(code);
  };

  const handleRunClick = () => {
    if (!isRunning) {
      onRun(code);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunClick();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="bg-white dark:bg-[#1C152D] rounded-3xl border border-pink-100 dark:border-[#2D2248] overflow-hidden shadow-card flex flex-col transition-colors"
    >
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-pink-100 dark:border-[#2D2248] bg-pink-50/40 dark:bg-[#151022]">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          <span className="text-xs font-mono font-bold text-zinc-900 dark:text-[#FDF2F8] uppercase tracking-wider">
            {title}
          </span>
          <div className="flex items-center gap-1.5 ml-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Python 3.12 • Matplotlib</span>
          </div>
        </div>

        {/* Action Pills in Header: Download .ipynb & Colab */}
        <div className="flex items-center gap-2">
          {examples.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:inline font-mono">
                Presets:
              </span>
              <select
                onChange={(e) => {
                  const selected = examples[Number(e.target.value)];
                  if (selected) {
                    setCode(selected.code);
                    onRun(selected.code);
                  }
                }}
                className="text-xs font-mono bg-white dark:bg-[#1C152D] border border-pink-200 dark:border-[#2D2248] rounded-xl px-2.5 py-1 text-zinc-700 dark:text-[#FDF2F8] focus:outline-none"
              >
                {examples.map((ex, idx) => (
                  <option key={idx} value={idx}>
                    {ex.title || ex.label || `Example ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleDownloadIpynb}
            title="Download Jupyter Notebook (.ipynb) for VS Code / Jupyter"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-[#1C152D] border border-pink-200 dark:border-[#2D2248] text-pink-700 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-[#241B3B] font-mono text-[11px] font-bold transition-all"
          >
            {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Download className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{downloaded ? "Saved" : ".ipynb"}</span>
          </button>

          <button
            onClick={handleOpenColab}
            title="Open in Google Colab"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100 font-mono text-[11px] font-bold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Colab</span>
          </button>
        </div>
      </div>

      {/* Editor Main Body */}
      <div className="relative flex-1 bg-white dark:bg-[#0E0B16] min-h-[220px]">
        {isMounted && !hasMonacoError ? (
          <Editor
            height={height}
            language="python"
            theme={theme === "light" ? "vs" : "vs-dark"}
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "var(--font-mono), monospace",
              fontLigatures: true,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: "on",
              padding: { top: 12, bottom: 12 },
              lineDecorationsWidth: 4,
              renderLineHighlight: "all",
            }}
            loading={
              <div className="h-full flex items-center justify-center gap-2 text-xs font-mono text-zinc-500">
                <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                <span>Loading Python Editor...</span>
              </div>
            }
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ height }}
            className="w-full p-4 font-mono text-xs bg-white dark:bg-[#0E0B16] text-zinc-900 dark:text-[#FDF2F8] border-none resize-none focus:outline-none"
            placeholder="# Write Python code here..."
          />
        )}
      </div>

      {/* Editor Footer / Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-pink-100 dark:border-[#2D2248] bg-pink-50/40 dark:bg-[#151022]">
        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={() => {
                onReset();
                setCode(initialCode);
              }}
              title="Reset code to original starter state"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-200 dark:border-[#2D2248] text-zinc-600 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-[#1C152D] font-mono text-xs transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy code to clipboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-200 dark:border-[#2D2248] text-zinc-600 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-[#1C152D] font-mono text-xs transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-[11px] font-mono text-zinc-400">
            Ctrl + Enter to run
          </span>

          <button
            onClick={handleRunClick}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono text-xs font-black shadow-md shadow-pink-500/25 dark:shadow-[0_0_15px_rgba(236,72,153,0.35)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Plot</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
