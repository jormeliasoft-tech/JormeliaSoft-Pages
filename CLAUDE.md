# Jormelia Soft · Sitio web corporativo

Contexto para Claude (y para cualquier persona que retome el proyecto).

## Qué es

Jormelia Soft es un emprendimiento de desarrollo de software en Colombia (lema: **Imagina • Crea • Conecta**). Este repositorio es su página web corporativa: su carta de presentación ante clientes. Por eso el estándar es alto en UI/UX, copy, paleta, accesibilidad y rendimiento. Debe verse hecha por un profesional del área.

- Instagram: https://www.instagram.com/jormelia_soft
- WhatsApp (catálogo de servicios): 300 577 2967 → `https://wa.me/573005772967`
- Público: emprendedores y pymes, muchos sin conocimientos técnicos. La mayoría entra desde el celular.

## Estado actual (v1)

Sitio estático de una sola página, sin frameworks ni build. Funciona abriendo `index.html` (recomendado: extensión **Live Server** en VS Code).

```
jormelia-soft/
├── index.html            # Estructura y contenido (todas las secciones) + meta SEO/OG/JSON-LD
├── css/styles.css        # Tokens de diseño, @font-face, estilos, responsive, modo oscuro
├── js/main.js            # Menú móvil, animación del hero, formulario (WhatsApp + correo), analítica
├── robots.txt            # Permite todo, apunta al sitemap
├── sitemap.xml           # Una sola URL (sitio de una página)
├── functions/api/contact.js  # Cloudflare Pages Function: recibe el formulario y envía correo (Resend)
├── assets/fonts/         # Outfit, Figtree, JetBrains Mono autohospedadas (variable fonts, .woff2)
├── assets/img/portfolio/ # Capturas reales de proyectos (hilos-nata.webp, sigap.webp)
└── assets/img/
    ├── logo-simbolo.webp               # Símbolo </> recortado (nav y favicon)
    ├── logo-blanco.webp                # Logo con texto en blanco (footer oscuro)
    ├── logo-original-transparente.png  # Logo original sin fondo
    └── logo-original-fondo-blanco.png  # Logo original con fondo (usado como og:image)
```

**Despliegue**: dominio `jormeliasoft.com` ya comprado en Cloudflare. Se despliega en **Cloudflare Pages** (sitio estático, sin build). La carpeta `functions/` sigue la convención de Cloudflare Pages Functions (`functions/api/contact.js` → ruta `/api/contact`).

### Secciones (en orden)
1. **Nav fija**: símbolo + "Jormelia Soft" en texto, enlaces a secciones, botón "Cotizar proyecto". Menú hamburguesa bajo 760px.
2. **Hero**: titular "Convertimos tu idea en software que trabaja por tu negocio." A la derecha, el elemento memorable del sitio: una ventana de editor que escribe código (`crearSitio({...})`) y luego cambia a la pestaña "Resultado", mostrando una tienda móvil de ejemplo (Panadería La Espiga, pagos Nequi/PSE/Tarjeta, botón de WhatsApp). Las pestañas son clicables.
3. **Franja de marca**: "Imagina · Crea · Conecta" sobre azul marino.
4. **Servicios** (`#servicios`): grilla asimétrica. Destacado: Páginas web. Luego tiendas en línea, apps móviles, software a la medida, automatización, soporte y mantenimiento.
5. **Cómo trabajamos** (`#proceso`): las 3 palabras del lema como pasos reales (1 Imagina, 2 Crea, 3 Conecta).
6. **Por qué nosotros** (`#por-que`): 4 diferenciales (contacto técnico directo, precio claro, el proyecto es tuyo, mobile first) + chips de tecnologías. Copy pensado a propósito para NO sonar a "somos pocos/una sola persona hace todo" (se cambió esa narrativa por petición explícita del cliente, por tema de credibilidad/ética): el foco es especialización y proceso, no tamaño de equipo.
7. **Portafolio** (`#portafolio`): 2 proyectos **reales**, con permiso confirmado del cliente (2026-09-29): **Hilos Ñata** (tienda de crochet hecho a mano, diseño y desarrollo completo — hilosnata.com) y **SIGAP** (software a la medida multi-tenant de analítica y gestión pastoral, con roles local/distrital/nacional — sigap.com.co). Cada tarjeta (`.case`) tiene una captura real del sitio (`.case-shot`, imagen a sangre completa arriba), etiqueta "Proyecto real", descripción, tags y un enlace "Ver el sitio". Las capturas se generaron con Playwright (`npx playwright screenshot` / script con scroll para disparar animaciones) y se recortaron/optimizaron a WebP (~25 KB) con un script propio (canvas en un navegador headless, sin depender de ImageMagick/cwebp que no estaban disponibles). Si se agregan más proyectos reales, seguir el mismo patrón: captura 1440×900 → recorte 900×560 (`object-fit:cover; object-position:top`) → WebP.
8. **Preguntas frecuentes** (`#preguntas`): `<details>` nativos.
9. **Contacto** (`#contacto`): bloque con degradado de marca, canales (WhatsApp, correo `hola@jormeliasoft.com`, Instagram), una ilustración vectorial propia (persona en su computador, decorativa, esquina inferior) y un formulario con **dos botones**: "Enviar por WhatsApp" (abre chat prellenado) y "Enviar por correo" (POST a `/api/contact`, la Pages Function). Pensado para que un cliente internacional que no usa WhatsApp igual pueda escribir.
10. **Footer** (4 columnas: marca, servicios, empresa, contacto) + botón flotante de WhatsApp.

