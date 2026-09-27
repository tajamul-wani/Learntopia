import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./ui/Icon";
import Avatar from "./Avatar";
import { useLanguage } from "../context/LanguageContext";

/**
 * The learner's account menu, in the desktop navbar (LT-115).
 *
 * The navbar row used to carry the profile pill and a Sign Out button side by
 * side, which is what made it too wide between 1024 and 1280. Both now live
 * behind one control, and it is the only place account actions live, on either
 * layout — a phone reaches the same two things from the My Profile page.
 *
 * It opens on click and is driven entirely from the keyboard. Opening on hover
 * as well was tried and removed: hover opened the menu as the pointer crossed
 * the avatar, so the click that followed toggled it straight back shut and the
 * learner's first click did nothing. Pinning an opened menu against its own
 * close-on-leave is a lot of state to carry for an affordance that no phone or
 * tablet has, and a keyboard cannot use at all.
 */
const AccountMenu = ({ displayName, avatarId, photoURL, onSignOut }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const menuId = useId();
  const [open, setOpen] = useState(false);

  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const itemsRef = useRef([]);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  // Pointer and focus leaving the menu closes it. Listening on the document
  // rather than a backdrop keeps the rest of the page clickable, so a learner
  // who meant to press a nav link gets that link, not a swallowed first click.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onFocusIn = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  const focusItem = (index) => {
    const items = itemsRef.current.filter(Boolean);
    if (!items.length) return;
    const next = (index + items.length) % items.length;
    items[next].focus();
  };

  const openAndFocus = (index) => {
    setOpen(true);
    // The items do not exist until the menu has rendered.
    window.requestAnimationFrame(() => focusItem(index));
  };

  const onButtonKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openAndFocus(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openAndFocus(-1);
    } else if (e.key === "Escape") {
      close();
    }
  };

  const onMenuKeyDown = (e) => {
    const items = itemsRef.current.filter(Boolean);
    const here = items.indexOf(document.activeElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(here + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(here - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(-1);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const goToLearning = () => {
    setOpen(false);
    navigate("/dashboard");
  };

  const signOut = () => {
    setOpen(false);
    onSignOut();
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        data-testid="account-menu-button"
        className={`group flex h-[34px] items-center gap-2 rounded-full border px-3.5 shadow-clay-sm transition-all duration-200 ${
          open
            ? "border-violet-500/50 bg-violet-500/12"
            : "border-white/10 bg-surface-2 hover:border-sky/50 hover:bg-sky/10 hover:shadow-glow"
        }`}
      >
        <Avatar avatarId={avatarId} photoURL={photoURL} size={22} name={displayName} />
        <span className="max-w-[120px] truncate text-xs font-bold text-ink-hi">{displayName}</span>
        <Icon
          name="chevron-down"
          size={14}
          className={`text-ink-low transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("nav.account")}
          onKeyDown={onMenuKeyDown}
          data-testid="account-menu"
          className="absolute right-0 top-[calc(100%+0.375rem)] z-50 w-56 animate-fade-in rounded-2xl border border-white/10 bg-surface p-1.5 shadow-clay"
        >
          <button
            type="button"
            role="menuitem"
            ref={(el) => (itemsRef.current[0] = el)}
            onClick={goToLearning}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-ink-hi transition-colors hover:bg-surface-2 focus:bg-surface-2 focus:outline-none"
          >
            <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-violet-500/15 text-violet-300">
              <Icon name="user" size={16} />
            </span>
            {t("nav.dashboard")}
          </button>

          <div className="mx-2.5 my-1 h-px bg-white/[0.08]" />

          <button
            type="button"
            role="menuitem"
            ref={(el) => (itemsRef.current[1] = el)}
            onClick={signOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-state-danger transition-colors hover:bg-state-danger/10 focus:bg-state-danger/10 focus:outline-none"
          >
            <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-state-danger/12 text-state-danger">
              <Icon name="logout" size={16} />
            </span>
            {t("nav.logout")}
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
