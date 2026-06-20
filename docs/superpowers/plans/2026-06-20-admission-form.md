# Public Admission Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public multi-step admission application page (frontend only) that submits to the existing backend `POST /admissions`, wired from the hero CTA and the academics "Apply" buttons.

**Architecture:** A `src/features/admissions/` feature folder (mirrors `notices`/`academics`): a `AdmissionWizardPage` orchestrator owns wizard state and submission; small step/presentational components render each step; a service posts via the shared `apiClient`; pure helpers hold options + validation. No backend changes.

**Tech Stack:** React 19, react-router-dom 7, Tailwind v4, lucide-react, react-hot-toast (already in repo). Reuses `src/api/api.jsx` (`apiClient.post`) and `src/components/common/PageBanner.jsx`.

## Global Constraints

- **Frontend only.** Do not modify anything under `backend/`.
- **No new dependencies.** Use what is already in `package.json`.
- **No test framework exists.** Verify each task with `npm run lint` (must report no NEW errors beyond the known pre-existing ones in `backend/prisma/seed.js` and `src/components/common/contact component/ContactForm.jsx`) and `npm run build` (must succeed). Final task adds a manual smoke test.
- **Backend contract (do not change), `POST /admissions` body:** `fullName` (2–100), `email` (valid, ≤254), `gender` (`male|female|other`), `phone` (10–20), `address` (5–500), `programApplied` (`plus2|bca|bhm|bsw`), `plus2Stream` (`science|management|humanities|education`, required iff program is `plus2`, forbidden otherwise), `session` (optional, ≤20), `website` (honeypot, must be empty). Response: `{ success, data: { id, ... }, message? }`.
- **Style:** match existing pages — `PageBanner` header, brand Tailwind tokens (`brand-primary`, `brand-dark`, emerald palette), `lucide-react` icons.
- **No code comments** unless essential (repo convention).
- Branch: `feat/admission-form`.

---

### Task 1: Options + validation helpers

**Files:**
- Create: `src/features/admissions/data/admissionOptions.js`
- Create: `src/features/admissions/validation.js`

**Interfaces:**
- Produces:
  - `PROGRAMS: {value,label}[]`, `STREAMS: {value,label}[]`, `GENDERS: {value,label}[]`
  - `PROGRAM_VALUES: string[]` (`['plus2','bca','bhm','bsw']`), `STREAM_VALUES`, `GENDER_VALUES`
  - `emptyAdmissionForm: object` — initial form state including `website: ''`
  - `validatePersonal(form) -> {[field]: message}` (covers fullName, email, phone, gender, address)
  - `validateProgram(form) -> {[field]: message}` (covers programApplied, conditional plus2Stream, session)
  - `validateAll(form) -> {[field]: message}` (merges both + honeypot check)

- [ ] **Step 1: Create `admissionOptions.js`**

```javascript
export const PROGRAMS = [
  { value: 'plus2', label: '+2 (Higher Secondary)' },
  { value: 'bca', label: 'BCA — Bachelor of Computer Application' },
  { value: 'bhm', label: 'BHM — Bachelor of Hotel Management' },
  { value: 'bsw', label: 'BSW — Bachelor of Social Work' },
];

export const STREAMS = [
  { value: 'science', label: 'Science' },
  { value: 'management', label: 'Management' },
  { value: 'humanities', label: 'Humanities' },
  { value: 'education', label: 'Education' },
];

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const PROGRAM_VALUES = PROGRAMS.map((p) => p.value);
export const STREAM_VALUES = STREAMS.map((s) => s.value);
export const GENDER_VALUES = GENDERS.map((g) => g.value);

export const emptyAdmissionForm = {
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  address: '',
  programApplied: '',
  plus2Stream: '',
  session: '',
  website: '',
};
```

- [ ] **Step 2: Create `validation.js`**

