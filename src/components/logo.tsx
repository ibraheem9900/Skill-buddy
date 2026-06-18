export function Logo({ size = 36, withText = true, className = "" }: { size?: number; withText?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="36" height="36" rx="8" fill="hsl(var(--primary))" />
        <path
          d="M10 24L14 12H16L18 18L20 12H22L26 24H24L22.5 19.5H21L20 22H16L15 19.5H13.5L12 24H10Z"
          fill="white"
        />
        <circle cx="18" cy="10" r="2.5" fill="white" fillOpacity="0.7" />
      </svg>
      {withText && (
        <span className="hidden sm:inline font-display text-xl font-extrabold tracking-tight text-foreground">
          Skill<span className="text-primary">Buddy</span>
        </span>
      )}
    </div>
  );
}
