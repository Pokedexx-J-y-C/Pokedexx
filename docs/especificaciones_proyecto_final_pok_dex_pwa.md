# CLASE APPS MÓVILES - Proyecto Final
## Pokédex PWA: Captura de Pokémon mediante códigos QR
**Especificaciones del proyecto y criterios de evaluación**

> Desarrollo de una aplicación web progresiva con interfaz móvil, consulta de PokéAPI y colección guardada en `localStorage`.

---

## 1. Descripción general

Desarrollar en equipos de 4 una **Progressive Web App (PWA)** con apariencia y experiencia de una aplicación móvil.

La aplicación funcionará como una Pokédex de la primera generación, incluyendo los Pokémon del **#001 Bulbasaur** al **#151 Mew**.

A diferencia de una Pokédex tradicional, los Pokémon no estarán disponibles automáticamente. Para registrar o capturar un Pokémon, el usuario deberá encontrar y escanear un código QR único asociado a ese Pokémon.

Al leer correctamente el código QR, la aplicación deberá consultar la información correspondiente utilizando la **PokéAPI** y permitir registrar al Pokémon como capturado.

Los Pokémon capturados se almacenarán exclusivamente en el dispositivo utilizando `localStorage`.

**La aplicación:**
* No tendrá inicio de sesión.
* No utilizará base de datos.
* No tendrá backend propio.
* No requerirá registrar usuarios.

Toda la colección será local para cada navegador o dispositivo.

---

## 2. Objetivo

Construir una aplicación web móvil que integre los principales temas vistos durante el curso:

* HTML.
* JavaScript.
* Tailwind CSS.
* Diseño responsive.
* Consumo de APIs REST.
* Manejo del DOM.
* Lectura de códigos QR.
* `localStorage`.
* Bottom Navigation Bar.
* Floating Action Button.
* Toast / Snackbar.
* Modal o Bottom Sheet.
* Estados de interfaz.
* Progressive Web Apps.
* Instalación de una aplicación web en un dispositivo.

---

## 3. Tecnologías

El proyecto deberá utilizar principalmente:

### Frontend
* HTML5.
* JavaScript.
* Tailwind CSS.

### Información de Pokémon
* **PokéAPI:** `https://pokeapi.co/api/v2/pokemon/{id}`

### Persistencia
* `localStorage`.

### Lectura QR
Se podrá utilizar alguna biblioteca JavaScript para acceder a la cámara y leer códigos QR. Por ejemplo:
* `html5-qrcode`.
* `ZXing`.
* Otra biblioteca equivalente.

*No será necesario desarrollar manualmente el algoritmo de reconocimiento del código QR.*

---

## 4. Pokémon disponibles

La aplicación solamente utilizará Pokémon pertenecientes a la primera generación. Por lo tanto, los identificadores válidos serán del **1 al 151**.

**Ejemplos:**
* `1` → Bulbasaur
* `4` → Charmander
* `7` → Squirtle
* `25` → Pikachu
* `150` → Mewtwo
* `151` → Mew

---

## 5. Códigos QR

Cada Pokémon tendrá asociado un código QR único. Para simplificar el proyecto, el contenido del QR deberá utilizar el siguiente formato:

```text
pokemon:{id}
```

**Ejemplos:**
* `pokemon:1` representará a Bulbasaur.
* `pokemon:25` representará a Pikachu.
* `pokemon:150` representará a Mewtwo.

**La aplicación deberá validar que:**
* El código comienza con `pokemon:`.
* El identificador sea numérico.
* El identificador esté entre 1 y 151.

*Cualquier QR que no cumpla estas reglas deberá considerarse inválido.*

---

## 6. Flujo de captura

Al presionar el botón de captura:
1. Se abrirá el lector de códigos QR.
2. El usuario permitirá acceso a la cámara.
3. Se escaneará el código QR.
4. La aplicación obtendrá el ID del Pokémon.
5. Se validará que corresponda a un Pokémon entre 1 y 151.
6. Se verificará si el Pokémon ya fue capturado.
7. Se consultará la PokéAPI.
8. Se mostrará la información encontrada.
9. El usuario podrá confirmar la captura.
10. El Pokémon se almacenará en `localStorage`.
11. La interfaz deberá actualizarse inmediatamente.
12. Se mostrará un Toast o Snackbar indicando que el Pokémon fue capturado.

**Ejemplo de notificación:**
> *¡Pikachu fue agregado a tu Pokédex!*

---

## 7. Pantalla principal: Mi Pokédex

