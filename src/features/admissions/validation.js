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
