"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LESSONS,
  getLessonById,
  getPreviousLesson,
  getNextLesson,
  Lesson,
} from "@/data/lessons";
import { generateExplanation, FullExplanation } from "@/lib/explanationEngine";
import { getSavedLessonCode, saveLessonCode, markLessonCompleted, unmarkLessonCompleted, getProgress } from "@/lib/storage";

// Components
import ExplanationPanel from "@/components/ExplanationPanel";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import PlotVisualizer from "@/components/PlotVisualizer";
import StepByStep from "@/components/StepByStep";
import WhatHappened from "@/components/WhatHappened";
import WhySection from "@/components/WhySection";
import CommonMistakes from "@/components/CommonMistakes";
import CommonMistakesBox from "@/components/CommonMistakesBox";
import LessonQuiz from "@/components/LessonQuiz";
import RealWorldDataSwitcher from "@/components/RealWorldDataSwitcher";
import QuickSummary from "@/components/QuickSummary";
import PracticeChallenge from "@/components/PracticeChallenge";
import LessonNavigation from "@/components/LessonNavigation";
import CourseSidebar from "@/components/CourseSidebar";
import LessonVideoModal from "@/components/LessonVideoModal";

import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  ArrowLeft,
  Clock,
  Award,
  Layers,
  Zap,
  HelpCircle,
  List,
  CheckCircle2,
  Sliders,
  Play,
  Box,
} from "lucide-react";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  const lesson = getLessonById(rawId) || LESSONS[0];
  const prevLesson = getPreviousLesson(lesson);
  const nextLesson = getNextLesson(lesson);

  const [code, setCode] = useState(lesson.starterCode);
  const [explanation, setExplanation] = useState<FullExplanation | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = getSavedLessonCode(lesson.id, lesson.starterCode);
    setCode(saved);
    const initialExp = generateExplanation(saved);
    setExplanation(initialExp);

    const prog = getProgress();
    setCompletedIds(prog.completedLessons || []);
  }, [lesson]);

  const handleRunCode = (newCode: string) => {
    setIsRunning(true);
    saveLessonCode(lesson.id, newCode);

    setTimeout(() => {
      const exp = generateExplanation(newCode);
      setExplanation(exp);
      setIsRunning(false);
    }, 150);
  };

  const handleResetCode = () => {
    setCode(lesson.starterCode);
    saveLessonCode(lesson.id, lesson.starterCode);
    const exp = generateExplanation(lesson.starterCode);
    setExplanation(exp);
  };

  const handleLoadConceptCode = (snippet: string) => {
    const fullSnippet = snippet.startsWith("import matplotlib")
      ? snippet
      : `import matplotlib.pyplot as plt\nimport numpy as np\n\n${snippet}\n\nplt.title("Snippet Demo")\nplt.grid(True)\nplt.show()`;
    setCode(fullSnippet);
    handleRunCode(fullSnippet);
  };

  const isCompleted = completedIds.includes(lesson.id);

  const handleToggleComplete = () => {
    if (isCompleted) {
      unmarkLessonCompleted(lesson.id);
      setCompletedIds((prev) => prev.filter((id) => id !== lesson.id));
    } else {
      markLessonCompleted(lesson.id);
      setCompletedIds((prev) => [...prev, lesson.id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0E0B16] text-zinc-900 dark:text-[#FDF2F8] py-8 pb-24 space-y-8 animate-fade-in transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Lesson Top Bar Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#1C152D] border border-pink-100 dark:border-[#2D2248] shadow-card">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-200 dark:border-[#2D2248] text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-[#151022]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30">
                Track: {lesson.track}
              </span>
              <span className="hidden sm:inline text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Topic {lesson.number} of {LESSONS.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsVideoOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>Video Tutorial</span>
            </button>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-pink-200 dark:border-[#2D2248] hover:bg-pink-50 dark:hover:bg-[#151022] text-xs font-mono font-semibold"
            >
              <List className="w-4 h-4" />
              <span>Curriculum (50)</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Balanced Responsive Workspace (6 cols / 6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Theory, Concepts, Why Section, Common Mistakes, Quick Summary (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <ExplanationPanel
              lesson={lesson}
              onLoadSnippet={handleLoadConceptCode}
            />

            {explanation && <WhySection whyExplanation={explanation.whyExplanation} />}

            {/* Beginner Common Mistakes & Fixes Box */}
            <CommonMistakesBox category={lesson.category} />

            <QuickSummary summary={lesson.summary} />
          </div>

          {/* Right Column: Code Editor, Terminal, Live Visualizer, What Happened, Step-by-Step (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Monaco Python Editor with 1-Click Download .ipynb & Colab */}
            <CodeEditor
              initialCode={code}
              onRun={handleRunCode}
              isRunning={isRunning}
              onReset={handleResetCode}
              examples={lesson.examples}
              height="260px"
              title={`Topic ${lesson.number} • Python IDE`}
              lessonName={lesson.title}
            />

            {/* 2. Output Panel (Terminal prints & stats) */}
            <OutputPanel explanation={explanation} />

            {/* 3. Live Plot Visualizer Canvas */}
            {explanation && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    Live Vector Plot Visualizer
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Interactive • Edit code & click Run
                  </span>
                </div>
                <PlotVisualizer figure={explanation.parsed.figure} />
              </div>
            )}

            {/* 4. Real-World Datasets 1-Click Switcher */}
            <RealWorldDataSwitcher
              onSelectDataset={(dsCode) => {
                setCode(dsCode);
                handleRunCode(dsCode);
              }}
            />

            {/* 5. What Happened Breakdown */}
            {explanation && <WhatHappened text={explanation.whatHappened} />}

            {/* 6. Step-by-Step Execution Trace */}
            {explanation && <StepByStep steps={explanation.steps} />}
          </div>
        </div>

        {/* Dedicated Interactive Practice Challenge Arena */}
        <div className="pt-2">
          <PracticeChallenge
            challenge={lesson.challenge}
            lessonId={lesson.id}
            nextLessonSlug={nextLesson?.slug}
            onSuccess={() => setCompletedIds((prev) => [...prev, lesson.id])}
          />
        </div>

        {/* End of Lesson Interactive Mini Quiz & Confetti Celebration */}
        <div className="pt-2">
          <LessonQuiz
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            onQuizPassed={() => {
              markLessonCompleted(lesson.id);
              setCompletedIds((prev) => (prev.includes(lesson.id) ? prev : [...prev, lesson.id]));
            }}
          />
        </div>

        {/* Lesson Bottom Navigation */}
        <LessonNavigation
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          currentLesson={lesson}
          isCompleted={isCompleted}
          onToggleComplete={handleToggleComplete}
        />
      </div>

      {/* Curriculum Sidebar */}
      <CourseSidebar
        currentLessonId={lesson.id}
        completedIds={completedIds}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Video Modal */}
      {isVideoOpen && (
        <LessonVideoModal
          lesson={lesson}
          onClose={() => setIsVideoOpen(false)}
        />
      )}
    </div>
  );
}
