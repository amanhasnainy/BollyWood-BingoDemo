import { useState } from "react";
import { Menu } from "lucide-react";
import { useAuth } from "@/global/authContext";
import { MobileMenu } from "./MobileMenu";
import { NavbarActions } from "./NavbarActions";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarNavLink } from "./NavbarNavLink";
import { navLinks } from "./navbarData";
import { useActiveSection } from "./useActiveSection";

type NavbarProps = {
  onCreateRoom?: () => void;
};

export function Navbar({ onCreateRoom = () => {} }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useActiveSection();
  const { user, clearTokens, isLoggedIn } = useAuth();
  function resolveDisplayName(u: any) {
    if (!u) return null;
    return (
      u.name ||
      u.fullName ||
      u.full_name ||
      [u.firstName, u.lastName].filter(Boolean).join(" ") ||
      [u.first_name, u.last_name].filter(Boolean).join(" ") ||
      u.email ||
      u.username ||
      null
    );
  }

  const fullName = resolveDisplayName(user);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const goToAuth = () => {
    window.location.hash = "#/login";
  };

  const goToLogout = () => {
    clearTokens();
    window.location.hash = "#/";
  };

  const isLinkActive = (sectionId: string | null) => {
    if (sectionId === null) return activeId === "home";
    return activeId === sectionId;
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-[#E8A93B]/20 bg-[#1B1330] text-white backdrop-blur-md"
        data-testid="navbar"
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:px-8 sm:h-20">
          <NavbarLogo />

          <nav
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <NavbarNavLink
                key={link.id}
                label={link.label}
                href={link.href}
                isActive={isLinkActive(link.sectionId)}
                testId={`nav-${link.id}`}
              />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <NavbarActions
              onCreateRoom={onCreateRoom}
              onWalletClick={() => scrollTo("star-wallet")}
              onAuthClick={goToAuth}
              onLogout={goToLogout}
              userName={fullName}
              isLoggedIn={isLoggedIn}
            />

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              data-testid="navbar-menu-toggle"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        activeId={activeId}
        onClose={() => setMobileOpen(false)}
        onCreateRoom={onCreateRoom}
        onWalletClick={() => scrollTo("star-wallet")}
        onAuthClick={goToAuth}
        onLogout={goToLogout}
        userName={fullName}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
