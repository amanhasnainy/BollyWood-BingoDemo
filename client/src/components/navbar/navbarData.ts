export type NavLink = {
  id: string;
  label: string;
  href: string;
  sectionId: string | null;
  mobileLabel?: string;
};

export const navLinks: NavLink[] = [
  { id: "home", label: "Home", href: "#", sectionId: null },
  { id: "categories", label: "Categories", href: "#categories", sectionId: "categories" },
  {
    id: "game-rooms",
    label: "Game Rooms",
    href: "#live-rooms",
    sectionId: "live-rooms",
    mobileLabel: "Rooms",
  },
  {
    id: "playlists",
    label: "Playlists",
    href: "#featured-playlists",
    sectionId: "featured-playlists",
  },
  {
    id: "how-to-play",
    label: "How to Play",
    href: "#how-it-works",
    sectionId: "how-it-works",
  },
  { id: "faq", label: "FAQ", href: "#faq", sectionId: "faq" },
];

export const mobileExtraLinks = [
  { id: "create-room", label: "Create Room", href: "#live-rooms" },
  { id: "wallet", label: "Wallet", href: "#star-wallet" },
  { id: "profile", label: "Profile", href: "#live-rooms" },
] as const;
