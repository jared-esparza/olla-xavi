# Botón de flyers en pollos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir un botón «Ver flyers» a la promoción de pollos con el pictograma local y el enlace definitivo.

**Architecture:** La acción se incorpora al HTML estático dentro de `.chicken-actions`. CSS organiza las tres acciones en dos columnas en escritorio y una en móvil; no se modifica JavaScript.

**Tech Stack:** HTML5, CSS y pruebas Node.js con `node:test`.

## Global Constraints

- Usar `img/icons/picto_flyers.png` sin modificarlo.
- Enlazar en la misma pestaña a `https://sites.google.com/view/menudiario-llolladenxavi/inicio/flyers`.
- Mantener intactos la fotografía, textos, sello y comportamientos existentes.
- No añadir dependencias.

---

### Task 1: Añadir la acción de flyers

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `img/icons/picto_flyers.png`, 244 × 254 RGBA.
- Produces: enlace estático `.chicken-flyers` dentro de `.chicken-actions`.

- [ ] **Step 1: Write the failing test**

Añadir una prueba que compruebe el enlace exacto, texto «Ver flyers», ausencia de `target="_blank"`, pictograma decorativo con dimensiones y reglas responsive de dos y una columnas.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/site.test.mjs`

Expected: FAIL porque `.chicken-flyers` todavía no existe.

- [ ] **Step 3: Write minimal implementation**

Añadir después del botón de llamada:

```html
<a class="button chicken-flyers" href="https://sites.google.com/view/menudiario-llolladenxavi/inicio/flyers">
  <img src="img/icons/picto_flyers.png" alt="" width="244" height="254"> Ver flyers <span aria-hidden="true">→</span>
</a>
```

Cambiar `.chicken-actions` a una cuadrícula `max-content max-content`, colocar `.chicken-flyers` en la primera columna y conservar una columna bajo `560px`.

- [ ] **Step 4: Run verification**

Run: `node --test tests/site.test.mjs`

Run: `node --check script.js`

Expected: todas las pruebas y comprobaciones pasan.

- [ ] **Step 5: Visual verification**

Revisar 375, 768, 1024 y 1440 px, comprobando ausencia de desbordamiento y la disposición 2+1 en escritorio / 1+1+1 en móvil.

No se incluye commit porque el directorio contiene cambios previos sin confirmar y el usuario no ha solicitado modificar el historial.
