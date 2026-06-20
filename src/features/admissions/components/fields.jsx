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
