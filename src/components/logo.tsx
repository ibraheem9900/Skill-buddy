import logoIcon from "@/assets/skillbuddy-icon.png";

export function Logo({ size = 36, withText = true, className = "" }: { size?: number; withText?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoIcon}
        alt="SkillBuddy"
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ height: size, width: size }}
      />
      {withText && (
        <span className="hidden sm:inline font-display text-xl font-extrabold tracking-tight text-foreground">
          Skill<span className="text-primary">Buddy</span>
        </span>
      )}
    </div>
  );
}