La pantalla principal mostrará los Pokémon que el usuario ha capturado. Cada Pokémon deberá mostrarse mediante una tarjeta.

**La tarjeta deberá mostrar al menos:**
* Número del Pokémon.
* Nombre.
* Imagen.
* Tipo o tipos.

**Ejemplo:**
> **#025 Pikachu**  
> Tipo: Electric

Al seleccionar una tarjeta deberá abrirse la pantalla o Bottom Sheet de detalles.

---

## 8. Pokémon no capturados

La aplicación deberá permitir visualizar el progreso respecto a los 151 Pokémon. Una opción recomendada es mostrar los Pokémon no capturados como una silueta o tarjeta bloqueada.

**Ejemplo:**
> **#150**  
> `? Pokémon no descubierto`

Esto permitirá que el usuario conozca cuáles Pokémon todavía necesita encontrar. No deberá mostrarse toda la información de un Pokémon que todavía no haya sido capturado.

---

## 9. Detalle del Pokémon

Cuando el usuario seleccione un Pokémon capturado deberá mostrarse información obtenida desde PokéAPI.

| Como mínimo | Opcionalmente podrán incluir |
| :--- | :--- |
| Número | Estadísticas |
| Nombre | HP |
| Imagen | Ataque |
| Tipo | Defensa |
| Altura | Ataque especial |
| Peso | Defensa especial |
| Habilidades | Velocidad |

El detalle podrá implementarse mediante:
* Una pantalla independiente.
* Un Modal.
* Un Bottom Sheet.

---

## 10. Persistencia con `localStorage`

Los Pokémon capturados deberán guardarse en `localStorage`. No será válido mantener la colección solamente en un arreglo de JavaScript. Al cerrar completamente la aplicación y volver a abrirla, los Pokémon capturados deberán continuar disponibles.

**Una posible estructura es:**

```json
[
  {
    "id": 1,
    "name": "bulbasaur",
    "image": "...",
    "types": ["grass", "poison"],
    "capturedAt": "2026-11-03T18:30:00"
  },
  {
    "id": 25,
    "name": "pikachu",
    "image": "...",
    "types": ["electric"],
    "capturedAt": "2026-11-03T19:15:00"
  }
]
```

**Ejemplo de almacenamiento y recuperación:**

```javascript
// Guardar colección
localStorage.setItem(
  'pokemonCapturados',
  JSON.stringify(pokemonCapturados)
);

// Recuperar colección al iniciar la aplicación
const pokemonCapturados =
  JSON.parse(localStorage.getItem('pokemonCapturados')) || [];
```

---

## 11. Pokémon repetidos

Un mismo Pokémon solamente podrá registrarse una vez. Si el usuario escanea nuevamente el QR de un Pokémon previamente capturado, la aplicación deberá detectarlo.

**Ejemplo:**
> *Pikachu ya se encuentra registrado en tu Pokédex.*

No deberá duplicarse dentro de `localStorage`.

---

## 12. Bottom Navigation Bar

La aplicación deberá utilizar una barra de navegación inferior similar a una aplicación móvil. El diseño puede incluir iconos.

| Vista | Función |
| :--- | :--- |
| **Pokédex** | Muestra la colección de Pokémon. |
| **Progreso** | Muestra estadísticas de la colección. |
| **Acerca de** | Información del proyecto. |

---

## 13. Floating Action Button

La acción principal de la aplicación será capturar Pokémon. Por lo tanto, deberá existir un **Floating Action Button (FAB)** claramente visible (por ejemplo: *Escanear*).

Al presionarlo deberá abrirse el lector QR.

---

## 14. Pantalla de progreso

La aplicación deberá mostrar información sobre el avance del usuario.

**Como mínimo:**
* Pokémon capturados: `37/151`
* Porcentaje completado: `24.5%`

También deberá mostrarse visualmente mediante una barra de progreso (ej. `24%`).

---

## 15. Toast / Snackbar

Las acciones importantes deberán proporcionar retroalimentación visual.

| Situación | Mensaje (Ejemplo) |
| :--- | :--- |
| **Captura correcta** | ¡Pikachu fue agregado a tu Pokédex! |
| **Pokémon repetido** | Este Pokémon ya había sido capturado. |
| **QR inválido** | Este código QR no pertenece a la Pokédex. |
| **Error de conexión** | No fue posible consultar la información del Pokémon. |

---

## 16. Estados de interfaz

La aplicación deberá contemplar diferentes estados:

