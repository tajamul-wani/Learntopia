import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "../context/ToastContext";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

/**
 * IdentityPrompt — asks a learner who never chose an identity to pick one.
 *
 * Accounts created by Google sign-in, or by a version of the app that never
 * asked, carry the account holder's real name and no avatar of their own.
 * Learntopia is used by children, so this asks once, on the next visit:
 *
 *  - Choose now  → the existing Edit Profile screen, so there is one form
 *  - Skip        → a gender-neutral Critter avatar, and the public board keeps
 *                  a generated nickname instead of anything from the account
 *
 * Either answer records `identityConfirmedAt`, so it never asks again.
 */
const IdentityPrompt = () => {
  const { needsIdentityChoice, skipIdentityChoice } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [working, setWorking] = useState(false);
  // Dismissing without answering (the close icon, the backdrop, or heading off
  // to the editor) leaves the profile untouched, so the question comes back on
  // the next visit rather than being silently answered for them.
  const [dismissed, setDismissed] = useState(false);

  if (!needsIdentityChoice || dismissed) return null;

  const handleSkip = async () => {
    setWorking(true);
    try {
      await skipIdentityChoice();
      toast.profileSaved(t("identityPrompt.skipped"));
    } finally {
      setWorking(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={() => setDismissed(true)}
      title={t("identityPrompt.title")}
      icon="user"
      showFooter={false}
    >
      <p className="text-sm leading-relaxed text-ink">{t("identityPrompt.body")}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="secondary"
          onClick={handleSkip}
          loading={working}
          disabled={working}
          className="w-full sm:w-auto"
        >
          {t("identityPrompt.skip")}
        </Button>
        <Button
          onClick={() => {
            setDismissed(true);
            navigate("/dashboard?edit=profile");
          }}
          disabled={working}
          className="w-full sm:w-auto"
        >
          {t("identityPrompt.choose")}
        </Button>
      </div>
    </Modal>
  );
};

export default IdentityPrompt;
