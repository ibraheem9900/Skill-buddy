import logoTransparent from "@/assets/skillbuddy-logo-transparent.png";
import iconTransparent from "@/assets/skillbuddy-icon-transparent.png";
import { useTheme } from "@/components/theme-provider";

export function Logo({
  size = 36,
  withText = true,
  className = "",
}: {
  size?: number;
  withText?: boolean;
  className?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const filterStyle = isDark
    ? { filter: "brightness(0) invert(1)" }
    : undefined;

  if (withText) {
    return (
      <img
        src={logoTransparent}
        alt="Skillbuddy"
        className={`object-contain shrink-0 ${className}`}
        style={{ height: size, width: "auto", ...filterStyle }}
        suppressHydrationWarning
      />
    );
  }

  return (
    <img
      src={iconTransparent}
      alt="Skillbuddy"
      className={`object-contain shrink-0 ${className}`}
      style={{ height: size, width: size, ...filterStyle }}
      suppressHydrationWarning
    />
  );
}
