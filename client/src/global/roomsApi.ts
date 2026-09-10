import { apiClient } from "./apiClient";

export type LiveRoomApi = {
  id: number | string;
  code: string;
  title: string;
  theme: string;
  playlistId?: string;
  hostId?: string;
  playerIds?: string[];
  visibility: "public" | "private";
  hostName: string;
  hostMode: "random" | "manual";
  status: "waiting" | "live";
  maxPlayers: number;
  playerCount: number;
  calledNumbers: number[];
};

export type CreateRoomInput = {
  code?: string;
  title: string;
  theme: string;
  playlistId?: string;
  visibility: "public" | "private";
  hostName: string;
  hostMode?: "random" | "manual";
  maxPlayers?: number;
};

export async function createRoom(input: CreateRoomInput) {
  const response = await apiClient.post("/api/v1/rooms", input);

  return response.data;
}

export async function getRooms() {
  const response = await apiClient.get<LiveRoomApi[]>("/api/v1/rooms");
  return Array.isArray(response.data) ? response.data : [];
}

export async function joinRoom(roomCode: string) {
  const response = await apiClient.post(`/api/v1/rooms/${roomCode}/join`);
  return response.data;
}

export async function nextSong(roomCode: string) {
  const response = await apiClient.post(`/api/v1/rooms/${roomCode}/next`);
  return response.data;
}

export async function startRoomGame(roomCode: string, patterns?: string[]) {
  const response = await apiClient.post(`/api/v1/rooms/${roomCode}/start`, { patterns });
  return response.data;
}

export async function getRoomByCode(roomCode: string) {
  const response = await apiClient.get<LiveRoomApi>(`/api/v1/rooms/${roomCode}`);
  return response.data;
}
