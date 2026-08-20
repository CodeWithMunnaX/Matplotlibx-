// ====================================================
// MATPLOTLIB & PYTHON IN-BROWSER AST SIMULATOR & PARSER
// Pure Client-Side Execution Engine
// ====================================================

import {
  FigureState,
  AxesState,
  PlotElement,
  createDefaultFigure,
  DEFAULT_COLORS,
  np,
  calculateHistogramBins,
  calculateBoxplotStats,
} from "./matplotlibSimulator";

export interface ParsedLine {
  lineNumber: number;
  raw: string;
  type: string;
  description: string;
}

export interface ParseResult {
  figure: FigureState;
  prints: string[];
  traces: ParsedLine[];
  errors: string[];
  hasErrors: boolean;
  variables: Record<string, any>;
}

// ----------------------------------------------------
// EXPRESSION EVALUATOR (Safe In-Memory Python Math Parser)
// ----------------------------------------------------
export function evaluatePythonExpr(
  expr: string,
  vars: Record<string, any>
): any {
  const clean = expr.trim();

  // Empty
  if (!clean) return undefined;

  // Variables lookup
  if (vars[clean] !== undefined) {
    return vars[clean];
  }

  // String literals: "hello" or 'world'
  if (
    (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith("'") && clean.endsWith("'"))
  ) {
    return clean.slice(1, -1);
  }

  // Booleans & None
  if (clean === "True") return true;
  if (clean === "False") return false;
  if (clean === "None") return null;

  // Number
  if (!isNaN(Number(clean))) return Number(clean);

  // List literal: [1, 2, 3, 4]
  if (clean.startsWith("[") && clean.endsWith("]")) {
    const inner = clean.slice(1, -1).trim();
    if (!inner) return [];
    const items = splitArgs(inner);
    return items.map((item) => evaluatePythonExpr(item, vars));
  }

  // Tuple literal: (8, 5)
  if (clean.startsWith("(") && clean.endsWith(")")) {
    const inner = clean.slice(1, -1).trim();
    const items = splitArgs(inner);
    return items.map((item) => evaluatePythonExpr(item, vars));
  }

  // len(obj)
  const lenMatch = clean.match(/^len\((.*)\)$/);
  if (lenMatch) {
    const target = evaluatePythonExpr(lenMatch[1], vars);
    if (Array.isArray(target) || typeof target === "string") {
      return target.length;
    }
    return 0;
  }

  // range(stop) or range(start, stop, step)
  const rangeMatch = clean.match(/^range\((.*)\)$/);
  if (rangeMatch) {
    const args = splitArgs(rangeMatch[1]);
    if (args.length === 1) {
      const stop = evaluatePythonExpr(args[0], vars) ?? 0;
      return np.arange(stop);
    }
    const start = evaluatePythonExpr(args[0], vars) ?? 0;
    const stop = evaluatePythonExpr(args[1], vars) ?? 0;
    const step = args[2] ? evaluatePythonExpr(args[2], vars) : 1;
    return np.arange(start, stop, step);
  }

  // np.array([...])
  const arrayMatch = clean.match(/^np\.(?:array)\((.*)\)$/);
  if (arrayMatch) {
    const arg = evaluatePythonExpr(arrayMatch[1], vars);
    return Array.isArray(arg) ? arg : [arg];
  }

  // np.pi
  if (clean === "np.pi" || clean === "numpy.pi") return Math.PI;

  // np.linspace(start, stop, num)
  const linspaceMatch = clean.match(/^np\.(?:linspace)\((.*)\)$/);
  if (linspaceMatch) {
    const args = splitArgs(linspaceMatch[1]);
    const start = evaluatePythonExpr(args[0], vars) ?? 0;
    const stop = evaluatePythonExpr(args[1], vars) ?? 10;
    const num = args[2] ? evaluatePythonExpr(args[2], vars) : 50;
    return np.linspace(start, stop, num);
  }

  // np.arange(start, stop, step)
  const arangeMatch = clean.match(/^np\.(?:arange)\((.*)\)$/);
  if (arangeMatch) {
    const args = splitArgs(arangeMatch[1]);
    if (args.length === 1) {
      return np.arange(evaluatePythonExpr(args[0], vars));
    }
    const start = evaluatePythonExpr(args[0], vars);
    const stop = evaluatePythonExpr(args[1], vars);
    const step = args[2] ? evaluatePythonExpr(args[2], vars) : 1;
    return np.arange(start, stop, step);
  }

  // np.sin(x), np.cos(x), np.tan(x), np.exp(x), np.log(x), np.sqrt(x)
  const mathFuncMatch = clean.match(/^np\.(sin|cos|tan|exp|log|sqrt)\((.*)\)$/);
  if (mathFuncMatch) {
    const fn = mathFuncMatch[1];
    const val = evaluatePythonExpr(mathFuncMatch[2], vars);
    if (fn === "sin") return np.sin(val);
    if (fn === "cos") return np.cos(val);
    if (fn === "tan") return np.tan(val);
    if (fn === "exp") return np.exp(val);
    if (fn === "log") return np.log(val);
    if (fn === "sqrt") return np.sqrt(val);
  }

  // np.random.randn, np.random.rand, np.random.randint, np.random.normal, np.random.uniform
  const randMatch = clean.match(/^np\.random\.(randn|rand|randint|normal|uniform|seed)\((.*)\)$/);
  if (randMatch) {
    const fn = randMatch[1];
    const args = splitArgs(randMatch[2]);
    if (fn === "seed") {
      np.random.seed(evaluatePythonExpr(args[0], vars) || 42);
      return null;
    }
    if (fn === "randn") {
      return np.random.randn(args[0] ? evaluatePythonExpr(args[0], vars) : 10);
    }
    if (fn === "rand") {
      return np.random.rand(args[0] ? evaluatePythonExpr(args[0], vars) : 10);
    }
    if (fn === "randint") {
      const low = evaluatePythonExpr(args[0], vars) ?? 0;
      const high = evaluatePythonExpr(args[1], vars) ?? 10;
      const size = args[2] ? evaluatePythonExpr(args[2], vars) : 10;
      return np.random.randint(low, high, size);
    }
    if (fn === "normal") {
      const loc = evaluatePythonExpr(args[0], vars) ?? 0;
      const scale = evaluatePythonExpr(args[1], vars) ?? 1;
      const size = args[2] ? evaluatePythonExpr(args[2], vars) : 100;
      return np.random.normal(loc, scale, size);
    }
    if (fn === "uniform") {
      const low = evaluatePythonExpr(args[0], vars) ?? 0;
      const high = evaluatePythonExpr(args[1], vars) ?? 1;
      const size = args[2] ? evaluatePythonExpr(args[2], vars) : 10;
      return Array.from({ length: size }, () => Math.random() * (high - low) + low);
    }
  }

  // np.meshgrid(x, y)
  const meshMatch = clean.match(/^np\.meshgrid\((.*)\)$/);
  if (meshMatch) {
    const args = splitArgs(meshMatch[1]);
    const x = evaluatePythonExpr(args[0], vars) || np.linspace(-3, 3, 20);
    const y = evaluatePythonExpr(args[1], vars) || np.linspace(-3, 3, 20);
    return np.meshgrid(x, y);
  }

  // Array/List slicing & indexing: arr[::2], arr[0:5], arr[i], arr[-1]
  const sliceMatch = clean.match(/^([a-zA-Z_]\w*)\[([^\]]+)\]$/);
  if (sliceMatch) {
    const varName = sliceMatch[1];
    const sliceExpr = sliceMatch[2].trim();
    const arr = vars[varName];
    if (Array.isArray(arr)) {
      if (sliceExpr.startsWith("::")) {
        const step = parseInt(sliceExpr.slice(2), 10) || 1;
        return arr.filter((_, idx) => idx % step === 0);
      }
      if (sliceExpr.includes(":")) {
        const parts = sliceExpr.split(":");
        const start = parts[0] ? parseInt(parts[0], 10) : 0;
        const end = parts[1] ? parseInt(parts[1], 10) : arr.length;
        const step = parts[2] ? parseInt(parts[2], 10) : 1;
        const sliced = arr.slice(start, end);
        return step !== 1 ? sliced.filter((_, idx) => idx % step === 0) : sliced;
      }
      const idx = parseInt(sliceExpr, 10);
      return !isNaN(idx) ? arr[idx < 0 ? arr.length + idx : idx] : arr;
    }
  }

  // Recursive element-wise arithmetic and binary operations on arrays and numbers
  const binOp = findTopLevelBinaryOp(clean);
  if (binOp) {
    const left = evaluatePythonExpr(binOp.left, vars);
    const op = binOp.op;
    const right = evaluatePythonExpr(binOp.right, vars);

    if (Array.isArray(left) && typeof right === "number") {
      if (op === "+") return left.map((v) => v + right);
      if (op === "-") return left.map((v) => v - right);
      if (op === "*") return left.map((v) => v * right);
      if (op === "/") return left.map((v) => (right !== 0 ? v / right : 0));
      if (op === "**") return left.map((v) => Math.pow(v, right));
    }
    if (typeof left === "number" && Array.isArray(right)) {
      if (op === "+") return right.map((v) => left + v);
      if (op === "-") return right.map((v) => left - v);
      if (op === "*") return right.map((v) => left * v);
      if (op === "/") return right.map((v) => (v !== 0 ? left / v : 0));
      if (op === "**") return right.map((v) => Math.pow(left, v));
    }
    if (Array.isArray(left) && Array.isArray(right)) {
      if (op === "+") return left.map((v, i) => v + (right[i] || 0));
      if (op === "-") return left.map((v, i) => v - (right[i] || 0));
      if (op === "*") return left.map((v, i) => v * (right[i] !== undefined ? right[i] : 1));
      if (op === "/") return left.map((v, i) => (right[i] ? v / right[i] : 0));
      if (op === "**") return left.map((v, i) => Math.pow(v, right[i] || 1));
    }
    if (typeof left === "number" && typeof right === "number") {
      if (op === "+") return left + right;
      if (op === "-") return left - right;
      if (op === "*") return left * right;
      if (op === "/") return right !== 0 ? left / right : 0;
      if (op === "**") return Math.pow(left, right);
    }
  }

  return clean;
}

