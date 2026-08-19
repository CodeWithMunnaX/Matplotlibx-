"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Challenge } from "@/data/lessons";
import { Award, CheckCircle2, XCircle, HelpCircle, Play, Sparkles, RotateCcw, ArrowRight, Layers, Code2 } from "lucide-react";
import confetti from "canvas-confetti";
import { markLessonCompleted } from "@/lib/storage";
import { parsePythonMatplotlib, ParseResult } from "@/lib/parser";
import PlotVisualizer from "./PlotVisualizer";

interface PracticeChallengeProps {
  challenge: Challenge;
  lessonId: string;
  nextLessonSlug?: string;
  onSuccess?: () => void;
}

export default function PracticeChallenge({
  challenge,
  lessonId,
  nextLessonSlug,
  onSuccess,
}: PracticeChallengeProps) {
  const [code, setCode] = useState(challenge.starterCode);
  const [parsedResult, setParsedResult] = useState<ParseResult | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string>("");
  const [showHint, setShowHint] = useState<boolean>(false);

  // Initialize or re-parse when challenge changes or on load
  useEffect(() => {
    setCode(challenge.starterCode);
    setStatus("idle");
    setFeedback("");
    setShowHint(false);
    try {
      const res = parsePythonMatplotlib(challenge.starterCode);
      setParsedResult(res);
    } catch {
      // safe fallback
    }
  }, [challenge]);

  // Handle live code change in challenge editor
  const handleCodeChange = (newVal: string) => {
    setCode(newVal);
    try {
      const res = parsePythonMatplotlib(newVal);
      setParsedResult(res);
      if (status !== "idle") {
        setStatus("idle");
        setFeedback("");
      }
    } catch {
      // safe fallback
    }
  };

  const handleReset = () => {
    setCode(challenge.starterCode);
    setStatus("idle");
    setFeedback("");
    try {
      const res = parsePythonMatplotlib(challenge.starterCode);
      setParsedResult(res);
    } catch {
      // safe fallback
    }
  };

  const handleValidateSolution = () => {
    // 1. Check required keywords
    const missingKeywords = challenge.targetKeywords.filter(
      (kw) => !code.includes(kw)
    );

    if (missingKeywords.length > 0) {
      setStatus("error");
      setFeedback(`Missing required syntax keyword: "${missingKeywords[0]}"`);
      return;
    }

    // 2. Parse and evaluate code
    const parsed = parsePythonMatplotlib(code);
    setParsedResult(parsed);

    if (parsed.hasErrors) {
      setStatus("error");
      setFeedback(`Execution error: ${parsed.errors[0]}`);
      return;
    }

    // 3. Optional snippet check if expected
    if (challenge.expectedOutputSnippet) {
      const allText = [
        ...parsed.prints,
        ...parsed.figure.axes.map((a) => a.title || ""),
        ...parsed.figure.axes.map((a) => a.xlabel || ""),
        ...parsed.figure.axes.map((a) => a.ylabel || ""),
      ].join(" ");

      if (
        !allText.toLowerCase().includes(challenge.expectedOutputSnippet.toLowerCase()) &&
        !code.includes(challenge.expectedOutputSnippet)
      ) {
        setStatus("error");
        setFeedback(`Make sure your plot includes "${challenge.expectedOutputSnippet}" as required.`);
        return;
      }
    }

    // 4. Mark success & fire confetti
    setStatus("success");
    setFeedback("Awesome! Challenge solved successfully and graph rendered cleanly!");
    markLessonCompleted(lessonId);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#00D9C0", "#6366F1", "#FFB86B", "#FF5C7A"],
      });
    } catch {
      // safe fallback
    }

    if (onSuccess) onSuccess();
  };

  return (
    <div className="bg-white dark:bg-[#11182D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#26304A] shadow-sm dark:shadow-card space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-[#26304A] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F5F7FA] font-sans">
                Hands-on Challenge: {challenge.title}
              </h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                +50 XP
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8B93A7] font-sans mt-0.5">
              Write Matplotlib code to solve the objective and see your live plot render
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {status === "success" && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-teal-50 dark:bg-[#00D9C0]/15 border border-teal-500 dark:border-[#00D9C0] text-teal-700 dark:text-[#00D9C0] text-xs font-mono font-bold shadow-[0_0_12px_rgba(0,217,192,0.3)] animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Challenge Solved!</span>
            </span>
          )}
          {status === "error" && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-red-50 dark:bg-red-500/15 border border-red-300 dark:border-red-500 text-red-600 dark:text-red-400 text-xs font-mono font-bold animate-fade-in">
              <XCircle className="w-4 h-4" />
              <span>⚠ Not quite yet</span>
            </span>
          )}
        </div>
      </div>

      {/* Task Prompt Box */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-[#00D9C0]">
          <span>Objective Instructions:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-[#F5F7FA] font-sans leading-relaxed">
          {challenge.prompt}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-slate-500">Required Keywords:</span>
          {challenge.targetKeywords.map((kw, i) => (
            <code
              key={i}
              className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                code.includes(kw)
                  ? "bg-teal-50 dark:bg-[#00D9C0]/10 text-teal-700 dark:text-[#00D9C0] border-teal-300 dark:border-[#00D9C0]/30"
                  : "bg-slate-100 dark:bg-[#16203B] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#26304A]"
              }`}
            >
              {code.includes(kw) ? `✓ ${kw}` : kw}
            </code>
          ))}
        </div>
      </div>

      {/* 2-Column Challenge Studio: Editor (Left) & Live Challenge Plot (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Code Editor (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-[#8B93A7] flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-teal-600 dark:text-[#00D9C0]" />
              Challenge Code Editor
            </span>
            <button
              onClick={handleReset}
              className="text-xs font-mono text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            rows={8}
            spellCheck={false}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-[#26304A] font-mono text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:border-teal-500 transition-colors resize-y leading-relaxed"
            placeholder="Write your Python plotting code here..."
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-mono text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
            </button>

            <button
              onClick={handleValidateSolution}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 dark:bg-[#00D9C0] hover:bg-teal-700 dark:hover:bg-[#00D9C0]/90 text-white dark:text-[#0B1021] font-mono text-xs font-black shadow-md shadow-teal-500/20 dark:shadow-[0_0_15px_rgba(0,217,192,0.35)] transition-all hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Validate Solution</span>
            </button>
          </div>

          {showHint && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-900 dark:text-amber-300 font-sans leading-relaxed animate-fade-in">
              💡 <strong>Hint:</strong> {challenge.hint}
            </div>
          )}

          {status === "success" && (
            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-300 dark:border-[#00D9C0]/30 text-xs font-mono text-teal-800 dark:text-[#00D9C0] flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {status === "error" && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-xs font-mono text-red-700 dark:text-red-400 flex items-center gap-2 animate-fade-in">
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        {/* Right: Live Challenge Graph Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-[#00D9C0] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Challenge Output Graph
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Live Vector Preview
            </span>
          </div>

          {parsedResult?.figure ? (
            <div className="border border-slate-200 dark:border-[#26304A] rounded-2xl overflow-hidden shadow-sm">
              <PlotVisualizer figure={parsedResult.figure} />
            </div>
          ) : (
            <div className="w-full h-48 rounded-2xl border border-dashed border-slate-300 dark:border-[#26304A] flex flex-col items-center justify-center text-xs font-mono text-slate-400 p-4 text-center">
              <span>Write code on the left to render live challenge plot</span>
            </div>
          )}

          {/* Unlock Next Topic Banner */}
          {status === "success" && nextLessonSlug && (
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-[#00D9C0]/10 border border-teal-300 dark:border-[#00D9C0] flex flex-wrap items-center justify-between gap-3 animate-fade-in shadow-[0_0_20px_rgba(0,217,192,0.25)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-[#00D9C0]" />
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Ready for the next master topic?
                </span>
              </div>
              <Link
                href={`/lessons/${nextLessonSlug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 dark:bg-[#00D9C0] text-white dark:text-[#0B1021] font-mono text-xs font-black shadow-md hover:scale-105 transition-all"
              >
                <span>Continue Next Topic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
