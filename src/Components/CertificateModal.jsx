import { useEffect, useRef, useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import Icon from "./ui/Icon";
import { useLanguage } from "../context/LanguageContext";
import { COURSES } from "../data/coursesData";
import {
  CERT_HEIGHT,
  CERT_WIDTH,
  certificateFontsReady,
  certificateId,
  downloadCertificate,
  drawCertificate,
  loadCertificateLogo,
} from "../utils/certificate";

/**
 * The certificate, shown full size and downloadable as a PNG.
 *
 * Drawn on a canvas the learner can actually see, rather than rendered
 * invisibly for export: what they look at is the file they get.
 *
 * The name is the display name they chose. No real name is asked for or kept
 * (LT-81), so a certificate carries nothing the app did not already hold.
 */
const CertificateModal = ({ open, onClose, uid, learnerName, course, completedAt }) => {
  const { t, currentLang } = useLanguage();
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(true);
  const [saving, setSaving] = useState(false);
  // The footer line as drawn. Canvas text cannot be read back, so this is how
  // the date on the certificate is checkable from the outside.
  const [dateLine, setDateLine] = useState("");

  const courseTitle = course?.title || "";
  const courseId = course?.courseId ?? course?.id ?? "";
  const id = certificateId(uid, courseId);
  // The badge belongs to the course, so it is looked up here rather than
  // threaded through every caller.
  const badgeName = COURSES.find((c) => String(c.id) === String(courseId))?.badge?.name || "";

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setDrawing(true);

    (async () => {
      // Both matter before the first stroke: a canvas drawn before the faces
      // load is set in a fallback, and the mark has to be the real file.
      const [logo] = await Promise.all([loadCertificateLogo(), certificateFontsReady()]);
      if (cancelled || !canvasRef.current) return;

      // A certificate carries a date. When the app recorded when the course was
      // finished it says so; an enrolment completed before that was recorded
      // has no such date, and rather than print today as if it were the
      // completion day, the document is dated by when it was issued — which is
      // the truth about the piece of paper, not a guess about the learner.
      const raw = completedAt?.toDate?.() || (completedAt ? new Date(completedAt) : null);
      const finished = raw && !Number.isNaN(raw.getTime()) ? raw : null;
      const date = finished || new Date();
      const dateText = date.toLocaleDateString(currentLang, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const dateLabel = finished ? t("certificate.completedOn") : t("certificate.issuedOn");
      setDateLine(`${dateLabel} ${dateText}`);
      drawCertificate(canvasRef.current, {
        learnerName,
        courseTitle,
        dateText,
        badgeName,
        id,
        logo,
        strings: {
          eyebrow: t("certificate.eyebrow"),
          awardedTo: t("certificate.awardedTo"),
          forCompleting: t("certificate.forCompleting"),
          badgeEarned: t("certificate.badgeEarned"),
          dateLabel,
          certificateId: t("certificate.idLabel"),
        },
      });
      setDrawing(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [open, learnerName, courseTitle, completedAt, badgeName, id, currentLang, t]);

  const save = async () => {
    if (!canvasRef.current) return;
    setSaving(true);
    await downloadCertificate(canvasRef.current, courseTitle);
    setSaving(false);
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={t("certificate.title")}
      showFooter={false}
      widthClass="max-w-4xl"
    >
      <div className="flex flex-col gap-4">
        {/* The canvas is its real 1600x1131 and simply scales down to the
            dialog, so the preview and the download are the same pixels. */}
        <div
          data-testid="certificate-canvas-wrap"
          data-date-line={dateLine}
          className="overflow-hidden rounded-2xl border border-white/10 bg-surface-2"
          style={{ aspectRatio: `${CERT_WIDTH} / ${CERT_HEIGHT}` }}
        >
          <canvas ref={canvasRef} className="h-full w-full" aria-label={t("certificate.title")} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="min-w-0 text-[0.8125rem] text-ink-low">{t("certificate.hint")}</p>
          <Button
            onClick={save}
            loading={saving}
            disabled={drawing || saving}
            data-testid="certificate-download"
            className="gap-2 font-bold"
          >
            <Icon name="arrow" size={16} className="rotate-90" />
            {t("certificate.download")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CertificateModal;
