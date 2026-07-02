import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { useI18n } from "@/lib/i18n";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  message?: string;
};

const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.skillbuddy.app";
const IOS_URL = "https://apps.apple.com/app/skillbuddy/id000000000";

function AppStoreIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M3.18 23.76a2 2 0 0 1-.94-.87l9.38-9.38 2.83 2.83-10.37 7.77a2.06 2.06 0 0 1-.9-.35zM.5 2.39A2 2 0 0 0 .06 3.5v17c0 .38.1.74.28 1.05l.1.1 9.52-9.52v-.22L.5 2.39zm20.07 8.64-2.67-1.55-2.99 2.99 3 3 2.67-1.56a2.02 2.02 0 0 0 0-2.88zM3.18.24l10.37 7.77-2.83 2.83L1.34 1.46A2 2 0 0 1 3.18.24z"/>
    </svg>
  );
}

export function QRDownloadModal({ open, onOpenChange, title, message }: Props) {
  const { t } = useI18n();

  const displayTitle = title ?? t("qr.title");
  const displayMessage = message ?? t("qr.message");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-3xl border-0 p-0 overflow-hidden shadow-2xl gap-0">

        {/* Header */}
        <div
          className="relative px-7 pb-7 pt-8 text-center text-white overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1d5c44 0%, #2D7A5F 60%, #3a9b76 100%)" }}
        >
          {/* decorative blobs */}
          <div className="pointer-events-none absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10" />

          <div className="relative">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="white" aria-hidden="true">
                <path d="M17 2H7C5.9 2 5 2.9 5 4v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H7V4h10v12zm-5 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
              </svg>
            </div>
            <h2 className="font-display text-xl font-extrabold leading-snug">
              {displayTitle}
            </h2>
            <p className="mt-2 text-sm text-white/80 leading-relaxed">
              {displayMessage}
            </p>
          </div>
        </div>

        {/* QR section */}
        <div className="bg-background px-7 py-6">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("app.qr.availableOn")}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* iOS */}
            <a
              href={IOS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
            >
              <div className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-border group-hover:ring-primary/20">
                <QRCodeSVG
                  value={IOS_URL}
                  size={110}
                  bgColor="#ffffff"
                  fgColor="#1a1a1a"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <AppStoreIcon />
                <span>{t("app.qr.appStore")}</span>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                {t("common.ios")}
              </span>
            </a>

            {/* Android */}
            <a
              href={ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
            >
              <div className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-border group-hover:ring-primary/20">
                <QRCodeSVG
                  value={ANDROID_URL}
                  size={110}
                  bgColor="#ffffff"
                  fgColor="#1a1a1a"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <PlayStoreIcon />
                <span>{t("app.qr.googlePlay")}</span>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                {t("common.android")}
              </span>
            </a>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {t("app.qr.scanTitle")} · {t("app.qr.scanSubtext")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
