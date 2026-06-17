export function Logo({ size = 36, withText = true, className = "" }: { size?: number; withText?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 40 40" aria-label="SkillBuddy" className="shrink-0">
        <defs>
          <linearGradient id="sbLogoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-glow)" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="20" fill="url(#sbLogoGrad)" />
        <path
          d="M14.5 16.5c0-2 1.5-3.4 3.8-3.4 1.9 0 3.3.9 3.7 2.6h-2.4c-.2-.5-.7-.8-1.4-.8-.8 0-1.3.4-1.3 1 0 .6.5.9 1.9 1.2 2.6.5 3.6 1.5 3.6 3.3 0 2.1-1.6 3.5-4 3.5-2.2 0-3.8-1.1-4.1-3h2.5c.2.7.9 1.1 1.7 1.1.9 0 1.5-.4 1.5-1.1 0-.6-.4-.9-1.9-1.2-2.5-.5-3.6-1.4-3.6-3.2zm9 0c0-2 1.5-3.4 3.8-3.4 1.9 0 3.3.9 3.7 2.6h-2.4c-.2-.5-.7-.8-1.4-.8-.8 0-1.3.4-1.3 1 0 .6.5.9 1.9 1.2 2.6.5 3.6 1.5 3.6 3.3 0 2.1-1.6 3.5-4 3.5-2.2 0-3.8-1.1-4.1-3h2.5c.2.7.9 1.1 1.7 1.1.9 0 1.5-.4 1.5-1.1 0-.6-.4-.9-1.9-1.2-2.5-.5-3.6-1.4-3.6-3.2z"
          fill="white"
        />
      </svg>
      {withText && (
        <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
          Skill<span className="text-primary">Buddy</span>
        </span>
      )}
    </div>
  );
}
