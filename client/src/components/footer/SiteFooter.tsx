import { NavbarLogo } from "@/components/navbar/NavbarLogo";
import { FooterSocialLink } from "./FooterSocial";
import { footerTagline, legalLinks, quickLinks, socialLinks } from "./footerData";

function FooterLinkGroup({
  title,
  links,
  testIdPrefix,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
  testIdPrefix: string;
}) {
  return (
    <div>
      <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#E8A93B]">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              data-testid={`${testIdPrefix}-${link.label.toLowerCase().replace(/\s/g, "-")}`}
              className="text-xs text-white/75 transition-colors hover:text-[#E8A93B]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer
      className="bg-[#1B1330] px-5 py-14 sm:px-8 lg:px-12 text-white border-t border-white/5"
      data-testid="site-footer"
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <NavbarLogo />
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-white/60">
              {footerTagline}
            </p>
          </div>

          <FooterLinkGroup title="QUICK LINKS" links={quickLinks} testIdPrefix="footer-link" />
          <FooterLinkGroup title="LEGAL" links={legalLinks} testIdPrefix="footer-legal" />

          <div>
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#E8A93B]">
              SOCIAL
            </h3>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {socialLinks.map((social) => (
                <FooterSocialLink
                  key={social.icon}
                  label={social.label}
                  href={social.href}
                  icon={social.icon}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/50">
            © 2026 BollyBingo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
