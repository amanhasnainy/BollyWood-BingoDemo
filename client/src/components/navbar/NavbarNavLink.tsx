import { cn } from "@/lib/utils";

type NavbarNavLinkProps = {
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
  testId?: string;
};

export function NavbarNavLink({ label, href, isActive, onClick, testId }: NavbarNavLinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
    onClick?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      data-testid={testId}
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150",
        isActive
          ? "text-[#E8A93B] font-semibold"
          : "text-white/80 hover:text-[#E8A93B]",
      )}
    >
      {label}
    </a>
  );
}
