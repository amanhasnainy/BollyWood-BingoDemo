import { apiClient } from "./apiClient";

export type PlaylistApi = {
  id: string;
  name: string;
  emoji?: string;
  songCount?: string;
  badge?: string;
  description?: string;
};

export async function getPlaylists(): Promise<PlaylistApi[]> {
  const response = await apiClient.get<PlaylistApi[]>("/api/v1/playlists");
  return Array.isArray(response.data) ? response.data : [];
}
