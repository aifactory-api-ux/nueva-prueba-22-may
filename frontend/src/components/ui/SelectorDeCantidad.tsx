import React, { useState, useCallback } from 'react';
import { tokens } from '../../styles/tokens';

export interface SelectorDeCantidadProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
}

const SelectorDeCantidad: React.FC<SelectorDeCantidadProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false);

  const handleDecrement = useCallback(() => {
    if (!disabled && value > min) {
      onChange(value - 1);
    }
  }, [value, min, onChange, disabled]);

  const handleIncrement = useCallback(() => {
    if (!disabled && value < max) {
      onChange(value + 1);
    }
  }, [value, max, onChange, disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, '');
      const newValue = parseInt(rawValue, 10);
      if (!isNaN(newValue)) {
        const clampedValue = Math.max(min, Math.min(max, newValue));
        onChange(clampedValue);
      }
    },
    [onChange, min, max]
  );

  const handleBlur = useCallback(() => {
    setFocused(false);
    if (value < min) {
      onChange(min);
    } else if (value > max) {
      onChange(max);
    }
  }, [value, min, max, onChange]);

  const isDisabled = disabled;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${focused && !isDisabled ? tokens.colors.accent : '#E5E7EB'}`,
        borderRadius: '8px',
        padding: '4px',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: focused && !isDisabled ? `0 0 0 3px ${tokens.colors.accent}20` : 'none',
      }}
      onFocus={() => setFocused(true)}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isDisabled || value <= min}
        aria-label="Disminuir cantidad"
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: isDisabled || value <= min ? '#E5E7EB' : tokens.colors.surface,
          color: isDisabled || value <= min ? '#6B7280' : tokens.colors.primary,
          cursor: isDisabled || value <= min ? 'not-allowed' : 'pointer',
          fontFamily: tokens.typography.fontFamily,
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: 1,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!isDisabled && value > min) {
            e.currentTarget.style.backgroundColor = '#0F3460';
            e.currentTarget.style.color = '#FFFFFF';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled && value > min) {
            e.currentTarget.style.backgroundColor = tokens.colors.surface;
            e.currentTarget.style.color = tokens.colors.primary;
          }
        }}
      >
        −
      </button>

      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={isDisabled}
        aria-label="Cantidad"
        style={{
          width: '48px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'transparent',
          color: isDisabled ? '#6B7280' : '#1A1A2E',
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: 1.6,
          textAlign: 'center',
          outline: 'none',
          cursor: isDisabled ? 'not-allowed' : 'text',
        }}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={isDisabled || value >= max}
        aria-label="Aumentar cantidad"
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: isDisabled || value >= max ? '#E5E7EB' : tokens.colors.surface,
          color: isDisabled || value >= max ? '#6B7280' : tokens.colors.primary,
          cursor: isDisabled || value >= max ? 'not-allowed' : 'pointer',
          fontFamily: tokens.typography.fontFamily,
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: 1,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!isDisabled && value < max) {
            e.currentTarget.style.backgroundColor = '#0F3460';
            e.currentTarget.style.color = '#FFFFFF';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled && value < max) {
            e.currentTarget.style.backgroundColor = tokens.colors.surface;
            e.currentTarget.style.color = tokens.colors.primary;
          }
        }}
      >
        +
      </button>
    </div>
  );
};

export default SelectorDeCantidad;