import api from "@/lib/axios";
import { Topic, Problem } from "@/types";

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post<{
      token: string;
      user: { id: string; name: string; email: string };
    }>("/auth/signup", data),

  login: (data: { email: string; password: string }) =>
    api.post<{
      token: string;
      user: { id: string; name: string; email: string };
    }>("/auth/login", data),
};

export const topicsApi = {
  getAll: () => api.get<Topic[]>("/topics"),

  getBySlug: (slug: string) =>
    api.get<{ topic: Topic; problems: Problem[] }>(`/topics/${slug}`),
};

export const progressApi = {
  getCompleted: () => api.get<{ completedIds: string[] }>("/progress"),

  getSummary: () =>
    api.get<{ summary: Record<string, number> }>("/progress/summary"),

  toggle: (problemId: string, completed: boolean) =>
    api.put(`/progress/${problemId}`, { completed }),
};
