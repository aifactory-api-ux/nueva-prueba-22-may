import React from 'react';
import { Link } from 'react-router-dom';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC = () => {
  const sections: FooterSection[] = [
    {
      title: 'Colecciones',
      links: [
        { label: 'Inicio', href: '/inicio' },
        { label: 'Catálogo', href: '/catalogo-productos' },
        { label: 'Novedades', href: '/catalogo-productos?filter=nuevos' },
        { label: 'Ofertas', href: '/catalogo-productos?filter=ofertas' },
      ],
    },
    {
      title: 'Atención al Cliente',
      links: [
        { label: 'Contacto', href: '/contacto' },
        { label: 'Envíos y Entregas', href: '/envios' },
        { label: 'Devoluciones y Reembolso', href: '/devoluciones' },
        { label: 'Guía de Tallas', href: '/guia-tallas' },
      ],
    },
    {
      title: 'Sobre Nosotros',
      links: [
        { label: 'Nuestra Historia', href: '/nosotros' },
        { label: 'Sostenibilidad', href: '/sostenibilidad' },
        { label: 'Prensa', href: '/prensa' },
        { label: 'Trabaja con Nosotros', href: '/empleo' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Términos y Condiciones', href: '/terminos' },
        { label: 'Política de Privacidad', href: '/privacidad' },
        { label: 'Política de Cookies', href: '/cookies' },
        { label: 'Avisos Legales', href: '/avisos' },
      ],
    },
  ];

  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://instagram.com',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: 'https://facebook.com',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
      ),
    },
    {
      label: 'Pinterest',
      href: 'https://pinterest.com',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8.5 15.5c1.5-1.5 3-2 4.5-1.5s2 2.5.5 4c-1 1-2.5 1-3.5.5s-1.5-2-1-3.5 1.5-2 3-1.5" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: '#1A1A2E',
        padding: '48px 120px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px',
          }}
        >
          {sections.map((section) => (
            <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4
                style={{
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      style={{
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: 1.5,
                        textDecoration: 'none',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#E94560';
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
             Síguenos
            </h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#E94560';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
              to="/inicio"
              style={{
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 700,
                lineHeight: 1.4,
                textDecoration: 'none',
              }}
            >
              OutletPremium
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 400, lineHeight: 1.5, margin: 0 }}>
              Tu destino para moda premium a precios outlet.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 400, lineHeight: 1.5, margin: 0 }}>
              © {new Date().getFullYear()} OutletPremium. Todos los derechos reservados.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 400, lineHeight: 1.4, margin: 0 }}>
             made with passion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;