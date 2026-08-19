"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Copy, Check, Terminal, Sparkles, Loader2, Code2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import Editor, { loader } from "@monaco-editor/react";

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
}

export default function CodeEditor({
  initialCode,
  onRun,
  isRunning = false,
  onReset,
  examples = [],
  height = "260px",
  title = "Python / Matplotlib Editor",
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
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
      className="bg-white dark:bg-[#11182D] rounded-3xl border border-slate-200 dark:border-[#26304A] overflow-hidden shadow-sm dark:shadow-card flex flex-col transition-colors"
    >
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-[#26304A] bg-slate-50 dark:bg-[#0F162B]">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-teal-600 dark:text-[#00D9C0]" />
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-[#F5F7FA] uppercase tracking-wider">
            {title}
          </span>
          <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-200 dark:border-[#00D9C0]/30 text-[10px] font-mono text-teal-700 dark:text-[#00D9C0]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-[#00D9C0] animate-pulse" />
            <span>Python 3.12 ● Matplotlib</span>
          </div>
        </div>

        {/* Examples Dropdown if provided */}
        {examples.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 dark:text-[#8B93A7] hidden sm:inline font-mono">
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
              className="text-xs font-mono bg-white dark:bg-[#11182D] border border-slate-200 dark:border-[#26304A] rounded-xl px-2.5 py-1 text-slate-700 dark:text-[#F5F7FA] focus:outline-none"
            >
              {examples.map((ex, idx) => (
                <option key={idx} value={idx}>
                  {ex.title || ex.label || `Example ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Editor Main Body */}
      <div className="relative flex-1 bg-white dark:bg-[#0B1021] min-h-[220px]">
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
              <div className="h-full flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
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
            className="w-full p-4 font-mono text-xs bg-white dark:bg-[#0B1021] text-slate-900 dark:text-[#F5F7FA] border-none resize-none focus:outline-none"
            placeholder="# Write Python code here..."
          />
        )}
      </div>

      {/* Editor Footer / Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-[#26304A] bg-slate-50 dark:bg-[#0F162B]">
        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={() => {
                onReset();
                setCode(initialCode);
              }}
              title="Reset code to original starter state"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#26304A] text-slate-600 dark:text-[#8B93A7] hover:bg-slate-200 dark:hover:bg-[#16203B] font-mono text-xs transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy code to clipboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#26304A] text-slate-600 dark:text-[#8B93A7] hover:bg-slate-200 dark:hover:bg-[#16203B] font-mono text-xs transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-[11px] font-mono text-slate-400">
            Ctrl + Enter to run
          </span>

          <button
            onClick={handleRunClick}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 dark:bg-[#00D9C0] hover:bg-teal-700 dark:hover:bg-[#00D9C0]/90 text-white dark:text-[#0B1021] font-mono text-xs font-black shadow-md shadow-teal-500/20 dark:shadow-[0_0_15px_rgba(0,217,192,0.35)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
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
