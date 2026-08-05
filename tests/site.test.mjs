import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const root = resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);

test('la landing publica el contenido y los enlaces acordados', async () => {
  const htmlPath = resolve(root, 'index.html');
  const cssPath = resolve(root, 'styles.css');
  const jsPath = resolve(root, 'script.js');

  assert.ok(existsSync(htmlPath), 'falta index.html');
  assert.ok(existsSync(cssPath), 'falta styles.css');
  assert.ok(existsSync(jsPath), 'falta script.js');

  const html = readFileSync(htmlPath, 'utf8');
  const css = readFileSync(cssPath, 'utf8');

  for (const label of ['Menú diario', 'Carta', 'Frankfurts y hamburguesas', 'Galletas']) {
    assert.match(html, new RegExp(label, 'i'), `falta el acceso ${label}`);
  }

  assert.equal((html.match(/data-site-link/g) ?? []).length, 8, 'debe haber cuatro enlaces en navegación y cuatro tarjetas');
  assert.match(html, /646\s*987\s*656/);
  assert.match(html, /info@lolladenxavi\.com/);
  assert.match(html, /@lolla_den_xavi/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /<body id="inicio">/, 'el destino Inicio debe estar en la parte superior del documento');
  assert.doesNotMatch(html, /<header[^>]*id="inicio"/, 'una cabecera sticky no puede ser el destino Inicio');
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);

  const site = require(jsPath);
  assert.equal(site.wrapIndex(-1, 7), 6);
  assert.equal(site.wrapIndex(7, 7), 0);
  assert.equal(site.wrapIndex(3, 7), 3);
  assert.equal(site.visibleSlidesForWidth(375), 1);
  assert.equal(site.visibleSlidesForWidth(768), 2);
  assert.equal(site.visibleSlidesForWidth(1440), 5);
});

test('el JavaScript funciona al abrir index.html directamente', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /<script[^>]+type="module"/i, 'file:// bloquea los módulos locales');
  assert.match(html, /src="script\.js\?v=4"/, 'el navegador debe solicitar la versión corregida del script');

  assert.doesNotThrow(() => require(resolve(root, 'script.js')));
});

test('los botones sociales utilizan iconos locales de marca', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const instagram = resolve(root, 'img', 'icons', 'instagram.svg');
  const whatsapp = resolve(root, 'img', 'icons', 'whatsapp.svg');

  assert.ok(existsSync(instagram), 'falta el icono local de Instagram');
  assert.ok(existsSync(whatsapp), 'falta el icono local de WhatsApp');
  assert.equal((html.match(/img\/icons\/instagram\.svg/g) ?? []).length, 3);
  assert.equal((html.match(/img\/icons\/whatsapp\.svg/g) ?? []).length, 3);
});

test('el modal de galería ofrece controles accesibles', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const css = readFileSync(resolve(root, 'styles.css'), 'utf8');

  assert.match(html, /<dialog[^>]+id="gallery-modal"[^>]+aria-labelledby="gallery-modal-title"/i);
  assert.match(html, /data-gallery-image/);
  assert.doesNotMatch(html, /<img[^>]+src=""/i, 'el visor no debe solicitar una fuente vacía');
  assert.match(html, /data-gallery-counter/);
  assert.match(html, /aria-label="Cerrar galería"/);
  assert.match(html, /aria-label="Imagen anterior"/);
  assert.match(html, /aria-label="Imagen siguiente"/);
  assert.match(css, /\.footer-socials\s+a\s*\{[^}]*display:\s*grid;[^}]*place-items:\s*center;/s);
  assert.match(css, /\.gallery-modal-panel\s*\{[^}]*width:\s*min\(/s, 'el panel debe dejar una zona exterior clicable');
});

test('la navegación del modal es circular', () => {
  const site = require(resolve(root, 'script.js'));
  assert.equal(site.galleryStep(0, -1, 9), 8);
  assert.equal(site.galleryStep(8, 1, 9), 0);
  assert.equal(site.galleryStep(3, 1, 9), 4);
  assert.equal(site.galleryKeyAction('ArrowLeft'), -1);
  assert.equal(site.galleryKeyAction('ArrowRight'), 1);
  assert.equal(site.galleryKeyAction('Escape'), 'close');
});

test('promociona los pollos a l’ast los domingos y corrige el horario', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const quickLinksIndex = html.indexOf('<section class="quick-links"');
  const promoIndex = html.indexOf('id="pollos-domingo"');
  const galleryIndex = html.indexOf('<section class="gallery-section"');

  assert.ok(promoIndex > quickLinksIndex, 'la promoción debe aparecer después de los cuatro accesos');
  assert.ok(promoIndex < galleryIndex, 'la promoción debe aparecer antes de la galería');
  assert.match(html, /Especial de los domingos/);
  assert.match(html, /Pollos\s*<span>a l’ast<\/span>/);
  assert.match(html, /Recogida de 12:00 a 15:00/);
  assert.match(html, /img\/webp\/Pollo_a_last\.webp/);
  assert.match(html, /https:\/\/wa\.me\/34646987656\?text=Hola%2C%20quiero%20encargar%20pollo%20a%20l%27ast%20para%20este%20domingo/);
  assert.match(html, /href="tel:\+34646987656"/);
  assert.doesNotMatch(html, /solo pollo asado/i);
  assert.match(html, /Domingo<br>\s*9:00\s*–\s*15:30 h/);
});

test('utiliza el logotipo local como favicon', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const faviconPath = resolve(root, 'img', 'Logo negro contorno blanco grueso l_olla_d_en_xavi.png');
  const faviconLinks = html.match(/<link[^>]+rel="icon"[^>]*>/gi) ?? [];

  assert.equal(faviconLinks.length, 1, 'debe existir una única declaración de favicon');
  assert.match(faviconLinks[0], /type="image\/png"/i);
  assert.match(faviconLinks[0], /href="img\/Logo negro contorno blanco grueso l_olla_d_en_xavi\.png"/i);
  assert.ok(existsSync(faviconPath), 'falta el archivo local usado como favicon');
});
