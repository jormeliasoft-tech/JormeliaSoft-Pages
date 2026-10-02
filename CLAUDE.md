# Jormelia Soft · Sitio web corporativo

Contexto para Claude (y para cualquier persona que retome el proyecto).

## Qué es

Jormelia Soft es un emprendimiento de desarrollo de software en Colombia (lema: **Imagina • Crea • Conecta**). Este repositorio es su página web corporativa: su carta de presentación ante clientes. Por eso el estándar es alto en UI/UX, copy, paleta, accesibilidad y rendimiento. Debe verse hecha por un profesional del área.

- Instagram: https://www.instagram.com/jormelia_soft
- WhatsApp (catálogo de servicios): 300 577 2967 → `https://wa.me/573005772967`
- Público: emprendedores y pymes, muchos sin conocimientos técnicos. La mayoría entra desde el celular.
- **Sitio en vivo**: https://jormeliasoft.com (desde 2026-09-29). `www.jormeliasoft.com` redirige (301) a la versión sin `www`. Desplegado en Cloudflare Pages (proyecto `jormeliasoft-pages`), conectado al repo `jormeliasoft-tech/JormeliaSoft-Pages` en GitHub (rama `main`, deploy automático en cada push). La cuenta de GitHub con acceso de escritura al repo es `gestionsigasoftware-netizen` (colaboradora invitada; considerar más adelante si conviene una cuenta propia de Jormelia Soft).

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
2. **Hero**: titular "Convertimos tu idea en software que trabaja por tu negocio." A la derecha, el elemento memorable del sitio: una ventana de editor (`#editor`) que escribe código (`crearSitio({...})`) y luego cambia a la pestaña "Resultado". Las pestañas son clicables.
   - **Historia**: hubo dos versiones previas mostrando una tienda móvil ficticia ("Panadería La Espiga") y luego una real (**Hilos Nata**, ver Portafolio). El 2026-09-30 el cliente pidió quitar cualquier referencia a un cliente/negocio real del hero — no quería que el elemento más visible del sitio "apuntara" a un proyecto específico. Se reemplazó por una escena **genérica multi-dispositivo**.
   - **Versión actual**: "Resultado" muestra el mismo sitio de ejemplo (marca ficticia "TuNegocio") a la vez en **tablet** (asomando detrás, parcialmente oculta), **laptop** (protagonista, con navegador funcional: barra de direcciones, nav con logo/links/CTA, hero con insignia + titular + 2 botones + tarjeta de métrica flotante, y tarjetas "debajo del pliegue" asomando en el borde inferior) y **celular** (sobrepuesto al frente, con notch e indicador de inicio). Estructura en el DOM: `.pane.preview > .scene-frame > .scene > (.tablet, .laptop, .m-phone)`.
   - **Por qué existe `.scene-frame`**: es un contenedor con `overflow:hidden` y una altura explícita por breakpoint (400/368/288/224px) que recorta `.scene` (que SIEMPRE mide 560×400, la referencia interna) escalada con `transform:scale()` desde `transform-origin:bottom center`. Esto evita el error obvio de "reducir el alto Y aplicar la escala a la vez" (se duplica la reducción y deja un hueco vacío arriba de los dispositivos) — si se ajusta el responsive de esta escena, la altura de `.scene-frame` en cada breakpoint debe ser exactamente `400 * factorDeEscala`, nunca un valor independiente.
   - **`.pane.preview` tiene su propio padding reducido** (`16px 6px 0`, con selector de 2 clases para ganarle a `.pane` normal y a su variante móvil): el padding generoso de `.pane` (pensado para el código) le restaba ancho real a la escena de 560px, cortando el borde derecho del celular (se notó al agrandar el laptop 2026-09-30, pero el recorte ya existía desde antes). Si el ancho de referencia de `.scene` cambia, verificar que siga cabiendo dentro de `.pane.preview` con este padding reducido, no con el de `.pane` normal.
   - **Animación de entrada**: al pasar a "Resultado" (clic manual o automático tras escribir el código), `main.js` agrega la clase `.pop` a `#editor` con un `setTimeout` corto; el CSS hace que tablet → laptop → celular aparezcan en cascada (`transition-delay` escalonado en cada uno). Con `prefers-reduced-motion: reduce` esto no aplica (la regla global `*{transition:none!important}` lo neutraliza) y además el autoplay ni siquiera intenta cambiar de pestaña — se queda mostrando el código completo, como pedía el principio de accesibilidad ya existente.
   - Todo el contenido (textos, marca "TuNegocio", métricas) es genérico e ilustrativo a propósito — no representa a ningún cliente real. Si en el futuro se vuelve a asociar el hero a un proyecto real, debe ser una decisión explícita del cliente, no algo que se reintroduzca por defecto.
