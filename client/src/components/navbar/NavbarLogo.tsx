import { BollyBingoLogoIcon } from "@/components/common/BollyBingoLogoIcon";

export function NavbarLogo() {
  return (
    <a
      href="#"
      className="group flex shrink-0 items-center gap-2.5"
      data-testid="navbar-logo"
      onClick={(event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <BollyBingoLogoIcon className="h-9 w-9 transition-transform duration-200 group-hover:scale-105" />
      <span className="font-serif text-xl font-bold tracking-tight text-white">
        Bolly<span className="text-[#E8A93B]">Bingo</span>
      </span>
    </a>
  );
}
