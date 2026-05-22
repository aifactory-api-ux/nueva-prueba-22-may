import React, { useState } from 'react';

interface InputDeBusquedaProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6B7280"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export const InputDeBusqueda: React.FC<InputDeBusquedaProps> = ({
  value: externalValue,
  onChange,
  onSearch,
  placeholder = 'Buscar productos...',
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isControlled = externalValue !== undefined;
  const value = isControlled ? externalValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div
      className={`flex flex-row items-center w-full md:w-[260px] bg-white rounded-[8px] border transition-all duration-200 ${
        isFocused
          ? 'border-[#0F3460] shadow-[0_0_0_2px_#E9456033]'
          : 'border-[#E5E7EB]'
      } ${className}`}
      style={{
        padding: '12px 16px',
      }}
    >
      <span className="flex-shrink-0 mr-3">
        <SearchIcon />
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[16px] font-normal leading-[1.6] text-[#1A1A2E] placeholder-[#6B7280] font-['Inter',sans-serif]"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: 1.6,
          color: '#1A1A2E',
        }}
      />
    </div>
  );
};

export default InputDeBusqueda;
