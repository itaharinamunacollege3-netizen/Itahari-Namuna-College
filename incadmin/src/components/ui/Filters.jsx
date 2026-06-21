import { Search } from "lucide-react";
import { cn } from "@/utils/cn";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  inputClassName,
  size = "sm",
  ...props
}) {
  const sizeClass = size === "md" ? "input-md" : "input-sm";

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "input input-bordered w-full rounded-xl border-[var(--border-subtle)] bg-[var(--color-surface)] pl-9",
          sizeClass,
          inputClassName
        )}
        {...props}
      />
    </div>
  );
}

export function FilterSelect({
  value,
  onChange,
  className,
  size = "sm",
  children,
  ...props
}) {
  const sizeClass = size === "md" ? "select-md" : "select-sm";

  return (
    <select
      value={value}
      onChange={onChange}
      className={cn(
        "select select-bordered rounded-xl border-[var(--border-subtle)] bg-[var(--color-surface)]",
        sizeClass,
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