| Estado | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **Loading** | Mientras se consulta PokéAPI. | *Consultando Pokédex...* |
| **Estado vacío** | Cuando todavía no se ha capturado ningún Pokémon. | *Tu Pokédex está vacía. Escanea tu primer código QR para comenzar tu aventura.* |
| **Error** | Cuando existe un problema con PokéAPI o la conexión. | Mensaje de error amigable. |
| **Contenido** | Cuando existen Pokémon capturados. | Cuadrícula/lista de tarjetas de Pokémon. |

---

## 17. Progressive Web App

El proyecto deberá funcionar como una PWA instalable. Deberá incluir como mínimo:

* `manifest.json`:
  * Nombre de la aplicación.
  * Nombre corto.
  * Iconos.
  * Color principal.
  * Color de fondo.
  * `display: standalone`.
* Service Worker.
* Registro del Service Worker desde JavaScript.

Después de instalarse, la aplicación deberá abrirse como una aplicación independiente y no simplemente como una pestaña tradicional del navegador.

---

## 18. Funcionamiento offline

La interfaz principal de la aplicación deberá poder abrirse aunque no exista conexión a Internet. El Service Worker deberá almacenar los recursos principales de la aplicación, por ejemplo:

* HTML.
* JavaScript.
* CSS.
* Iconos.

No es obligatorio que pueda descubrirse un Pokémon nuevo sin Internet, ya que la información se obtiene desde PokéAPI. Los Pokémon previamente guardados en `localStorage` deberán continuar mostrándose.

---

## 19. Diseño de interfaz

Aunque técnicamente sea una página web, no deberá parecer un sitio web de escritorio reducido. La interfaz deberá diseñarse pensando primero en dispositivos móviles (**Mobile First**).

**Se evaluará:**
* Jerarquía visual.
* Espaciado.
* Tamaño adecuado de controles.
* Botones fáciles de presionar.
* Bottom Navigation.
* FAB.
* Tarjetas.
* Bottom Sheets o Modales.
* Diseño responsive.
* Uso apropiado de Tailwind CSS.

Se recomienda inspirarse en una aplicación Pokédex, pero cada equipo/estudiante deberá desarrollar su propia propuesta visual.

---

## 20. Pantallas mínimas

La aplicación deberá contar como mínimo con las siguientes vistas o estados principales:

| Vista | Propósito |
| :--- | :--- |
| **1. Mi Pokédex** | Colección de Pokémon capturados. |
| **2. Escáner QR** | Acceso a la cámara y lectura del código. |
| **3. Detalle del Pokémon** | Información del Pokémon capturado. |
| **4. Progreso** | Cantidad y porcentaje de Pokémon encontrados. |
| **5. Acerca de** | Información del proyecto y autor(es). |

Estas vistas pueden estar desarrolladas dentro de un solo HTML utilizando JavaScript para cambiar el contenido visible.

---

## 21. Estructura sugerida

Una posible estructura del proyecto será:

```text
pokedex/
├── index.html
├── manifest.json
├── service-worker.js
├── js/
│   └── app.js
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── assets/
```

También podrá realizarse utilizando una estructura diferente siempre que esté correctamente organizada.

---

## 22. Requerimientos funcionales

La aplicación deberá permitir:
* Consultar Pokémon de la primera generación.
* Leer códigos QR utilizando la cámara.
* Validar el formato del código QR.
* Obtener el identificador del Pokémon.
* Consultar PokéAPI.
* Mostrar la información obtenida.
* Registrar Pokémon como capturados.
* Evitar Pokémon duplicados.
* Guardar las capturas en `localStorage`.
* Recuperar las capturas al abrir nuevamente la aplicación.
* Mostrar la colección de Pokémon.
* Consultar el detalle de un Pokémon.
* Mostrar el progreso sobre 151 Pokémon.
* Mostrar mensajes mediante Toast o Snackbar.
* Mostrar estados de carga, vacío, error y contenido.
* Navegar utilizando una Bottom Navigation Bar.
* Iniciar la captura utilizando un FAB.
* Instalar la aplicación como PWA.
* Abrir la interfaz principal sin conexión.
* Mantener la colección después de cerrar la aplicación.
* La interfaz de usuario deberá ser lo más parecido a una Pokédex.

---

## 23. Restricciones

