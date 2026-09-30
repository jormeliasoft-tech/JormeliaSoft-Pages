# Ilustraciones de servicios — código fuente

Cada `.html` aquí es la fuente editable de una de las ilustraciones en `assets/img/illustrations/`. Están escritas como HTML/CSS puro (sin SVG a mano) y se capturan con Playwright a resolución 2x para exportarlas como WebP.

## Requisitos

- Node.js y el paquete `playwright` instalado (`npm install playwright` en cualquier carpeta) con el navegador Chromium descargado (`npx playwright install chromium`).
- Copiar los 3 archivos de fuentes autohospedadas del sitio (`assets/fonts/*.woff2`) junto a estos `.html` antes de renderizar, porque las ilustraciones usan `@font-face` con rutas relativas.

## Regenerar una ilustración

```bash
node shot.js tienda.html tienda.png 640 480      # o 420 420 para las angostas
node to-webp.js tienda.png tienda.webp 700       # 700 para las anchas, 520 para las angostas
```

Luego copiar el `.webp` resultante a `assets/img/illustrations/` (mismo nombre, para que `index.html` no necesite cambios).

## Para crear una ilustración nueva en el mismo estilo

1. Copiar uno de los `.html` existentes como punto de partida.
2. Mantener: el blob de fondo (`opacity:.16-.17`, degradado de dos tonos de la paleta de marca), 1-2 "objetos" centrales (tarjeta, monitor, teléfono, nodo circular) con sombras suaves, y 1-2 insignias circulares blancas flotantes con un ícono simple.
3. Usar solo los colores de `:root` en `css/styles.css` (cobalt, azure, violet, soft) para que la ilustración combine con el resto del sitio.
4. Capturar con `omitBackground:true` (ver `shot.js`) para que el fondo quede transparente.