3. **Franja de marca**: "Imagina · Crea · Conecta" sobre azul marino.
4. **Servicios** (`#servicios`): grilla asimétrica. Destacado: Páginas web — también usa `.svc.photo` (imagen de laptop/red de "diseño web", agregada 2026-09-30), pero a diferencia de las otras 5 **conserva el blob de marca** (`::before`) como acento encima de la foto: capas de atrás hacia adelante son `.svc-illus` (foto+degradado, z-index 0) → `::before` (blob, z-index 1) → `.svc-body` (texto, z-index 2). Esto fue pedido explícito del cliente ("no elimines el blob, intégralo"), así que si se edita esta tarjeta no quitar el blob sin confirmar primero. Las otras 5 tarjetas (tiendas en línea, apps móviles, software a la medida, automatización, soporte) usan la clase `.svc.photo`: la ilustración cubre toda la tarjeta como fondo (`.svc-illus{position:absolute; inset:0}`) con un degradado navy de marca encima (`.svc-illus::after`, `linear-gradient(160deg, rgba(2,12,48,.74), rgba(2,12,48,.92))`) y el texto (`.svc-body`) en blanco/claro sobre ese degradado.
   - **Historia de esta sección** (importante si se vuelve a tocar): primero hubo 5 ilustraciones propias hechas en HTML/CSS por Claude (ver `design/illustrations-src/`, siguen documentadas ahí como referencia/alternativa). El 2026-09-30 el cliente las reemplazó por imágenes que él mismo consiguió en Pixabay (`assets/img/illustrations/ilustrations 2/`, carpeta ignorada por git — son 4 estilos de ilustración distintos con fondos sólidos de colores distintos). Se les quitó el fondo sólido por chroma-key (script en el historial de la sesión, no guardado en el repo) y se integraron como fondo completo de tarjeta con el degradado navy — ese degradado es lo que realmente le da coherencia al conjunto pese a que las 5 imágenes originales no combinan entre sí. **Si se agregan o cambian estas imágenes en el futuro**, cualquier ilustración sirve siempre que: (a) se le quite el fondo sólido dejándola con transparencia, y (b) se aplique sobre `.svc.photo` para heredar el degradado — el degradado es lo que hace que estilos distintos se vean como un solo sistema.
