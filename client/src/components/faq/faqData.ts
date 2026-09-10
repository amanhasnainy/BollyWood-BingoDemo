export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "create-room",
    question: "How do I create a room?",
    answer:
      "Tap Create Room from the lobby, choose a theme, and spend 10 stars. Share your room code so friends can join before you start calling numbers.",
  },
  {
    id: "stars",
    question: "How many stars do I get?",
    answer:
      "Every new player receives 30 free stars when they sign up. Use them to create rooms or join live games.",
  },
  {
    id: "friends",
    question: "Can I play with friends?",
    answer:
      "Yes. Create a private room and share the code, or join a public table. Play together from anywhere in the world.",
  },
  {
    id: "win",
    question: "How do I win Bingo?",
    answer:
      "Listen for live song calls, mark matching spots on your card, and be the first to complete a row or pattern—then shout BINGO!",
  },
  {
    id: "install",
    question: "Do I need to install anything?",
    answer:
      "No download required. Bollywood Bingo runs in your browser on desktop, tablet, and mobile.",
  },
];
