export type HeroSlideVisual = "bingo" | "playlist" | "wallet" | "lobby";

export type HeroSlideButton = {
  label: string;
  target: string;
  variant: "primary" | "secondary";
};

export type HeroSlideData = {
  id: string;
  badge: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  bullets?: string[];
  buttons: [HeroSlideButton, HeroSlideButton];
  background: string;
  glow: string;
  visual: HeroSlideVisual;
};

export const heroSlides: HeroSlideData[] = [
  {
    id: "multiplayer",
    badge: "🎮 Multiplayer Bollywood Bingo",
    headingLine1: "Play Bollywood Bingo",
    headingLine2: "With Friends Anywhere",
    description:
      "Create rooms, invite friends or join live public games from anywhere in the world.",
    buttons: [
      { label: "Play Now", target: "live-rooms", variant: "primary" },
      { label: "Browse Rooms", target: "live-rooms", variant: "secondary" },
    ],
    background: "linear-gradient(160deg, #FBF3E7 0%, #F8ECE0 50%, #F5E5D5 100%)",
    glow: "radial-gradient(ellipse 55% 45% at 78% 35%, rgba(200,29,74,0.1), transparent)",
    visual: "bingo",
  },
  {
    id: "playlists",
    badge: "🎵 75 Songs Per Playlist",
    headingLine1: "Every Party",
    headingLine2: "Has Its Own Playlist",
    description: "Play Sangeet, Diwali, Bollywood Classics, Punjabi Hits and more.",
    buttons: [
      { label: "Explore Categories", target: "categories", variant: "primary" },
      { label: "View Playlist", target: "featured-playlists", variant: "secondary" },
    ],
    background: "linear-gradient(160deg, #FBF3E7 0%, #F6EDE3 50%, #F4E8DB 100%)",
    glow: "radial-gradient(ellipse 50% 40% at 72% 38%, rgba(200,29,74,0.08), transparent)",
    visual: "playlist",
  },
  {
    id: "stars",
    badge: "⭐ Earn & Spend Stars",
    headingLine1: "Create Rooms",
    headingLine2: "Win More Stars",
    description: "Every new player receives 30 stars.",
    bullets: ["Create Room: 10 Stars", "Join Room: 5 Stars"],
    buttons: [
      { label: "Create Room", target: "live-rooms", variant: "primary" },
      { label: "Learn More", target: "star-wallet", variant: "secondary" },
    ],
    background: "linear-gradient(160deg, #FBF3E7 0%, #FAF0DF 50%, #F6E6CE 100%)",
    glow: "radial-gradient(ellipse 50% 40% at 74% 36%, rgba(232,169,59,0.12), transparent)",
    visual: "wallet",
  },
  {
    id: "live",
    badge: "🏆 Real-Time Multiplayer",
    headingLine1: "Play Live",
    headingLine2: "Compete Together",
    description:
      "Play in real-time with friends and family. Mark your card faster than everyone else.",
    buttons: [
      { label: "Join Live Game", target: "live-rooms", variant: "primary" },
      { label: "Watch Demo", target: "cta", variant: "secondary" },
    ],
    background: "linear-gradient(160deg, #FBF3E7 0%, #EBF4F3 45%, #E3F0EE 100%)",
    glow: "radial-gradient(ellipse 55% 45% at 70% 42%, rgba(11,110,100,0.1), transparent)",
    visual: "lobby",
  },
];
