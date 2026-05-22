# UI/UX Design Contract

> **READ THIS FILE BEFORE IMPLEMENTING ANY FRONTEND COMPONENT.**
> This is the single source of truth for all visual and functional requirements.

## Figma Source

File URL: https://www.figma.com/design/cVHM6NOEwEt35RF88lnQpO?node-id=10-2

## Visual Direction

Diseño minimalista y elegante que transmite 'lujo con descuento'. Paleta sobria con acentos sutiles, tipografía limpia, imágenes de producto grandes y de alta calidad, botones redondeados y espacios amplios para una sensación premium.

## Pages / Figma Frames

### 1. Inicio

### 2. Catálogo de productos

### 3. Detalle de producto

### 4. Carrito de compras

## Design Tokens

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

## Base Components

### `Navbar principal`
Barra de navegación superior con logo, enlaces a categorías, búsqueda, icono de carrito y menú de usuario. Versión sticky en escritorio, menú hamburguesa en móvil.

### `Botón CTA primario`
Botón redondeado (border-radius: 12px) con color primario, texto blanco, hover con opacidad 0.9. Usado para 'Añadir al carrito', 'Comprar ahora', etc.

### `Tarjeta de producto`
Tarjeta con imagen, nombre, precio original tachado, precio outlet, botón de añadir al carrito. Sombra sutil, hover con elevación.

### `Input de búsqueda`
Campo de texto con icono de lupa, borde redondeado, placeholder 'Buscar productos...'

### `Filtros de catálogo`
Panel lateral o superior con checkboxes/selectores para talla, color, estilo, marca y rango de precio.

### `Badge de descuento`
Etiqueta pequeña con fondo secundario y texto blanco indicando porcentaje de descuento.

### `Footer`
Pie de página con enlaces a políticas, redes sociales, newsletter y datos de contacto.

### `Modal de carrito`
Panel deslizante desde la derecha mostrando productos en carrito, total y botón de checkout.

### `Formulario de checkout`
Formulario de varias secciones: datos de envío, método de pago, resumen del pedido.

### `Selector de cantidad`
Control con botones - y + y número, para modificar cantidad de producto en carrito.


## Preliminary Spec

```json
{
  "site_goal": "Establecer una plataforma de comercio electr\u00f3nico robusta y atractiva, especializada en la venta de ropa y productos premium bajo un modelo outlet, para incrementar ventas, expandir la base de clientes y posicionar la marca en el mercado digital de lujo con descuento.",
  "audience": "Consumidores finales (hombres y mujeres de diversas edades) interesados en adquirir prendas y productos premium de forma online a precios de outlet, buscando navegaci\u00f3n sencilla, filtros eficientes, descripciones detalladas, im\u00e1genes de alta calidad y un proceso de compra seguro y \u00e1gil que transmita una experiencia de 'lujo con descuento'.",
  "brand_tone": "Lujo con descuento",
  "readiness_reason": "El usuario ha solicitado expl\u00edcitamente proceder con la creaci\u00f3n del dise\u00f1o.",
  "visual_references": [],
  "constraints": [
    "L\u00edmite presupuestario inicial para la fase de desarrollo del MVP y la infraestructura.",
    "Lanzamiento r\u00e1pido del MVP en un plazo de 4-6 meses.",
    "Posibles requisitos de integraci\u00f3n con sistemas de inventario existentes o proveedores de servicios de pago y env\u00edo espec\u00edficos.",
    "Cumplimiento obligatorio con normativas de protecci\u00f3n de datos (ej. GDPR o leyes locales equivalentes) y regulaciones de comercio electr\u00f3nico.",
    "Disponibilidad de un equipo de desarrollo con las habilidades requeridas y capacidad para escalar.",
    "Elecci\u00f3n de proveedor de servicios en la nube y configuraciones de infraestructura eficientes en costos y escalables, con posibles restricciones geogr\u00e1ficas."
  ],
  "sections_or_pages": [
    "Cat\u00e1logo de productos (gesti\u00f3n y visualizaci\u00f3n, incluyendo b\u00fasqueda, filtros y detalles de producto)",
    "Carrito de compras (funcionalidad para agregar productos, modificar cantidades y proceder al checkout)",
    "Gesti\u00f3n de pedidos (proceso de checkout, creaci\u00f3n de pedido y seguimiento del estado del pedido)"
  ],
  "confirmed_assumptions": [
    "La plataforma deber\u00e1 transmitir una sensaci\u00f3n de 'lujo con descuento' desde el dise\u00f1o, con im\u00e1genes de alta calidad y descripciones que resalten el valor original versus el precio outlet.",
    "La implementaci\u00f3n se planificar\u00e1 en fases, comenzando con un Producto M\u00ednimo Viable (MVP) que incluir\u00e1 las funcionalidades esenciales para operar."
  ],
  "design_requirements": {
    "content_needs": "Descripciones detalladas de productos que resalten su valor original, im\u00e1genes de alta calidad. Mostrar \u00edtems en la pantalla principal.",
    "interaction_needs": "Navegaci\u00f3n sencilla, filtros de b\u00fasqueda eficientes por talla, color, estilo y marca, proceso de compra seguro y \u00e1gil. El usuario debe poder seleccionar, mover a su carrito y comprar de forma simple e intuitiva.",
    "responsive_accessibility": "Interfaz responsive para dispositivos de escritorio, tablets y m\u00f3viles.",
    "visual_style": "Debe transmitir una sensaci\u00f3n de 'lujo con descuento', con una paleta de colores sobria, elegante y minimalista. Se considerar\u00e1 el redondeo de botones."
  },
  "ready_for_phase_2": true,
  "status": "complete",
  "open_questions": [
    "\u00bfTienes ya definido si vender\u00e1s marcas espec\u00edficas o ser\u00e1 un outlet multimarca?",
    "\u00bfCu\u00e1les son las funcionalidades clave que se imaginan para el MVP, como sistemas de filtrado avanzado, opciones de personalizaci\u00f3n, o integraciones espec\u00edficas con redes sociales?",
    "\u00bfSe ha definido un nombre comercial para la tienda online?",
    "\u00bfExisten preferencias o requisitos espec\u00edficos sobre las pasarelas de pago o los proveedores de log\u00edstica a utilizar?"
  ],
  "gaps_to_resolve": [
    "Alta competencia en el mercado de e-commerce premium/outlet, requiere propuesta de valor clara y posicionamiento fuerte.",
    "Problemas de integraci\u00f3n con pasarelas de pago y l
```

