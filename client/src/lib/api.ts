import axios from "axios";
import { useAppStore } from "./store";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach auth token
api.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAppStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string; state?: string; district?: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  loginOtp: (data: { phone: string; code: string }) => api.post("/auth/login", data),
  requestOtp: (phone: string) => api.post("/auth/request-otp", { phone }),
  me: () => api.get("/auth/me"),
  guest: () => api.post("/auth/guest"),
};

// ── Categories ───────────────────────────────
export const categoriesApi = {
  list: () => api.get("/categories"),
  getQuestions: (categoryId: string) => api.get(`/categories/${categoryId}/questions`),
};

// ── Intake ───────────────────────────────────
export const intakeApi = {
  submit: (data: any) => api.post("/intake/submit", data),
  analyze: (text: string, language: string) => api.post("/intake/analyze", { text, language }),
};

// ── Plans ────────────────────────────────────
export const plansApi = {
  getByIssue: (issueId: string) => api.get(`/plans/issue/${issueId}`),
  myIssues: () => api.get("/plans/my-issues"),
  getPlan: (planId: string) => api.get(`/plans/${planId}`),
  updateStep: (stepId: string, status: string) => api.patch(`/plans/step/${stepId}`, { status }),
};

// ── Directory ────────────────────────────────
export const directoryApi = {
  offices: (params: Record<string, string>) => api.get("/directory/offices", { params }),
  states: () => api.get("/directory/states"),
  districts: (state: string) => api.get(`/directory/states/${state}/districts`),
  types: () => api.get("/directory/types"),
};

// ── Rights ───────────────────────────────────
export const rightsApi = {
  all: () => api.get("/rights"),
  bySubCategory: (subCategoryId: string) => api.get(`/rights/subcategory/${subCategoryId}`),
};

// ── Helplines ────────────────────────────────
export const helplinesApi = {
  list: (params?: Record<string, string>) => api.get("/helplines", { params }),
};

export default api;
