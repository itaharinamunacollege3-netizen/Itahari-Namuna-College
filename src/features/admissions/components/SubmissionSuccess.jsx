import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function SubmissionSuccess({ referenceId, fullName, programLabel }) {
  return (
    <div className="mx-auto max-w-lg text-center py-10">
      <CheckCircle2 className="mx-auto text-brand-primary" size={56} />
      <h2 className="mt-4 font-heading text-2xl font-bold text-brand-dark">
        Application Submitted!
      </h2>
      <p className="mt-2 text-sm text-brand-dark/60">
        Thank you{fullName ? `, ${fullName}` : ''}. We have received your application
        {programLabel ? ` for ${programLabel}` : ''}. Our admissions team will contact you soon.
      </p>
      {referenceId != null && (
        <div className="mt-6 inline-block rounded-xl border border-brand-primary/20 bg-brand-primary/5 px-6 py-3">
          <span className="block text-xs font-bold text-stone-500">Reference ID</span>
          <span className="text-lg font-bold text-brand-primary">#{referenceId}</span>
        </div>
      )}
      <div className="mt-8">
        <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-primary/90 transition">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
