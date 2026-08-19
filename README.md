# MatplotlibX

An Interactive Visual Python Plotting Laboratory and Full Course

MatplotlibX is a developer learning platform designed to teach Matplotlib and Python Data Visualization visually through live vector plots, interactive parameter studios, colormap explorers, subplots builders, and a complete 50-topic master curriculum.

---

## Overview

- In-browser Python AST simulation engine: Parses and renders Matplotlib scripts directly in the browser with zero backend server setup.
- Interactive Vector Visualizer: Real-time rendering for line plots, scatter plots, bar charts, horizontal bars, histograms, pie charts, box plots, violin plots, 2D heatmaps, 2D contours, area fills, dual y-axes, and 3D surface plots.
- Live Parameter Chart Studio: Interactive controls for visual parameter tweaking and instant Python code generation.
- Master Chart Decision Guide: Condition-based reference matrix explaining when to use each chart type, real-world examples, anti-patterns, and runnable syntax.
- Figure Anatomy Guide: Comprehensive breakdown of Figure, Axes, Spines, Ticks, Tick Labels, Legend, and Data Marks.
- 50 Master Lessons: Step-by-step curriculum covering beginner basics to advanced 3D surfaces and executive dashboard subplots.
- Interactive Colormap Explorer: Previews of 20+ Matplotlib color palettes across sequential, diverging, and perceptually uniform scales.
- 3D Surface Studio: Interactive 360-degree rotation, elevation, and azimuth controls for 3D scalar fields.

---

## 50-Topic Master Curriculum

| Track | Description | Key Topics |
|---|---|---|
| Track 1: Fundamentals | Core architecture and basic 2D line plotting | Introduction, Figure Anatomy, Line Plots, Line Styles, Markers, Colors, Labels, Grids, Legends, Multi-line Curves |
| Track 2: Essential Charts | Categorical, proportional, and statistical plotting | Vertical Bars, Horizontal Bars, Histograms, Scatter Plots, Pie Charts, Box Plots, Violin Plots, Error Bars, Shaded Areas, Stackplots |
| Track 3: Subplots and Layouts | Multi-panel figures and layout engines | Subplot Grid Coordinates, Object-Oriented Subplots, GridSpec, Inset Axes, Dual Y-Axes, Shared Axes, Figure DPI, Tight Layout, Constrained Layout, Pandas DataFrame Integration |
| Track 4: Advanced Styling | Heatmaps, contours, math text, and custom axes | Colormaps, Normalization (vmin/vmax), Heatmaps (imshow), Contour Plots (contourf), Spines Customization, Ticks and Locators, Log Scales, Annotations, Math Text, Polar Plots |
| Track 5: 3D and Projects | 3D visualizers, vector fields, and capstone | 3D Surface Plots, 3D Wireframes, 3D Bar Charts, Vector Quiver Fields, Stylesheets, Candlestick Plots, Time-Series Dates, High-Res Export (savefig), Animations, Executive Dashboard Project |

---

## Technology Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Code Editor: Monaco Editor (VS Code in-browser engine)
- Parser: Custom Client-Side Python AST Parser and Vector SVG Plot Generator
- State Management: React Hooks and LocalStorage persistence

---

## Getting Started Locally

### Prerequisites

- Node.js version 18.17.0 or higher
- npm version 9.0.0 or higher

### Installation

1. Navigate to the project directory:
   ```bash
   cd MATPLOTLIB_PROJECT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## Project Directory Structure

```
MATPLOTLIB_PROJECT/
├── app/
│   ├── globals.css              # Global styles and theme color tokens
│   ├── layout.tsx               # Root application layout and providers
│   ├── page.tsx                 # Home page and curriculum dashboard
│   ├── playground/
│   │   └── page.tsx             # Interactive Python IDE and preset lab
│   └── lessons/
│       ├── page.tsx             # Full curriculum directory
│       └── [id]/
│           └── page.tsx         # Interactive lesson workspace and runner
├── components/
│   ├── Navbar.tsx               # Top navigation bar
│   ├── Footer.tsx               # Application footer
│   ├── Hero.tsx                 # Home page hero section with live plot preview
│   ├── LessonCard.tsx           # Curriculum card component
│   ├── CodeEditor.tsx           # Monaco code editor integration
│   ├── PlotVisualizer.tsx       # Vector SVG and Canvas plot renderer
│   ├── ChartDecisionGuide.tsx   # Condition-based chart selection matrix
│   ├── ChartStudio.tsx          # Parameter-driven visual chart builder
│   ├── MatplotlibAnatomy.tsx    # Interactive figure anatomy inspector
│   ├── ColormapExplorer.tsx     # Color palette and colormap inspector
│   ├── Plot3DStudio.tsx         # 3D surface rotation visualizer
│   ├── SubplotLayoutBuilder.tsx # Multi-subplot grid designer
│   └── ThemeProvider.tsx        # Light and Dark theme context provider
├── data/
│   ├── lessons.ts               # Complete metadata and code for 50 lessons
│   └── templates.ts             # Pre-built playground templates
├── lib/
│   ├── parser.ts                # Client-side Python AST parser and mathematical evaluator
│   ├── explanationEngine.ts     # Educational step-by-step code analyzer
│   └── storage.ts               # LocalStorage progress tracking helpers
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies and build scripts
```

---

## Available Scripts

- `npm run dev`: Starts the Next.js development server on port 3000.
- `npm run build`: Compiles and builds the application for production.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint to check for syntax and type issues.

---

## Key Features

### 1. In-Browser Python AST Parser
Parses Python Matplotlib code without sending code to any remote backend server. Handles NumPy arrays (`np.linspace`, `np.arange`, `np.random`), mathematical expressions, and Matplotlib plotting commands in real time.

### 2. Live Vector Graphics Output
Renders clean scalable vector graphics (SVG) with support for hover tooltips, grid toggles, SVG export, and PNG download.

### 3. Chart Decision Guide
Contains structured guidance for 15+ Matplotlib chart types, specifying ideal conditions, real-world examples, anti-patterns, pro tips, and Python code snippets.

### 4. Interactive Learning Workspace
Each lesson includes theory notes, an editable code block, live plot preview, step-by-step code execution breakdowns, and interactive practice challenges.

---

## Author

Created by Munna Kumar (@CodeWithMunnaX).

- YouTube: https://www.youtube.com/@CodeWithMunnaX
- LinkedIn: https://www.linkedin.com/in/munna-kumar-93234b241
- Instagram: https://www.instagram.com/codewithmunnax

---

## License

This project is licensed under the MIT License.