## Figma Design Context (layout, spacing, component tree)

```json
{
  "success": true,
  "result": {
    "success": true,
    "action": "get_design_context",
    "auth_required": false,
    "message": "Retrieved React + Tailwind design context for node 10:2.",
    "figma": {
      "file_key": "cVHM6NOEwEt35RF88lnQpO",
      "node_id": "10:2",
      "file_url": "https://www.figma.com/design/cVHM6NOEwEt35RF88lnQpO?node-id=10-2",
      "frameworks": "React",
      "languages": "TypeScript",
      "implementation_target": "React + TypeScript + Tailwind CSS",
      "root_name": "Carrito de compras - Desktop",
      "root_size": {
        "width": 1440
      },
      "screen_summary": "Desktop ecommerce cart page in Spanish for a premium outlet storefront. Includes dark navbar, cart hero, cart item list, order summary card, benefits row, recommended products, and footer.",
      "primary_tokens": {
        "colors": {
          "background": "#f5f5f5",
          "surface": "#ffffff",
          "navy": "#1a1a2e",
          "accent": "#e94560",
          "muted_text": "#6b7280",
          "border": "#e5e7eb",
          "success": "#10b981",
          "blue": "#0f3460"
        },
        "font": "Inter",
        "radii": [
          "10px",
          "12px",
          "16px",
          "999px"
        ],
        "shadows": [
          "0px 2px 4px rgba(0,0,0,0.08)",
          "0px 8px 16px rgba(0,0,0,0.18)"
        ]
      },
      "sections": [
        {
          "node_id": "10:3",
          "name": "Navbar principal",
          "description": "Dark 88px header with Project logo, navigation links, search input, and active cart pill."
        },
        {
          "node_id": "10:17",
          "name": "Hero carrito",
          "description": "Dark hero with breadcrumb, title 'Carrito de compras', and supporting copy."
        },
        {
          "node_id": "10:21",
          "name": "Contenido carrito",
          "description": "Main two-column cart content with 3 product rows and a sticky-feeling order summary."
        },
        {
          "node_id": "10:117",
          "name": "Beneficios de compra",
          "description": "Four purchase benefit cards."
        },
        {
          "node_id": "10:130",
          "name": "Productos recomendados",
          "description": "Recommended product row titled 'Completa tu look outlet'."
        },
        {
          "node_id": "10:157",
          "name": "Footer",
          "description": "Dark footer with brand and policy links."
        }
      ],
      "screenshot_available": true,
      "code_available": true
    }
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": null
}
```

## Figma Variable Definitions (token names + values)

```json
{
  "success": true,
  "result": {
    "success": true,
    "action": "get_variable_defs",
    "auth_required": false,
    "message": "Variable definitions retrieved; no variables were returned for the provided file/node.",
    "figma": {
      "file_key": "cVHM6NOEwEt35RF88lnQpO",
      "node_id": "10:2",
      "variables": {}
    }
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": null
}
```

## Code Connect Map (Figma component → code file)

