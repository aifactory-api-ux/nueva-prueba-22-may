import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../lib/api';
import { useCart } from '../hooks/useCart';

function formatPrice(price: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price / 100);
}

function discountPct(price: number, original: number): number {
  return Math.round((1 - price / original) * 100);
}

function ProductCardOferta({ product, onAddToCart }: { product: Product; onAddToCart: (id: string) => void }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  return (
    <div style={{
      backgroundColor: '#FFFFFF', borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      {hasDiscount && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          backgroundColor: '#E94560', color: '#FFFFFF',
          borderRadius: '9999px', fontSize: '12px', fontWeight: 700,
          padding: '4px 10px', zIndex: 1,
        }}>
          -{discountPct(product.price, product.originalPrice!)}%
        </div>
      )}
      <Link to={`/detalle-producto/${product.id}`} style={{ display: 'block' }}>
        <div style={{ backgroundColor: '#F5F5F5', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
          />
        </div>
      </Link>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '14px', color: '#1A1A2E', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{product.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {hasDiscount && (
            <span style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'line-through' }}>
              {formatPrice(product.originalPrice!, product.currency)}
            </span>
          )}
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#E94560' }}>
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
        <button
          onClick={() => onAddToCart(product.id)}
          style={{
            marginTop: 'auto', backgroundColor: '#1A1A2E', color: '#FFFFFF',
            border: 'none', borderRadius: '8px', padding: '10px 0',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#E94560'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#1A1A2E'; }}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}

const CATEGORY_STYLES: { bg: string; text: string; sub: string }[] = [
  { bg: '#0F3460', text: '#FFFFFF', sub: 'Selección premium hasta -60%' },
  { bg: '#1A1A2E', text: '#FFFFFF', sub: 'Sastrería, casual y básicos' },
  { bg: 'linear-gradient(135deg, #E94560, #9b2335)', text: '#FFFFFF', sub: 'Piezas de lujo con descuento' },
];

export default function InicioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addCartItem } = useCart();

  useEffect(() => {
    async function load() {
      try {
        const [pRes, cRes] = await Promise.all([fetch('/api/products'), fetch('/api/categories')]);
        const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
        setProducts(Array.isArray(pData) ? pData : []);
        setCategories(Array.isArray(cData) ? cData : []);
      } catch {
        // show empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      await addCartItem(productId, 1);
    } catch {
      // user may not be logged in — redirect handled by cart page
    }
  };

  const featuredProducts = products.slice(0, 4);
  const heroProducts = products.slice(0, 2);
  const displayCategories = categories.slice(0, 3);

  return (
    <div style={{ backgroundColor: '#F5F5F5', fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A1A2E', padding: '64px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '64px' }}>

          {/* Left copy */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: 'inline-block', color: '#E94560', fontSize: '13px', fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px',
            }}>
              Outlet Premium
            </span>
            <h1 style={{ color: '#FFFFFF', fontSize: '48px', fontWeight: 700, lineHeight: 1.15, margin: '0 0 20px' }}>
              Lujo con descuento para renovar tu armario
            </h1>
            <p style={{ color: '#A0AEC0', fontSize: '16px', lineHeight: 1.7, margin: '0 0 32px', maxWidth: '480px' }}>
              Descubre prendas y productos premium con precios outlet, imágenes de alta calidad y una compra segura de principio a fin.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/catalogo-productos" style={{
                backgroundColor: '#E94560', color: '#FFFFFF', padding: '14px 28px',
                borderRadius: '8px', fontWeight: 700, fontSize: '15px', textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
                Comprar ofertas
              </Link>
              <Link to="/catalogo-productos" style={{
                backgroundColor: 'transparent', color: '#FFFFFF', padding: '14px 28px',
                borderRadius: '8px', fontWeight: 700, fontSize: '15px', textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.4)', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#FFFFFF'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.4)'; }}>
                Ver catálogo
              </Link>
            </div>
          </div>

          {/* Right product preview */}
          {heroProducts.length > 0 && (
            <div style={{ flexShrink: 0, backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', display: 'flex', gap: '16px' }}>
              {heroProducts.map(p => (
                <Link key={p.id} to={`/detalle-producto/${p.id}`} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  width: '120px', textDecoration: 'none',
                }}>
                  <div style={{ width: '100px', height: '100px', backgroundColor: '#F5F5F5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={p.imageUrl} alt={p.name} style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '50%' }}
                      onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#1A1A2E', fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>{p.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORÍAS ───────────────────────────────────── */}
      {!loading && (
        <section style={{ padding: '64px 72px', backgroundColor: '#F5F5F5' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A2E', textAlign: 'center', margin: '0 0 40px' }}>
              Comprar por categoría
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(displayCategories.length || 3, 3)}, 1fr)`, gap: '20px' }}>
              {(displayCategories.length > 0 ? displayCategories : [
                { id: '1', name: 'Mujer', description: 'Selección premium' },
                { id: '2', name: 'Hombre', description: 'Sastrería y básicos' },
                { id: '3', name: 'Accesorios', description: 'Piezas de lujo' },
              ]).map((cat, i) => {
                const style = CATEGORY_STYLES[i % CATEGORY_STYLES.length];
                return (
                  <Link
                    key={cat.id}
                    to={`/catalogo-productos?categoryId=${cat.id}`}
                    style={{
                      display: 'block', borderRadius: '12px', padding: '32px 28px',
                      textDecoration: 'none', background: style.bg,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  >
                    <h3 style={{ color: style.text, fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>{cat.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', margin: 0 }}>{style.sub}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── OFERTAS DESTACADAS ───────────────────────────── */}
      <section style={{ padding: '64px 72px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>Ofertas destacadas</h2>
            <Link to="/catalogo-productos" style={{
              backgroundColor: '#1A1A2E', color: '#FFFFFF',
              padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            }}>Ver todo</Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ backgroundColor: '#F5F5F5', borderRadius: '12px', height: '320px', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B7280' }}>
              <p style={{ fontSize: '18px', marginBottom: '16px' }}>No hay productos disponibles</p>
              <Link to="/catalogo-productos" style={{ color: '#E94560', fontWeight: 600 }}>Explorar catálogo</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
              {featuredProducts.map(p => (
                <ProductCardOferta key={p.id} product={p} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────── */}
      <section style={{ padding: '48px 72px', backgroundColor: '#F5F5F5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
          {[
            { icon: '🚚', title: 'Envío rápido', desc: 'Seguimiento de pedido y logística fiable.' },
            { icon: '🔒', title: 'Pago seguro', desc: 'Checkout protegido para compras premium.' },
            { icon: '↩', title: 'Devoluciones claras', desc: 'Política simple para comprar con confianza.' },
          ].map(b => (
            <div key={b.title} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '28px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: '28px', marginBottom: '8px' }}>{b.icon}</p>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A2E', margin: '0 0 6px' }}>{b.title}</p>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{ backgroundColor: '#1A1A2E', padding: '24px 72px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '18px' }}>Project</span>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['Política de devoluciones', 'Términos y condiciones', 'Contacto'].map(t => (
              <Link key={t} to="#" style={{ color: '#A0AEC0', fontSize: '13px', textDecoration: 'none' }}>{t}</Link>
            ))}
          </div>
          <button style={{
            backgroundColor: '#E94560', color: '#FFFFFF', border: 'none',
            borderRadius: '20px', padding: '8px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          }}>
            Newsletter
          </button>
        </div>
      </footer>
    </div>
  );
}
