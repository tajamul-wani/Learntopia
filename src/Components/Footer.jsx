import { NavLink } from "react-router-dom";
import Logo from "./ui/Logo";
import Icon from "./ui/Icon";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const LINK_GROUPS = [
    {
      title: t("nav.courses"),
      links: [
        { to: "/courses", label: t("nav.courses") },
        { to: "/quiz", label: t("nav.quiz") },
        { to: "/doc", label: t("nav.doc") },
      ],
    },
    {
      title: t("dashboard.welcome"),
      links: [
        { to: "/login", label: t("nav.login") },
        { to: "/signUp", label: t("nav.signUp") },
        { to: "/dashboard", label: t("nav.dashboard") },
      ],
    },
    {
      title: t("nav.contact"),
      links: [
        { to: "/contact", label: t("nav.contact") },
        { to: "/", label: t("nav.home") },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { to: "/privacy", label: t("footer.privacy") },
        { to: "/terms", label: t("footer.terms") },
      ],
    },
  ];

  return (
    <footer className="mt-20 select-none border-t border-white/[0.07] bg-ground-900">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-low">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Link columns */}
          {LINK_GROUPS.map((group, idx) => (
            <div key={idx}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-ink">{group.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <NavLink
                      to={link.to}
                      className="text-sm text-ink-low transition-colors hover:text-ink-hi"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-center text-xs text-ink-low sm:flex-row sm:text-left">
          <p className="text-center leading-relaxed sm:text-left">&copy; {new Date().getFullYear()} Learntopia. {t("footer.rights")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
            <span>
              Built by{" "}
              <a
                href="https://github.com/tajamul-wani"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-ink transition-colors hover:text-ink-hi"
              >
                Tajamul Wani
              </a>
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/tajamul-wani"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] text-ink-low transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-ink-hi"
              >
                <Icon name="github" size={16} />
              </a>
              <a
                href="https://linkedin.com/in/tajamul-wani"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] text-ink-low transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-ink-hi"
              >
                <Icon name="linkedin" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
