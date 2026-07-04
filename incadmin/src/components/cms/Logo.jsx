import logo from "@/assets/onlylogo.webp";
import { cn } from "@/utils/cn";

const SIZES = {
  sm: {
    wrap: "h-10 w-10",
    img: "h-8 w-8",
    title: "text-sm",
    sub: "text-[11px]",
  },
  md: {
    wrap: "h-11 w-11",
    img: "h-9 w-9",
    title: "text-[15px]",
    sub: "text-xs",
  },
  lg: {
    wrap: "h-14 w-14",
    img: "h-11 w-11",
    title: "text-lg",
    sub: "text-sm",
  },
  xl: {
    wrap: "h-20 w-20",
    img: "h-16 w-16",
    title: "text-2xl",
    sub: "text-sm",
  },
};

export function LogoMark({ size = "md", light = false, className }) {
  const s = SIZES[size] ?? SIZES.md;

  return (
    <div
      className={cn(
        "brand-logo-mark flex shrink-0 items-center justify-center overflow-hidden rounded-lg",
        s.wrap,
        className
      )}
    >
      <img
        src={logo}
        alt="Itahari Namuna College"
        className={cn(s.img, "object-contain")}
        style={light ? { filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' } : undefined}
      />
    </div>
  );
}

export function Logo({
  size = "md",
  light = false,
  showText = true,
  title = "Itahari Namuna College",
  subtitle = "Content Management System",
  compact = false,
  className,
}) {
  const s = SIZES[size] ?? SIZES.md;
  const displayTitle = compact ? "Itahari Namuna" : title;
  const displaySubtitle = compact ? "College CMS" : subtitle;

  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <LogoMark size={size} light={light} />
      {showText ? (
        <div className="min-w-0">
          <p
            className={cn(
              s.title,
              "truncate font-bold leading-tight",
              light ? "text-white" : "text-[var(--color-brand-dark)]"
            )}
          >
            {displayTitle}
          </p>
          <p
            className={cn(
              s.sub,
              "truncate",
              light ? "text-white/75" : "text-[var(--text-muted)]"
            )}
          >
            {displaySubtitle}
          </p>
        </div>
      ) : null}
    </div>
  );
}
