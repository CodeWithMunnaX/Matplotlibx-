// lib/storage.ts
// LocalStorage helpers for MatplotlibX user progress, code states, and preferences

export interface UserProgress {
  completedLessons: string[];
  lastVisitedLessonId?: string;
  theme?: "dark" | "light";
}

const STORAGE_KEYS = {
  PROGRESS: "matplotlibx_user_progress_v1",
  CODE_PREFIX: "matplotlibx_code_",
  CUSTOM_CODE: "matplotlibx_custom_playground_code",
};

export function getProgress(): UserProgress {
  if (typeof window === "undefined") {
    return { completedLessons: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) return { completedLessons: [] };
    return JSON.parse(raw);
  } catch {
    return { completedLessons: [] };
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
}

export function markLessonCompleted(lessonId: string): void {
  const current = getProgress();
  if (!current.completedLessons.includes(lessonId)) {
    current.completedLessons.push(lessonId);
    saveProgress(current);
  }
}

export function unmarkLessonCompleted(lessonId: string): void {
  const current = getProgress();
  current.completedLessons = current.completedLessons.filter((id) => id !== lessonId);
  saveProgress(current);
}

export function getSavedLessonCode(lessonId: string, fallbackCode: string): string {
  if (typeof window === "undefined") return fallbackCode;
  try {
    return localStorage.getItem(STORAGE_KEYS.CODE_PREFIX + lessonId) || fallbackCode;
  } catch {
    return fallbackCode;
  }
}

export function saveLessonCode(lessonId: string, code: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CODE_PREFIX + lessonId, code);
  } catch (e) {
    console.error("Failed to save lesson code", e);
  }
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    // Clear all saved codes
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEYS.CODE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.error("Failed to reset progress", e);
  }
}