```javascript
import {
  PROGRAM_VALUES,
  STREAM_VALUES,
  GENDER_VALUES,
} from './data/admissionOptions';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validatePersonal(form) {
  const errors = {};
  const name = form.fullName.trim();
  if (name.length < 2 || name.length > 100) {
    errors.fullName = 'Enter your full name (2–100 characters).';
  }
  const email = form.email.trim();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    errors.email = 'Enter a valid email address.';
  }
  const phone = form.phone.trim();
  if (phone.length < 10 || phone.length > 20) {
    errors.phone = 'Enter a valid phone number (10–20 characters).';
  }
  if (!GENDER_VALUES.includes(form.gender)) {
    errors.gender = 'Please select your gender.';
  }
  const address = form.address.trim();
  if (address.length < 5 || address.length > 500) {
    errors.address = 'Enter your address (at least 5 characters).';
  }
  return errors;
}

export function validateProgram(form) {
  const errors = {};
  if (!PROGRAM_VALUES.includes(form.programApplied)) {
    errors.programApplied = 'Please choose a program.';
  }
  if (form.programApplied === 'plus2') {
    if (!STREAM_VALUES.includes(form.plus2Stream)) {
      errors.plus2Stream = 'Please choose a stream for +2.';
    }
  }
  if (form.session && form.session.trim().length > 20) {
    errors.session = 'Session is too long.';
  }
  return errors;
}

export function validateAll(form) {
  const errors = { ...validatePersonal(form), ...validateProgram(form) };
  if (form.website) {
    errors.website = 'Invalid submission.';
  }
  return errors;
}
```

- [ ] **Step 3: Lint + build**

Run: `npm run lint && npm run build`
Expected: build succeeds; no new lint errors referencing `admissions/`.

- [ ] **Step 4: Commit**

```bash
git add src/features/admissions/data/admissionOptions.js src/features/admissions/validation.js
git commit -m "feat(admissions): add option lists and form validation helpers"
```

---

### Task 2: Admission submit service

**Files:**
- Create: `src/features/admissions/services/admissionsService.js`

**Interfaces:**
- Consumes: `apiClient.post` from `src/api/api.jsx`.
- Produces: `submitAdmission(form) -> Promise<{ ok: boolean, data?: object, message?: string, fieldErrors?: object }>`

- [ ] **Step 1: Create `admissionsService.js`**

```javascript
import { apiClient } from '../../../api/api';

function buildPayload(form) {
  const payload = {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    gender: form.gender,
    phone: form.phone.trim(),
    address: form.address.trim(),
    programApplied: form.programApplied,
    website: '',
  };
  if (form.session && form.session.trim()) {
    payload.session = form.session.trim();
  }
  if (form.programApplied === 'plus2' && form.plus2Stream) {
    payload.plus2Stream = form.plus2Stream;
  }
  return payload;
}

export async function submitAdmission(form) {
  try {
    const body = await apiClient.post('/admissions', buildPayload(form));
    if (body?.success) {
      return { ok: true, data: body.data };
    }
    return {
      ok: false,
      message: body?.message ?? 'Submission failed. Please try again.',
      fieldErrors: body?.errors,
    };
  } catch {
    return { ok: false, message: 'Something went wrong. Please try again.' };
  }
}

export { buildPayload };
```

- [ ] **Step 2: Lint + build**

Run: `npm run lint && npm run build`
Expected: build succeeds; no new lint errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/admissions/services/admissionsService.js
git commit -m "feat(admissions): add submitAdmission service over apiClient"
```

---

### Task 3: WizardProgress indicator

**Files:**
- Create: `src/features/admissions/components/WizardProgress.jsx`

**Interfaces:**
- Produces: `default WizardProgress({ steps: string[], current: number })`

- [ ] **Step 1: Create `WizardProgress.jsx`**

```jsx
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
```

- [ ] **Step 2: Lint + build**

Run: `npm run lint && npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/features/admissions/components/WizardProgress.jsx
git commit -m "feat(admissions): add WizardProgress step indicator"
```

---

### Task 4: Reusable field primitives + PersonalDetailsStep

**Files:**
- Create: `src/features/admissions/components/fields.jsx`
- Create: `src/features/admissions/components/PersonalDetailsStep.jsx`

**Interfaces:**
- Produces (`fields.jsx`):
  - `TextField({ label, name, value, onChange, error, type='text', placeholder, as })` — renders a labeled `<input>` (or `<textarea>` when `as='textarea'`) with error text.
  - `SelectField({ label, name, value, onChange, error, options, placeholder })` — labeled `<select>`.
  - `RadioGroup({ label, name, value, onChange, error, options })` — labeled radio set.
- Produces (`PersonalDetailsStep.jsx`): `default PersonalDetailsStep({ form, errors, onChange })` where `onChange(name, value)`.

- [ ] **Step 1: Create `fields.jsx`**

```jsx
const base =
  'w-full rounded-xl border px-4 py-2.5 text-sm text-brand-dark bg-white outline-none transition-colors focus:border-brand-primary';

