import { cn } from "@/utils/cn";

const SIZE_CLASSES = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "",
};

const VARIANT_CLASSES = {
  primary: "border-none bg-[var(--color-brand-primary)] text-white hover:brightness-105",
  ghost: "btn-ghost",
  danger: "btn-ghost text-rose-600 hover:bg-rose-50",
  neutral: "",
};

export function Button({
  children,
  className,
  size = "md",
  variant = "neutral",
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn("btn", SIZE_CLASSES[size] ?? SIZE_CLASSES.md, VARIANT_CLASSES[variant] ?? "", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="loading loading-spinner loading-xs" /> : null}
      {children}
    </button>
  );
}
