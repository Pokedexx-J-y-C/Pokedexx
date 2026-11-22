# Plan de mejoras — Pokédexx PWA

Documento de trabajo para retomar el proyecto en cualquier sesión o equipo.

## Estado de la implementación

- Repositorio reubicado en `C:\Users\Usuario\Documents\ESCUELA\Pokedex`.
- `main` y el tag `v1.0-entrega-anterior` conservan la versión previa (commit `0c7405a`).
- Fases 1 a 8 implementadas en la rama `feature/pwa-mejoras`.
- Fecha de implementación: 2026-11-21.

### Resumen de cambios

- `service_worker.js` reescrito con precache del shell y del CDN fijado, caché de PokéAPI,
  imágenes y códigos QR (se conserva el nombre para actualizar instalaciones existentes).
- `manifest.json` completo, con iconos PNG (`any` y `maskable`) y `apple-touch-icon`.
- `index.html` con metadatos PWA, banner offline, estado vacío, estados de carga y error,
  modal accesible y botón de instalación.
- `app.js` organizado por funciones: almacenamiento seguro, API con timeout y caché,
  renderizado accesible de 151 tarjetas, progreso unificado, escáner con reanudación,
  toasts tipados e instalación.
- `assets/qr/` con los 10 códigos obligatorios, verificados con un decodificador.
- README actualizado; `docs/` conserva las especificaciones y este plan.

## Contexto

- Repositorio: `https://github.com/Pokedexx-J-y-C/Pokedexx`
- Aplicación publicada: `https://pokedexx-j-y-c.github.io/Pokedexx/`
- Rama de trabajo: `feature/pwa-mejoras`
- Respaldo de la versión anterior: tag `v1.0-entrega-anterior`
- Especificaciones: `docs/especificaciones_proyecto_final_pok_dex_pwa.md`
- Stack: HTML5, JavaScript, Tailwind CSS (CDN), `html5-qrcode`, PokéAPI y `localStorage`.
- Sin backend, sin base de datos, sin login (según especificaciones).

## Estado inicial del repositorio

La versión `v1.0-entrega-anterior` ya cumple:

- Navegación inferior con tres vistas (Pokédex, Progreso, Acerca de).
- Botón flotante (FAB) que abre la vista del escáner.
- 151 espacios generados, con los no capturados bloqueados.
- Colección persistida en `localStorage` y detección de duplicados.
- Validación de QR con formato `pokemon:{id}` y rango 1–151.
- Consumo de PokéAPI con tipos, habilidades, altura y peso.
- Modal de detalle de Pokémon capturados.
- Service Worker registrado y manifest instalable.
- Toasts básicos y README con autores y códigos QR externos.

## Objetivo

Cerrar las brechas frente a las especificaciones académicas sin romper lo ya logrado,
priorizando los criterios de evaluación:

1. Diseño móvil con Tailwind e interfaz tipo Pokédex.
2. Consumo correcto de PokéAPI.
3. Lectura y validación de QR.
4. Persistencia con `localStorage`.
5. PWA instalable y Service Worker.
6. Bottom Navigation, FAB, modal y toasts.
7. Manejo de estados y errores.
8. Organización y calidad del código.

## Brechas detectadas

Prioridad alta:

- Offline parcial: el Service Worker no cachea Tailwind, `html5-qrcode` ni PokéAPI;
  sin red la interfaz pierde estilos y el detalle de Pokémon capturados.
- `localStorage` sin protección: un JSON corrupto rompe la aplicación.
- Falta el estado vacío obligatorio cuando no hay Pokémon capturados.
- Estados de carga y error solo mediante toast, sin estado inline ni reintento.
- La detección de duplicados ocurre después de consultar PokéAPI.
- El escáner no se reanuda automáticamente tras un QR inválido o duplicado.
- El FAB navega a la vista del escáner pero no inicia la cámara.
- Iconos solo en SVG; faltan PNG 192/512 para instalación y compatibilidad iOS.

Prioridad media:

- Toast sin `aria-live`, sin variantes y sin cola.
- Modal sin `aria-modal` ni gestión de foco.
- Tarjetas capturadas no accesibles por teclado.
- `capturedAt` se registra al escanear en lugar de al confirmar.
- Códigos QR del README dependen de un servicio externo.
- Faltan banner offline, botón de instalación y `.gitignore`.

Prioridad baja:

- Vista previa obsoleta tras un QR inválido.
- La cámara no se detiene al ocultar la pestaña.
- Posible doble registro por doble pulsación en "Capturar".

## Fases

1. PWA y offline real: precache del shell, CDN con versión fija, runtime cache de
   PokéAPI e imágenes, manifest completo, iconos PNG y banner de conexión.
2. Capa de datos: wrapper seguro de `localStorage`, caché de detalle, timeout con
   `AbortController` y `capturedAt` al confirmar.
3. Colección: estado vacío, tarjetas accesibles, imágenes perezosas con `alt`.
4. Escáner: verificación de duplicado antes del fetch, reanudación automática,
   estados de carga y error, FAB que inicia la cámara, limpieza de la vista previa.
5. Feedback: toasts con tipos y `aria-live`, botón de confirmación protegido,
   accesibilidad del modal.
6. Progreso: una sola función de actualización, porcentaje con un decimal.
7. Pulido: foco visible, safe areas, banner offline y botón de instalación.
8. Entregables: README actualizado, códigos QR locales en `assets/qr/`, `.gitignore`
   e instrucciones de publicación en GitHub Pages.

## Verificación

Matriz manual mínima:

- Cámara disponible y permiso denegado.
- QR válido, inválido, fuera de rango y Pokémon duplicado.
- Funcionamiento sin red y con la colección previamente guardada.
- `localStorage` vacío y `localStorage` corrupto.
- Progreso de 0 a 151 y porcentaje correcto.
- Recarga de la aplicación conservando la colección.
- Instalación como PWA y apertura offline del shell.
- Consola sin errores.

### Resultados automatizados (2026-11-21)

- Navegador headless: 151 tarjetas renderizadas, estado vacío visible con 0 capturados.
- Colección de prueba con duplicado y fuera de rango: normalizada a 1 Pokémon (`1 / 151`, `0.7%`).
- `localStorage` corrupto: la aplicación carga sin errores y muestra el estado vacío.
- Modo offline: shell, estilos y colección se muestran correctamente.
- Service Worker registrado y caché `pokedexx-v4-shell` creada.
- 10 códigos QR locales decodificados correctamente con `jsqr`.
- Consola sin errores en todos los escenarios.

## Notas

- `localStorage` es propio de cada origen: la colección de `localhost` no se traslada
  a GitHub Pages ni viceversa.
- La cámara y la instalación requieren HTTPS o `localhost`; para pruebas en teléfono
  se recomienda GitHub Pages.
- La aplicación no permite capturar Pokémon sin conexión: PokéAPI es obligatoria para
  obtener la información, tal como permite la especificación.
