import { KeyboardEvent } from 'react';
import { Play, Shuffle } from 'lucide-react';

type NameEntryProps = {
  value: string;
  knownNames: string[];
  disabled: boolean;
  canSpin: boolean;
  error: string;
  onChange: (value: string) => void;
  onSpin: () => void;
  onTestSpin: () => void;
};

export function NameEntry({
  value,
  knownNames,
  disabled,
  canSpin,
  error,
  onChange,
  onSpin,
  onTestSpin,
}: NameEntryProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && canSpin && !disabled) {
      onSpin();
    }
  };

  return (
    <section className="name-entry" aria-label="Spin controls">
      <input
        className="name-input"
        value={value}
        disabled={disabled}
        list="known-names"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a name"
        autoComplete="off"
      />
      <datalist id="known-names">
        {knownNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <div className="spin-actions">
        <button className="spin-button" type="button" disabled={!canSpin || disabled} onClick={onSpin}>
          <Play size={34} fill="currentColor" />
          SPIN
        </button>
        <button className="test-button" type="button" disabled={disabled} onClick={onTestSpin}>
          <Shuffle size={20} />
          Test
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </section>
  );
}
