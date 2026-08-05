# Modal de galería y ajuste de iconos

## Objetivo

Centrar los iconos sociales del pie y permitir ampliar cualquier imagen del carrusel en una galería modal accesible.

## Diseño

- Los círculos sociales del pie centrarán sus SVG mediante grid, sin márgenes heredados.
- Cada slide será activable con ratón, teclado y tacto.
- Un `dialog` mostrará la imagen completa con `object-fit: contain`, texto alternativo y contador.
- La navegación anterior/siguiente será circular y responderá a botones, flechas de teclado y gestos horizontales.
- El modal se cerrará con el botón, Escape o un clic sobre el fondo exterior; al cerrar devolverá el foco al slide que lo abrió.
- Se bloqueará el scroll del documento mientras el modal esté abierto y se respetará `prefers-reduced-motion`.

## Validación

- Probar apertura desde la primera y última imagen, navegación circular y cierre por los tres métodos.
- Verificar foco, teclado y geometría en móvil y escritorio.
- Confirmar que los iconos de Instagram y WhatsApp quedan centrados dentro de sus círculos.
