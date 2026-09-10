export type RoomCategory = "diwali" | "sangeet" | "punjabi" | "bollywood" | "ladies";

export type GameRoom = {
  id: string;
  emoji: string;
  name: string;
  theme: string;
  category: RoomCategory;
  playerCount: number;
  maxPlayers: number;
  entryFee: number;
  hostName: string;
  hostInitials: string;
  status: "live" | "waiting";
};

export const gameRooms: GameRoom[] = [
  {
    id: "diwali-kitty-brunch",
    emoji: "🪔",
    name: "Diwali Kitty Brunch",
    theme: "Diwali Hits",
    category: "diwali",
    playerCount: 48,
    maxPlayers: 120,
    entryFee: 5,
    hostName: "Asha Aunty",
    hostInitials: "AA",
    status: "live",
  },
  {
    id: "sangeet-tambola",
    emoji: "🎵",
    name: "Sangeet Tambola",
    theme: "Sangeet Songs",
    category: "sangeet",
    playerCount: 18,
    maxPlayers: 75,
    entryFee: 5,
    hostName: "Priya Sharma",
    hostInitials: "PS",
    status: "waiting",
  },
  {
    id: "ladies-club",
    emoji: "👑",
    name: "Ladies Club",
    theme: "Ladies Club",
    category: "ladies",
    playerCount: 11,
    maxPlayers: 35,
    entryFee: 5,
    hostName: "Meera Kapoor",
    hostInitials: "MK",
    status: "waiting",
  },
  {
    id: "bollywood-night",
    emoji: "🎬",
    name: "Bollywood Night",
    theme: "Bollywood Classics",
    category: "bollywood",
    playerCount: 67,
    maxPlayers: 120,
    entryFee: 5,
    hostName: "Rahul Verma",
    hostInitials: "RV",
    status: "live",
  },
  {
    id: "punjabi-tadka",
    emoji: "🥁",
    name: "Punjabi Tadka",
    theme: "Punjabi Tadka",
    category: "punjabi",
    playerCount: 22,
    maxPlayers: 75,
    entryFee: 5,
    hostName: "Simran Kaur",
    hostInitials: "SK",
    status: "waiting",
  },
];

export type StatusFilter = "all" | "live" | "waiting";
export type CategoryFilter = "all" | RoomCategory;

export const statusFilters: { id: StatusFilter; label: string; dot?: "green" | "orange" }[] = [
  { id: "all", label: "All Rooms" },
  { id: "live", label: "Live", dot: "green" },
  { id: "waiting", label: "Waiting", dot: "orange" },
];

export const categoryFilters: { id: CategoryFilter; label: string }[] = [
  { id: "diwali", label: "Diwali" },
  { id: "sangeet", label: "Sangeet" },
  { id: "bollywood", label: "Bollywood" },
  { id: "punjabi", label: "Punjabi" },
  { id: "ladies", label: "Ladies Club" },
];

export function getDisplayStatus(room: GameRoom): "live" | "waiting" | "full" {
  if (room.maxPlayers > 0 && room.playerCount >= room.maxPlayers) return "full";
  return room.status;
}
