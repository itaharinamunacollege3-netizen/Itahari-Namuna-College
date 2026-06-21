import { PROGRAMS, STREAMS, GENDERS } from '../data/admissionOptions';

function labelOf(options, value) {
  return options.find((o) => o.value === value)?.label ?? '—';
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-stone-100 last:border-0">
      <span className="text-xs font-bold text-stone-500">{label}</span>
      <span className="text-sm text-brand-dark text-right">{value || '—'}</span>
    </div>
  );
}

export default function ReviewStep({ form, submitError }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <Row label="Full Name" value={form.fullName} />
        <Row label="Email" value={form.email} />
        <Row label="Phone" value={form.phone} />
        <Row label="Gender" value={labelOf(GENDERS, form.gender)} />
        <Row label="Address" value={form.address} />
        <Row label="Program" value={labelOf(PROGRAMS, form.programApplied)} />
        {form.programApplied === 'plus2' && (
          <Row label="+2 Stream" value={labelOf(STREAMS, form.plus2Stream)} />
        )}
        <Row label="Session" value={form.session} />
      </div>
      {submitError && (
        <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {submitError}
        </p>
      )}
    </div>
  );
}
