# Component Guide

Quick reference for components and design tokens. Use exact names — do not rename or create synonyms.

## Token Quick Reference

```json
{
  "colors": {
    "primary": "#1A1A2E",
    "secondary": "#E94560",
    "accent": "#0F3460",
    "background": "#F5F5F5",
    "surface": "#FFFFFF",
    "text_primary": "#1A1A2E",
    "text_secondary": "#6B7280",
    "text_on_primary": "#FFFFFF",
    "border": "#E5E7EB",
    "success": "#10B981",
    "error": "#EF4444",
    "discount_badge": "#E94560"
  },
  "typography": {
    "font_family": "'Inter', sans-serif",
    "headings": {
      "h1": {
        "size": "36px",
        "weight": "700",
        "line_height": "1.2"
      },
      "h2": {
        "size": "28px",
        "weight": "600",
        "line_height": "1.3"
      },
      "h3": {
        "size": "22px",
        "weight": "600",
        "line_height": "1.4"
      },
      "h4": {
        "size": "18px",
        "weight": "500",
        "line_height": "1.5"
      }
    },
    "body": {
      "regular": {
        "size": "16px",
        "weight": "400",
        "line_height": "1.6"
      },
      "small": {
        "size": "14px",
        "weight": "400",
        "line_height": "1.5"
      },
      "caption": {
        "size": "12px",
        "weight": "400",
        "line_height": "1.4"
      }
    },
    "button": {
      "size": "16px",
      "weight": "600",
      "letter_spacing": "0.5px"
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px",
    "3xl": "64px"
  },
  "border_radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "full": "9999px"
  },
  "shadows": {
    "card": "0 2px 8px rgba(0,0,0,0.08)",
    "dropdown": "0 4px 16px rgba(0,0,0,0.12)",
    "modal": "0 8px 32px rgba(0,0,0,0.2)"
  },
  "icon_image_style": "Iconos lineales de trazo fino, im\u00e1genes de producto de alta resoluci\u00f3n con fondo blanco o lifestyle, iconos de carrito y b\u00fasqueda estilizados.",
  "motion_interaction": "Transiciones suaves de 0.3s ease, hover con elevaci\u00f3n sutil en tarjetas, microinteracciones en botones (cambio de color/opacidad)."
}
```

## Available Components

- **Navbar principal**: Barra de navegación superior con logo, enlaces a categorías, búsqueda, icono de carrito y menú de usuario. Versión sticky en escritorio, menú hamburguesa en móvil.
- **Botón CTA primario**: Botón redondeado (border-radius: 12px) con color primario, texto blanco, hover con opacidad 0.9. Usado para 'Añadir al carrito', 'Comprar ahora', etc.
- **Tarjeta de producto**: Tarjeta con imagen, nombre, precio original tachado, precio outlet, botón de añadir al carrito. Sombra sutil, hover con elevación.
- **Input de búsqueda**: Campo de texto con icono de lupa, borde redondeado, placeholder 'Buscar productos...'
- **Filtros de catálogo**: Panel lateral o superior con checkboxes/selectores para talla, color, estilo, marca y rango de precio.
- **Badge de descuento**: Etiqueta pequeña con fondo secundario y texto blanco indicando porcentaje de descuento.
- **Footer**: Pie de página con enlaces a políticas, redes sociales, newsletter y datos de contacto.
- **Modal de carrito**: Panel deslizante desde la derecha mostrando productos en carrito, total y botón de checkout.
- **Formulario de checkout**: Formulario de varias secciones: datos de envío, método de pago, resumen del pedido.
- **Selector de cantidad**: Control con botones - y + y número, para modificar cantidad de producto en carrito.
