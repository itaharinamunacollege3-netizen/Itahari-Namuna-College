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