5. **Cómo trabajamos** (`#proceso`): las 3 palabras del lema como pasos reales (1 Imagina, 2 Crea, 3 Conecta).
6. **Por qué nosotros** (`#por-que`): 4 diferenciales (contacto técnico directo, precio claro, el proyecto es tuyo, mobile first) + chips de tecnologías. Copy pensado a propósito para NO sonar a "somos pocos/una sola persona hace todo" (se cambió esa narrativa por petición explícita del cliente, por tema de credibilidad/ética): el foco es especialización y proceso, no tamaño de equipo.
7. **Portafolio** (`#portafolio`): 2 proyectos **reales**, con permiso confirmado del cliente (2026-09-29): **Hilos Nata** (tienda de crochet hecho a mano, diseño y desarrollo completo — hilosnata.com) y **SIGAP** (software a la medida multi-tenant de analítica y gestión pastoral, con roles local/distrital/nacional — sigap.com.co). Cada tarjeta (`.case`) tiene una captura real del sitio (`.case-shot`, imagen a sangre completa arriba), etiqueta "Proyecto real", descripción, tags y un enlace "Ver el sitio". Las capturas se generaron con Playwright (`npx playwright screenshot` / script con scroll para disparar animaciones) y se recortaron/optimizaron a WebP (~25 KB) con un script propio (canvas en un navegador headless, sin depender de ImageMagick/cwebp que no estaban disponibles). Si se agregan más proyectos reales, seguir el mismo patrón: captura 1440×900 → recorte 900×560 (`object-fit:cover; object-position:top`) → WebP.
8. **Preguntas frecuentes** (`#preguntas`): `<details>` nativos.
9. **Contacto** (`#contacto`): bloque con degradado de marca, canales (WhatsApp, correo `hola@jormeliasoft.com`, Instagram), una ilustración vectorial propia (persona en su computador, decorativa, esquina inferior) y un formulario con **dos botones**: "Enviar por WhatsApp" (abre chat prellenado) y "Enviar por correo" (POST a `/api/contact`, la Pages Function). Pensado para que un cliente internacional que no usa WhatsApp igual pueda escribir.
9.5. **Cotizador** (`#quoteModal`, agregado 2026-09-30): modal (no una sección en el flujo de la página) con backdrop oscurecido y blur, abierto desde el botón "Cotizar proyecto" (nav de escritorio) o desde el mismo botón dentro del menú móvil (`.menu-cta` en `#menu`, oculto en escritorio vía `.menu-cta-item{display:none}` porque ahí ya está el botón normal de la nav). Flujo: elegir 1 de 6 servicios → responder 1-2 preguntas específicas de ese servicio → ver un rango de precio en vivo (degradado de marca) + tiempo estimado → botón real de WhatsApp con el mensaje prellenado según las respuestas.
   - **Los precios están en `services` dentro de `js/main.js`** (objeto con `min`/`max`/`weeks` por opción "base", más modificadores tipo `add` o `mult`). Se investigaron contra el mercado colombiano 2026 (ver research de la sesión) y el cliente los aprobó, pero **son un estimado de referencia, no la tarifa oficial** — si Jormelia Soft cambia lo que cobra, hay que actualizar estos números a mano, no hay ninguna fuente externa de precios conectada.
   - Se implementó primero como maqueta en un Artifact de Claude para que el cliente la probara antes de tocar el sitio real — ese patrón (probar interactivos grandes en Artifact antes de integrarlos) vale la pena repetirlo para features similares.
   - Nota de accesibilidad: el modal cierra con Enter en el botón X, click en el backdrop, o Escape; NO tiene un focus-trap completo (no cicla el Tab dentro del modal), es una limitación conocida, no un bug pendiente de arreglar salvo que se pida.
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
- [x] **Ejemplo del hero**: resuelto 2026-09-29, ahora muestra Hilos Nata (real) en vez de la panadería ficticia. Productos genéricos, sin precios/nombres reales inventados (ver Secciones).
- [x] **Portafolio** (`#portafolio`): resuelto 2026-09-29 con Hilos Nata y SIGAP (ver Secciones). Si aparece un tercer proyecto real con permiso, agregarlo siguiendo el mismo patrón de tarjeta (`.case`) — no hace falta que sean exactamente 2; el grid `.cases` es `repeat(2,1fr)` pero acepta más elementos (ajustar a `repeat(3,1fr)` si llegan a ser 3 o más, como estaba antes).
- [x] **FAQ**: confirmado 2026-09-30 por el cliente — los tiempos y condiciones (periodo de acompañamiento, trabajo remoto) ya coinciden con la política real. No requiere cambios.
- [x] Ciudad/ubicación en el footer: confirmado 2026-09-30 — se queda "Colombia", sin ciudad específica.
- [x] **Favicon en varios tamaños**: resuelto 2026-09-29. Generados desde `logo-simbolo.webp` usando Chromium headless (Playwright) + `<canvas>` para redimensionar sin depender de ImageMagick/cwebp (no disponibles en el entorno) ni de un servicio externo. Archivos en `assets/img/icons/`: `favicon-16x16.png`, `favicon-32x32.png`, `icon-192.png`, `icon-512.png` (fondo transparente, 12-14% de padding) y `apple-touch-icon.png` (180×180, fondo navy sólido `#020C30` porque iOS no debe usar transparencia). `site.webmanifest` en la raíz referencia los íconos 192/512 para Android/PWA. Si se necesita regenerar (ej. cambia el logo), reusar el patrón: cargar imagen en un `<img>` dentro de una página headless, dibujar en `<canvas>` centrado con padding, exportar con `canvas.toDataURL('image/png')`.
- [x] **Imagen OG dedicada** (1200×630): resuelta 2026-09-29. `assets/img/og-image.png`, diseñada a medida con la identidad real (blob de marca, símbolo, titular del hero, tags en JetBrains Mono). Se generó como página HTML propia (`og.html`, con las mismas fuentes autohospedadas del sitio) capturada con Playwright a exactamente 1200×630 — mismo patrón que las capturas del portafolio y los favicons. Si el copy o el diseño cambian, regenerar con el mismo método en vez de editar el PNG directamente.
- [ ] **Cuentas de terceros pendientes de crear** (el cliente decidió avanzar con placeholders, ver Próximos pasos → Analítica y Formulario).

