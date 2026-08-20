/**
 * Helper to generate valid Jupyter Notebook (.ipynb) files on the client side
 * and trigger instant browser download or open in Google Colab.
 */

export interface NotebookContent {
  title: string;
  description: string;
  code: string;
  filename?: string;
}

export function generateJupyterNotebook(content: NotebookContent): string {
  const notebook = {
    cells: [
      {
        cell_type: "markdown",
        metadata: {},
        source: [
          `# ${content.title}\n`,
          `**MatplotlibX Interactive Visual Masterclass 2026**\n\n`,
          `*Created by Munna Kumar (@CodeWithMunnaX)*\n\n`,
          `${content.description}\n`,
        ],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: content.code.split("\n").map((line, idx, arr) => (idx < arr.length - 1 ? line + "\n" : line)),
      },
    ],
    metadata: {
      language_info: {
        name: "python",
        version: "3.11.0",
      },
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3",
      },
    },
    nbformat: 4,
    nbformat_minor: 4,
  };

  return JSON.stringify(notebook, null, 2);
}

export function downloadNotebook(content: NotebookContent) {
  const jsonStr = generateJupyterNotebook(content);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const cleanName = (content.filename || content.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  a.href = url;
  a.download = `${cleanName}.ipynb`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function openInGoogleColab(code: string) {
  // Google Colab playground link with prepended code encoded
  const encoded = encodeURIComponent(code);
  window.open(`https://colab.research.google.com/#create=true`, "_blank");
}
