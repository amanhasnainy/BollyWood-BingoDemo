import {
  Clapperboard,
  Crown,
  Flame,
  Heart,
  Music2,
  PartyPopper,
  Drum,
  Sparkles,
  Mic2,
  Palette,
  Disc3,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  id: string;
  emoji: string;
  name: string;
  songCount: string;
  badge: string;
  filterTag: string;
  gradient: string;
  Icon: LucideIcon;
};

export const categories: Category[] = [
  {
    id: "bollywood-classics",
    emoji: "🎵",
    name: "Bollywood Classics",
    songCount: "75 Songs",
    badge: "Playlist Ready",
    filterTag: "Bollywood",
    gradient: "from-[#8C1B3E] via-[#A81B43] to-[#C81D4A]",
    Icon: Clapperboard,
  },
  {
    id: "diwali-dhamaka",
    emoji: "🎵",
    name: "Diwali Dhamaka",
    songCount: "60 Songs",
    badge: "Playlist Ready",
    filterTag: "Diwali",
    gradient: "from-[#C58823] via-[#D7992A] to-[#E8A93B]",
    Icon: Flame,
  },
  {
    id: "punjabi-beats",
    emoji: "🎵",
    name: "Punjabi Beats",
    songCount: "50 Songs",
    badge: "Playlist Ready",
    filterTag: "Punjabi",
    gradient: "from-[#47306D] via-[#593B8A] to-[#6A479F]",
    Icon: Drum,
  },
  {
    id: "ladies-club-specials",
    emoji: "🎵",
    name: "Ladies Club Specials",
    songCount: "45 Songs",
    badge: "Playlist Ready",
    filterTag: "Ladies Club",
    gradient: "from-[#06584F] via-[#086359] to-[#0B6E64]",
    Icon: Crown,
  },
  {
    id: "sangeet-songs",
    emoji: "🎵",
    name: "Sangeet Specials",
    songCount: "75 Songs",
    badge: "Playlist Ready",
    filterTag: "Sangeet",
    gradient: "from-[#9E1B40] via-[#BA5826] to-[#E8A93B]",
    Icon: Music2,
  },
  {
    id: "dance-masala",
    emoji: "🕺",
    name: "Dance Masala",
    songCount: "75 Songs",
    badge: "Playlist Ready",
    filterTag: "Bollywood",
    gradient: "from-[#8C1B3E] via-[#A81B43] to-[#C81D4A]",
    Icon: PartyPopper,
  },
];

export const categoriesRowTwo: Category[] = [
  {
    id: "romantic-hits",
    emoji: "💕",
    name: "Romantic Hits",
    songCount: "75 Songs",
    badge: "Playlist Ready",
    filterTag: "Bollywood",
    gradient: "from-[#8C1B3E] to-[#C81D4A]",
    Icon: Heart,
  },
  {
    id: "garba-night",
    emoji: "🪩",
    name: "Garba Night",
    songCount: "75 Songs",
    badge: "Playlist Ready",
    filterTag: "Diwali",
    gradient: "from-[#C58823] to-[#E8A93B]",
    Icon: Sparkles,
  },
  {
    id: "kitty-party",
    emoji: "☕",
    name: "Kitty Party",
    songCount: "75 Songs",
    badge: "Playlist Ready",
    filterTag: "Ladies Club",
    gradient: "from-[#06584F] to-[#0B6E64]",
    Icon: Crown,
  },
  {
    id: "holi-colors",
    emoji: "🎨",
    name: "Holi Colors",
    songCount: "75 Songs",
    badge: "Playlist Ready",
    filterTag: "Diwali",
    gradient: "from-[#C58823] to-[#E8A93B]",
    Icon: Palette,
  },
  {
    id: "retro-90s",
    emoji: "📼",
    name: "Retro 90s",
    songCount: "75 Songs",
    badge: "Playlist Ready",
    filterTag: "Bollywood",
    gradient: "from-[#47306D] to-[#6A479F]",
    Icon: Disc3,
  },
  {
    id: "wedding-antakshari",
    emoji: "🎤",
    name: "Wedding Antakshari",
    songCount: "75 Songs",
    badge: "Playlist Ready",
    filterTag: "Sangeet",
    gradient: "from-[#9E1B40] to-[#E8A93B]",
    Icon: Mic2,
  },
];
