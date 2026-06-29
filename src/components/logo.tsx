import logoDark from "@/assets/skillbuddy-logo-dark.png";
import iconDark from "@/assets/skillbuddy-icon-dark.png";
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
        src={logoDark}
        alt="Skillbuddy"
        className={`object-contain shrink-0 ${className}`}
        style={{ height: size, width: "auto", ...filterStyle }}
        suppressHydrationWarning
      />
    );
  }

  return (
    <img
      src={iconDark}
      alt="Skillbuddy"
      className={`object-contain shrink-0 ${className}`}
      style={{ height: size, width: size, ...filterStyle }}
      suppressHydrationWarning
    />
  );
}
