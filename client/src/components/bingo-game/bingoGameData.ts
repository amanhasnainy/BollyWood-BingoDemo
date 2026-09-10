export const ROOM_INFO = {
  name: "Diwali Kitty Brunch",
  category: "Diwali Hits",
  host: "Asha Aunty",
  players: 48,
  maxPlayers: 120,
  prizePool: 200,
  roomCode: "DIWALI77",
  countdown: "02:15",
} as const;

export const BINGO_GRID: (number | "FREE")[][] = [
  [10, 18, 35, 58, 70],
  [4, 23, 42, 50, 69],
  [9, 27, "FREE", 63, 71],
  [15, 25, 44, 53, 75],
  [12, 17, 38, 57, 66],
];

/** 22 / 25 marked — only 18, 35, and 42 remain unmarked */
export const INITIAL_MARKED = new Set<string>(
  Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => `${row}-${col}`),
  )
    .flat()
    .filter((key) => !["0-1", "0-2", "1-2"].includes(key)),
);

export const CURRENT_CALL = {
  number: 52,
  song: "Kala Chashma",
} as const;

export const CHAT_MESSAGES = [
  {
    id: "1",
    name: "Asha Aunty",
    initials: "AA",
    isHost: true,
    message: "Welcome everyone! 🎉 Let's get this Diwali party started!",
    time: "2m ago",
    avatarClass: "bg-bb-primary",
  },
  {
    id: "2",
    name: "Rahul",
    initials: "R",
    isHost: false,
    message: "So excited for Diwali bingo!",
    time: "1m ago",
    avatarClass: "bg-bb-gold text-bb-bg",
  },
  {
    id: "3",
    name: "Neha",
    initials: "N",
    isHost: false,
    message: "My card is ready! 💃",
    time: "1m ago",
    avatarClass: "bg-bb-surface text-bb-text",
  },
  {
    id: "4",
    name: "Arjun",
    initials: "A",
    isHost: false,
    message: "Good luck everyone!",
    time: "45s ago",
    avatarClass: "bg-bb-elevated text-bb-text",
  },
  {
    id: "5",
    name: "Riya",
    initials: "Ri",
    isHost: false,
    message: "Love this playlist already 🎶",
    time: "30s ago",
    avatarClass: "bg-bb-success text-white",
  },
] as const;

export type ChatMessage = {
  id: string;
  name: string;
  initials: string;
  isHost: boolean;
  message: string;
  time: string;
  avatarClass: string;
};

export type PatternGrid = boolean[][];

export const WINNING_PATTERNS = [
  {
    id: "early-five",
    label: "Early Five",
    dots: patternEarlyFive(),
  },
  {
    id: "top-line",
    label: "Top Line",
    dots: patternRow(0),
  },
  {
    id: "middle-line",
    label: "Middle Line",
    dots: patternRow(2),
  },
  {
    id: "bottom-line",
    label: "Bottom Line",
    dots: patternRow(4),
  },
  {
    id: "four-corners",
    label: "Four Corners",
    dots: patternFourCorners(),
  },
  {
    id: "full-house",
    label: "Full House",
    dots: patternFullHouse(),
  },
] as const;

function emptyGrid(): PatternGrid {
  return Array.from({ length: 5 }, () => Array(5).fill(false));
}

function patternRow(row: number): PatternGrid {
  const grid = emptyGrid();
  for (let c = 0; c < 5; c++) grid[row][c] = true;
  return grid;
}

function patternFourCorners(): PatternGrid {
  const grid = emptyGrid();
  grid[0][0] = true;
  grid[0][4] = true;
  grid[4][0] = true;
  grid[4][4] = true;
  return grid;
}

function patternFullHouse(): PatternGrid {
  return Array.from({ length: 5 }, () => Array(5).fill(true));
}

function patternEarlyFive(): PatternGrid {
  const grid = emptyGrid();
  const positions = [
    [0, 1],
    [1, 3],
    [2, 0],
    [3, 2],
    [4, 4],
  ];
  for (const [r, c] of positions) grid[r][c] = true;
  return grid;
}