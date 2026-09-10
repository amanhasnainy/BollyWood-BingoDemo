type SocialIconProps = {
  icon: string;
};

function SocialIcon({ icon }: SocialIconProps) {
  const className = "h-4 w-4";

  switch (icon) {
    case "instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14 8.5V6.75c0-.69.56-1.25 1.25-1.25H17V3h-2.5c-2.07 0-3.75 1.68-3.75 3.75V8.5H9v3h1.75V21h3.25v-9.5H17l.5-3h-3.5z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.13 5 12 5 12 5s-6.13 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.3 26.3 0 0 0 2 12a26.3 26.3 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.87 19 12 19 12 19s6.13 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.3 26.3 0 0 0 22 12a26.3 26.3 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.61 4.07 1.66 5.73L2 22l4.51-1.73a9.86 9.86 0 0 0 5.53 1.67h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.13c-.25.7-1.45 1.34-2 1.42-.5.08-1.16.12-1.88-.12-.43-.14-1-.46-1.74-.9-3.06-1.9-5.05-4.28-5.2-4.48-.15-.2-1.24-1.64-1.24-3.13 0-1.49.78-2.22 1.06-2.52.27-.3.6-.38.8-.38h.57c.18 0 .43-.07.67.51.25.6.84 2.05.92 2.2.08.15.13.33.02.53-.1.2-.16.33-.32.51-.16.18-.34.4-.48.54-.16.16-.33.33-.14.65.19.32.84 1.39 1.81 2.25 1.24 1.1 2.29 1.45 2.61 1.61.32.16.51.14.7-.08.18-.22.8-.93 1.01-1.25.21-.32.42-.27.7-.16.29.11 1.82.86 2.13 1.02.32.16.53.24.61.37.08.14.08.78-.17 1.48z" />
        </svg>
      );
    default:
      return null;
  }
}

type FooterSocialProps = {
  label: string;
  href: string;
  icon: string;
};

export function FooterSocialLink({ label, href, icon }: FooterSocialProps) {
  return (
    <a
      href={href}
      aria-label={label}
      data-testid={`footer-social-${icon}`}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-[#E8A93B]"
    >
      <SocialIcon icon={icon} />
    </a>
  );
}
