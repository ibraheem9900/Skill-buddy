import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  message?: string;
};

const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.skillbuddy.app";
const IOS_URL = "https://apps.apple.com/app/skillbuddy/id000000000";

export function QRDownloadModal({ open, onOpenChange, title, message }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border p-0 overflow-hidden">
        <div className="gradient-hero p-6 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary shadow-elegant">
            <Smartphone className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl font-extrabold">{title ?? "📱 Book via the SkillBuddy App"}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {message ?? "To post a job and receive bids from verified professionals, please download the SkillBuddy app."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6">
          <QRBlock label="Android" sublabel="Google Play" url={ANDROID_URL} />
          <QRBlock label="iOS" sublabel="App Store" url={IOS_URL} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function QRBlock({ label, sublabel, url }: { label: string; sublabel: string; url: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4">
      <div className="rounded-xl bg-white p-2">
        <QRCodeSVG value={url} size={120} level="M" />
      </div>
      <div className="text-sm font-bold">{label}</div>
      <div className="text-xs text-muted-foreground">{sublabel}</div>
    </div>
  );
}
