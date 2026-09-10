export type StarWalletItem = {
  id: string;
  emoji: string;
  title: string;
  stars: number;
  description: string;
};

export const starWalletItems: StarWalletItem[] = [
  {
    id: "welcome-bonus",
    emoji: "⭐",
    title: "Welcome Bonus",
    stars: 30,
    description: "Every new player receives 30 free stars.",
  },
  {
    id: "create-room",
    emoji: "🏠",
    title: "Create Room",
    stars: 10,
    description: "Host your own private or public Bingo room.",
  },
  {
    id: "join-room",
    emoji: "🚪",
    title: "Join Room",
    stars: 5,
    description: "Join any live room and start playing instantly.",
  },
];

export const starWalletFooterNote =
  "Earn more stars by winning games and participating in events.";