// Helper to find top-level binary operators taking operator precedence into account
function findTopLevelBinaryOp(expr: string): { left: string; op: string; right: string } | null {
  const searchOps = (operators: string[]) => {
    let depth = 0;
    let inQuotes = false;
    let quoteChar = "";

    for (let i = expr.length - 1; i >= 0; i--) {
      const char = expr[i];

      if ((char === '"' || char === "'") && (i === 0 || expr[i - 1] !== "\\")) {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (quoteChar === char) {
          inQuotes = false;
        }
        continue;
      }

      if (inQuotes) continue;

      if (char === ")" || char === "]" || char === "}") {
        depth++;
        continue;
      }
      if (char === "(" || char === "[" || char === "{") {
        depth--;
        continue;
      }

      if (depth === 0) {
        if (operators.includes("**") && i >= 1 && expr.slice(i - 1, i + 1) === "**") {
          return {
            left: expr.slice(0, i - 1).trim(),
            op: "**",
            right: expr.slice(i + 1).trim(),
          };
        }

        if (operators.includes(char)) {
          if (char === "-" && (i === 0 || "+-*/(%=[,".includes(expr[i - 1].trim()))) {
            continue;
          }
          return {
            left: expr.slice(0, i).trim(),
            op: char,
            right: expr.slice(i + 1).trim(),
          };
        }
      }
    }
    return null;
  };

  const addSub = searchOps(["+", "-"]);
  if (addSub && addSub.left && addSub.right) return addSub;

  const mulDiv = searchOps(["*", "/", "%"]);
  if (mulDiv && mulDiv.left && mulDiv.right) return mulDiv;

  const power = searchOps(["**"]);
  if (power && power.left && power.right) return power;

  return null;
}

