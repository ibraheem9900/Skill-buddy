import icon from "@/assets/skillbuddy-icon.png.asset.json";

export function Logo({ size = 32, withText = true, className = "" }: { size?: number; withText?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="grid place-items-center rounded-xl bg-primary shrink-0"
        style={{ width: size + 12, height: size + 12 }}
      >
        <img src={icon.url} alt="SkillBuddy" width={size} height={size} className="object-contain invert brightness-0" style={{ filter: "brightness(0) invert(1)" }} />
      </div>
      {withText && (
        <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
          Skill<span className="text-primary">buddy</span>
        </span>
      )}
    </div>
  );
}
