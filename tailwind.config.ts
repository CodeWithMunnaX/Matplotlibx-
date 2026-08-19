import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
          950: "#500724",
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        neon: {
          bg: "#0E0B16",
          secondary: "#151022",
          card: "#1C152D",
          cardHover: "#241B3B",
          pink: "#EC4899",
          pinkDark: "#BE185D",
          pinkGlow: "rgba(236, 72, 153, 0.35)",
          green: "#10B981",
          greenDark: "#059669",
          greenGlow: "rgba(16, 185, 129, 0.35)",
          border: "#2D2248",
          borderHighlight: "#43326B",
          text: "#FDF2F8",
          muted: "#A78BFA",
          subtle: "#7C6F9E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Outfit", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "pink-sm": "0 2px 8px -1px rgba(236, 72, 153, 0.2)",
        "pink-md": "0 8px 24px -4px rgba(236, 72, 153, 0.25)",
        "pink-lg": "0 12px 32px -6px rgba(236, 72, 153, 0.3)",
        "green-sm": "0 2px 8px -1px rgba(16, 185, 129, 0.2)",
        "green-md": "0 8px 24px -4px rgba(16, 185, 129, 0.25)",
        card: "0 4px 20px -2px rgba(236, 72, 153, 0.05), 0 2px 6px -1px rgba(16, 185, 129, 0.04)",
        "card-dark": "0 10px 30px -10px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce-subtle 2s infinite ease-in-out",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-in-left": "slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
