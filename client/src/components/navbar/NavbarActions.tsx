import { Bell, ChevronDown, LogIn, Plus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarWalletPill } from "./StarWalletPill";

type NavbarActionsProps = {
  onCreateRoom: () => void;
  onWalletClick: () => void;
  onAuthClick: () => void;
  onLogout: () => void;
  isLoggedIn?: boolean;
  userName?: string | null;
  showCreateButton?: boolean;
};

function getInitials(name?: string | null) {
  if (!name) return "BB";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "BB";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("").slice(0, 2);
}

export function NavbarActions({
  onCreateRoom,
  onWalletClick,
  onAuthClick,
  onLogout,
  isLoggedIn = false,
  userName,
  showCreateButton = true,
}: NavbarActionsProps) {

  return (
    <div className="flex items-center gap-2">
      <StarWalletPill onClick={onWalletClick} className="hidden sm:inline-flex" />

      {isLoggedIn ? (
        <div
          data-testid="navbar-user"
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={onLogout}
            data-testid="navbar-logout-compact"
            title="Logout"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
          </button>

          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-[#E8A93B]/40">
            <AvatarFallback className="bg-[#E8A93B] text-xs font-extrabold text-[#1B1330]">
              {getInitials(userName)[0] || "A"}
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <button
          type="button"
          onClick={onAuthClick}
          data-testid="navbar-auth"
          className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 sm:inline-flex"
        >
          <LogIn className="h-3.5 w-3.5 text-[#E8A93B]" />
          <span>Login</span>
        </button>
      )}

      {showCreateButton && (
        <button
          type="button"
          onClick={onCreateRoom}
          data-testid="navbar-create-room"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#C81D4A] px-4 text-xs font-bold text-white shadow-md shadow-[#C81D4A]/20 transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Create Room</span>
        </button>
      )}
    </div>
  );
}
