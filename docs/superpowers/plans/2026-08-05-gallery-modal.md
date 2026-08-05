# Gallery Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centrar los iconos sociales del pie y añadir una galería modal accesible al carrusel existente.

**Architecture:** El HTML incorporará un único `dialog` reutilizable. `script.js` conectará cada slide con el modal y mantendrá un índice circular independiente del carrusel principal; CSS resolverá centrado, overlay y adaptación responsive.

**Tech Stack:** HTML5, CSS, JavaScript clásico y `node:test`.

## Global Constraints

- Sin frameworks ni dependencias.
- Compatible con apertura directa mediante `file://`.
- Navegación circular, teclado, gestos y cierre exterior.
- Mantener los assets WebP y el estilo negro/amarillo existente.

---

### Task 1: Contrato del modal e iconos

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `index.html`
- Modify: `styles.css`

- [ ] Añadir una prueba que exija un `dialog` etiquetado, controles anterior/siguiente/cerrar y CSS de centrado para `.footer-socials a` y sus imágenes.
- [ ] Ejecutar `node --test tests/site.test.mjs` y confirmar el fallo por ausencia del modal.
- [ ] Añadir el marcado del modal y los estilos responsive mínimos.
- [ ] Ejecutar la prueba y confirmar que pasa el contrato estructural.

### Task 2: Lógica de galería

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `script.js`

**Interfaces:**
- Produces: `galleryStep(index, direction, length): number` y controlador `initGalleryModal()`.

- [ ] Añadir casos de prueba para avance y retroceso circular.
- [ ] Ejecutar las pruebas y confirmar el fallo por función ausente.
- [ ] Implementar apertura desde slide, actualización de imagen/contador, flechas, teclado, swipe, cierre exterior y devolución de foco.
- [ ] Ejecutar todas las pruebas y comprobar la sintaxis con `node --check script.js`.

### Task 3: Verificación visual

**Files:**
- Verify: `index.html`, `styles.css`, `script.js`

- [ ] Servir el proyecto localmente y probar apertura, navegación y cierre en 375 y 1440 px.
- [ ] Comprobar consola, desbordamiento horizontal, tamaño de imagen y centrado de ambos iconos del pie.
- [ ] Ejecutar de nuevo la suite completa y la comprobación de recursos locales.
