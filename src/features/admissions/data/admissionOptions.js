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