function errorClass(error) {
  return error ? 'border-red-400' : 'border-stone-300';
}

function Label({ label, name }) {
  return (
    <label htmlFor={name} className="block text-xs font-bold text-brand-dark mb-1.5">
      {label}
    </label>
  );
}

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-500">{error}</p>;
}

export function TextField({ label, name, value, onChange, error, type = 'text', placeholder, as }) {
  return (
    <div>
      <Label label={label} name={name} />
      {as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${base} ${errorClass(error)} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${base} ${errorClass(error)}`}
        />
      )}
      <FieldError error={error} />
    </div>
  );
}

export function SelectField({ label, name, value, onChange, error, options, placeholder }) {
  return (
    <div>
      <Label label={label} name={name} />
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`${base} ${errorClass(error)}`}
      >
        <option value="">{placeholder ?? 'Select…'}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError error={error} />
    </div>
  );
}

export function RadioGroup({ label, name, value, onChange, error, options }) {
  return (
    <div>
      <Label label={label} name={name} />
      <div className="flex flex-wrap gap-3">
        {options.map((o) => (
          <label
            key={o.value}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm cursor-pointer transition-colors ${
              value === o.value
                ? 'border-brand-primary bg-brand-primary/5 text-brand-dark'
                : 'border-stone-300 text-stone-600'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={(e) => onChange(name, e.target.value)}
              className="accent-brand-primary"
            />
            {o.label}
          </label>
        ))}
      </div>
      <FieldError error={error} />
    </div>
  );
}
```

- [ ] **Step 2: Create `PersonalDetailsStep.jsx`**

```jsx
import { TextField, RadioGroup } from './fields';
import { GENDERS } from '../data/admissionOptions';

export default function PersonalDetailsStep({ form, errors, onChange }) {
  return (
    <div className="space-y-5">
      <TextField label="Full Name" name="fullName" value={form.fullName} onChange={onChange} error={errors.fullName} placeholder="e.g. Ram Bahadur Thapa" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} placeholder="you@example.com" />
        <TextField label="Phone" name="phone" value={form.phone} onChange={onChange} error={errors.phone} placeholder="98XXXXXXXX" />
      </div>
      <RadioGroup label="Gender" name="gender" value={form.gender} onChange={onChange} error={errors.gender} options={GENDERS} />
      <TextField label="Address" name="address" as="textarea" value={form.address} onChange={onChange} error={errors.address} placeholder="Tole, Municipality, District" />
    </div>
  );
}
```

- [ ] **Step 3: Lint + build**

Run: `npm run lint && npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/features/admissions/components/fields.jsx src/features/admissions/components/PersonalDetailsStep.jsx
git commit -m "feat(admissions): add field primitives and personal-details step"
```

---

### Task 5: ProgramStep (with conditional +2 stream)

**Files:**
- Create: `src/features/admissions/components/ProgramStep.jsx`

**Interfaces:**
- Consumes: `SelectField` from `./fields`; `PROGRAMS`, `STREAMS` from `../data/admissionOptions`.
- Produces: `default ProgramStep({ form, errors, onChange })`.

- [ ] **Step 1: Create `ProgramStep.jsx`**

```jsx
import { SelectField, TextField } from './fields';
import { PROGRAMS, STREAMS } from '../data/admissionOptions';

export default function ProgramStep({ form, errors, onChange }) {
  return (
    <div className="space-y-5">
      <SelectField label="Program" name="programApplied" value={form.programApplied} onChange={onChange} error={errors.programApplied} options={PROGRAMS} placeholder="Choose a program" />
      {form.programApplied === 'plus2' && (
        <SelectField label="+2 Stream" name="plus2Stream" value={form.plus2Stream} onChange={onChange} error={errors.plus2Stream} options={STREAMS} placeholder="Choose a stream" />
      )}
      <TextField label="Preferred Session (optional)" name="session" value={form.session} onChange={onChange} error={errors.session} placeholder="e.g. 2081" />
    </div>
  );
}
```

- [ ] **Step 2: Lint + build**

Run: `npm run lint && npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/features/admissions/components/ProgramStep.jsx
git commit -m "feat(admissions): add program step with conditional +2 stream"
```

---

### Task 6: ReviewStep

**Files:**
- Create: `src/features/admissions/components/ReviewStep.jsx`

**Interfaces:**
- Consumes: `PROGRAMS`, `STREAMS`, `GENDERS` from `../data/admissionOptions`.
- Produces: `default ReviewStep({ form, submitError })`.

- [ ] **Step 1: Create `ReviewStep.jsx`**

```jsx
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
```

- [ ] **Step 2: Lint + build**

Run: `npm run lint && npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/features/admissions/components/ReviewStep.jsx
git commit -m "feat(admissions): add review step"
```

---

### Task 7: SubmissionSuccess

**Files:**
- Create: `src/features/admissions/components/SubmissionSuccess.jsx`

**Interfaces:**
- Consumes: `Link` from `react-router-dom`; `CheckCircle2` from `lucide-react`.
- Produces: `default SubmissionSuccess({ referenceId, fullName, programLabel })`.

- [ ] **Step 1: Create `SubmissionSuccess.jsx`**

```jsx
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
```

- [ ] **Step 2: Lint + build**

Run: `npm run lint && npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/features/admissions/components/SubmissionSuccess.jsx
git commit -m "feat(admissions): add submission success screen"
```

---

### Task 8: AdmissionWizardPage orchestrator + route

**Files:**
- Modify (replace stub): `src/features/admissions/pages/AdmissionWizardPage.jsx`
- Modify: `src/routes/AppRoutes.jsx`

**Interfaces:**
- Consumes: all step components, `WizardProgress`, `SubmissionSuccess`, `submitAdmission`, validators, options, `PageBanner`, `useSearchParams`.
- Produces: routed page at `/admissions`.

- [ ] **Step 1: Replace `AdmissionWizardPage.jsx`**

```jsx
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

            {/* honeypot — visually hidden, must stay empty */}
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
```

- [ ] **Step 2: Add the route in `AppRoutes.jsx`**

Add the lazy import alongside the other feature pages:

```jsx
const AdmissionWizardPage = lazy(() => import('../features/admissions/pages/AdmissionWizardPage'));
```

Add the route inside the `children` array (place it near `contact`):

```jsx
      { path: 'admissions', element: <AdmissionWizardPage /> },
```

- [ ] **Step 3: Lint + build**

Run: `npm run lint && npm run build`
Expected: build succeeds; an `AdmissionWizardPage-*.js` chunk appears in the build output.

- [ ] **Step 4: Commit**

```bash
git add src/features/admissions/pages/AdmissionWizardPage.jsx src/routes/AppRoutes.jsx
git commit -m "feat(admissions): wizard orchestrator + /admissions route"
```

---

### Task 9: Wire entry points (hero CTA + academics apply)

**Files:**
- Modify: `src/features/general_pages/HomePage.jsx`
- Modify: `src/features/academics/pages/ProgramDetailPage.jsx`

**Interfaces:**
- Consumes: the `/admissions` route from Task 8; `Link` (already imported in both files — verify).

- [ ] **Step 1: Repoint the hero "Admissions" CTA in `HomePage.jsx`**

Find the hero CTA `<Link>` whose text is `Admissions` (currently `to="/contact"`) and change its target:

```jsx
                <Link
                  to="/admissions"
                  className="w-full sm:w-auto bg-brand-white/10 backdrop-blur-xs text-brand-white border border-brand-white/30 font-heading font-bold text-sm tracking-wide px-8 py-3.5 rounded-xl hover:bg-brand-white/20 hover:scale-103 active:scale-97 transition-all duration-300 text-center"
                >
                  Admissions
                </Link>
```

(Only the `to` value changes from `/contact` to `/admissions`. Leave classes/text as-is.)

- [ ] **Step 2: Wire the academics "Apply For Admission" button in `ProgramDetailPage.jsx`**

`Link` is already imported. Replace the dead `<button>` (around line 121) with a `Link` to the prefilled admission route (`id` is the program slug from `useParams`):

```jsx
            <Link
              to={`/admissions?program=${id}`}
              className="block text-center w-full bg-[#006A38] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#00522b] transition-colors"
            >
              Apply For Admission
            </Link>
```

- [ ] **Step 3: Lint + build**

Run: `npm run lint && npm run build`
Expected: build succeeds; no new lint errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/general_pages/HomePage.jsx src/features/academics/pages/ProgramDetailPage.jsx
git commit -m "feat(admissions): link hero CTA and academics apply buttons to /admissions"
```

---

### Task 10: Manual smoke test against the running backend

**Files:** none (verification only).

**Preconditions:** Backend running on `:5000` with seeded DB; frontend `.env` has `VITE_API_BASE_URL="http://localhost:5000/api"`; `npm run dev` on `:5173`.

- [ ] **Step 1: Navigation** — From the homepage, click the hero "Admissions" CTA → lands on `/admissions`. From an academics program page (e.g. `/academic/bca`), click "Apply For Admission" → lands on `/admissions?program=bca` with **BCA preselected** on the Program step.

- [ ] **Step 2: Conditional stream** — On the Program step, choose **+2** → the "+2 Stream" select appears and is required; choose any other program → it disappears.

- [ ] **Step 3: Validation gating** — Click **Next** on an empty Personal step → inline errors appear and the step does not advance. Fill valid values → advances.

- [ ] **Step 4: Happy path** — Complete all steps, **Submit** → success screen shows a numeric **Reference ID**. Confirm via API that the record exists:

Run: `curl -s http://localhost:5000/api/admin/... ` is admin-gated; instead confirm the POST succeeded by the returned reference ID on screen, and optionally check the DB directly:
`psql -h localhost -p 5433 -U postgres -d INC_college -c 'select id, "fullName", "programApplied" from "Admission" order by id desc limit 3;'`
Expected: the new row matches the submitted name + program.

- [ ] **Step 5: Honeypot** — (Optional) In devtools, set the hidden `website` input to any value and submit → request is rejected (no success screen). Confirms anti-spam parity.

- [ ] **Step 6: Final lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

---

## Self-Review

- **Spec coverage:** entry points (Task 8 route, Task 9 CTAs) ✓; file structure (Tasks 1–8 match the spec's folder layout) ✓; state & data flow (Task 8) ✓; validation incl. conditional stream + honeypot (Tasks 1, 5, 8) ✓; service & payload (Task 2) ✓; error handling — 400/429/network surfaced via `submitError` (Tasks 2, 6, 8) ✓; success + reference ID (Task 7) ✓; styling via PageBanner/brand tokens ✓; out-of-scope items not built ✓.
- **Placeholder scan:** no TBD/TODO; all code shown in full.
- **Type consistency:** `onChange(name, value)` signature consistent across `fields.jsx`, all steps, and the page; `submitAdmission(form) -> {ok,data,message,fieldErrors}` consumed exactly in Task 8; option lists (`PROGRAMS`/`STREAMS`/`GENDERS`) and value arrays used consistently; `result.id` → `SubmissionSuccess referenceId`.

## Notes / known deviations
- No automated tests (project has no runner). Verification is lint + build + the Task 10 manual smoke test. Validators and `buildPayload` are exported as pure functions so unit tests can be added later if a runner is introduced.
