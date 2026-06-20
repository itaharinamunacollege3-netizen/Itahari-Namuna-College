# Admission Form (Public Apply) — Design Spec

**Date:** 2026-06-20
**Branch:** `feat/admission-form`
**Scope:** Frontend only. No backend changes.

## Goal

Replace the stub `AdmissionWizardPage` (currently `<div>AdmissionWizardPage</div>`, not routed) with a working public admission application — a multi-step wizard that submits to the existing backend `POST /admissions` endpoint. Wire the hero CTA and the academics "Apply For Admission" buttons to it.

## Backend contract (existing — do not modify)

`POST /admissions` (public, rate-limited, validated by `admissionSchema`). Request body:

| Field            | Rule                                                        |
|------------------|-------------------------------------------------------------|
| `fullName`       | string, trim, 2–100                                          |
| `email`          | string, valid email, ≤254                                   |
| `gender`         | enum: `male` \| `female` \| `other`                         |
| `phone`          | string, 10–20                                               |
| `address`        | string, 5–500                                               |
| `programApplied` | enum: `plus2` \| `bca` \| `bhm` \| `bsw`                    |
| `plus2Stream`    | enum: `science` \| `management` \| `humanities` \| `education` — **required iff** `programApplied === plus2`, forbidden otherwise |
| `session`        | string, ≤20, optional                                       |
| `website`        | honeypot — must be empty (anti-spam); any value → rejected   |

Response envelope: `{ success: true, data: { id, ... } }`. The `id` is the application reference. (The API may also return an access token for self-service; **out of scope** here — ignored.)

## Entry points & routing

- **Route:** add `{ path: 'admissions', element: <AdmissionWizardPage /> }` to `src/routes/AppRoutes.jsx`, lazy-loaded like the other pages.
- **Hero CTA:** in `HomePage.jsx`, the "Admissions" button currently `to="/contact"` → `to="/admissions"`.
- **Academics:** in `ProgramDetailPage.jsx`, the dead `<button>Apply For Admission</button>` → `<Link to={\`/admissions?program=${id}\`}>`. The academic program ids (`bca`, `bhm`, `bsw`) map 1:1 to the admission enum. `plus2` has no academics page; it is selectable only on the admission page.
- **Navbar:** `Navbar.jsx` has no Admissions item (Home, About, Academics, Cells & Units, Notices, Gallery, Facilities, Contact) — left unchanged. Entry points are the hero CTA and the academics "Apply" buttons; no new nav item is added.

## File structure

Mirrors the existing `notices` / `academics` feature folders.

```
src/features/admissions/
  pages/AdmissionWizardPage.jsx   # orchestrator: step state, formData, submit, reads ?program
  components/
    WizardProgress.jsx            # step indicator: 1 Personal → 2 Program → 3 Review
    PersonalDetailsStep.jsx       # fullName, email, phone, gender, address
    ProgramStep.jsx               # programApplied, conditional plus2Stream, session
    ReviewStep.jsx                # read-only summary + submit button
    SubmissionSuccess.jsx         # success screen + reference ID
  services/admissionsService.js   # submitAdmission(payload) → apiClient.post('/admissions')
  data/admissionOptions.js        # PROGRAMS / STREAMS / GENDERS option lists (value + label)
```

## State & data flow

`AdmissionWizardPage` owns all state:

- `step`: `0 | 1 | 2` (Personal / Program / Review).
- `formData`: `{ fullName, email, phone, gender, address, programApplied, plus2Stream, session, website }`, initialized empty (`website: ''`).
- `errors`: `{ [field]: message }` for the current step.
- `status`: `idle | submitting | success | error`.
- `result`: the returned admission object (for the reference ID); `submitError`: message string.

Flow:

1. On mount, read `?program=` via `useSearchParams`. If it equals `bca` / `bhm` / `bsw`, set `formData.programApplied`. (`plus2` is accepted too if passed, but no academics link produces it.)
2. Each step component receives `formData`, `onChange(field, value)`, and `errors`.
3. **Next** runs that step's validation; if it passes, advance, else set `errors`. **Back** decrements `step` (no validation).
4. **Review** shows a read-only summary of all fields. **Submit** re-validates everything, sets `status='submitting'`, calls the service.
5. On success → `status='success'`, store `result`; render `SubmissionSuccess` (replaces the form). On failure → `status='error'`, set `submitError`, stay on Review.

## Validation (client-side, mirrors backend)

Hand-rolled in a small helper (same style as `ContactForm`), per field:

- `fullName`: required, 2–100 chars.
- `email`: required, valid email format, ≤254.
- `phone`: required, 10–20 chars.
- `address`: required, 5–500 chars.
- `gender`: required, one of the three.
- `programApplied`: required, one of the four.
- `plus2Stream`: **only rendered when `programApplied === 'plus2'`**; required in that case; omitted from payload otherwise.
- `session`: optional, ≤20.
- `website`: hidden honeypot, must be empty; if non-empty, block submit (matches backend).

Step gating: Step 0 validates the personal fields; Step 1 validates the program fields (incl. conditional stream); Review re-checks all before submit.

## Service & payload

`admissionsService.submitAdmission(formData)`:

- Builds the payload: required fields always; `session` only if non-empty; `plus2Stream` only if `programApplied === 'plus2'`; always include `website: ''`.
- Calls `apiClient.post('/admissions', payload)` (reuses `src/api/api.jsx`, same as `ContactForm`).
- Returns the parsed envelope `{ success, data, message }`.

No mock fallback for this write action (unlike the read-only notices service): if `VITE_API_BASE_URL` is unset or the request fails, surface an error to the user.

## Error handling

Surfaced on the Review step (form stays intact so the user can retry):

- **400** validation from server → show `message`; if the server provides a field path, map it to that field's error.
- **429** rate-limited → "Too many attempts. Please try again in a moment."
- **Network / 5xx / no API base** → generic "Something went wrong. Please try again."

## Styling

Reuse the existing design system: `PageBanner` for the page header, brand Tailwind tokens (`brand-primary`, emerald palette), and `lucide-react` icons — consistent with the notices and academics pages. The `WizardProgress` indicator and `SubmissionSuccess` checkmark follow the same visual language.

## Out of scope (YAGNI)

- Applicant tracking / view-your-application page (the access-token flow).
- Admin dashboard (list / review / status / CSV export).
- Authentication UI.
- File uploads / document attachments.
- Any backend change.

## Testing / verification

- `npm run build` and `npm run lint` pass.
- Manual: hero CTA and each academics "Apply" button land on `/admissions` (program pre-selected for academics).
- Manual against the running backend: a valid submission returns a reference ID and shows the success screen; the conditional +2 stream field appears only for +2; the honeypot blocks a filled `website`.
