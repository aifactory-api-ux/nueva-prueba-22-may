import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { CartItem, Product, api } from '../lib/api';

interface CartItemWithProduct extends CartItem {
  product: Product | null;
}

function formatPrice(price: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price / 100);
}

function discountPct(price: number, original: number): number {
  return Math.round((1 - price / original) * 100);
}

function QuantitySelector({ quantity, onIncrease, onDecrease }: { quantity: number; onIncrease: () => void; onDecrease: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
      <button onClick={onDecrease} disabled={quantity <= 1} style={{
        width: '36px', height: '36px', border: 'none', background: 'none', cursor: 'pointer',
        fontSize: '18px', color: quantity <= 1 ? '#D1D5DB' : '#1A1A2E', transition: 'background 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
        onMouseEnter={e => { if (quantity > 1) (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5F5'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
        −
      </button>
      <span style={{ width: '36px', textAlign: 'center', fontSize: '15px', fontWeight: 600, color: '#1A1A2E' }}>{quantity}</span>
      <button onClick={onIncrease} style={{
        width: '36px', height: '36px', border: 'none', background: 'none', cursor: 'pointer',
        fontSize: '18px', color: '#1A1A2E', transition: 'background 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5F5'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
        +
      </button>
    </div>
  );
}

function CartItemRow({ item, onUpdate, onRemove }: { item: CartItemWithProduct; onUpdate: (id: string, qty: number) => void; onRemove: (id: string) => void }) {
  const { product } = item;
  if (!product) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <div style={{ width: '88px', height: '88px', backgroundColor: '#F5F5F5', borderRadius: '8px', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '16px', backgroundColor: '#F5F5F5', borderRadius: '4px', width: '60%' }} />
          <div style={{ height: '14px', backgroundColor: '#F5F5F5', borderRadius: '4px', width: '40%' }} />
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const pct = hasDiscount ? discountPct(product.price, product.originalPrice!) : 0;
  const savings = hasDiscount ? (product.originalPrice! - product.price) * item.quantity : 0;

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', position: 'relative' }}>
      {hasDiscount && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          backgroundColor: '#E94560', color: '#FFFFFF', borderRadius: '20px',
          fontSize: '11px', fontWeight: 700, padding: '3px 8px', zIndex: 1,
        }}>
          -{pct}%
        </div>
      )}
      <Link to={`/detalle-producto/${product.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
        <div style={{ width: '88px', height: '88px', backgroundColor: '#F5F5F5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={product.imageUrl} alt={product.name}
            style={{ width: '72px', height: '72px', objectFit: 'contain' }}
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
        </div>
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#E94560', fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Outlet Premium
            </p>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E', margin: '0 0 4px' }}>{product.name}</p>
            {product.description && (
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '320px' }}>
                {product.description}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {hasDiscount && (
                <span style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice! * item.quantity, product.currency)}
                </span>
              )}
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E' }}>
                {formatPrice(product.price * item.quantity, product.currency)}
              </span>
              {savings > 0 && (
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
                  Ahorras {formatPrice(savings, product.currency)}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
            <QuantitySelector
              quantity={item.quantity}
              onIncrease={() => onUpdate(product.id, item.quantity + 1)}
              onDecrease={() => onUpdate(product.id, item.quantity - 1)}
            />
            <button onClick={() => onRemove(product.id)} style={{
              background: 'none', border: 'none', color: '#9CA3AF', fontSize: '13px',
              cursor: 'pointer', fontWeight: 500, padding: 0, transition: 'color 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#E94560'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; }}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarritoDeComprasPage() {
  const { cart, loading, updateCartItem, removeCartItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [itemsWithProducts, setItemsWithProducts] = useState<CartItemWithProduct[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  // Fetch product details for each cart item
  useEffect(() => {
    if (!cart?.items?.length) {
      setItemsWithProducts([]);
      return;
    }
    setItemsWithProducts(cart.items.map(item => ({ ...item, product: null })));

    Promise.all(
      cart.items.map(item => fetch(`/api/products/${item.productId}`).then(r => r.ok ? r.json() : null))
    ).then(products => {
      setItemsWithProducts(
        cart.items.map((item, i) => ({ ...item, product: products[i] as Product | null }))
      );
    }).catch(() => {});
  }, [cart?.items]);

  // Fetch recommendations
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setRecommendedProducts(data.slice(0, 3));
    }).catch(() => {});
  }, []);

  const validItems = itemsWithProducts.filter(i => i.product !== null);
  const subtotal = validItems.reduce((s, i) => s + (i.product!.price * i.quantity), 0);
  const outletDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = (subtotal - outletDiscount) >= 15000 ? 0 : 499;
  const total = subtotal - outletDiscount + shipping;
  const currency = validItems[0]?.product?.currency || 'EUR';

  const handleUpdate = async (productId: string, qty: number) => {
    try { await updateCartItem(productId, qty); } catch { /* ignore */ }
  };

  const handleRemove = async (productId: string) => {
    try { await removeCartItem(productId); } catch { /* ignore */ }
  };

  const handleCheckout = async () => {
    if (!user) { navigate('/login'); return; }
    if (!cart?.items?.length) return;
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const order = await api.post<{ id: string }>('/api/orders', {
        items: cart.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      });
      const session = await api.post<{ url: string }>('/api/payments/create-session', { orderId: order.id });
      if (session.url) {
        window.location.href = session.url;
      } else {
        navigate('/historial-de-pedidos');
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Error al procesar el pago');
      setCheckoutLoading(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'OUTLET10') {
      setCouponApplied(true);
    }
  };

  if (loading && !cart) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTopColor: '#E94560', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6B7280', fontSize: '15px' }}>Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 72px 64px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: '#6B7280' }}>
          <Link to="/inicio" style={{ color: '#6B7280', textDecoration: 'none' }}>Inicio</Link>
          <span>/</span>
          <span style={{ color: '#1A1A2E', fontWeight: 600 }}>Carrito de compras</span>
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1A1A2E', margin: '0 0 6px' }}>Carrito de compras</h1>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
              Revisa tus piezas premium outlet, ajusta cantidades y avanza a un checkout seguro.
            </p>
          </div>
          <Link to="/catalogo-productos" style={{
            backgroundColor: 'transparent', color: '#1A1A2E', border: '1px solid #E5E7EB',
            borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600,
            textDecoration: 'none', transition: 'background 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5F5'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
            Seguir comprando
          </Link>
        </div>

        {validItems.length === 0 && !loading ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '64px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</p>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A2E', marginBottom: '8px' }}>Tu carrito está vacío</h3>
            <p style={{ color: '#6B7280', marginBottom: '24px' }}>Explora el catálogo y añade tus piezas favoritas.</p>
            <Link to="/catalogo-productos" style={{
              backgroundColor: '#E94560', color: '#FFFFFF', padding: '12px 28px',
              borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none',
            }}>Ver catálogo</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

            {/* Items list */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '16px' }}>
                {validItems.length} {validItems.length === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itemsWithProducts.map(item => (
                  <CartItemRow key={item.productId} item={item} onUpdate={handleUpdate} onRemove={handleRemove} />
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div style={{ width: '320px', flexShrink: 0, position: 'sticky', top: '104px' }}>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.09)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A2E', margin: '0 0 24px' }}>Resumen del pedido</h2>

                {/* Coupon */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  <input
                    type="text"
                    placeholder="Codigo outlet"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    style={{
                      flex: 1, border: '1px solid #E5E7EB', borderRadius: '8px',
                      padding: '10px 12px', fontSize: '13px', color: '#1A1A2E', outline: 'none',
                      backgroundColor: couponApplied ? '#F0FDF4' : '#FFFFFF',
                    }}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode.trim()}
                    style={{
                      backgroundColor: couponApplied ? '#10B981' : '#1A1A2E', color: '#FFFFFF',
                      border: 'none', borderRadius: '8px', padding: '10px 16px',
                      fontSize: '13px', fontWeight: 600, cursor: couponApplied ? 'default' : 'pointer',
                    }}
                  >
                    {couponApplied ? '✓' : 'Aplicar'}
                  </button>
                </div>

                {/* Price breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6B7280' }}>
                    <span>Subtotal</span>
                    <span style={{ color: '#1A1A2E', fontWeight: 500 }}>{formatPrice(subtotal, currency)}</span>
                  </div>
                  {couponApplied && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#6B7280' }}>Descuento outlet</span>
                      <span style={{ color: '#E94560', fontWeight: 600 }}>-{formatPrice(outletDiscount, currency)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6B7280' }}>
                    <span>Envío</span>
                    <span style={{ color: shipping === 0 ? '#10B981' : '#1A1A2E', fontWeight: 500 }}>
                      {shipping === 0 ? 'Gratis' : formatPrice(shipping, currency)}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E' }}>Total</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A2E' }}>{formatPrice(total, currency)}</span>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '20px', lineHeight: 1.5 }}>
                  Impuestos incluidos. Pago seguro y devoluciones sencillas durante 14 días.
                </p>

                {checkoutError && (
                  <p style={{ fontSize: '13px', color: '#E94560', backgroundColor: '#FEF2F2', borderRadius: '8px', padding: '10px 12px', marginBottom: '16px' }}>
                    {checkoutError}
                  </p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || validItems.length === 0}
                  style={{
                    width: '100%', backgroundColor: '#1A1A2E', color: '#FFFFFF',
                    border: 'none', borderRadius: '8px', padding: '14px 0',
                    fontSize: '15px', fontWeight: 700, cursor: checkoutLoading || validItems.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: checkoutLoading || validItems.length === 0 ? 0.6 : 1,
                    marginBottom: '12px',
                  }}
                >
                  {checkoutLoading ? 'Procesando...' : 'Finalizar compra'}
                </button>
                <button style={{
                  width: '100%', backgroundColor: 'transparent', color: '#1A1A2E',
                  border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px 0',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Compra protegida SSL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trust badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginTop: '48px' }}>
          {[
            { icon: '🚚', title: 'Envío premium gratis', desc: 'En pedidos superiores a EUR 150' },
            { icon: '🔒', title: 'Pago seguro', desc: 'Tarjeta, PayPal y financiación' },
            { icon: '↩', title: 'Devolución fácil', desc: '14 días para cambios o devoluciones' },
            { icon: '✓', title: 'Outlet autenticado', desc: 'Piezas premium verificadas' },
          ].map(b => (
            <div key={b.title} style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '18px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: '22px', margin: '0 0 6px' }}>{b.icon}</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A2E', margin: '0 0 4px' }}>{b.title}</p>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Completa tu look */}
        {recommendedProducts.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E', marginBottom: '24px' }}>Completa tu look outlet</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {recommendedProducts.map(p => (
                <div key={p.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                  <div style={{ width: '64px', height: '64px', backgroundColor: '#F5F5F5', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={p.imageUrl} alt={p.name} style={{ width: '56px', height: '56px', objectFit: 'contain' }}
                      onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A2E', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#E94560', margin: '0 0 2px' }}>
                      {formatPrice(p.price, p.currency)} outlet
                    </p>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <p style={{ fontSize: '11px', color: '#10B981', margin: 0, fontWeight: 600 }}>
                        -{discountPct(p.price, p.originalPrice)}%
                      </p>
                    )}
                  </div>
                  <button
                    onClick={async () => { try { await api.post('/api/cart/items', { productId: p.id, quantity: 1 }); } catch { /* not logged in */ } }}
                    style={{
                      backgroundColor: '#1A1A2E', color: '#FFFFFF', border: 'none',
                      borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: 700,
                      cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#E94560'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#1A1A2E'; }}>
                    Añadir
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
