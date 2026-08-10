# Botón de flyers en la promoción de pollos

## Objetivo

Añadir un acceso a los flyers dentro del bloque promocional de pollos a l’ast, siguiendo la composición visual aportada.

## Diseño aprobado

- Añadir después de las acciones de WhatsApp y llamada un botón amarillo «Ver flyers» con flecha.
- Usar `img/icons/picto_flyers.png` como pictograma decorativo, con `alt=""` y dimensiones intrínsecas declaradas de 244 × 254.
- Enlazar en la misma pestaña a `https://sites.google.com/view/menudiario-llolladenxavi/inicio/flyers`.
- Organizar las acciones en dos columnas: WhatsApp y llamada en la primera fila; Flyers en la primera columna de la segunda fila.
- Por debajo de 560 px, mostrar los tres botones en una sola columna y a ancho completo.
- Mantener intactos la fotografía, los textos, el sello y los comportamientos JavaScript existentes.

## Verificación

- Comprobar el destino, texto, pictograma, dimensiones y ausencia de `target="_blank"`.
- Revisar el bloque a 375, 768, 1024 y 1440 px sin desbordamiento.
- Ejecutar las pruebas existentes y validar `script.js`.
