import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mobileExtraLinks, navLinks } from "./navbarData";
import { NavbarNavLink } from "./NavbarNavLink";
import { StarWalletPill } from "./StarWalletPill";

type MobileMenuProps = {
  open: boolean;
  activeId: string;
  onClose: () => void;
  onCreateRoom: () => void;
  onWalletClick: () => void;
  onAuthClick: () => void;
  onLogout: () => void;
  isLoggedIn?: boolean;
  userName?: string | null;
};

function getInitials(name?: string | null) {
  if (!name) return "BB";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "BB";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("").slice(0, 2);
}

export function MobileMenu({
  open,
  activeId,
  onClose,
  onCreateRoom,
  onWalletClick,
  onAuthClick,
  onLogout,
  isLoggedIn = false,
  userName,
}: MobileMenuProps) {
  const scrollAndClose = (href: string) => {
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col border-l border-bb-border bg-bb-elevated shadow-xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            data-testid="mobile-menu"
          >
            <div className="flex h-16 items-center justify-between border-b border-bb-border px-5">
              <span className="text-base font-semibold text-bb-text">Menu</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                data-testid="mobile-menu-close"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-bb-border text-bb-muted hover:bg-bb-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-5">
              <ul className="space-y-0.5">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <NavbarNavLink
                      label={link.mobileLabel ?? link.label}
                      href={link.href}
                      isActive={
                        link.sectionId === null
                          ? activeId === "home"
                          : activeId === link.sectionId
                      }
                      onClick={() => scrollAndClose(link.href)}
                      testId={`mobile-nav-${link.id}`}
                    />
                  </li>
                ))}
              </ul>

              <div className="my-5 border-t border-bb-border" />

              <ul className="space-y-0.5">
                {mobileExtraLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => scrollAndClose(link.href)}
                      data-testid={`mobile-nav-${link.id}`}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-bb-muted transition-colors hover:bg-bb-surface hover:text-bb-text"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <StarWalletPill onClick={() => { onWalletClick(); onClose(); }} />
              </div>
            </nav>

            <div className="border-t border-bb-border p-5 space-y-3">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex w-full items-center gap-3 rounded-xl border border-bb-border bg-bb-surface px-3 py-3 text-sm font-semibold text-bb-text">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-br from-[#C81D4A] to-[#1B1330] text-xs font-bold text-white">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{userName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { onCreateRoom(); onClose(); }}
                    data-testid="mobile-nav-create-room"
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-bb-primary text-sm font-semibold text-white hover:bg-bb-primary-hover"
                  >
                    Create Room
                  </button>
                  <button
                    type="button"
                    onClick={() => { onLogout(); onClose(); }}
                    data-testid="mobile-nav-logout"
                    className="w-full rounded-lg border border-bb-border bg-bb-elevated px-3 py-2.5 text-left text-[13px] font-medium text-bb-text hover:bg-bb-surface"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { onAuthClick(); onClose(); }}
                  data-testid="mobile-nav-auth"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-bb-border bg-bb-elevated py-3 text-sm font-semibold text-bb-text hover:border-bb-primary/40 hover:bg-bb-surface"
                >
                  Login / Register
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
