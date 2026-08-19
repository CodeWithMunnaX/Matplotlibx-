import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YouTubeSubscribeModal from "@/components/YouTubeSubscribeModal";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1021",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://matplotlibx.datastackwizard.live"),
  title: {
    default: "MatplotlibX | Master Python Data Visualization with Live Plots by @CodeWithMunnaX",
    template: "%s | MatplotlibX",
  },
  description:
    "Master Matplotlib & Python Data Visualization with 50 interactive topics, live vector chart renderer, 3D surface rotations, multi-subplot grids, and beginner-friendly tutorials by Munna Kumar (@CodeWithMunnaX).",
  keywords: [
    "Matplotlib",
    "MatplotlibX",
    "Python Data Visualization",
    "Matplotlib Full Course 2026",
    "Matplotlib Visualizer",
    "3D Surface Visualizer",
    "Pyplot Tutorial",
    "CodeWithMunnaX",
    "Munna Kumar",
    "Subplots in Matplotlib",
    "Colormaps Matplotlib",
    "Interactive Python Plots",
  ],
  authors: [{ name: "Munna Kumar (@CodeWithMunnaX)", url: "https://www.youtube.com/@CodeWithMunnaX" }],
  creator: "Munna Kumar (@CodeWithMunnaX)",
  publisher: "MatplotlibX — CodeWithMunnaX",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://matplotlibx.datastackwizard.live",
    siteName: "MatplotlibX — By @CodeWithMunnaX",
    title: "MatplotlibX | Master Python Data Visualization with Live Plots",
    description:
      "50 Interactive Visual Lessons • Live Vector Chart Visualizer • 3D Surface Studio • Zero to Hero by Munna Kumar (@CodeWithMunnaX). Free online masterclass!",
  },
  twitter: {
    card: "summary_large_image",
    title: "MatplotlibX | Interactive Visual Python Data Visualization Course by @CodeWithMunnaX",
    description:
      "Master Matplotlib visually with interactive vector plots, 3D surface cubes, step-by-step traces, and 50-topic master curriculum by CodeWithMunnaX.",
    creator: "@CodeWithMunnaX",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png" }],
    shortcut: ["/favicon.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Matplotlib Full Course 2026 — Interactive Visual Masterclass",
    "description":
      "Comprehensive 50-topic interactive Matplotlib masterclass covering Figure anatomy, subplots, 3D surfaces, statistical distributions, colormaps, and financial dashboards.",
    "provider": {
      "@type": "Organization",
      "name": "CodeWithMunnaX",
      "sameAs": [
        "https://www.youtube.com/@CodeWithMunnaX",
        "https://www.linkedin.com/in/munna-kumar-93234b241",
        "https://www.instagram.com/codewithmunnax"
      ],
    },
    "instructor": {
      "@type": "Person",
      "name": "Munna Kumar",
      "jobTitle": "Lead Educator & Full-Stack Developer",
      "sameAs": "https://www.youtube.com/@CodeWithMunnaX"
    },
    "educationalCredentialAwarded": "Python Data Visualization Specialist Certificate",
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#F4F6FB] dark:bg-[#0B1021] text-slate-900 dark:text-[#F5F7FA] min-h-screen flex flex-col antialiased selection:bg-[#6366F1] selection:text-white`}
      >
        <ThemeProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <YouTubeSubscribeModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
