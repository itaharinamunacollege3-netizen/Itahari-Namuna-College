import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ open, title, onClose, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div
        className={`card-surface relative z-10 max-h-[90vh] w-full overflow-y-auto p-6 ${
          wide === "xl" ? "max-w-3xl" : wide ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[var(--color-brand-dark)]">{title}</h3>
          <button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--sidebar-text)]">{label}</span>
      {children}
    </label>
  );
}

export function FormInput(props) {
  return (
    <input
      className="input input-bordered w-full rounded-xl border-[var(--border-subtle)] bg-[var(--color-surface)]"
      {...props}
    />
  );
}

export function FormTextarea(props) {
  return (
    <textarea
      className="textarea textarea-bordered w-full rounded-xl border-[var(--border-subtle)] bg-[var(--color-surface)]"
      rows={4}
      {...props}
    />
  );
}

export function FormSelect({ children, ...props }) {
  return (
    <select className="select select-bordered w-full rounded-xl border-[var(--border-subtle)] bg-[var(--color-surface)]" {...props}>
      {children}
    </select>
  );
}

export function FormCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--sidebar-text)]">
      <input
        type="checkbox"
        className="checkbox checkbox-sm border-[var(--border-subtle)]"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

export function FormHint({ children }) {
  return <p className="mt-1 text-xs text-[var(--text-muted)]">{children}</p>;
}

export function FormSection({ title, children }) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-[var(--border-subtle)] p-4">
      {title ? (
        <legend className="px-1 text-sm font-semibold text-[var(--color-brand-dark)]">{title}</legend>
      ) : null}
      {children}
    </fieldset>
  );
}

export function FormActions({ onCancel, submitLabel = "Save", loading }) {
  return (
    <div className="mt-6 flex justify-end gap-2">
      <button type="button" className="btn btn-ghost" onClick={onCancel}>
        Cancel
      </button>
      <button
        type="submit"
        className="btn border-none bg-[var(--color-brand-primary)] text-white"
        disabled={loading}
      >
        {loading ? <span className="loading loading-spinner loading-sm" /> : submitLabel}
      </button>
    </div>
  );
}
