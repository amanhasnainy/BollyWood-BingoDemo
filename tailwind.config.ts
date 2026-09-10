import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      colors: {
        bb: {
          bg: "#FBF3E7",
          surface: "#F5E9D7",
          elevated: "#FFFFFF",
          primary: "#C81D4A",
          "primary-hover": "#A6153B",
          gold: "#E8A93B",
          success: "#0B6E64",
          text: "#1B1330",
          muted: "#6E627C",
          border: "#EADBCC",
          ink: "#1B1330",
          cream: "#FBF3E7",
        },
        // Flat / base colors (regular buttons)
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border: "var(--destructive-border)",
        },
        ring: "hsl(var(--ring) / <alpha-value>)",
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--sidebar-primary) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border: "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--sidebar-accent) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "var(--sidebar-accent-border)"
        },
        status: {
          online: "rgb(11 110 100)",
          away: "rgb(232 169 59)",
          busy: "rgb(200 29 74)",
          offline: "rgb(156 163 175)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "hero-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "hero-pulse-number": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 4px 20px rgba(200, 29, 74, 0.2)",
          },
          "50%": {
            transform: "scale(1.04)",
            boxShadow: "0 6px 24px rgba(200, 29, 74, 0.28)",
          },
        },
        "hero-glow-border": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "particle-drift": {
          "0%": { transform: "translate(0, 0)", opacity: "0.15" },
          "50%": { transform: "translate(12px, -24px)", opacity: "0.55" },
          "100%": { transform: "translate(-8px, -48px)", opacity: "0.1" },
        },
        "bingo-ball-float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(8deg)" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.7" },
          "90%": { opacity: "0.5" },
          "100%": { transform: "translateY(80px) rotate(180deg)", opacity: "0" },
        },
        "hero-gradient-shift": {
          "0%, 100%": { filter: "hue-rotate(0deg) brightness(1)" },
          "50%": { filter: "hue-rotate(8deg) brightness(1.08)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "hero-float": "hero-float 7s ease-in-out infinite",
        "hero-pulse-number": "hero-pulse-number 2.4s ease-in-out infinite",
        "hero-glow-border": "hero-glow-border 3s ease-in-out infinite",
        "particle-drift": "particle-drift 10s ease-in-out infinite",
        "bingo-ball-float": "bingo-ball-float 6s ease-in-out infinite",
        "confetti-fall": "confetti-fall 5s ease-in-out infinite",
        "hero-gradient-shift": "hero-gradient-shift 12s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
