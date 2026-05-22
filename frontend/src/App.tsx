import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavbarPrincipal from './components/ui/NavbarPrincipal';

const InicioPage = React.lazy(() => import('./pages/InicioPage'));
const CatalogoPage = React.lazy(() => import('./pages/CatalogoPage'));
const CatalogoDeProductosPage = React.lazy(() => import('./pages/CatalogoDeProductosPage'));
const DetallePage = React.lazy(() => import('./pages/DetallePage'));
const DetalleDeProductoPage = React.lazy(() => import('./pages/DetalleDeProductoPage'));
const CarritoPage = React.lazy(() => import('./pages/CarritoPage'));
const CarritoDeComprasPage = React.lazy(() => import('./pages/CarritoDeComprasPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const OrderHistoryPage = React.lazy(() => import('./pages/OrderHistoryPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
      <NavbarPrincipal />
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/inicio" element={<InicioPage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/catalogo-productos" element={<CatalogoDeProductosPage />} />
        <Route path="/productos" element={<CatalogoPage />} />
        <Route path="/producto/:id" element={<DetallePage />} />
        <Route path="/detalle-producto/:id" element={<DetalleDeProductoPage />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/carrito-de-compras" element={<CarritoDeComprasPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/historial-de-pedidos" element={<OrderHistoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;