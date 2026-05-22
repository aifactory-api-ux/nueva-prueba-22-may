import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, Product } from '../lib/api';

function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  max,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-10 h-10 flex items-center justify-center border border-[#E5E7EB] rounded-lg text-lg font-medium text-[#1A1A2E] transition-all duration-200 hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="text-lg font-semibold text-[#1A1A2E] w-8 text-center">{quantity}</span>
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center border border-[#E5E7EB] rounded-lg text-lg font-medium text-[#1A1A2E] transition-all duration-200 hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}

function Breadcrumb({ productName }: { productName: string }) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link to="/inicio" className="text-[#6B7280] hover:text-[#E94560] transition-colors">
        Inicio
      </Link>
      <span className="text-[#E5E7EB]">/</span>
      <Link to="/catalogo-productos" className="text-[#6B7280] hover:text-[#E94560] transition-colors">
        Catálogo
      </Link>
      <span className="text-[#E5E7EB]">/</span>
      <span className="text-[#1A1A2E] truncate max-w-[200px]">{productName}</span>
    </nav>
  );
}

function ImageGallery({ imageUrl, productName }: { imageUrl: string; productName: string }) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="relative">
      <div
        className="relative aspect-square bg-white rounded-xl overflow-hidden cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
      >
        <img
          src={imageUrl || 'https://via.placeholder.com/420x420?text=No+Image'}
          alt={productName}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-125' : 'scale-100'
          }`}
        />
      </div>
      {isZoomed && (
        <button
          onClick={() => setIsZoomed(false)}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#1A1A2E] hover:bg-[#F5F5F5] transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}

function ProductInfo({
  product,
  quantity,
  onQuantityIncrease,
  onQuantityDecrease,
  onAddToCart,
  loading,
  error,
}: {
  product: Product;
  quantity: number;
  onQuantityIncrease: () => void;
  onQuantityDecrease: () => void;
  onAddToCart: () => void;
  loading: boolean;
  error: string | null;
}) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    }).format(price / 100);
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1
          className="text-[28px] font-bold text-[#1A1A2E] mb-4"
          style={{ fontWeight: 700, lineHeight: 1.3, fontFamily: "'Inter', sans-serif" }}
        >
          {product.name}
        </h1>
        <p
          className="text-[22px] font-semibold text-[#E94560] mb-4"
          style={{ fontWeight: 600, lineHeight: 1.4 }}
        >
          {formatPrice(product.price, product.currency)}
        </p>
        <div className="flex items-center gap-2">
          {isOutOfStock ? (
            <span className="px-3 py-1 bg-[#E53E3E] text-white text-xs font-semibold rounded-full">
              Agotado
            </span>
          ) : isLowStock ? (
            <span className="px-3 py-1 bg-[#DD6B20] text-white text-xs font-semibold rounded-full">
              ¡Últimas unidades!
            </span>
          ) : (
            <span className="px-3 py-1 bg-[#38A169] text-white text-xs font-semibold rounded-full">
              En stock
            </span>
          )}
          {!isOutOfStock && (
            <span className="text-sm text-[#6B7280]">
              {product.stock} unidades disponibles
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3
          className="text-base font-semibold text-[#1A1A2E] mb-3"
          style={{ fontWeight: 600, lineHeight: 1.4 }}
        >
          Descripción
        </h3>
        <p
          className="text-base text-[#6B7280] leading-relaxed"
          style={{ lineHeight: 1.6, fontWeight: 400 }}
        >
          {product.description}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-auto pt-6 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-6 mb-6">
          <span className="text-base font-medium text-[#1A1A2E]">Cantidad:</span>
          <QuantitySelector
            quantity={quantity}
            onIncrease={onQuantityIncrease}
            onDecrease={onQuantityDecrease}
            max={product.stock || 1}
          />
        </div>

        <button
          onClick={onAddToCart}
          disabled={loading || isOutOfStock}
          className="w-full py-4 bg-[#E94560] text-white text-base font-semibold rounded-lg transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ letterSpacing: '0.5px' }}
        >
          {loading ? 'Añadiendo...' : isOutOfStock ? 'Producto agotado' : 'Añadir al carrito'}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#6B7280]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Envío gratis en pedidos superiores a €50</span>
        </div>
      </div>
    </div>
  );
}

export default function DetalleDeProductoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Product>(`/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el producto';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleQuantityIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setCartLoading(true);
    setCartError(null);
    try {
      await api.post('/api/cart/items', { productId: product.id, quantity });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al añadir al carrito';
      setCartError(message);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-24 xl:px-32">
          <div className="py-12">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="aspect-square bg-gray-200 rounded-xl" />
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 bg-gray-200 rounded w-1/4" />
                  <div className="h-24 bg-gray-200 rounded" />
                  <div className="h-12 bg-gray-200 rounded w-1/3 mt-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl text-center max-w-md" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">Producto no encontrado</h2>
          <p className="text-[#6B7280] mb-6">{error || 'El producto que buscas no existe.'}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/catalogo-productos')}
              className="px-6 py-3 border border-[#E5E7EB] text-[#1A1A2E] font-medium rounded-lg hover:bg-[#F5F5F5] transition-colors"
            >
              Ver catálogo
            </button>
            <button
              onClick={fetchProduct}
              className="px-6 py-3 bg-[#E94560] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-24 xl:px-32">
        <div className="py-8 lg:py-12">
          <Breadcrumb productName={product.name} />

          {addedToCart && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-700 font-medium">¡Producto añadido al carrito!</span>
            </div>
          )}

          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
            style={{ gap: 48 }}
          >
            <ImageGallery imageUrl={product.imageUrl} productName={product.name} />

            <ProductInfo
              product={product}
              quantity={quantity}
              onQuantityIncrease={handleQuantityIncrease}
              onQuantityDecrease={handleQuantityDecrease}
              onAddToCart={handleAddToCart}
              loading={cartLoading}
              error={cartError}
            />
          </div>
        </div>

        <section className="py-12 border-t border-[#E5E7EB]">
          <h2
            className="text-[22px] font-semibold text-[#1A1A2E] mb-6"
            style={{ fontWeight: 600, lineHeight: 1.4 }}
          >
            Detalles del producto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 className="text-base font-semibold text-[#1A1A2E] mb-3">Categoría</h3>
              <p className="text-[#6B7280]">{product.categoryId || 'General'}</p>
            </div>
            <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 className="text-base font-semibold text-[#1A1A2E] mb-3">SKU</h3>
              <p className="text-[#6B7280] font-mono text-sm">{product.id}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}