Para este proyecto:
* No deberá utilizarse una base de datos.
* No se desarrollará un backend.
* No habrá registro de usuarios.
* No habrá inicio de sesión.
* No será necesario sincronizar información entre dispositivos.
* Toda la información capturada será local.
* Al borrar los datos del navegador se perderá la colección.
* Solamente podrán capturarse Pokémon con ID entre 1 y 151.

---

## 24. Validaciones mínimas

La aplicación deberá manejar correctamente situaciones como:
* QR que no pertenece a la aplicación.
* Pokémon fuera del rango 1-151.
* Pokémon ya capturado.
* Error en PokéAPI.
* Dispositivo sin conexión.
* Permiso de cámara rechazado.
* Código QR ilegible.
* `localStorage` vacío.

La aplicación no deberá simplemente detenerse o mostrar errores de JavaScript en estos casos.

---

## 25. Experiencia esperada

Una interacción típica deberá ser:
1. El usuario instala la PWA.
2. Abre su Pokédex.
3. Observa: `0 / 151 Pokémon`.
4. Presiona el FAB: **Escanear**.
5. Escanea: `pokemon:25`.
6. La aplicación consulta PokéAPI.
7. Aparece Pikachu con su información.
8. El usuario confirma la captura.
9. Aparece: *¡Pikachu capturado!*
10. La Pokédex ahora muestra: `1 / 151 Pokémon`.
11. El usuario cierra la aplicación.
12. Al volver a abrirla, Pikachu continúa registrado.

---

## 26. Entregables

Cada entrega deberá incluir:

### 1. Código fuente
Proyecto completo y organizado.

### 2. PWA funcional
La aplicación deberá poder instalarse.

### 3. Códigos QR
Un conjunto de códigos QR que permitan probar diferentes Pokémon. Como mínimo deberán entregarse códigos correspondientes a:

| ID | Pokémon | Contenido del QR |
| :--- | :--- | :--- |
| 1 | Bulbasaur | `pokemon:1` |
| 4 | Charmander | `pokemon:4` |
| 7 | Squirtle | `pokemon:7` |
| 25 | Pikachu | `pokemon:25` |
| 39 | Jigglypuff | `pokemon:39` |
| 52 | Meowth | `pokemon:52` |
| 94 | Gengar | `pokemon:94` |
| 133 | Eevee | `pokemon:133` |
| 150 | Mewtwo | `pokemon:150` |
| 151 | Mew | `pokemon:151` |

### 4. `README.md`
Un archivo breve explicando:
1. Nombre del proyecto.
2. Autor(es).
3. Cómo ejecutar la aplicación.
4. Librería utilizada para QR.
5. Cómo instalar la PWA.

---

## 27. Criterios de evaluación

| Criterio | Valor |
| :--- | :---: |
| Diseño móvil utilizando Tailwind y UI inspirada en un Pokédex | 15% |
| Consumo correcto de PokéAPI | 15% |
| Lectura y validación de QR | 15% |
| Persistencia mediante `localStorage` | 15% |
| PWA instalable y Service Worker | 15% |
| Bottom Navigation, FAB, Bottom Sheet/Modal y Toast | 10% |
| Manejo de estados y errores | 10% |
| Organización y calidad del código | 5% |
| **Total** | **100%** |

---

## 28. Consideraciones importantes

No se evaluará únicamente que la aplicación "funcione". El proyecto deberá demostrar que el estudiante comprende cómo combinar diferentes componentes de una aplicación web móvil:

> **Interfaz + eventos + API + QR + almacenamiento local + PWA**

El código JavaScript deberá ser entendible y estar organizado en funciones. Se recomienda evitar colocar toda la lógica dentro de un único evento. Por ejemplo:

```javascript
leerQR();
buscarPokemon(id);
guardarPokemon(pokemon);
renderizarPokedex();
actualizarProgreso();
mostrarToast(mensaje);
```

La aplicación deberá sentirse como un pequeño producto terminado y no solamente como una colección de ejercicios independientes.

---

## 29. Resultado final esperado

Al terminar el proyecto, cada estudiante deberá tener una Pokédex instalable en su teléfono o computadora, capaz de utilizar la cámara para descubrir Pokémon mediante códigos QR y conservar localmente su colección.

El objetivo final será intentar completar:
> **151/151 Pokémon capturados.**

---

## 30. Entrega

La entrega será vía **GitHub**; se deberá añadir como colaborador al usuario **`emilianolopezn`**.

* **Primera entrega:** Viernes 13 de octubre *(Alcance: al menos la parte visual, sin funcionalidad y con elementos estáticos)*.
* **Entrega final:** Día del examen final *(por anunciar)*.