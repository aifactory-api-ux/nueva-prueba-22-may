import React from 'react';

export interface BotonCtaPrimarioProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const BotonCtaPrimario: React.FC<BotonCtaPrimarioProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        backgroundColor: '#E94560',
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
        fontSize: '16px',
        fontWeight: 600,
        letterSpacing: '0.5px',
        padding: '12px 32px',
        borderRadius: '12px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'opacity 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '0.9';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = disabled ? '0.5' : '1';
      }}
    >
      {children}
    </button>
  );
};

export default BotonCtaPrimario;