**Sobre fotos/ilustraciones de personas**: decisión explícita del cliente (2026-09-29) de NO mostrar fotos reales de su equipo (privacidad, y es normal en empresas de desarrollo). Tampoco se usa una foto real de otra persona ni una foto generada por IA presentada como si fuera real — sería contenido fabricado presentado como genuino, lo mismo que ya se evita con testimonios/estadísticas. En su lugar, el "toque humano" se resuelve con **ilustración vectorial propia** (ver el SVG `.cta-illustration` en Contacto), que no pretende ser una fotografía.

## Sistema de diseño

Colores (extraídos del logo), definidos como variables en `:root`:

| Token | Hex | Uso |
|---|---|---|
| `--navy` | `#020C30` | Texto principal, secciones oscuras, botón primario |
| `--azure` | `#4CA1FD` | Acentos, foco, degradado |
| `--cobalt` | `#1D4FE0` | Iconos, degradado, botón en modo oscuro |
| `--violet` | `#4B17B9` | Final del degradado de marca |
| `--soft` | `#4F5BEF` | Color de "Soft" en el logo, detalles |
| `--paper` | `#F5F7FE` | Fondo (azul frío, no crema) |

- Degradado de marca: `--brand-grad` (azure → cobalt → violet), igual al blob del logo.
- Tipografías: **Outfit** para títulos, **Figtree** para texto, **JetBrains Mono** solo para código. Autohospedadas como variable fonts en `assets/fonts/` (ya no se usa Google Fonts CDN, por rendimiento). Declaradas vía `@font-face` al inicio de `styles.css`; si se agrega un peso nuevo debe estar dentro del rango `font-weight` ya declarado o se debe volver a descargar el archivo variable.
- Botones de WhatsApp (flotante, formulario, maqueta del hero): **navy/cobalto de marca con ícono blanco**, no el verde oficial de WhatsApp — decisión explícita del cliente para reforzar identidad propia sobre la de terceros.
- Modo oscuro: automático con `prefers-color-scheme`, y forzable con `data-theme="dark"|"light"` en `<html>`.
- Breakpoints: 980px (una columna) y 760px (móvil).
- Accesibilidad: foco visible, `prefers-reduced-motion` desactiva animaciones (el hero muestra el código completo), textos alternativos, contraste AA.

### Principios a mantener
- Una sola animación protagonista (el hero). No agregar fade-in a cada sección ni efectos por todas partes.
- Copy en español de Colombia, tuteando, claro y sin tecnicismos para el cliente. Verbos concretos en los botones.
- Nada de estadísticas, clientes o testimonios inventados. Solo contenido real.
- Evitar el look de plantilla: no etiquetas en mayúsculas sobre cada título, no tarjetas idénticas repetidas.

## Pendiente / supuestos por validar

Estos contenidos se escribieron sin acceso al catálogo real ni al Instagram:
- [ ] **Servicios**: confirmar la lista contra el catálogo de WhatsApp y ajustar textos y etiquetas. (Confirmado 2026-09-29: la lista de 6 servicios se mantiene tal cual; no incluir videojuegos como servicio aparte, solo mencionarlos si aplica en conversación directa con el cliente).
- [x] **Tecnologías** (sección Por qué): actualizado 2026-09-29 a stack real y más competitivo: TypeScript, JavaScript, React, Node.js, Java, C#, C++, Python, Laravel, Django, Flutter, SQL, Figma. Se quitó HTML·CSS y WordPress por decisión del cliente (no aportan a un posicionamiento premium). Si el stack real cambia, actualizar los `<span>` dentro de `.stack` en `index.html`.
- [ ] **Ejemplo del hero**: "Panadería La Espiga" es ficticio. Reemplazar por un proyecto real si hay permiso del cliente (por ejemplo, Hilos Ñata o SIGAP, ya usados en el portafolio).
- [x] **Portafolio** (`#portafolio`): resuelto 2026-09-29 con Hilos Ñata y SIGAP (ver Secciones). Si aparece un tercer proyecto real con permiso, agregarlo siguiendo el mismo patrón de tarjeta (`.case`) — no hace falta que sean exactamente 2; el grid `.cases` es `repeat(2,1fr)` pero acepta más elementos (ajustar a `repeat(3,1fr)` si llegan a ser 3 o más, como estaba antes).
- [ ] **FAQ**: revisar tiempos y condiciones (periodo de acompañamiento, trabajo remoto) según la política real.
- [ ] Ciudad/ubicación en el footer (hoy dice "Colombia").
- [ ] **Favicon en varios tamaños** (apple-touch-icon 180×180, PNGs 16/32/192/512, `manifest.json`): hoy se reutiliza `logo-simbolo.webp` para todo, que funciona en Chrome/Firefox/Edge pero no es el formato/tamaño ideal para iOS/Android. Generar los tamaños correctos con una herramienta como realfavicongenerator.net (requiere procesar imágenes, fuera del alcance de edición de texto/código).
- [ ] **Imagen OG dedicada** (1200×630): hoy `og:image` reutiliza `logo-original-fondo-blanco.png` como solución temporal. Una tarjeta diseñada específicamente para compartir en redes/WhatsApp se vería mejor.
- [ ] **Cuentas de terceros pendientes de crear** (el cliente decidió avanzar con placeholders, ver Próximos pasos → Analítica y Formulario).

