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
