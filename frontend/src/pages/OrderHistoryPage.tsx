import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';

function formatPrice(price: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price / 100);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'paid':
      return { backgroundColor: '#10B981', color: '#FFFFFF' };
    case 'cancelled':
      return { backgroundColor: '#EF4444', color: '#FFFFFF' };
    case 'pending':
      return { backgroundColor: '#E94560', color: '#FFFFFF' };
    case 'shipped':
      return { backgroundColor: '#0F3460', color: '#FFFFFF' };
    case 'delivered':
      return { backgroundColor: '#10B981', color: '#FFFFFF' };
    default:
      return { backgroundColor: '#6B7280', color: '#FFFFFF' };
  }
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    cancelled: 'Cancelado',
    shipped: 'Enviado',
    delivered: 'Entregado',
  };
  return labels[status] || status;
}

interface OrderCardProps {
  order: {
    id: string;
    items: { productId: string; quantity: number; price: number }[];
    totalAmount: number;
    currency: string;
    status: string;
    createdAt: string;
  };
  onClick: () => void;
}

function OrderCard({ order, onClick }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-6 cursor-pointer transition-shadow hover:shadow-md"
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '24px',
        gap: '24px',
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p
            className="text-base font-semibold text-[#1A1A2E] mb-1"
            style={{ fontWeight: 600, lineHeight: 1.6 }}
          >
            Pedido #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p
            className="text-sm text-[#6B7280]"
            style={{ fontWeight: 400, lineHeight: 1.5 }}
          >
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-sm font-semibold"
          style={{
            ...getStatusStyle(order.status),
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <p
          className="text-sm text-[#6B7280]"
          style={{ lineHeight: 1.5 }}
        >
          {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
        </p>
        <p
          className="text-base font-semibold text-[#1A1A2E]"
          style={{ fontWeight: 600, lineHeight: 1.6 }}
        >
          {formatPrice(order.totalAmount, order.currency)}
        </p>
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  const { orders, loading, error, fetchOrders } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#E94560] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280] text-base" style={{ lineHeight: 1.6 }}>
            Cargando historial de pedidos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div
          className="bg-white p-8 rounded-lg text-center max-w-md"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
        >
          <div className="text-[#E94560] text-5xl mb-4">⚠️</div>
          <h2
            className="text-xl font-semibold text-[#1A1A2E] mb-2"
            style={{ fontWeight: 600 }}
          >
            Error al cargar pedidos
          </h2>
          <p className="text-[#6B7280] mb-6" style={{ lineHeight: 1.6 }}>
            {error}
          </p>
          <button
            onClick={() => fetchOrders()}
            className="px-6 py-3 bg-[#E94560] text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
            style={{ letterSpacing: '0.5px' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div
        className="max-w-[1400px] mx-auto"
        style={{ paddingLeft: '120px', paddingRight: '120px' }}
      >
        <div className="py-8 lg:py-12">
          <h1
            className="text-[28px] font-semibold text-[#1A1A2E]"
            style={{ fontWeight: 600, lineHeight: 1.3, fontFamily: "'Inter', sans-serif" }}
          >
            Historial de Pedidos
          </h1>
          <p className="text-base text-[#6B7280] mt-2" style={{ lineHeight: 1.6 }}>
            {orders.length === 0
              ? 'No tienes pedidos realizados'
              : `${orders.length} ${orders.length === 1 ? 'pedido' : 'pedidos'} realizados`}
          </p>
        </div>

        {orders.length === 0 ? (
          <div
            className="bg-white rounded-lg p-12 text-center"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3
              className="text-lg font-semibold text-[#1A1A2E] mb-2"
              style={{ fontWeight: 600 }}
            >
              Aún no tienes pedidos
            </h3>
            <p className="text-[#6B7280] mb-6" style={{ lineHeight: 1.6 }}>
              Cuando realices tu primera compra, aquí podrás ver el historial.
            </p>
            <button
              onClick={() => navigate('/catalogo-productos')}
              className="px-6 py-3 bg-[#E94560] text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
              style={{ letterSpacing: '0.5px' }}
            >
              Ver Catálogo
            </button>
          </div>
        ) : (
          <div className="space-y-6 pb-12" style={{ gap: '24px' }}>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => navigate(`/detalle-pedido/${order.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}