import { Check } from 'lucide-react';

export default function WizardProgress({ steps, current }) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  done
                    ? 'bg-brand-primary text-white'
                    : active
                      ? 'bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary'
                      : 'bg-stone-200 text-stone-500'
                }`}
              >
                {done ? <Check size={16} /> : i + 1}
              </span>
              <span
                className={`hidden sm:block text-xs font-bold tracking-wide ${
                  active ? 'text-brand-dark' : 'text-stone-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="h-px w-6 sm:w-10 bg-stone-300" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
