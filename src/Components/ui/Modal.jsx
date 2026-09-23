import { useEffect } from "react";
import { createPortal } from "react-dom";
import Card from "./Card";
import Icon from "./Icon";
import Button from "./Button";
import { useLanguage } from "../../context/LanguageContext";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  icon, 
  actionText = "Confirm", 
  onAction, 
  actionVariant = "primary", 
  isDestructive = false,
  loading = false,
  actionDisabled = false,
  showFooter = true
}) => {
  const { t } = useLanguage();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { 
      document.body.style.overflow = 'unset'; 
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const shouldRenderFooter = showFooter && Boolean(onAction);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={!loading ? onClose : undefined}
      />
      
      <Card className="relative z-10 w-full max-w-lg overflow-hidden p-5 sm:p-6 md:p-8 animate-fade-up">
        <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6 sm:gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {icon && (
              <div className={`grid h-9 w-9 flex-none place-items-center rounded-xl shadow-clay-sm sm:h-12 sm:w-12 sm:rounded-2xl ${isDestructive ? 'bg-state-danger/15 text-state-danger' : 'bg-sky/15 text-sky'}`}>
                <Icon name={icon} size={18} className="sm:hidden" />
                <Icon name={icon} size={24} className="hidden sm:block" />
              </div>
            )}
            <h2 className="min-w-0 truncate text-base font-extrabold text-ink-hi sm:text-xl md:text-2xl">{title}</h2>
          </div>
          <button 
            onClick={!loading ? onClose : undefined}
            disabled={loading}
            aria-label={t("common.close")}
            className="rounded-xl p-2 text-ink-low transition-colors hover:bg-surface-2 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        
        <div className="mb-6 text-ink">
          {children}
        </div>
        
        {shouldRenderFooter && (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose} disabled={loading} className="w-full sm:w-auto">
              {t("common.cancel")}
            </Button>
            <Button 
              variant={actionVariant} 
              onClick={onAction} 
              loading={loading} 
              disabled={actionDisabled || loading} 
              className="w-full sm:w-auto"
            >
              {actionText}
            </Button>
          </div>
        )}
      </Card>
    </div>,
    document.body
  );
};

export default Modal;
