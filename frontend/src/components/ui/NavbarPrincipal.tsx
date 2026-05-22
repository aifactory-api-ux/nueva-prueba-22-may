import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../hooks/useCart';

const NavbarPrincipal: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string): boolean =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo-productos?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const linkStyle = (active: boolean): React.CSSProperties => ({
    color: active ? '#E94560' : '#FFFFFF',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: 1.6,
    textDecoration: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'color 0.2s ease',
  });

  return (
    <nav
      style={{
        backgroundColor: '#1A1A2E',
        height: '72px',
        paddingLeft: '72px',
        paddingRight: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: "'Inter', sans-serif",
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <Link
        to="/inicio"
        style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 700, textDecoration: 'none' }}
      >
        Project
      </Link>

      {/* Mobile toggle */}
      <button
        type="button"
        className="lg:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{ color: '#FFFFFF', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isMenuOpen ? (
            <path d="M6 6l12 12M6 18L18 6" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Desktop nav links */}
      <div className="hidden lg:flex" style={{ gap: '32px', alignItems: 'center' }}>
        {[
          { label: 'Inicio', to: '/inicio' },
          { label: 'Catálogo de productos', to: '/catalogo-productos' },
          { label: 'Carrito de compras', to: '/carrito-de-compras' },
        ].map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            style={linkStyle(isActive(to))}
            onMouseEnter={e => { if (!isActive(to)) (e.currentTarget as HTMLElement).style.color = '#E94560'; }}
            onMouseLeave={e => { if (!isActive(to)) (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Search + user */}
      <div className="hidden lg:flex" style={{ gap: '16px', alignItems: 'center' }}>
        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar productos..."
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '8px 16px 8px 36px',
              color: '#FFFFFF',
              fontSize: '14px',
              width: '200px',
              outline: 'none',
            }}
          />
          <svg
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </form>

        {/* Cart icon */}
        <Link
          to="/carrito-de-compras"
          style={{ color: '#FFFFFF', position: 'relative', display: 'flex', alignItems: 'center', padding: '8px' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#E94560'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M6 6L5 3H2" />
          </svg>
          {itemCount > 0 && (
            <span style={{
              position: 'absolute', top: 0, right: 0,
              backgroundColor: '#E94560', color: '#FFFFFF',
              borderRadius: '9999px', fontSize: '11px', fontWeight: 700,
              minWidth: '18px', height: '18px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: '0 4px',
            }}>
              {itemCount}
            </span>
          )}
        </Link>

        {/* User menu */}
        {user ? (
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: '#E94560', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFFFFF', fontSize: '14px', fontWeight: 700,
              }}
            >
              {user.fullName.charAt(0).toUpperCase()}
            </button>
            {isUserMenuOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                backgroundColor: '#FFFFFF', borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)', minWidth: '180px', overflow: 'hidden',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F5F5F5' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A2E', margin: 0 }}>{user.fullName}</p>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{user.email}</p>
                </div>
                <Link to="/historial-de-pedidos" style={{ display: 'block', padding: '12px 16px', color: '#1A1A2E', fontSize: '14px', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5F5'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
                  Mis pedidos
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ display: 'block', padding: '12px 16px', color: '#1A1A2E', fontSize: '14px', textDecoration: 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5F5'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
                    Panel Admin
                  </Link>
                )}
                <button type="button" onClick={handleLogout} style={{
                  display: 'block', width: '100%', padding: '12px 16px', color: '#E94560',
                  fontSize: '14px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5F5'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" style={{
            color: '#FFFFFF', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#E94560'; (e.currentTarget as HTMLElement).style.borderColor = '#E94560'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'; }}>
            Iniciar sesión
          </Link>
        )}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute', top: '72px', left: 0, right: 0,
          backgroundColor: '#1A1A2E', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }} className="lg:hidden">
          {[
            { label: 'Inicio', to: '/inicio' },
            { label: 'Catálogo de productos', to: '/catalogo-productos' },
            { label: 'Carrito de compras', to: '/carrito-de-compras' },
          ].map(({ label, to }) => (
            <Link key={to} to={to} style={linkStyle(isActive(to))}>{label}</Link>
          ))}
          {user ? (
            <>
              <Link to="/historial-de-pedidos" style={linkStyle(false)}>Mis pedidos</Link>
              <button type="button" onClick={handleLogout} style={{ ...linkStyle(false), background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, color: '#E94560' }}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" style={linkStyle(false)}>Iniciar sesión</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarPrincipal;
