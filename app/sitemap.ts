import { MetadataRoute } from "next";
import { LESSONS } from "@/data/lessons";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://matplotlibx.datastackwizard.live";

  const lessonUrls = LESSONS.map((lesson) => ({
    url: `${baseUrl}/lessons/${lesson.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/lessons`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/playground`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...lessonUrls,
  ];
}
