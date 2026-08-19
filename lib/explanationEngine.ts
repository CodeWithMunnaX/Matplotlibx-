// lib/explanationEngine.ts
// Generates step-by-step visual breakdowns, pedagogical insights, and Matplotlib anatomy traces

import { parsePythonMatplotlib, ParseResult, ParsedLine } from "./parser";
import { FigureState } from "./matplotlibSimulator";

export interface StepExplanation {
  stepNumber: number;
  lineNumber: number;
  codeSnippet: string;
  actionTitle: string;
  description: string;
  badgeType: "setup" | "data" | "plot" | "style" | "output";
}

export interface FullExplanation {
  parsed: ParseResult;
  summary: string;
  plotCount: number;
  axesCount: number;
  elementsSummary: { type: string; count: number }[];
  steps: StepExplanation[];
  whatHappened: string;
  whyExplanation: {
    title: string;
    description: string;
    mentalModel: string;
    proTip: string;
  };
  executionTimeMs: number;
}

export function generateExplanation(code: string): FullExplanation {
  const startTime = performance.now();
  const parsed = parsePythonMatplotlib(code);
  const endTime = performance.now();
  const executionTimeMs = Math.max(1, Math.round((endTime - startTime) * 10) / 10);

  const figure = parsed.figure;
  const axesCount = figure.axes.length;

  let totalElements = 0;
  const elementCounts: Record<string, number> = {};

  for (const ax of figure.axes) {
    for (const el of ax.elements) {
      totalElements++;
      elementCounts[el.type] = (elementCounts[el.type] || 0) + 1;
    }
  }

  const elementsSummary = Object.entries(elementCounts).map(([type, count]) => ({
    type,
    count,
  }));

  // Build steps
  const steps: StepExplanation[] = parsed.traces.map((trace, idx) => {
    let badgeType: StepExplanation["badgeType"] = "plot";
    if (trace.type === "IMPORT") badgeType = "setup";
    else if (trace.type === "FIGURE" || trace.type === "SUBPLOTS") badgeType = "setup";
    else if (trace.type === "ASSIGNMENT") badgeType = "data";
    else if (trace.type === "DECORATION" || trace.type === "LAYOUT") badgeType = "style";
    else if (trace.type === "PRINT" || trace.type === "RENDER") badgeType = "output";

    return {
      stepNumber: idx + 1,
      lineNumber: trace.lineNumber,
      codeSnippet: trace.raw,
      actionTitle: trace.type.replace(/_/g, " "),
      description: trace.description,
      badgeType,
    };
  });

  // Dynamic what happened summary
  let whatHappened = "";
  if (totalElements === 0) {
    whatHappened =
      "The script initialized the figure environment, but no plotting commands (like plt.plot, plt.scatter, or plt.bar) were executed to draw data marks.";
  } else {
    const typesPresent = Object.keys(elementCounts).join(", ");
    whatHappened = `Created a ${figure.figsize[0]}x${figure.figsize[1]} figure containing ${axesCount} axes panel(s). Rendered ${totalElements} graphical layer(s) ([${typesPresent}]) and applied layout formatting.`;
  }

  // Why explanation
  const whyExplanation = {
    title: "Matplotlib Architecture & Rendering Pipeline",
    description:
      "Matplotlib separates visualization into three distinct layers: the Backend (rendering to screen/PNG), the Artist layer (all visible elements like Figures, Axes, Lines, Text), and the Scripting layer (pyplot API).",
    mentalModel:
      "Imagine the Figure as a physical artist's canvas on an easel, each Axes as an individual paper taped to the canvas, and lines/bars/text as strokes of paint applied inside the paper boundaries.",
    proTip:
      "For production scripts and complex dashboards, always prefer the Object-Oriented interface (`fig, ax = plt.subplots()`) over `plt.plot()` to retain full, explicit control over individual subplots.",
  };

  const summary = `Figure with ${axesCount} Axes • ${totalElements} Chart Layers • ${parsed.prints.length} Console Prints`;

  return {
    parsed,
    summary,
    plotCount: totalElements,
    axesCount,
    elementsSummary,
    steps,
    whatHappened,
    whyExplanation,
    executionTimeMs,
  };
}