## Próximos pasos (proyección)

Auditoría de competitividad hecha el 2026-09-29 (7 puntos para competir con agencias grandes). Estado de cada uno:

1. **Portafolio real** — hecho: Hilos Ñata y SIGAP, con capturas reales, descripción y enlace al sitio en vivo.
2. **Foto/rostro real del equipo** — descartado a propósito (privacidad, decisión del cliente). Resuelto en su lugar con una ilustración vectorial propia en `#contacto` (`.cta-illustration`). No reabrir esta opción sin que el cliente lo pida explícitamente.
3. **SEO técnico** — hecho: Open Graph/Twitter Card, `sitemap.xml`, `robots.txt`, JSON-LD `ProfessionalService`, `canonical`, `theme-color`, `apple-touch-icon` (con el asset existente, ver pendientes sobre tamaños correctos).
4. **Rendimiento** — hecho lo posible sin build: fuentes autohospedadas (`assets/fonts/`, variable fonts, `@font-face` con `font-display:swap`, `<link rel="preload">` para Outfit/Figtree), `loading="lazy"` en la imagen del footer. Falta correr Lighthouse/PageSpeed **una vez el sitio esté publicado** en `jormeliasoft.com` (medir contra `localhost` no es representativo).
5. **Analítica** — placeholder listo. Recomendado: activar **Cloudflare Web Analytics** desde el panel de Cloudflare Pages después de desplegar (cero código, sin cookies). Si además se quiere el evento de clic en WhatsApp con más detalle, hay un bloque de Google Analytics 4 comentado en el `<head>` de `index.html` — descomentar y poner el ID real de una propiedad GA4. `js/main.js` ya dispara `trackEvent('whatsapp_click', ...)` en todos los enlaces de WhatsApp y no falla si `gtag` no existe.
6. **Canal de contacto internacional** — hecho: formulario con dos botones (WhatsApp y correo) y enlace `mailto:hola@jormeliasoft.com` en Contacto y footer. El botón de correo llama a `functions/api/contact.js` (Cloudflare Pages Function) que envía el mensaje por **Resend**. Para que funcione en producción falta: (a) crear cuenta en resend.com, (b) verificar el dominio `jormeliasoft.com` en Resend, (c) configurar la variable de entorno `RESEND_API_KEY` en Cloudflare Pages (Settings → Environment variables). Sin esa variable, el botón de correo responde con un error controlado pidiendo usar WhatsApp.
7. **Despliegue** — dominio `jormeliasoft.com` ya comprado en Cloudflare. Falta: conectar el proyecto a **Cloudflare Pages** (por Git o por "Direct Upload"/Wrangler) y apuntar el dominio. Requiere acceso a la cuenta de Cloudflare del cliente, así que es una acción manual de él, no de Claude.

**Se evaluó migrar a React y se descartó** (2026-09-29): ninguno de los 7 puntos lo requería, el sitio es una sola página sin estado complejo, y un framework solo agregaría build/dependencias sin beneficio. Si en el futuro se agrega un blog, panel de cliente o portafolio dinámico tipo CMS, ahí sí vale la pena reconsiderar (y evaluar algo más liviano que React puro, como Astro, antes que un SPA completo).

**Opcional / más adelante**: testimonios reales con nombre y negocio autorizados, imagen OG diseñada a medida (1200×630), favicon en tamaños completos, selector manual de tema claro/oscuro, páginas individuales por servicio, blog, versión en inglés.

## Cómo trabajar
- No hay dependencias ni build para el sitio en sí. Editar y recargar. La única pieza "de servidor" es `functions/api/contact.js`, una Cloudflare Pages Function (JS plano, sin compilar) que Cloudflare ejecuta automáticamente al desplegar — no requiere Node/npm localmente para editarla, solo para probarla end-to-end se necesitaría `wrangler pages dev`.
- Mantener todo el color vía variables CSS; no escribir hex sueltos fuera de `:root` salvo casos puntuales ya existentes (mockup del hero, colores propios de la maqueta de panadería).
- Probar siempre en 390px de ancho y en modo oscuro antes de dar algo por terminado.
- Decisión de arquitectura (2026-09-29): **seguir estático, no migrar a React** — ver razones en "Próximos pasos". No revisitar esta decisión salvo que cambien los requisitos (CMS, panel de cliente, blog).
