type BollyBingoLogoIconProps = {
  className?: string;
  variant?: "dark" | "light";
};

export function BollyBingoLogoIcon({
  className = "h-9 w-9",
  variant = "dark",
}: BollyBingoLogoIconProps) {
  const isDark = variant === "dark";

  return (
    <svg
      aria-label="BollyBingo logo"
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={isDark ? "clapper-stripes-dark" : "clapper-stripes-light"}
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-25)"
        >
          <rect width="8" height="16" fill={isDark ? "#E8A93B" : "#C81D4A"} />
          <rect x="8" width="8" height="16" fill="#FBF3E7" />
        </pattern>
      </defs>

      {/* Top Clapperboard Stick */}
      <g transform="rotate(-12 50 18)">
        <rect
          x="12"
          y="6"
          width="76"
          height="20"
          rx="6"
          fill={`url(#${isDark ? "clapper-stripes-dark" : "clapper-stripes-light"})`}
          stroke={isDark ? "#FBF3E7" : "#1B1330"}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="16" r="4" fill={isDark ? "#FBF3E7" : "#1B1330"} />
      </g>

      {/* Bottom Bingo Card Body */}
      <rect
        x="15"
        y="24"
        width="70"
        height="70"
        rx="12"
        fill={isDark ? "#1B1330" : "#FFFFFF"}
        stroke={isDark ? "#FBF3E7" : "#1B1330"}
        strokeWidth="5"
      />

      {/* 3x3 Grid Lines */}
      <line x1="38.3" y1="24" x2="38.3" y2="94" stroke={isDark ? "#3D2E5C" : "#CBD2DE"} strokeWidth="3.5" />
      <line x1="61.6" y1="24" x2="61.6" y2="94" stroke={isDark ? "#3D2E5C" : "#CBD2DE"} strokeWidth="3.5" />
      <line x1="15" y1="47.3" x2="85" y2="47.3" stroke={isDark ? "#3D2E5C" : "#CBD2DE"} strokeWidth="3.5" />
      <line x1="15" y1="70.6" x2="85" y2="70.6" stroke={isDark ? "#3D2E5C" : "#CBD2DE"} strokeWidth="3.5" />

      {/* Center Star Cell Badge */}
      <rect x="40" y="49" width="20" height="20" rx="4" fill={isDark ? "#C81D4A" : "#E8A93B"} />
      {/* Star Icon inside Center Cell */}
      <polygon
        points="50,52 52,56.5 56.8,57 53.2,60 54.3,64.8 50,62.2 45.7,64.8 46.8,60 43.2,57 48,56.5"
        fill={isDark ? "#FFFFFF" : "#1B1330"}
      />
    </svg>
  );
}