// Helper: Split arguments inside parentheses accounting for nested commas in lists/tuples
function splitArgs(argStr: string): string[] {
  const args: string[] = [];
  let current = "";
  let depth = 0;
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < argStr.length; i++) {
    const char = argStr[i];
    if ((char === '"' || char === "'") && (i === 0 || argStr[i - 1] !== "\\")) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
      }
    }

    if (!inQuotes) {
      if (char === "(" || char === "[" || char === "{") depth++;
      else if (char === ")" || char === "]" || char === "}") depth--;
      else if (char === "," && depth === 0) {
        args.push(current.trim());
        current = "";
        continue;
      }
    }
    current += char;
  }
  if (current.trim()) {
    args.push(current.trim());
  }
  return args;
}

// Helper: Parse positional arguments and keyword arguments (e.g. color="red", alpha=0.8)
function parseArgsAndKwargs(
  argList: string[],
  vars: Record<string, any>
): { positional: any[]; kwargs: Record<string, any> } {
  const positional: any[] = [];
  const kwargs: Record<string, any> = {};

  for (const arg of argList) {
    const eqIdx = arg.indexOf("=");
    if (eqIdx !== -1 && !arg.startsWith("[") && !arg.startsWith("(")) {
      const key = arg.slice(0, eqIdx).trim();
      const valExpr = arg.slice(eqIdx + 1).trim();
      kwargs[key] = evaluatePythonExpr(valExpr, vars);
    } else {
      positional.push(evaluatePythonExpr(arg, vars));
    }
  }

  return { positional, kwargs };
}

