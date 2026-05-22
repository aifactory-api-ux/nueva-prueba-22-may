import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useCart } from '../hooks/useCart';
import { Product } from '../lib/api';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = ['Negro', 'Blanco', 'Azul', 'Rojo'];
const STYLES_LIST = ['Abrigos', 'Vestidos', 'Sneakers', 'Accesorios'];
const BRANDS = ['Maison', 'Atelier', 'Milano', 'Studio'];
const PAGE_SIZE = 12;

function formatPrice(price: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price / 100);
}

function discountPct(price: number, original: number): number {
  return Math.round((1 - price / original) * 100);
}

function CheckboxItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${checked ? '#0F3460' : '#D1D5DB'}`,
          backgroundColor: checked ? '#0F3460' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <span style={{ fontSize: '14px', color: '#1A1A2E', fontWeight: checked ? 600 : 400 }}>{label}</span>
    </label>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const pct = hasDiscount ? discountPct(product.price, product.originalPrice!) : 0;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', position: 'relative',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.14)' : '0 2px 8px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasDiscount && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          backgroundColor: '#E94560', color: '#FFFFFF', borderRadius: '20px',
          fontSize: '12px', fontWeight: 700, padding: '4px 10px', zIndex: 1,
        }}>
          -{pct}%
        </div>
      )}
      <Link to={`/detalle-producto/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ backgroundColor: '#F5F5F5', aspectRatio: '4/5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '80%', height: '80%', objectFit: 'contain', borderRadius: '50%', transition: 'transform 0.3s' }}
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
          />
        </div>
      </Link>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Link to={`/detalle-producto/${product.id}`} style={{ textDecoration: 'none' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A2E', margin: 0, lineHeight: 1.4 }}>{product.name}</p>
        </Link>
        {product.description && (
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
            {product.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          {hasDiscount && (
            <span style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'line-through' }}>
              {formatPrice(product.originalPrice!, product.currency)}
            </span>
          )}
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#E94560' }}>
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
        <button
          onClick={() => onAddToCart(product.id)}
          style={{
            marginTop: '8px', backgroundColor: '#1A1A2E', color: '#FFFFFF',
            border: 'none', borderRadius: '8px', padding: '10px 0',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s',
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

export default function CatalogoDeProductosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, fetchProducts } = useProducts();
  const { categories, fetchCategories } = useCategories();
  const { addCartItem } = useCart();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedStyles, setSelectedStyles] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('descuento');
  const [page, setPage] = useState(1);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(selectedCategory || undefined); }, [selectedCategory, fetchProducts]);

  const sorted = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case 'descuento':
        return list.sort((a, b) => {
          const da = a.originalPrice ? (1 - a.price / a.originalPrice) : 0;
          const db = b.originalPrice ? (1 - b.price / b.originalPrice) : 0;
          return db - da;
        });
      case 'precio-asc': return list.sort((a, b) => a.price - b.price);
      case 'precio-desc': return list.sort((a, b) => b.price - a.price);
      default: return list;
    }
  }, [products, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCategoryTab = (catId: string) => {
    setSelectedCategory(catId);
    setPage(1);
    setSearchParams(catId ? { categoryId: catId } : {});
  };

  const handleAddToCart = async (productId: string) => {
    try { await addCartItem(productId, 1); } catch { /* not logged in */ }
  };

  const clearFilters = () => {
    setSelectedSizes(new Set());
    setSelectedColors(new Set());
    setSelectedStyles(new Set());
    setSelectedBrands(new Set());
    setSearch('');
    setSelectedCategory('');
    setPage(1);
  };

  const toggleSet = (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
    setPage(1);
  };

  const hasFilters = selectedSizes.size > 0 || selectedColors.size > 0 || selectedStyles.size > 0 || selectedBrands.size > 0 || search;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO BANNER ─────────────────────────────── */}
      <div style={{ backgroundColor: '#1A1A2E', padding: '48px 72px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#FFFFFF', fontSize: '36px', fontWeight: 700, margin: '0 0 12px' }}>
            Catálogo de productos
          </h1>
          <p style={{ color: '#A0AEC0', fontSize: '15px', margin: '0 0 28px', maxWidth: '600px', lineHeight: 1.6 }}>
            Ropa y productos premium con descuentos outlet, seleccionados para una experiencia de compra elegante, clara y segura.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '8px', padding: '10px 16px 10px 40px', color: '#FFFFFF',
                  fontSize: '14px', width: '260px', outline: 'none',
                }}
              />
              <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            {['Hasta -70%', 'Envío seguro', 'Devoluciones fáciles'].map(pill => (
              <span key={pill} style={{
                backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px',
                padding: '8px 16px', fontSize: '13px', fontWeight: 500,
              }}>{pill}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 72px 64px' }}>

        {/* ── CATEGORY TABS + SORT ─────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleCategoryTab('')}
              style={{
                padding: '8px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                backgroundColor: selectedCategory === '' ? '#1A1A2E' : '#FFFFFF',
                color: selectedCategory === '' ? '#FFFFFF' : '#1A1A2E',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              Todos
            </button>
            {categories.slice(0, 4).map(cat => (
              <button key={cat.id}
                onClick={() => handleCategoryTab(cat.id)}
                style={{
                  padding: '8px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                  backgroundColor: selectedCategory === cat.id ? '#1A1A2E' : '#FFFFFF',
                  color: selectedCategory === cat.id ? '#FFFFFF' : '#1A1A2E',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}>
                {cat.name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>{loading ? 'Cargando...' : `${sorted.length} productos`}</span>
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPage(1); }}
              style={{
                border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px',
                fontSize: '13px', color: '#1A1A2E', backgroundColor: '#FFFFFF', cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="descuento">Ordenar: mayor descuento</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────── */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

          {/* Sidebar */}
          <aside style={{
            width: '240px', flexShrink: 0, backgroundColor: '#FFFFFF', borderRadius: '12px',
            padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', position: 'sticky', top: '88px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>Filtros de catálogo</h3>
              {hasFilters && (
                <button onClick={clearFilters} style={{ fontSize: '12px', color: '#E94560', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Limpiar
                </button>
              )}
            </div>

            {[
              { label: 'Talla', items: SIZES, set: selectedSizes, setter: setSelectedSizes },
              { label: 'Color', items: COLORS, set: selectedColors, setter: setSelectedColors },
              { label: 'Estilo', items: STYLES_LIST, set: selectedStyles, setter: setSelectedStyles },
              { label: 'Marca', items: BRANDS, set: selectedBrands, setter: setSelectedBrands },
            ].map(({ label, items, set, setter }) => (
              <div key={label} style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A2E', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {label}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map(item => (
                    <CheckboxItem
                      key={item}
                      label={item}
                      checked={set.has(item)}
                      onChange={() => toggleSet(set, item, setter)}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A2E', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Precio
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="number" placeholder="Mín" style={{ width: '70px', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '6px 8px', fontSize: '13px' }} />
                <span style={{ color: '#9CA3AF' }}>–</span>
                <input type="number" placeholder="Máx" style={{ width: '70px', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '6px 8px', fontSize: '13px' }} />
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', height: '380px', opacity: 0.6 }} />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '64px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                <p style={{ fontSize: '32px', marginBottom: '16px' }}>📦</p>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1A2E', marginBottom: '8px' }}>No se encontraron productos</h3>
                <p style={{ color: '#6B7280', marginBottom: '20px' }}>
                  {hasFilters ? 'Prueba con otros filtros.' : 'Aún no hay productos disponibles.'}
                </p>
                {hasFilters && (
                  <button onClick={clearFilters} style={{ backgroundColor: '#E94560', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
                  {paginated.map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        style={{
                          width: '36px', height: '36px', borderRadius: '8px', border: '1px solid',
                          borderColor: page === i + 1 ? '#1A1A2E' : '#E5E7EB',
                          backgroundColor: page === i + 1 ? '#1A1A2E' : '#FFFFFF',
                          color: page === i + 1 ? '#FFFFFF' : '#1A1A2E',
                          fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                    {page < totalPages && (
                      <button
                        onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        style={{
                          padding: '0 16px', height: '36px', borderRadius: '8px', border: '1px solid #E5E7EB',
                          backgroundColor: '#FFFFFF', color: '#1A1A2E', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        Siguiente
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1A1A2E', padding: '32px 72px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '18px', margin: '0 0 4px' }}>Project</p>
            <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Lujo con descuento, compras seguras y selección premium.</p>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['Política de devoluciones', 'Términos y condiciones', 'Contacto', 'Newsletter'].map(t => (
              <Link key={t} to="#" style={{ color: '#A0AEC0', fontSize: '13px', textDecoration: 'none' }}>{t}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
