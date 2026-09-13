import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Icon from "../Components/ui/Icon";
import { useLanguage } from "../context/LanguageContext";

const MAX_MSG = 1000;

// ─── Component ────────────────────────────────────────────────────────────────
const Contact = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CONTACT_CARDS = [
    {
      icon: "mail",
      label: t("contact.emailCardTitle"),
      value: t("contact.emailCardSub"),
      href: "mailto:tajamul.270@gmail.com",
      border: "border-violet-500/20",
      chip: "bg-violet-500/15 border-violet-500/30 text-violet-400",
    },
    {
      icon: "clock",
      label: t("contact.responseTitle"),
      value: t("contact.responseSub"),
      border: "border-sky/20",
      chip: "bg-sky/15 border-sky/30 text-sky",
    },
    {
      icon: "book",
      label: t("contact.docTitle"),
      value: t("contact.docSub"),
      to: "/doc",
      border: "border-state-success/20",
      chip: "bg-state-success/15 border-state-success/30 text-state-success",
    },
    {
      icon: "shield",
      label: t("contact.privacyTitle"),
      value: t("contact.privacySub"),
      border: "border-gold-500/20",
      chip: "bg-gold-500/15 border-gold-500/30 text-gold-400",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > MAX_MSG) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "ContactMessages"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || "(no subject)",
        message: formData.message.trim(),
        submittedAt: serverTimestamp(),
      });
      // Navigate to dedicated Thank You page, pass name via state
      navigate("/thank-you", { state: { name: formData.name.trim() } });
    } catch (err) {
      console.error("Contact form error:", err);
      setErrors({ form: "Something went wrong. Please try again or email us directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase = (hasError) =>
    `w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-[0.95rem] text-ink-hi outline-none
     transition-all duration-200 placeholder:text-ink-low focus:bg-white/[0.05] focus:ring-2
     ${
       hasError
         ? "border-state-danger/60 focus:border-state-danger focus:ring-state-danger/20"
         : "border-white/[0.08] focus:border-violet-500 focus:ring-violet-500/25"
     }`;

  return (
    <div className="container-page py-16 md:py-24">

      {/* ── Page header ── */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-violet-400">
          <Icon name="message-circle" size={13} /> {t("contact.eyebrow")}
        </span>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-ink-hi sm:text-5xl">
          {t("contact.title")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink sm:text-lg">
          {t("contact.subtitle")}
        </p>
      </div>

      {/* ── Main grid ── */}
      <div className="mx-auto mt-14 grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.5fr]">

        {/* ── Info sidebar (second on mobile, first/left on lg+) ── */}
        <div className="order-2 lg:order-1 flex flex-col gap-4">
          {CONTACT_CARDS.map((card) => (
            <div
              key={card.label}
              className={`group relative overflow-hidden rounded-2xl border bg-surface shadow-clay p-5 transition-all duration-300 hover:-translate-y-0.5 ${card.border}`}
            >
              <div className="flex items-start gap-4">
                <div className={`grid h-11 w-11 flex-none place-items-center rounded-xl border shadow-clay-sm ${card.chip}`}>
                  <Icon name={card.icon} size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-low">
                    {card.label}
                  </p>
                  {card.href ? (
                    <a
                      href={card.href}
                      className="mt-1 block truncate text-sm font-medium text-ink-hi transition-colors hover:text-violet-400"
                    >
                      {card.value}
                    </a>
                  ) : card.to ? (
                    <Link
                      to={card.to}
                      className="mt-1 block text-sm font-medium text-ink-hi transition-colors hover:text-violet-400"
                    >
                      {card.value}
                    </Link>
                  ) : (
                    <p className="mt-1 text-sm leading-snug text-ink-hi">{card.value}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Contact form (first on mobile, second/right on lg+) ── */}
        <div className="order-1 lg:order-2 relative overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-clay p-7 md:p-9">
          <div className="relative mb-7">
            <h2 className="text-xl font-bold text-ink-hi">{t("contact.formHeading")}</h2>
            <p className="mt-1 text-sm text-ink-low">
              {t("contact.formSubtitle")}
            </p>
          </div>

          {errors.form && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-state-danger/30 bg-state-danger/10 p-4 text-sm text-state-danger">
              <Icon name="warning" size={16} className="mt-0.5 flex-none" />
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-5">

            {/* Name + Email */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-name"
                  className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-low"
                >
                  {t("contact.nameLabel")} <span className="text-state-danger">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder={t("contact.namePlaceholder")}
                  value={formData.name}
                  onChange={handleChange}
                  className={inputBase(!!errors.name)}
                />
                {errors.name && (
                  <span className="flex items-center gap-1 text-xs text-state-danger">
                    <Icon name="info" size={12} /> {errors.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-email"
                  className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-low"
                >
                  {t("contact.emailLabel")} <span className="text-state-danger">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("contact.emailPlaceholder")}
                  value={formData.email}
                  onChange={handleChange}
                  className={inputBase(!!errors.email)}
                />
                {errors.email && (
                  <span className="flex items-center gap-1 text-xs text-state-danger">
                    <Icon name="info" size={12} /> {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-subject"
                className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-low"
              >
                {t("contact.subjectLabel")}
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder={t("contact.subjectPlaceholder")}
                value={formData.subject}
                onChange={handleChange}
                className={inputBase(false)}
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="contact-message"
                  className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-low"
                >
                  {t("contact.messageLabel")} <span className="text-state-danger">*</span>
                </label>
                <span
                  className={`text-xs tabular-nums ${
                    formData.message.length >= MAX_MSG * 0.9 ? "text-gold-400" : "text-ink-low"
                  }`}
                >
                  {formData.message.length}/{MAX_MSG}
                </span>
              </div>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                placeholder="..."
                value={formData.message}
                onChange={handleChange}
                className={`${inputBase(!!errors.message)} resize-none`}
              />
              {errors.message && (
                <span className="flex items-center gap-1 text-xs text-state-danger">
                  <Icon name="info" size={12} /> {errors.message}
                </span>
              )}
            </div>

            {/* Privacy note */}
            <p className="text-xs text-ink-low">
              {t("contact.agreementPre")}{" "}
              <Link to="/privacy" className="text-violet-400 hover:text-violet-300">
                {t("contact.privacyLink")}
              </Link>
              . {t("contact.agreementPost")}
            </p>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-clay-btn transition-all duration-200 hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                    />
                  </svg>
                  {t("contact.sending")}
                </>
              ) : (
                <>
                  <Icon name="arrow" size={17} />
                  {t("contact.sendBtn")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