// ----------------------------------------------------
// MAIN PARSE & EXECUTION PIPELINE
// ----------------------------------------------------
export function parsePythonMatplotlib(code: string): ParseResult {
  const lines = code.split("\n");
  const figure: FigureState = createDefaultFigure();
  const prints: string[] = [];
  const traces: ParsedLine[] = [];
  const errors: string[] = [];

  const vars: Record<string, any> = {
    np: np,
    numpy: np,
    plt: null,
  };

  const axesMap = new Map<string, AxesState>();
  let currentAxIndex = 0;
  let colorIndex = 0;

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const trimmed = rawLine.trim();
    const lineNum = idx + 1;

    // Skip empty lines or comments
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    try {
      // 1. Imports
      if (trimmed.startsWith("import ") || trimmed.startsWith("from ")) {
        traces.push({
          lineNumber: lineNum,
          raw: trimmed,
          type: "IMPORT",
          description: `Imported module (${trimmed}) into Python namespace.`,
        });
        continue;
      }

      // 2. Prints: print(...)
      if (trimmed.startsWith("print(") && trimmed.endsWith(")")) {
        const inner = trimmed.slice(6, -1);
        const args = splitArgs(inner);
        const rendered = args
          .map((arg) => {
            const evaluated = evaluatePythonExpr(arg, vars);
            if (Array.isArray(evaluated)) {
              if (evaluated.length > 10) {
                return `[${evaluated.slice(0, 5).join(", ")} ... ${evaluated.slice(-2).join(", ")}]`;
              }
              return JSON.stringify(evaluated);
            }
            return String(evaluated ?? "");
          })
          .join(" ");
        prints.push(rendered);
        traces.push({
          lineNumber: lineNum,
          raw: trimmed,
          type: "PRINT",
          description: `Printed console output: ${rendered}`,
        });
        continue;
      }

      // 3. Subplots creation:
      // fig, ax = plt.subplots(...)
      // fig, (ax1, ax2) = plt.subplots(...)
      // fig, [ax1, ax2] = plt.subplots(...)
      // fig, axs = plt.subplots(...)
      const subplotsMatch = trimmed.match(
        /^(?:(?:([a-zA-Z_]\w*)\s*,\s*)?(?:([a-zA-Z_]\w*)|\((.*?)\)|\[(.*?)\])\s*=\s*)?plt\.subplots\((.*)\)$/
      );
      if (subplotsMatch) {
        const figVar = subplotsMatch[1] || "fig";
        const singleAxVar = subplotsMatch[2];
        const tupleAxVars = subplotsMatch[3];
        const listAxVars = subplotsMatch[4];
        const argsStr = subplotsMatch[5] || "";

        const { positional, kwargs } = parseArgsAndKwargs(splitArgs(argsStr), vars);
        const nrows = positional[0] || kwargs.nrows || 1;
        const ncols = positional[1] || kwargs.ncols || 1;
        const figsize = kwargs.figsize || [8, 4.5 * (nrows > 1 ? 1.4 : 1)];

        figure.figsize = Array.isArray(figsize) ? [Number(figsize[0]), Number(figsize[1])] : [8, 5];
        figure.nrows = nrows;
        figure.ncols = ncols;
        figure.axes = [];

        for (let r = 0; r < nrows; r++) {
          for (let c = 0; c < ncols; c++) {
            const axObj: AxesState = {
              id: `ax_${r}_${c}`,
              row: r,
              col: c,
              spines: { top: true, right: true, bottom: true, left: true },
              elements: [],
            };
            figure.axes.push(axObj);
          }
        }
        currentAxIndex = 0;

        // Register variable names in map
        if (tupleAxVars || listAxVars) {
          const varNames = (tupleAxVars || listAxVars)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          varNames.forEach((vName, i) => {
            if (figure.axes[i]) {
              axesMap.set(vName, figure.axes[i]);
              vars[vName] = figure.axes[i];
            }
          });
        } else if (singleAxVar) {
          if (singleAxVar === "ax") {
            axesMap.set("ax", figure.axes[0]);
            vars["ax"] = figure.axes[0];
          } else {
            vars[singleAxVar] = figure.axes;
            figure.axes.forEach((a, i) => {
              axesMap.set(`${singleAxVar}[${i}]`, a);
              axesMap.set(`${singleAxVar}[${a.row}, ${a.col}]`, a);
              axesMap.set(`${singleAxVar}[${a.row}][${a.col}]`, a);
              axesMap.set(`ax${i + 1}`, a);
            });
          }
        } else {
          axesMap.set("ax", figure.axes[0]);
          vars["ax"] = figure.axes[0];
        }

        traces.push({
          lineNumber: lineNum,
          raw: trimmed,
          type: "SUBPLOTS",
          description: `Created Figure with ${nrows}x${ncols} Subplot Axes grid (figsize=${figure.figsize[0]}x${figure.figsize[1]}).`,
        });
        continue;
      }

      // 4. fig.add_subplot(...)
      const addSubplotMatch = trimmed.match(/^(?:([a-zA-Z_]\w*)\s*=\s*)?fig\.add_subplot\((.*)\)$/);
      if (addSubplotMatch) {
        const axVarName = addSubplotMatch[1] || "ax";
        const { positional, kwargs } = parseArgsAndKwargs(splitArgs(addSubplotMatch[2]), vars);
        const is3D = kwargs.projection === "3d" || positional.includes("3d");
        const axObj: AxesState = {
          id: `ax_${figure.axes.length}`,
          row: 0,
          col: figure.axes.length,
          spines: { top: true, right: true, bottom: true, left: true },
          elements: [],
          is3D,
        };
        figure.axes.push(axObj);
        axesMap.set(axVarName, axObj);
        vars[axVarName] = axObj;
        currentAxIndex = figure.axes.length - 1;
        traces.push({
          lineNumber: lineNum,
          raw: trimmed,
          type: "SUBPLOT_SELECT",
          description: `Added subplot axes \`${axVarName}\`${is3D ? " with 3D projection" : ""}.`,
        });
        continue;
      }

      // 5. ax2 = ax1.twinx()
      const twinxMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*([a-zA-Z_]\w*)\.twinx\(\)$/);
      if (twinxMatch) {
        const newAxVar = twinxMatch[1];
        const parentAxVar = twinxMatch[2];
        const parentAx = axesMap.get(parentAxVar) || figure.axes[currentAxIndex] || figure.axes[0];
        parentAx.hasTwinX = true;
        axesMap.set(newAxVar, parentAx);
        vars[newAxVar] = parentAx;
        traces.push({
          lineNumber: lineNum,
          raw: trimmed,
          type: "TWIN_AXIS",
          description: `Created secondary twin Y-axis on the right for \`${newAxVar}\`.`,
        });
        continue;
      }

      // 6. plt.figure(...)
      const figMatch = trimmed.match(/^plt\.figure\((.*)\)$/);
      if (figMatch) {
        const { kwargs } = parseArgsAndKwargs(splitArgs(figMatch[1]), vars);
        if (kwargs.figsize && Array.isArray(kwargs.figsize)) {
          figure.figsize = [Number(kwargs.figsize[0]), Number(kwargs.figsize[1])];
        }
        if (kwargs.dpi) figure.dpi = Number(kwargs.dpi);
        if (kwargs.facecolor) figure.facecolor = String(kwargs.facecolor);

        traces.push({
          lineNumber: lineNum,
          raw: trimmed,
          type: "FIGURE",
          description: `Configured Figure container (figsize=${figure.figsize[0]}x${figure.figsize[1]}, dpi=${figure.dpi}).`,
        });
        continue;
      }

      // 7. plt.subplot(nrows, ncols, index) or plt.subplot(221)
      const subplotMatch = trimmed.match(/^(?:([a-zA-Z_]\w*)\s*=\s*)?plt\.subplot\((.*)\)$/);
      if (subplotMatch) {
        const axVarName = subplotMatch[1];
        const rawArgs = splitArgs(subplotMatch[2]);
        let r = 1,
          c = 1,
          idxVal = 1;
        if (rawArgs.length === 1 && String(rawArgs[0]).length === 3) {
          const s = String(rawArgs[0]);
          r = parseInt(s[0]);
          c = parseInt(s[1]);
          idxVal = parseInt(s[2]);
        } else {
          r = evaluatePythonExpr(rawArgs[0], vars) || 1;
          c = evaluatePythonExpr(rawArgs[1], vars) || 1;
          idxVal = evaluatePythonExpr(rawArgs[2], vars) || 1;
        }

        figure.nrows = Math.max(figure.nrows, r);
        figure.ncols = Math.max(figure.ncols, c);

        const targetRow = Math.floor((idxVal - 1) / c);
        const targetCol = (idxVal - 1) % c;

        let existingAx = figure.axes.find((a) => a.row === targetRow && a.col === targetCol);
        if (!existingAx) {
          existingAx = {
            id: `ax_${targetRow}_${targetCol}`,
            row: targetRow,
            col: targetCol,
            spines: { top: true, right: true, bottom: true, left: true },
            elements: [],
          };
          figure.axes.push(existingAx);
        }
        currentAxIndex = figure.axes.indexOf(existingAx);
        if (axVarName) {
          axesMap.set(axVarName, existingAx);
          vars[axVarName] = existingAx;
        }

        traces.push({
          lineNumber: lineNum,
          raw: trimmed,
          type: "SUBPLOT_SELECT",
          description: `Active axes set to Subplot (${r}x${c}, index=${idxVal}).`,
        });
        continue;
      }

      // 8. Direct variable assignments: x = ..., y = ..., [x, y] = np.meshgrid(...)
      const assignMatch = trimmed.match(/^([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varNames = assignMatch[1].split(",").map((s) => s.trim());
        const expr = assignMatch[2].trim();

        if (expr.startsWith("np.meshgrid(") || expr.startsWith("numpy.meshgrid(")) {
          const [X, Y] = evaluatePythonExpr(expr, vars);
          if (varNames.length >= 2) {
            vars[varNames[0]] = X;
            vars[varNames[1]] = Y;
          }
          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "ASSIGNMENT",
            description: `Generated 2D coordinate meshgrids for [${varNames.join(", ")}].`,
          });
          continue;
        }

        const evaluated = evaluatePythonExpr(expr, vars);
        if (varNames.length === 1) {
          vars[varNames[0]] = evaluated;
        }
        traces.push({
          lineNumber: lineNum,
          raw: trimmed,
          type: "ASSIGNMENT",
          description: `Assigned variable \`${varNames[0]}\` (${Array.isArray(evaluated) ? `${evaluated.length} elements` : typeof evaluated}).`,
        });
        continue;
      }

      // Ensure at least one default axes exists
      if (figure.axes.length === 0) {
        figure.axes.push({
          id: "ax_0_0",
          row: 0,
          col: 0,
          spines: { top: true, right: true, bottom: true, left: true },
          elements: [],
        });
        currentAxIndex = 0;
      }

      // 9. Method Calls on plt, ax, ax1, ax2, axs[0], etc.
      const methodMatch = trimmed.match(/^([a-zA-Z_]\w*(?:\[.*?\])?)\.([a-zA-Z_]\w*)\((.*)\)$/);
      if (methodMatch) {
        const callerName = methodMatch[1];
        const method = methodMatch[2];
        const rawArgs = splitArgs(methodMatch[3]);
        const { positional, kwargs } = parseArgsAndKwargs(rawArgs, vars);

        // Resolve target axes:
        let curAx: AxesState = figure.axes[currentAxIndex] || figure.axes[0];
        if (axesMap.has(callerName)) {
          curAx = axesMap.get(callerName)!;
        } else if (callerName.startsWith("ax")) {
          const numMatch = callerName.match(/^ax(\d+)$/);
          if (numMatch) {
            const num = parseInt(numMatch[1], 10);
            const targetIdx = num >= 1 && num <= figure.axes.length ? num - 1 : num;
            if (figure.axes[targetIdx]) curAx = figure.axes[targetIdx];
          }
        } else if (callerName.startsWith("axs[")) {
          const idxMatch = callerName.match(/^axs?\[(\d+)(?:,\s*(\d+)|\]\[(\d+))?\]$/);
          if (idxMatch) {
            const idx1 = parseInt(idxMatch[1], 10);
            const idx2Str = idxMatch[2] || idxMatch[3];
            if (idx2Str !== undefined) {
              const idx2 = parseInt(idx2Str, 10);
              const found = figure.axes.find((a) => a.row === idx1 && a.col === idx2);
              if (found) curAx = found;
            } else if (figure.axes[idx1]) {
              curAx = figure.axes[idx1];
            }
          }
        }

        // A. LINE PLOT: plot(x, y) or plot(y)
        if (method === "plot") {
          let xData: number[] = [];
          let yData: number[] = [];

          if (positional.length === 1) {
            yData = positional[0] || [];
            xData = np.arange(yData.length);
          } else if (positional.length >= 2) {
            xData = positional[0] || [];
            yData = positional[1] || [];
          }

          const defaultCol = DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length];
          colorIndex++;

          curAx.elements.push({
            type: "line",
            x: Array.isArray(xData) ? xData : [],
            y: Array.isArray(yData) ? yData : [],
            color: kwargs.color || kwargs.c || defaultCol,
            linestyle: kwargs.linestyle || kwargs.ls || "-",
            linewidth: kwargs.linewidth ?? kwargs.lw ?? 2,
            marker: kwargs.marker,
            markersize: kwargs.markersize ?? kwargs.ms ?? 6,
            markeredgecolor: kwargs.markeredgecolor ?? kwargs.mec,
            label: kwargs.label,
            alpha: kwargs.alpha ?? 1.0,
          });

          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "PLOT_LINE",
            description: `Rendered 2D Line Plot on [${curAx.id}] with ${Array.isArray(xData) ? xData.length : 0} data points${kwargs.label ? ` (label="${kwargs.label}")` : ""}.`,
          });
          continue;
        }

        // B. SCATTER PLOT: scatter(x, y, s=..., c=..., cmap=...)
        if (method === "scatter") {
          const xData = positional[0] || [];
          const yData = positional[1] || [];
          const defaultCol = DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length];
          colorIndex++;

          curAx.elements.push({
            type: "scatter",
            x: Array.isArray(xData) ? xData : [],
            y: Array.isArray(yData) ? yData : [],
            s: kwargs.s ?? 50,
            c: kwargs.c ?? kwargs.color ?? defaultCol,
            cmap: kwargs.cmap || "viridis",
            marker: kwargs.marker || "o",
            alpha: kwargs.alpha ?? 0.85,
            edgecolors: kwargs.edgecolors || kwargs.edgecolor,
            label: kwargs.label,
          });

          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "PLOT_SCATTER",
            description: `Rendered Scatter Plot on [${curAx.id}] with ${Array.isArray(xData) ? xData.length : 0} markers${kwargs.cmap ? ` (cmap="${kwargs.cmap}")` : ""}.`,
          });
          continue;
        }

        // C. BAR CHART: bar(x, height, width=...) / barh(y, width, height=...)
        if (method === "bar" || method === "barh") {
          const cats = positional[0] || [];
          const vals = positional[1] || [];
          const posWidth = typeof positional[2] === "number" ? positional[2] : (typeof positional[2] === "string" && !isNaN(Number(positional[2])) ? Number(positional[2]) : undefined);
          const defaultCol = DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length];
          colorIndex++;

          curAx.elements.push({
            type: method === "barh" ? "barh" : "bar",
            categories: Array.isArray(cats) ? cats : [],
            values: Array.isArray(vals) ? vals : [],
            width: kwargs.width ?? posWidth ?? 0.6,
            color: kwargs.color ?? defaultCol,
            bottom: kwargs.bottom,
            left: kwargs.left,
            edgecolor: kwargs.edgecolor,
            label: kwargs.label,
            alpha: kwargs.alpha ?? 1.0,
          });

          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "PLOT_BAR",
            description: `Rendered ${method === "barh" ? "Horizontal" : "Vertical"} Bar Chart (${Array.isArray(cats) ? cats.length : 0} categories) on [${curAx.id}].`,
          });
          continue;
        }

        // D. HISTOGRAM: hist(data, bins=...)
        if (method === "hist") {
          const data = positional[0] || [];
          const bins = kwargs.bins ?? 10;
          const { binCounts, binEdges } = calculateHistogramBins(
            Array.isArray(data) ? data : [],
            typeof bins === "number" ? bins : 10
          );
          const defaultCol = DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length];
          colorIndex++;

          curAx.elements.push({
            type: "hist",
            data: Array.isArray(data) ? data : [],
            bins: typeof bins === "number" ? bins : 10,
            binCounts,
            binEdges,
            color: kwargs.color ?? defaultCol,
            edgecolor: kwargs.edgecolor ?? "#0B1021",
            density: kwargs.density,
            cumulative: kwargs.cumulative,
            label: kwargs.label,
            alpha: kwargs.alpha ?? 0.8,
          });

          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "PLOT_HIST",
            description: `Calculated & Drawn Histogram with ${Array.isArray(data) ? data.length : 0} samples into ${bins} frequency bins.`,
          });
          continue;
        }

        // E. PIE CHART: pie(values, labels=..., autopct=...)
        if (method === "pie") {
          const vals = positional[0] || [];
          curAx.elements.push({
            type: "pie",
            values: Array.isArray(vals) ? vals : [],
            labels: kwargs.labels,
            colors: kwargs.colors,
            explode: kwargs.explode,
            autopct: kwargs.autopct,
            startangle: kwargs.startangle ?? 0,
            shadow: kwargs.shadow,
          });

          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "PLOT_PIE",
            description: `Rendered Pie Distribution Chart with ${Array.isArray(vals) ? vals.length : 0} proportion slices.`,
          });
          continue;
        }

        // F. BOX PLOT: boxplot(data)
        if (method === "boxplot") {
          const rawData = positional[0] || [];
          const datasets = Array.isArray(rawData[0])
            ? rawData.map((d: number[], i: number) =>
                calculateBoxplotStats(kwargs.labels ? kwargs.labels[i] : `Group ${i + 1}`, d)
              )
            : [calculateBoxplotStats("Dataset", rawData)];

          curAx.elements.push({
            type: "boxplot",
            datasets,
            vert: kwargs.vert ?? true,
            patchArtist: kwargs.patch_artist ?? true,
            notch: kwargs.notch ?? false,
          });

          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "PLOT_BOXPLOT",
            description: `Computed Statistical Quartiles (Q1, Median, Q3, Outliers) for ${datasets.length} series.`,
          });
          continue;
        }

        // G. VIOLIN PLOT: violinplot(data)
        if (method === "violinplot") {
          const rawData = positional[0] || [];
          const datasets = (Array.isArray(rawData[0]) ? rawData : [rawData]).map(
            (d: number[], i: number) => {
              const min = Math.min(...d);
              const max = Math.max(...d);
              const mean = d.reduce((a, b) => a + b, 0) / (d.length || 1);
              const sorted = [...d].sort((a, b) => a - b);
              const median = sorted[Math.floor(sorted.length / 2)] || 0;
              return { label: `Set ${i + 1}`, min, max, mean, median, data: d };
            }
          );

          curAx.elements.push({
            type: "violin",
            datasets,
            showmeans: kwargs.showmeans ?? true,
            showmedians: kwargs.showmedians ?? true,
          });

          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "PLOT_VIOLIN",
            description: `Generated Kernel Density Violin Distribution plot.`,
          });
          continue;
        }

        // H. IMSHOW: imshow(matrix, cmap=...)
        if (method === "imshow") {
          const matrix = positional[0] || [
            [1, 2],
            [3, 4],
          ];
          curAx.elements.push({
            type: "imshow",
            matrix: Array.isArray(matrix) ? matrix : [[1]],
            cmap: kwargs.cmap || "viridis",
            interpolation: kwargs.interpolation || "nearest",
            vmin: kwargs.vmin,
            vmax: kwargs.vmax,
          });

          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "PLOT_IMSHOW",
            description: `Rendered 2D Matrix Heatmap (${matrix.length}x${matrix[0]?.length || 0} cells, cmap="${kwargs.cmap || "viridis"}").`,
          });
          continue;
        }

        // I. CONTOUR / CONTOURF: contour(X, Y, Z)
        if (method === "contour" || method === "contourf") {
          let X = positional[0];
          let Y = positional[1];
          let Z = positional[2];
          if (positional.length === 1) {
            Z = positional[0];
            const [meshX, meshY] = np.meshgrid(np.arange(Z[0]?.length || 10), np.arange(Z.length || 10));
            X = meshX;
            Y = meshY;
          }

          curAx.elements.push({
            type: method as any,
            X: Array.isArray(X) ? X : [],
            Y: Array.isArray(Y) ? Y : [],
            Z: Array.isArray(Z) ? Z : [],
            levels: kwargs.levels ?? 10,
            cmap: kwargs.cmap || "viridis",
          });

          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "PLOT_CONTOUR",
            description: `Drawn ${method === "contourf" ? "Filled " : ""}Contour isolines across 2D scalar field.`,
          });
          continue;
        }

        // J. 3D SURFACE & WIREFRAME: plot_surface, plot_wireframe, scatter3D
        if (
          method === "plot_surface" ||
          method === "plot_wireframe" ||
          method === "scatter3D" ||
          method === "bar3d"
        ) {
          curAx.is3D = true;
          const X = positional[0];
          const Y = positional[1];
          const Z = positional[2];

          curAx.elements.push({
            type: (method === "plot_surface"
              ? "3d_surface"
              : method === "plot_wireframe"
              ? "3d_wireframe"
              : "3d_scatter") as any,
            X: Array.isArray(X) && Array.isArray(X[0]) ? X : undefined,
            Y: Array.isArray(Y) && Array.isArray(Y[0]) ? Y : undefined,
            Z: Array.isArray(Z) && Array.isArray(Z[0]) ? Z : undefined,
            cmap: kwargs.cmap || "viridis",
          });

          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "PLOT_3D",
            description: `Rendered 3D Isometric Projection (${method}, colormap="${kwargs.cmap || "viridis"}").`,
          });
          continue;
        }

        // K. LABELS, TITLES, LIMITS & STYLES
        if (method === "title" || method === "set_title") {
          curAx.title = positional[0] || kwargs.label;
          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "DECORATION",
            description: `Set Axes Title on [${curAx.id}]: "${curAx.title}"`,
          });
          continue;
        }

        if (method === "suptitle") {
          figure.suptitle = positional[0];
          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "DECORATION",
            description: `Set Super Title for Figure: "${figure.suptitle}"`,
          });
          continue;
        }

        if (method === "xlabel" || method === "set_xlabel") {
          curAx.xlabel = positional[0];
          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "DECORATION",
            description: `Configured X-Axis Label on [${curAx.id}]: "${curAx.xlabel}"`,
          });
          continue;
        }

        if (method === "ylabel" || method === "set_ylabel") {
          curAx.ylabel = positional[0];
          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "DECORATION",
            description: `Configured Y-Axis Label on [${curAx.id}]: "${curAx.ylabel}"`,
          });
          continue;
        }

        if (method === "grid" || method === "set_grid") {
          curAx.grid = positional[0] !== undefined ? Boolean(positional[0]) : true;
          curAx.gridColor = kwargs.color || kwargs.c || "#344265";
          curAx.gridStyle = kwargs.linestyle || kwargs.ls || "--";
          curAx.gridAlpha = kwargs.alpha ?? 0.4;
          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "DECORATION",
            description: `Toggled Plot Background Grid on [${curAx.id}] (${curAx.grid ? "Enabled" : "Disabled"}).`,
          });
          continue;
        }

        if (method === "legend") {
          curAx.legend = true;
          curAx.legendLoc = kwargs.loc || "best";
          curAx.legendNcol = kwargs.ncol || 1;
          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "DECORATION",
            description: `Generated Data Series Legend box (loc="${curAx.legendLoc}").`,
          });
          continue;
        }

        if (method === "xlim" || method === "set_xlim") {
          const min = positional[0] ?? kwargs.left ?? kwargs.xmin;
          const max = positional[1] ?? kwargs.right ?? kwargs.xmax;
          if (min !== undefined && max !== undefined) {
            curAx.xlim = [Number(min), Number(max)];
          }
          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "LIMITS",
            description: `Enforced X-Axis Boundaries [${curAx.xlim?.[0]}, ${curAx.xlim?.[1]}].`,
          });
          continue;
        }

        if (method === "ylim" || method === "set_ylim") {
          const min = positional[0] ?? kwargs.bottom ?? kwargs.ymin;
          const max = positional[1] ?? kwargs.top ?? kwargs.ymax;
          if (min !== undefined && max !== undefined) {
            curAx.ylim = [Number(min), Number(max)];
          }
          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "LIMITS",
            description: `Enforced Y-Axis Boundaries [${curAx.ylim?.[0]}, ${curAx.ylim?.[1]}].`,
          });
          continue;
        }

        if (method === "xticks" || method === "set_xticks") {
          const vals = positional[0] || [];
          const labels = positional[1] || kwargs.labels;
          curAx.xticks = {
            values: Array.isArray(vals) ? vals : [],
            labels: Array.isArray(labels) ? labels : undefined,
          };
          continue;
        }

        if (method === "yticks" || method === "set_yticks") {
          const vals = positional[0] || [];
          const labels = positional[1] || kwargs.labels;
          curAx.yticks = {
            values: Array.isArray(vals) ? vals : [],
            labels: Array.isArray(labels) ? labels : undefined,
          };
          continue;
        }

        if (method === "set_xticklabels") {
          const labels = positional[0] || [];
          if (!curAx.xticks) curAx.xticks = { values: [] };
          curAx.xticks.labels = Array.isArray(labels) ? labels : [];
          continue;
        }

        if (method === "set_yticklabels") {
          const labels = positional[0] || [];
          if (!curAx.yticks) curAx.yticks = { values: [] };
          curAx.yticks.labels = Array.isArray(labels) ? labels : [];
          continue;
        }

        if (method === "colorbar") {
          curAx.colorbar = {
            label: positional[0] || kwargs.label,
            cmap: kwargs.cmap || "viridis",
          };
          continue;
        }

        if (method === "fill_between") {
          const xs = positional[0] || [];
          const y1s = positional[1] || [];
          const y2s = positional[2];
          curAx.elements.push({
            type: "fill_between",
            x: Array.isArray(xs) ? xs : [],
            y1: Array.isArray(y1s) ? y1s : [],
            y2: Array.isArray(y2s) ? y2s : undefined,
            color: kwargs.color || "#6366F1",
            alpha: kwargs.alpha ?? 0.3,
          });
          continue;
        }

        if (method === "axhline" || method === "axvline") {
          const val = positional[0] ?? 0;
          curAx.elements.push({
            type: "axline",
            orientation: method === "axhline" ? "horizontal" : "vertical",
            val: Number(val),
            color: kwargs.color || kwargs.c || "#FF5C7A",
            linestyle: kwargs.linestyle || kwargs.ls || "--",
            linewidth: kwargs.linewidth ?? kwargs.lw ?? 1.5,
          });
          continue;
        }

        if (method === "annotate") {
          const text = positional[0] || "";
          const xy = kwargs.xy || positional[1] || [0, 0];
          const xytext = kwargs.xytext || positional[2] || [xy[0] + 1, xy[1] + 1];
          curAx.elements.push({
            type: "annotation",
            text: String(text),
            xy: Array.isArray(xy) ? [Number(xy[0]) || 0, Number(xy[1]) || 0] : [0, 0],
            xytext: Array.isArray(xytext) ? [Number(xytext[0]) || 0, Number(xytext[1]) || 0] : [1, 1],
            color: kwargs.color || "#00D9C0",
            arrowprops: kwargs.arrowprops,
          });
          continue;
        }

        if (method === "show" || method === "tight_layout") {
          traces.push({
            lineNumber: lineNum,
            raw: trimmed,
            type: "OUTPUT",
            description: method === "show" ? "Rendered complete vector Figure." : "Calculated constrained padding.",
          });
          continue;
        }
      }
    } catch (err: any) {
      errors.push(`Line ${lineNum}: ${err.message || String(err)}`);
    }
  }

  return {
    figure,
    prints,
    traces,
    errors,
    hasErrors: errors.length > 0,
    variables: vars,
  };
}
