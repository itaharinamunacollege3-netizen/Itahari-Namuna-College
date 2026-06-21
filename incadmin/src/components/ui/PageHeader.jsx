import { useTheme } from "@/contexts/ThemeContext";
export function PageHeader({ title, subtitle, actions }) {
   const { theme } = useTheme();
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-[var(--color-brand-dark)]"
          }`}>{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
