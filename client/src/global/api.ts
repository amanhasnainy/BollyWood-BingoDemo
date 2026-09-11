export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://different.desicomedylive.com";

export function buildApiUrl(path: string) {
  if (!API_BASE_URL) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
