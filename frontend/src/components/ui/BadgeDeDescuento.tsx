import React from 'react';

export interface BadgeDeDescuentoProps {
  discountPercent: number;
  className?: string;
}

const BadgeDeDescuento: React.FC<BadgeDeDescuentoProps> = ({
  discountPercent,
  className,
}) => {
  if (discountPercent <= 0) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        backgroundColor: '#E94560',
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: 1.4,
        padding: '4px 12px',
        borderRadius: '9999px',
        display: 'inline-block',
      }}
    >
      -{discountPercent}%
    </div>
  );
};

export default BadgeDeDescuento;