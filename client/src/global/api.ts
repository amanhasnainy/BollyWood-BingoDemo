export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://3.110.104.91:8080";

export function buildApiUrl(path: string) {
  if (!API_BASE_URL) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}