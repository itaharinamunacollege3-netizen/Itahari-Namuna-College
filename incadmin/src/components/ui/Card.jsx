import { cn } from "@/utils/cn";

export function Card({ className, children, ...props }) {
  return (
    <section className={cn("card-surface rounded-2xl", className)} {...props}>
      {children}
    </section>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h2 className={cn("text-lg font-bold text-[var(--color-brand-dark)]", className)} {...props}>
      {children}
    </h2>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("mt-1 text-sm text-[var(--text-muted)]", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
}
