# Favicon de L’olla d’en Xavi

## Objetivo

Mostrar el logotipo de L’olla d’en Xavi como icono de la pestaña del navegador.

## Diseño aprobado

- Reutilizar `img/Logo negro contorno blanco grueso l_olla_d_en_xavi.png` sin modificarlo.
- Añadir en el `<head>` de `index.html` una referencia `rel="icon"` con tipo `image/png`.
- No generar imágenes nuevas ni cambiar elementos visibles de la página.

## Verificación

- Confirmar que el archivo referenciado existe.
- Comprobar que `index.html` contiene exactamente una declaración de favicon válida.
- Ejecutar las pruebas existentes para evitar regresiones.