```json
{
  "success": false,
  "result": {
    "success": false,
    "action": "get_code_connect_map",
    "auth_required": false,
    "message": "Code Connect is unavailable for the authenticated Figma account: a Developer seat in an Organization or Enterprise plan is required.",
    "figma": {
      "file_key": "cVHM6NOEwEt35RF88lnQpO",
      "node_id": "10:2",
      "code_connect_map": null,
      "error": "You need a Developer seat in an Organization or Enterprise plan to access Code Connect. Contact a Figma admin to upgrade.",
      "debug_uuid": "cb90feff-3d48-4753-862b-0a5b56403a7f"
    }
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": null,
  "error": "Code Connect is unavailable for the authenticated Figma account: a Developer seat in an Organization or Enterprise plan is required."
}
```

## Design System Rules

```json
{
  "success": true,
  "result": {
    "success": true,
    "action": "create_design_system_rules",
    "auth_required": false,
    "message": "Generated React + TypeScript + Tailwind CSS design system implementation rules from the Figma design context.",
    "figma": {
      "file_key": "cVHM6NOEwEt35RF88lnQpO",
      "file_url": "https://www.figma.com/design/cVHM6NOEwEt35RF88lnQpO?node-id=10-2",
      "node_id": "10:2",
      "suggested_path": "docs/design-system-rules.md",
      "rules_content": "# Design System Rules for React + TypeScript + Tailwind CSS\n\nUse the Figma file as the visual source of truth and implement screens with React components, TypeScript props, and Tailwind utility classes.\n\n## Core Tokens\n- Background page: #f5f5f5\n- Surface/card: #ffffff\n- Primary navy: #1a1a2e\n- Secondary navy: #0f3460\n- Accent/sale: #e94560\n- Success: #10b981\n- Border: #e5e7eb\n- Muted text: #6b7280\n- Light text: #d1d5db / #e5e7eb\n\n## Typography\n- Font family: Inter.\n- Use font weights matching the design: Regular 400, Medium 500, Semi Bold 600, Bold 700.\n- Main page titles use 36px / 44px on desktop.\n- Section titles use 22px to 28px with Semi Bold weight.\n- Body copy uses 14px to 16px with 20px to 26px line-height.\n- Product metadata and helper text use 12px to 13px.\n\n## Layout\n- Preserve the desktop canvas width behavior around 1440px.\n- Use vertical page structure: navbar, hero, main content, benefits, recommendations, footer.\n- Prefer flex and grid layouts over absolute positioning.\n- Top-level sections should stack vertically with no overlap.\n- Main cart content uses a two-column desktop layout: product list on the left and order summary on the right.\n- Use responsive breakpoints to collapse columns on tablet/mobile while keeping labels and content unchanged.\n\n## Spacing\n- Page horizontal padding on desktop: 72px for navbar, 120px for main sections.\n- Section vertical padding: 34px to 52px depending on density.\n- Card padding: 14px to 28px.\n- Grid and flex gaps: 14px, 18px, 24px, 28px, 32px.\n\n## Radius and Effects\n- Standard card radius: 12px.\n- Prominent summary panel radius: 16px.\n- Product/image radius: 10px to 12px.\n- Pills and badges use 999px radius.\n- Product cards use subtle shadow: 0 2px 4px rgba(0,0,0,0.08).\n- Prominent panels use stronger shadow: 0 8px 16px rgba(0,0,0,0.18).\n\n## Components\n- Navbar: dark navy background, logo mark, exact navigation labels, compact search input, active cart pill.\n- Hero: dark navy background, breadcrumb, canonical page title, short explanatory copy.\n- Product cart item: image block, sale badge, brand, title, variant metadata, stock status, original price, sale price, savings, quantity selector, remove action.\n- Order summary: promo code input row, subtotal/discount/shipping/total rows, divider, legal note, primary checkout CTA, secondary trust indicator.\n- Benefit tile: muted surface with short title and supporting copy.\n- Recommended product card: thumbnail, title, outlet price, discount, add CTA.\n- Footer: dark navy background with brand copy and policy links.\n\n## Tailwind Mapping\n- Use exact arbitrary colors when no semantic token exists, for example bg-[#1a1a2e], text-[#e94560], border-[#e5e7eb].\n- Keep Tailwind utilities readable by extracting repeated patterns into typed React components.\n- Do not install Tailwind if the target project already has another styling system; adapt tokens to the project convention while preserving visual values.\n\n## Accessibility\n- Buttons and interactive controls must be semantic button elements.\n- Search and promo inputs must use input elements with accessible labels.\n- Price, discount, and stock status must remain visible text, not only color-coded.\n- Maintain sufficient contrast for dark navy, white, accent, and muted text states.\n\n## Content Consistency\n- Preserve Spanish UI labels exactly as designed unless product requirements explicitly change them.\n- Keep commerce terminology: Inicio, Catalogo de productos, Detalle de producto, Carrito de compras, Finalizar compra, Seguir comprando, Eliminar.\n- Do not replace the ecommerce/cart experience with generic dashboard patterns."
    }
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": null
}
```
