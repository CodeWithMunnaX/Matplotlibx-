"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { HelpCircle, CheckCircle2, XCircle, Sparkles, Award, RotateCcw, ArrowRight } from "lucide-react";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonQuizProps {
  lessonId: string;
  lessonTitle: string;
  questions?: QuizQuestion[];
  onQuizPassed?: () => void;
}

const DEFAULT_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  default: [
    {
      id: "q1",
      question: "Which Matplotlib function is used to create a standard continuous 2D line plot?",
      options: ["plt.line()", "plt.plot()", "plt.draw_line()", "plt.scatter()"],
      correctIndex: 1,
      explanation: "plt.plot(x, y) is the primary Matplotlib function for drawing continuous 2D line curves between coordinate points.",
    },
    {
      id: "q2",
      question: "What must you call after specifying label='...' so that the legend actually appears on the canvas?",
      options: ["plt.show_labels()", "plt.draw()", "plt.legend()", "plt.render()"],
      correctIndex: 2,
      explanation: "plt.legend() must be explicitly called to render the registered dataset labels in a neat legend box.",
    },
  ],
  "02-horizontal-bar-charts": [
    {
      id: "q1",
      question: "Which function renders horizontal bars in Matplotlib?",
      options: ["plt.bar()", "plt.barh()", "plt.hbar()", "plt.horizontal()"],
      correctIndex: 1,
      explanation: "plt.barh(categories, values) renders horizontal bars, which is ideal for long category names.",
    },
    {
      id: "q2",
      question: "When should you prefer Horizontal Bars (barh) over Vertical Bars?",
      options: [
        "When category names are long descriptive text strings",
        "When plotting continuous time series",
        "When plotting 3D scalar surfaces",
        "When data has only 1 data point",
      ],
      correctIndex: 0,
      explanation: "Horizontal bars provide ample horizontal space for long text labels without awkward angle rotations.",
    },
  ],
};

export default function LessonQuiz({
  lessonId,
  lessonTitle,
  questions,
  onQuizPassed,
}: LessonQuizProps) {
  const quizList = questions || DEFAULT_QUIZ_QUESTIONS[lessonId] || DEFAULT_QUIZ_QUESTIONS.default;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isPassed, setIsPassed] = useState<boolean>(false);

  const handleSelectOption = (qIndex: number, optIndex: number) => {
    if (submitted && isPassed) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let allCorrect = true;
    quizList.forEach((q, idx) => {
      if (selectedAnswers[idx] !== q.correctIndex) {
        allCorrect = false;
      }
    });

    setSubmitted(true);
    setIsPassed(allCorrect);

    if (allCorrect) {
      // Trigger Confetti Blast 🎉
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#EC4899", "#10B981", "#F43F5E", "#34D399", "#A855F7"],
        });
      } catch (err) {
        // Confetti fallback
      }

      if (onQuizPassed) {
        onQuizPassed();
      }
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setIsPassed(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isReadyToSubmit = answeredCount === quizList.length;

  return (
    <div className="bg-white dark:bg-[#1C152D] rounded-3xl p-6 sm:p-8 border border-pink-100 dark:border-[#2D2248] shadow-card space-y-6 font-sans transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 dark:border-[#2D2248] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 text-xs font-mono font-bold text-pink-700 dark:text-pink-300">
            <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
            <span>End of Lesson Knowledge Check</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-[#FDF2F8]">
            Quick Mini Quiz: 2 Concept Questions
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Test your understanding to unlock the lesson completion badge
          </p>
        </div>

        {isPassed && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold animate-fade-in shadow-sm">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Quiz Passed (100%)</span>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {quizList.map((q, qIdx) => {
          const selectedOpt = selectedAnswers[qIdx];
          const isAnswered = selectedOpt !== undefined;
          const isCorrect = submitted && selectedOpt === q.correctIndex;
          const isWrong = submitted && isAnswered && selectedOpt !== q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                submitted
                  ? isCorrect
                    ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/40"
                    : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/40"
                  : "bg-pink-50/30 dark:bg-[#151022] border-pink-100 dark:border-[#2D2248]"
              }`}
            >
              {/* Question Text */}
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  Q{qIdx + 1}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-[#FDF2F8] leading-snug">
                  {q.question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selectedOpt === optIdx;
                  const isThisCorrect = submitted && optIdx === q.correctIndex;
                  const isThisWrongSelected = submitted && isThisSelected && optIdx !== q.correctIndex;

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted && isPassed}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`p-3 rounded-xl border text-left text-xs font-mono font-medium transition-all flex items-center justify-between gap-2 ${
                        isThisCorrect
                          ? "bg-emerald-100 dark:bg-emerald-500/25 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-sm"
                          : isThisWrongSelected
                          ? "bg-rose-100 dark:bg-rose-500/25 border-rose-500 text-rose-900 dark:text-rose-200 font-bold"
                          : isThisSelected
                          ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-500 shadow-sm"
                          : "bg-white dark:bg-[#1C152D] border-pink-100 dark:border-[#2D2248] text-zinc-700 dark:text-zinc-300 hover:border-pink-300 dark:hover:border-pink-500/40"
                      }`}
                    >
                      <span className="leading-relaxed">{option}</span>
                      {isThisCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      {isThisWrongSelected && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation on Submission */}
              {submitted && (
                <div
                  className={`p-3 rounded-xl text-xs font-sans leading-relaxed border ${
                    isCorrect
                      ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-300"
                  }`}
                >
                  <span className="font-bold font-mono">
                    {isCorrect ? "✅ Explanation: " : "❌ Solution Note: "}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-pink-100 dark:border-[#2D2248]">
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          {answeredCount} of {quizList.length} answered
        </span>

        <div className="flex items-center gap-2">
          {submitted && !isPassed && (
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-pink-200 dark:border-[#2D2248] hover:bg-pink-50 dark:hover:bg-[#151022] text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          )}

          {!isPassed ? (
            <button
              disabled={!isReadyToSubmit}
              onClick={handleSubmitQuiz}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-mono text-xs font-black transition-all ${
                isReadyToSubmit
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-sm hover:scale-105"
                  : "bg-zinc-100 dark:bg-[#151022] text-zinc-400 border border-zinc-200 dark:border-[#2D2248] cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Check Answers</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Lesson Mastered!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
