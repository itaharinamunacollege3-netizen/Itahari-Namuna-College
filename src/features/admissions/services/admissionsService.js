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
