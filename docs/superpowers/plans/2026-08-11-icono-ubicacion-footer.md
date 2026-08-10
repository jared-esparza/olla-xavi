# Footer Location Icon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sustituir el punto del enlace de ubicación del pie por un pin SVG amarillo y accesible.

**Architecture:** El icono se integra directamente en el HTML para evitar recursos y dependencias adicionales. Una clase CSS específica controla tamaño, color y alineación sin afectar a los iconos de teléfono y correo.

**Tech Stack:** HTML5, CSS, Node.js Test Runner.

## Global Constraints

- Mantener intactos el destino de Google Maps y el texto de la dirección.
- Usar un SVG inline decorativo con `aria-hidden="true"` y `focusable="false"`.
- No añadir JavaScript ni dependencias.

---

### Task 1: Pin de ubicación en el pie

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: enlace de ubicación existente en `.footer-contact`.
- Produces: `.footer-location-icon`, un SVG decorativo dentro del enlace.

- [ ] **Step 1: Write the failing test**

Añadir una prueba que recorte el pie y exija el SVG con su clase, atributos accesibles y elementos `path`/`circle`, además de verificar que ya no exista el punto anterior.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/site.test.mjs`
Expected: FAIL porque `.footer-location-icon` todavía no existe.

- [ ] **Step 3: Write minimal implementation**

Reemplazar el carácter por un SVG de pin con `viewBox="0 0 24 24"` y añadir reglas de tamaño, color y `flex-shrink` para `.footer-location-icon`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/site.test.mjs`
Expected: PASS.

- [ ] **Step 5: Verify JavaScript syntax**

Run: `node --check script.js`
Expected: salida vacía y código 0.