## Próximos pasos (proyección)

Auditoría de competitividad hecha el 2026-09-29 (7 puntos para competir con agencias grandes). **Los 7 quedaron resueltos el 2026-09-30**:

1. **Portafolio real** — hecho: Hilos Nata y SIGAP, con capturas reales, descripción y enlace al sitio en vivo.
2. **Foto/rostro real del equipo** — descartado a propósito (privacidad, decisión del cliente). Resuelto con una ilustración vectorial propia en `#contacto` (`.cta-illustration`). No reabrir sin que el cliente lo pida explícitamente.
3. **SEO técnico** — hecho: Open Graph/Twitter Card con imagen a medida (`og-image.png`), `sitemap.xml`, `robots.txt`, JSON-LD `ProfessionalService`, `canonical`, `theme-color`, favicon completo (16/32/192/512 + apple-touch-icon) + `site.webmanifest`.
4. **Rendimiento** — hecho y **verificado con PageSpeed Insights sobre la URL real** (2026-09-30): Escritorio 100/99/100/100 (Rendimiento/Accesibilidad/Prácticas/SEO), Móvil 99/99/100/100. Fuentes autohospedadas, `loading="lazy"`, todo sin build.
5. **Analítica** — hecho: **Cloudflare Web Analytics activo** (gratis, sin cookies) mostrando datos reales (Core Web Vitals "Good" en LCP/CLS, ~1s de carga). GA4 sigue disponible como bloque comentado en el `<head>` si en algún momento se quiere el detalle del evento `whatsapp_click` (ya disparado por `js/main.js`, no falla si `gtag` no existe).
6. **Canal de contacto internacional** — hecho y **verificado de punta a punta** (2026-09-30): dominio verificado en Resend (SPF/DKIM/DMARC), Cloudflare Email Routing activo (`hola@jormeliasoft.com` → Gmail del cliente), plantilla de correo con identidad de marca (`buildEmailHtml`/`buildEmailText` en `functions/api/contact.js`, tabla con estilos en línea para compatibilidad con clientes de correo). Un correo de prueba real fue confirmado "Delivered" en Resend y recibido en Gmail.
   - Nota de operación: los primerísimos correos de prueba rebotaron (`Bounced`) porque Email Routing aún no estaba configurado, lo que dejó `hola@jormeliasoft.com` en la **lista de supresión** de Resend. Hubo que quitarlo manualmente ahí (Resend → Emails → Suppressions) para que volviera a intentar enviar. Si en el futuro un correo real rebota por cualquier motivo, revisar esa lista de supresión — Resend no reintenta a una dirección suprimida aunque el problema ya esté resuelto.
   - Es normal que un dominio de correo nuevo tenga uno o dos envíos con `Delivery Delayed` (no es error) mientras Gmail "aprende" a confiar en el remitente; se resuelve solo con el tiempo y el volumen de envíos legítimos.
