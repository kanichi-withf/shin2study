'use client';

interface OptionItem {
  value: number;
  label: string;
}

interface QuizStartOptionsProps {
  label: string;
  name: string;
  value: number;
  options: OptionItem[];
  onChange: (value: number) => void;
}

export default function QuizStartOptions({
  label,
  name,
  value,
  options,
  onChange,
}: QuizStartOptionsProps) {
  return (
    <div className="qstart__field" role="group" aria-label={label}>
      <span className="qstart__field-label">{label}</span>
      <input type="hidden" name={name} value={value} />
      <div className="qstart__options">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              className={`qstart__option${active ? ' qstart__option--active' : ''}`}
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
