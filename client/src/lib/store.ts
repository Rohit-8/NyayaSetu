import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  language: "en" | "hi";
  toggleLanguage: () => void;
  setLanguage: (lang: "en" | "hi") => void;
  token: string | null;
  user: { id: string; name?: string; phone?: string; email?: string; role: string } | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: "hi",
      toggleLanguage: () => set((s) => ({ language: s.language === "en" ? "hi" : "en" })),
      setLanguage: (lang) => set({ language: lang }),
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "nyayasetu-store" }
  )
);
