import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageBanner from '../../../components/common/PageBanner';
import WizardProgress from '../components/WizardProgress';
import PersonalDetailsStep from '../components/PersonalDetailsStep';
import ProgramStep from '../components/ProgramStep';
import ReviewStep from '../components/ReviewStep';
import SubmissionSuccess from '../components/SubmissionSuccess';
import { submitAdmission } from '../services/admissionsService';
import { validatePersonal, validateProgram, validateAll } from '../validation';
import {
  emptyAdmissionForm,
  PROGRAM_VALUES,
  PROGRAMS,
} from '../data/admissionOptions';

const STEPS = ['Personal', 'Program', 'Review'];

function initialForm(searchParams) {
  const program = searchParams.get('program');
  if (program && PROGRAM_VALUES.includes(program)) {
    return { ...emptyAdmissionForm, programApplied: program };
  }
  return { ...emptyAdmissionForm };
}

export default function AdmissionWizardPage() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => initialForm(searchParams));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);

  const onChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleNext = () => {
    const stepErrors = step === 0 ? validatePersonal(form) : validateProgram(form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    const allErrors = validateAll(form);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setStep(allErrors.programApplied || allErrors.plus2Stream || allErrors.session ? 1 : 0);
      return;
    }
    setStatus('submitting');
    setSubmitError('');
    const res = await submitAdmission(form);
    if (res.ok) {
      setResult(res.data);
      setStatus('success');
    } else {
      setStatus('error');
      setSubmitError(res.message ?? 'Submission failed.');
      if (res.fieldErrors) setErrors(res.fieldErrors);
    }
  };

  const programLabel = PROGRAMS.find((p) => p.value === form.programApplied)?.label;

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <PageBanner title="Apply for Admission" subtitle="Start your application — it only takes a few minutes." />
      <div className="max-w-2xl mx-auto px-6 py-12">
        {status === 'success' ? (
          <SubmissionSuccess
            referenceId={result?.id}
            fullName={form.fullName.trim()}
            programLabel={programLabel}
          />
        ) : (
          <>
            <WizardProgress steps={STEPS} current={step} />

            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => onChange('website', e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {step === 0 && <PersonalDetailsStep form={form} errors={errors} onChange={onChange} />}
            {step === 1 && <ProgramStep form={form} errors={errors} onChange={onChange} />}
            {step === 2 && <ReviewStep form={form} submitError={submitError} />}

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 0 || status === 'submitting'}
                className="rounded-lg px-5 py-2.5 text-sm font-bold text-brand-dark disabled:opacity-40 hover:bg-stone-200 transition"
              >
                Back
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-primary/90 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === 'submitting'}
                  className="rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-primary/90 disabled:opacity-60 transition"
                >
                  {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
