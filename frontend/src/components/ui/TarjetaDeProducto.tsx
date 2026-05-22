import React from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  stock: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TarjetaDeProductoProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onClick?: (product: Product) => void;
  discountPercent?: number;
}

const TarjetaDeProducto: React.FC<TarjetaDeProductoProps> = ({
  product,
  onAddToCart,
  onClick,
  discountPercent,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(cents / 100);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: isHovered
          ? '0 8px 16px rgba(0,0,0,0.18)'
          : '0 2px 8px rgba(0,0,0,0.08)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: '1px solid #E5E7EB',
      }}
    >
      <div
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#F5F5F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/180';
          }}
        />
      </div>

      {discountPercent !== undefined && discountPercent > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: '#E94560',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: 1.4,
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          -{discountPercent}%
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: 1.6,
            color: '#1A1A2E',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 1.6,
              color: '#1A1A2E',
            }}
          >
            {formatPrice(product.price, product.currency)}
          </span>
          {discountPercent !== undefined && discountPercent > 0 && (
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: '#6B7280',
                textDecoration: 'line-through',
              }}
            >
              {formatPrice(
                Math.round(product.price / (1 - discountPercent / 100)),
                product.currency
              )}
            </span>
          )}
        </div>

        {product.stock === 0 && (
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              fontWeight: 500,
              color: '#EF4444',
            }}
          >
            Agotado
          </span>
        )}
      </div>

      {onAddToCart && (
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{
            backgroundColor: product.stock === 0 ? '#A0AEC0' : '#E94560',
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            opacity: product.stock === 0 ? 0.6 : 1,
            transition: 'opacity 0.3s ease, background-color 0.3s ease',
            marginTop: 'auto',
          }}
          onMouseEnter={(e) => {
            if (product.stock > 0) {
              (e.target as HTMLButtonElement).style.opacity = '0.9';
            }
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.opacity = product.stock === 0 ? '0.6' : '1';
          }}
        >
          {product.stock === 0 ? 'Agotado' : 'Añadir al carrito'}
        </button>
      )}
    </div>
  );
};

export default TarjetaDeProducto;