7. **Despliegue** — hecho y verificado en vivo: repo en GitHub (`jormeliasoft-tech/JormeliaSoft-Pages`) conectado a un proyecto de **Cloudflare Pages clásico** (`jormeliasoft-pages`; flujo "legacy Pages", no el Workers unificado, porque `functions/api/contact.js` usa la convención de Pages Functions). Build settings: framework preset "None", sin build command, output directory `/`. Dominios `jormeliasoft.com` y `www.jormeliasoft.com` activos con SSL; Redirect Rule (`https://www.*` → `https://${1}`, 301) redirige `www` a la raíz. Deploy automático en cada push a `main`.

**Se evaluó migrar a React y se descartó** (2026-09-29): ninguno de los 7 puntos lo requería, el sitio es una sola página sin estado complejo, y un framework solo agregaría build/dependencias sin beneficio. Si en el futuro se agrega un blog, panel de cliente o portafolio dinámico tipo CMS, ahí sí vale la pena reconsiderar (y evaluar algo más liviano que React puro, como Astro, antes que un SPA completo).

**Opcional / más adelante**: selector manual de tema claro/oscuro, páginas individuales por servicio, blog, versión en inglés, decidir si `gestionsigasoftware-netizen` sigue siendo la cuenta de GitHub del proyecto a largo plazo.

**Pendiente — sección de testimonios / prueba social (2026-10-02)**: el cliente pidió algo tipo widget de Trustpilot "bien realista, con buena valoración" más una sección de testimonios, mientras la empresa crece. Se rechazó hacerlo con contenido inventado (va directo contra el principio ya establecido de "nada de estadísticas, clientes o testimonios inventados" y además imitar la marca de Trustpilot sin cuenta real sería engañoso). Queda pendiente hacerlo bien, con pasos reales:
1. Crear la cuenta real de la empresa en Trustpilot (gratis), igual que se hizo con Google Business Profile.
2. Pedir una reseña corta autorizada a Hilos Nata y/o SIGAP (nombre y negocio reales, con permiso).
3. Una vez haya 2-3 reseñas reales, integrar el widget oficial de Trustpilot (script embebido legítimo) y maquetar una sección de testimonios con esas citas reales.
Mientras tanto, no agregar nada en su lugar (ni placeholder falso ni estadísticas inventadas) — dejar la sección fuera del sitio hasta tener contenido real que poner ahí.

## Cómo trabajar
- No hay dependencias ni build para el sitio en sí. Editar y recargar. La única pieza "de servidor" es `functions/api/contact.js`, una Cloudflare Pages Function (JS plano, sin compilar) que Cloudflare ejecuta automáticamente al desplegar — no requiere Node/npm localmente para editarla, solo para probarla end-to-end se necesitaría `wrangler pages dev`.
- Mantener todo el color vía variables CSS; no escribir hex sueltos fuera de `:root` salvo casos puntuales ya existentes (mockup del hero, colores propios de la maqueta de panadería).
- Probar siempre en 390px de ancho y en modo oscuro antes de dar algo por terminado.
- **Crítico — cache-busting de `css/styles.css` y `js/main.js`**: Cloudflare Pages sirve estos archivos con `Cache-Control: max-age=14400` (4 horas) por defecto. Si se edita cualquiera de los dos sin cambiar su URL, los visitantes con el archivo viejo en caché van a ver una mezcla rota (HTML nuevo con clases que el CSS viejo no conoce — por ejemplo, un SVG sin la regla que le da tamaño se ve enorme, ya pasó el 2026-09-30 con el rediseño del hero). Por eso ambos se referencian con `?v=N` en `index.html` (`css/styles.css?v=2`, `js/main.js?v=2`). **Cada vez que se edite `styles.css` o `main.js`, subir en 1 el número de versión correspondiente en `index.html`** para forzar que el navegador lo trate como un archivo nuevo, sin depender de que expire la caché.
- Decisión de arquitectura (2026-09-29): **seguir estático, no migrar a React** — ver razones en "Próximos pasos". No revisitar esta decisión salvo que cambien los requisitos (CMS, panel de cliente, blog).
