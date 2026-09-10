export type Playlist = {
  id: string;
  emoji: string;
  name: string;
  songCount: number;
  duration: string;
};

export const featuredPlaylists: Playlist[] = [
  {
    id: "diwali-hits",
    emoji: "🎉",
    name: "Diwali Hits",
    songCount: 75,
    duration: "3h 45m",
  },
  {
    id: "sangeet-special",
    emoji: "🎵",
    name: "Sangeet Special",
    songCount: 75,
    duration: "4h 10m",
  },
  {
    id: "dance-party",
    emoji: "🕺",
    name: "Dance Party",
    songCount: 75,
    duration: "3h 30m",
  },
  {
    id: "bollywood-classics",
    emoji: "🎬",
    name: "Bollywood Classics",
    songCount: 75,
    duration: "4h 25m",
  },
  {
    id: "punjabi-beats",
    emoji: "🥁",
    name: "Punjabi Beats",
    songCount: 75,
    duration: "3h 55m",
  },
  {
    id: "romantic-collection",
    emoji: "💕",
    name: "Romantic Collection",
    songCount: 75,
    duration: "4h 05m",
  },
];
