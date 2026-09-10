import {
  Gift,
  Music2,
  Shield,
  Ticket,
  Trophy,
  User,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type HowItWorksStep = {
  id: string;
  step: string;
  emoji: string;
  title: string;
  description: string;
  tag: string;
  Icon: LucideIcon;
};

export type HowItWorksFeature = {
  id: string;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  Icon: LucideIcon;
};

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: "create-account",
    step: "01",
    emoji: "👤",
    title: "Create an account",
    description: "Sign up in seconds and get 30 stars dropped straight into your wallet.",
    tag: "+30 Stars",
    Icon: User,
  },
  {
    id: "create-join-room",
    step: "02",
    emoji: "🎟️",
    title: "Create or join a room",
    description: "Host your own party for 10 stars, or slide into a live room for 5.",
    tag: "10★ / 5★",
    Icon: Ticket,
  },
  {
    id: "listen-mark",
    step: "03",
    emoji: "🎵",
    title: "Listen & mark",
    description: "Songs play live. Catch the track, mark it on your card, stay sharp.",
    tag: "Live Caller",
    Icon: Music2,
  },
  {
    id: "win-bingo",
    step: "04",
    emoji: "🏆",
    title: "Call Bingo",
    description: "Complete your pattern first and the stars — plus bragging rights — are yours.",
    tag: "Win Rewards",
    Icon: Trophy,
  },
];

export const howItWorksFeatures: HowItWorksFeature[] = [
  {
    id: "secure",
    title: "100% Secure",
    description: "Safe & fair gameplay guaranteed.",
    iconBg: "bg-bb-primary/10",
    iconColor: "text-bb-primary",
    Icon: Shield,
  },
  {
    id: "friends",
    title: "Play With Friends",
    description: "Invite friends or play with new opponents.",
    iconBg: "bg-bb-primary/10",
    iconColor: "text-bb-primary",
    Icon: Users,
  },
  {
    id: "realtime",
    title: "Real-Time Fun",
    description: "Live caller, real players, real excitement!",
    iconBg: "bg-bb-primary/10",
    iconColor: "text-bb-primary",
    Icon: Zap,
  },
  {
    id: "rewards",
    title: "Win Rewards",
    description: "Top players win stars & special prizes.",
    iconBg: "bg-bb-gold/15",
    iconColor: "text-bb-gold",
    Icon: Gift,
  },
];
