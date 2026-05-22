import React, { useState } from 'react';
import { Cart, api } from '../../lib/api';
import BotonCtaPrimario from './BotonCtaPrimario';

export interface FormularioDeCheckoutProps {
  cart: Cart | null;
  products: Map<string, { name: string; price: number; imageUrl: string }>;
  onCheckoutComplete?: (orderId: string) => void;
}

interface ShippingForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentForm {
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

interface FormErrors {
  shipping?: Partial<Record<keyof ShippingForm, string>>;
  payment?: Partial<Record<keyof PaymentForm, string>>;
}

const FormularioDeCheckout: React.FC<FormularioDeCheckoutProps> = ({
  cart,
  products,
  onCheckoutComplete,
}) => {
  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const calculateSubtotal = (): number => {
    if (!cart?.items.length) return 0;
    return cart.items.reduce((total, item) => {
      const product = products.get(item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateShipping = (): number => {
    return calculateSubtotal() >= 10000 ? 0 : 999;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateShipping();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateShipping = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingForm, string>> = {};

    if (!shipping.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio';
    }
    if (!shipping.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!validateEmail(shipping.email)) {
      newErrors.email = 'Introduce un correo electrónico válido';
    }
    if (!shipping.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
    }
    if (!shipping.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria';
    }
    if (!shipping.postalCode.trim()) {
      newErrors.postalCode = 'El código postal es obligatorio';
    }
    if (!shipping.country.trim()) {
      newErrors.country = 'El país es obligatorio';
    }

    setErrors((prev) => ({ ...prev, shipping: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentForm, string>> = {};

    if (!payment.cardName.trim()) {
      newErrors.cardName = 'El nombre en la tarjeta es obligatorio';
    }
    if (!payment.cardNumber.trim()) {
      newErrors.cardNumber = 'El número de tarjeta es obligatorio';
    } else if (!/^\d{16}$/.test(payment.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
    }
    if (!payment.cardExpiry.trim()) {
      newErrors.cardExpiry = 'La fecha de caducidad es obligatoria';
    } else if (!/^\d{2}\/\d{2}$/.test(payment.cardExpiry)) {
      newErrors.cardExpiry = 'Formato esperado: MM/AA';
    }
    if (!payment.cardCvc.trim()) {
      newErrors.cardCvc = 'El código CVC es obligatorio';
    } else if (!/^\d{3,4}$/.test(payment.cardCvc)) {
      newErrors.cardCvc = 'El código CVC debe tener 3 o 4 dígitos';
    }

    setErrors((prev) => ({ ...prev, payment: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingChange = (field: keyof ShippingForm, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (errors.shipping?.[field]) {
      setErrors((prev) => ({
        ...prev,
        shipping: { ...prev.shipping, [field]: undefined },
      }));
    }
  };

  const handlePaymentChange = (field: keyof PaymentForm, value: string) => {
    setPayment((prev) => ({ ...prev, [field]: value }));
    if (errors.payment?.[field]) {
      setErrors((prev) => ({
        ...prev,
        payment: { ...prev.payment, [field]: undefined },
      }));
    }
  };

  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const isShippingValid = validateShipping();
    const isPaymentValid = validatePayment();

    if (!isShippingValid || !isPaymentValid) {
      return;
    }

    if (!cart?.items.length) {
      setApiError('Tu carrito está vacío');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.items,
        shipping: {
          fullName: shipping.fullName,
          email: shipping.email,
          address: shipping.address,
          city: shipping.city,
          postalCode: shipping.postalCode,
          country: shipping.country,
        },
      };

      const orderResponse = await api.post<{ id: string }>('/api/orders', orderData);

      const paymentResponse = await api.post<{ sessionId: string; url: string }>(
        '/api/payments/create-session',
        { orderId: orderResponse.id }
      );

      if (paymentResponse.url) {
        window.location.href = paymentResponse.url;
      } else if (onCheckoutComplete) {
        onCheckoutComplete(orderResponse.id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ha ocurrido un error durante el checkout';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    width: '100%',
    padding: '12px 16px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.6,
    color: '#1A1A2E',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    boxSizing: 'border-box' as const,
  };

  const inputFocusStyles = {
    borderColor: '#0F3460',
    boxShadow: '0 0 0 2px rgba(233, 69, 96, 0.2)',
  };

  const inputErrorStyles = {
    borderColor: '#EF4444',
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '6px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.5,
    color: '#1A1A2E',
  };

  const errorTextStyles = {
    marginTop: '4px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.4,
    color: '#EF4444',
  };

  const sectionTitleStyles = {
    fontFamily: "'Inter', sans-serif",
    fontSize: '22px',
    fontWeight: 600,
    lineHeight: 1.4,
    color: '#1A1A2E',
    margin: '0 0 24px 0',
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '32px',
        }}
      >
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <h2 style={sectionTitleStyles}>Datos de Envío</h2>

          <div>
            <label style={labelStyles}>Nombre Completo</label>
            <input
              type="text"
              value={shipping.fullName}
              onChange={(e) => handleShippingChange('fullName', e.target.value)}
              placeholder="María García López"
              style={{
                ...inputStyles,
                ...(errors.shipping?.fullName ? inputErrorStyles : {}),
              }}
              onFocus={(e) => {
                if (!errors.shipping?.fullName) {
                  Object.assign(e.target.style, inputFocusStyles);
                }
              }}
              onBlur={(e) => {
                if (!errors.shipping?.fullName) {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.shipping?.fullName && (
              <span style={errorTextStyles}>{errors.shipping.fullName}</span>
            )}
          </div>

          <div>
            <label style={labelStyles}>Correo Electrónico</label>
            <input
              type="email"
              value={shipping.email}
              onChange={(e) => handleShippingChange('email', e.target.value)}
              placeholder="maria.garcia@ejemplo.com"
              style={{
                ...inputStyles,
                ...(errors.shipping?.email ? inputErrorStyles : {}),
              }}
              onFocus={(e) => {
                if (!errors.shipping?.email) {
                  Object.assign(e.target.style, inputFocusStyles);
                }
              }}
              onBlur={(e) => {
                if (!errors.shipping?.email) {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.shipping?.email && (
              <span style={errorTextStyles}>{errors.shipping.email}</span>
            )}
          </div>

          <div>
            <label style={labelStyles}>Dirección</label>
            <input
              type="text"
              value={shipping.address}
              onChange={(e) => handleShippingChange('address', e.target.value)}
              placeholder="Calle Gran Vía, 42"
              style={{
                ...inputStyles,
                ...(errors.shipping?.address ? inputErrorStyles : {}),
              }}
              onFocus={(e) => {
                if (!errors.shipping?.address) {
                  Object.assign(e.target.style, inputFocusStyles);
                }
              }}
              onBlur={(e) => {
                if (!errors.shipping?.address) {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.shipping?.address && (
              <span style={errorTextStyles}>{errors.shipping.address}</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={labelStyles}>Ciudad</label>
              <input
                type="text"
                value={shipping.city}
                onChange={(e) => handleShippingChange('city', e.target.value)}
                placeholder="Madrid"
                style={{
                  ...inputStyles,
                  ...(errors.shipping?.city ? inputErrorStyles : {}),
                }}
                onFocus={(e) => {
                  if (!errors.shipping?.city) {
                    Object.assign(e.target.style, inputFocusStyles);
                  }
                }}
                onBlur={(e) => {
                  if (!errors.shipping?.city) {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.shipping?.city && (
                <span style={errorTextStyles}>{errors.shipping.city}</span>
              )}
            </div>

            <div>
              <label style={labelStyles}>Código Postal</label>
              <input
                type="text"
                value={shipping.postalCode}
                onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                placeholder="28001"
                style={{
                  ...inputStyles,
                  ...(errors.shipping?.postalCode ? inputErrorStyles : {}),
                }}
                onFocus={(e) => {
                  if (!errors.shipping?.postalCode) {
                    Object.assign(e.target.style, inputFocusStyles);
                  }
                }}
                onBlur={(e) => {
                  if (!errors.shipping?.postalCode) {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.shipping?.postalCode && (
                <span style={errorTextStyles}>{errors.shipping.postalCode}</span>
              )}
            </div>
          </div>

          <div>
            <label style={labelStyles}>País</label>
            <select
              value={shipping.country}
              onChange={(e) => handleShippingChange('country', e.target.value)}
              style={{
                ...inputStyles,
                ...(errors.shipping?.country ? inputErrorStyles : {}),
              }}
              onFocus={(e) => {
                if (!errors.shipping?.country) {
                  Object.assign(e.target.style, inputFocusStyles);
                }
              }}
              onBlur={(e) => {
                if (!errors.shipping?.country) {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <option value="">Selecciona un país</option>
              <option value="ES">España</option>
              <option value="MX">México</option>
              <option value="AR">Argentina</option>
              <option value="CO">Colombia</option>
              <option value="US">Estados Unidos</option>
              <option value="GB">Reino Unido</option>
              <option value="FR">Francia</option>
              <option value="DE">Alemania</option>
              <option value="IT">Italia</option>
              <option value="PT">Portugal</option>
            </select>
            {errors.shipping?.country && (
              <span style={errorTextStyles}>{errors.shipping.country}</span>
            )}
          </div>
        </section>

        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <h2 style={sectionTitleStyles}>Método de Pago</h2>

          <div>
            <label style={labelStyles}>Nombre en la Tarjeta</label>
            <input
              type="text"
              value={payment.cardName}
              onChange={(e) => handlePaymentChange('cardName', e.target.value)}
              placeholder="MARÍA GARCÍA LÓPEZ"
              style={{
                ...inputStyles,
                ...(errors.payment?.cardName ? inputErrorStyles : {}),
              }}
              onFocus={(e) => {
                if (!errors.payment?.cardName) {
                  Object.assign(e.target.style, inputFocusStyles);
                }
              }}
              onBlur={(e) => {
                if (!errors.payment?.cardName) {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.payment?.cardName && (
              <span style={errorTextStyles}>{errors.payment.cardName}</span>
            )}
          </div>

          <div>
            <label style={labelStyles}>Número de Tarjeta</label>
            <input
              type="text"
              value={payment.cardNumber}
              onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              style={{
                ...inputStyles,
                ...(errors.payment?.cardNumber ? inputErrorStyles : {}),
              }}
              onFocus={(e) => {
                if (!errors.payment?.cardNumber) {
                  Object.assign(e.target.style, inputFocusStyles);
                }
              }}
              onBlur={(e) => {
                if (!errors.payment?.cardNumber) {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.payment?.cardNumber && (
              <span style={errorTextStyles}>{errors.payment.cardNumber}</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={labelStyles}>Fecha de Caducidad</label>
              <input
                type="text"
                value={payment.cardExpiry}
                onChange={(e) => handlePaymentChange('cardExpiry', formatExpiry(e.target.value))}
                placeholder="MM/AA"
                maxLength={5}
                style={{
                  ...inputStyles,
                  ...(errors.payment?.cardExpiry ? inputErrorStyles : {}),
                }}
                onFocus={(e) => {
                  if (!errors.payment?.cardExpiry) {
                    Object.assign(e.target.style, inputFocusStyles);
                  }
                }}
                onBlur={(e) => {
                  if (!errors.payment?.cardExpiry) {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.payment?.cardExpiry && (
                <span style={errorTextStyles}>{errors.payment.cardExpiry}</span>
              )}
            </div>

            <div>
              <label style={labelStyles}>CVC</label>
              <input
                type="text"
                value={payment.cardCvc}
                onChange={(e) => handlePaymentChange('cardCvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                maxLength={4}
                style={{
                  ...inputStyles,
                  ...(errors.payment?.cardCvc ? inputErrorStyles : {}),
                }}
                onFocus={(e) => {
                  if (!errors.payment?.cardCvc) {
                    Object.assign(e.target.style, inputFocusStyles);
                  }
                }}
                onBlur={(e) => {
                  if (!errors.payment?.cardCvc) {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.payment?.cardCvc && (
                <span style={errorTextStyles}>{errors.payment.cardCvc}</span>
              )}
            </div>
          </div>
        </section>

        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <h2 style={sectionTitleStyles}>Resumen del Pedido</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cart?.items.map((item) => {
              const product = products.get(item.productId);
              if (!product) return null;

              return (
                <div
                  key={item.productId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #E5E7EB',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: '#6B7280',
                      }}
                    >
                      {item.quantity}x
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: '#1A1A2E',
                      }}
                    >
                      {product.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: 1.5,
                      color: '#1A1A2E',
                    }}
                  >
                    {formatPrice(product.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1px solid #E5E7EB',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: '#6B7280',
              }}
            >
              Subtotal
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: 1.5,
                color: '#1A1A2E',
              }}
            >
              {formatPrice(calculateSubtotal())}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: '#6B7280',
              }}
            >
              Envío
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: 1.5,
                color: calculateShipping() === 0 ? '#10B981' : '#1A1A2E',
              }}
            >
              {calculateShipping() === 0 ? 'GRATIS' : formatPrice(calculateShipping())}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '2px solid #E5E7EB',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                lineHeight: 1.5,
                color: '#1A1A2E',
              }}
            >
              Total
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: 1.5,
                color: '#1A1A2E',
              }}
            >
              {formatPrice(calculateTotal())}
            </span>
          </div>
        </section>

        {apiError && (
          <div
            style={{
              padding: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              border: '1px solid #EF4444',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: '#EF4444',
              }}
            >
              {apiError}
            </span>
          </div>
        )}

        <BotonCtaPrimario type="submit" fullWidth disabled={loading}>
          {loading ? 'Procesando...' : 'Completar Pedido'}
        </BotonCtaPrimario>
      </div>
    </form>
  );
};

export default FormularioDeCheckout;