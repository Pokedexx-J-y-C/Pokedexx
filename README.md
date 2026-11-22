# Pokedexx

**Autores:**
- Carolina Islas Iturriaga
- Jorge Cervantes Valdez

---

## Descripción del proyecto

**Pokedexx** es una aplicación web progresiva (PWA) inspirada en una Pokédex, que permite descubrir y capturar Pokémon de la primera generación, desde el número `#001` hasta el `#151`, mediante el escaneo de códigos QR.

Al escanear un código QR válido, la aplicación obtiene la información del Pokémon utilizando **PokéAPI**, muestra sus datos y permite al usuario confirmar su captura. Los Pokémon capturados se almacenan localmente en el navegador mediante `localStorage`, permitiendo conservar la colección sin necesidad de crear una cuenta o utilizar una base de datos.

---

## Tecnologías utilizadas

- **HTML5**
- **JavaScript (ES6+)**
- **Tailwind CSS**
- **PokéAPI** (`https://pokeapi.co/api/v2/pokemon/{id}`)
- **HTML5-QRCode (`html5-qrcode`)**
- **LocalStorage**
- **Progressive Web App (PWA)** (`manifest.json` + `service-worker.js`)

---

## Funcionalidades

- Visualización de los 151 Pokémon de la primera generación.
- Pokémon no capturados representados mediante tarjetas bloqueadas.
- Escaneo de códigos QR mediante la cámara del dispositivo.
- Validación de códigos QR y de identificadores entre `1` y `151`.
- Consulta de información de Pokémon mediante PokéAPI.
- Captura de Pokémon mediante confirmación del usuario.
- Guardado local de Pokémon capturados mediante `localStorage`.
- Prevención de capturas duplicadas.
- Buscador por nombre o número.
- Visualización de detalles de cada Pokémon capturado (número, imagen, tipos, habilidades, altura y peso).
- Seguimiento del progreso de captura con barra y porcentaje.
- Notificaciones Toast para retroalimentación al usuario.
- Navegación entre las vistas de **Pokédex**, **Progreso** y **Acerca de**.
- Instalación como aplicación mediante PWA y funcionamiento offline de la interfaz.
- Estados de interfaz: vacío, carga, error y contenido.
- Recuperación segura ante datos corruptos en `localStorage`.
- Reapertura automática del escáner tras un QR inválido o un Pokémon duplicado.
- Verificación de duplicados y de rango antes de consultar PokéAPI.
- Botón de instalación en **Acerca de** y aviso de conexión offline.
- Interfaz accesible: navegación por teclado, foco visible y regiones `aria-live`.
- Caché offline del shell, Tailwind, `html5-qrcode`, imágenes y datos de PokéAPI ya consultados.

---

## Cómo ejecutar la aplicación

El Service Worker y la cámara requieren `localhost` o HTTPS; abrir `index.html` directamente con `file://` deshabilita la PWA y el escáner.

1. Clonar el repositorio.
2. Servir la carpeta con un servidor local:
   - `python -m http.server 8000`
   - o `npx serve .`
   - o la extensión **Live Server** de Visual Studio Code.
3. Abrir `http://localhost:8000`.

> **Nota:** Para probar la cámara y la instalación en un teléfono se requiere HTTPS. La opción más simple es publicar el proyecto en **GitHub Pages**.

### Publicación en GitHub Pages

1. En el repositorio, entrar a **Settings → Pages**.
2. En **Source**, elegir **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
3. Guardar y abrir la URL HTTPS publicada.

> La colección de `localStorage` pertenece a cada origen: no se comparte entre `localhost` y GitHub Pages.

---

## Instalación de la PWA

- **Android / Chrome / Edge:** pulsar el botón **Instalar aplicación** en *Acerca de* o usar el menú del navegador → **Instalar aplicación**.
- **iPhone / iPad (Safari):** botón **Compartir** → **Añadir a pantalla de inicio**.
- La aplicación se abre en modo `standalone`, sin la barra del navegador.

---

## Librería utilizada para QR

Se utilizó **`html5-qrcode`**, una librería de JavaScript que permite acceder a la cámara del dispositivo y detectar códigos QR en tiempo real para extraer el identificador del Pokémon (`pokemon:{id}`) y consultar su información en la API.

---

## API utilizada

Se utiliza **PokéAPI** para obtener información de los Pokémon de la primera generación:

```text
https://pokeapi.co/api/v2/pokemon/{id}
```

---

## Estructura del proyecto

```text
pokedex/
├── index.html
├── app.js
├── service-worker.js
├── manifest.json
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── maskable-512.png
│   ├── apple-touch-icon-180.png
│   └── pokedex.svg
├── assets/
│   └── qr/
│       └── pokemon-001.png ... pokemon-151.png
├── docs/
│   ├── especificaciones_proyecto_final_pok_dex_pwa.md
│   └── PLAN-MEJORAS.md
└── README.md
```

---

## Códigos QR de Prueba

Los códigos obligatorios están incluidos como imágenes PNG en `assets/qr/` y no dependen de servicios externos:

| #001 Bulbasaur (`pokemon:1`) | #004 Charmander (`pokemon:4`) | #007 Squirtle (`pokemon:7`) | #025 Pikachu (`pokemon:25`) | #039 Jigglypuff (`pokemon:39`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR Bulbasaur](assets/qr/pokemon-001.png) | ![QR Charmander](assets/qr/pokemon-004.png) | ![QR Squirtle](assets/qr/pokemon-007.png) | ![QR Pikachu](assets/qr/pokemon-025.png) | ![QR Jigglypuff](assets/qr/pokemon-039.png) |

| #052 Meowth (`pokemon:52`) | #094 Gengar (`pokemon:94`) | #133 Eevee (`pokemon:133`) | #150 Mewtwo (`pokemon:150`) | #151 Mew (`pokemon:151`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR Meowth](assets/qr/pokemon-052.png) | ![QR Gengar](assets/qr/pokemon-094.png) | ![QR Eevee](assets/qr/pokemon-133.png) | ![QR Mewtwo](assets/qr/pokemon-150.png) | ![QR Mew](assets/qr/pokemon-151.png) |



## Códigos QR - Pokédex Completa (001 al 151)

Escanea cualquiera de los 151 códigos QR desde la aplicación para registrar al Pokémon en tu colección.

> Las imágenes de esta sección se generan con un servicio externo (`api.qrserver.com`). El paquete obligatorio, sin dependencia de red, está en `assets/qr/`.

| #001 Bulbasaur (`pokemon:1`) | #002 Ivysaur (`pokemon:2`) | #003 Venusaur (`pokemon:3`) | #004 Charmander (`pokemon:4`) | #005 Charmeleon (`pokemon:5`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 001](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:1) | ![QR 002](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:2) | ![QR 003](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:3) | ![QR 004](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:4) | ![QR 005](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:5) |

| #006 Charizard (`pokemon:6`) | #007 Squirtle (`pokemon:7`) | #008 Wartortle (`pokemon:8`) | #009 Blastoise (`pokemon:9`) | #010 Caterpie (`pokemon:10`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 006](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:6) | ![QR 007](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:7) | ![QR 008](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:8) | ![QR 009](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:9) | ![QR 010](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:10) |

| #011 Metapod (`pokemon:11`) | #012 Butterfree (`pokemon:12`) | #013 Weedle (`pokemon:13`) | #014 Kakuna (`pokemon:14`) | #015 Beedrill (`pokemon:15`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 011](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:11) | ![QR 012](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:12) | ![QR 013](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:13) | ![QR 014](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:14) | ![QR 015](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:15) |

| #016 Pidgey (`pokemon:16`) | #017 Pidgeotto (`pokemon:17`) | #018 Pidgeot (`pokemon:18`) | #019 Rattata (`pokemon:19`) | #020 Raticate (`pokemon:20`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 016](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:16) | ![QR 017](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:17) | ![QR 018](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:18) | ![QR 019](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:19) | ![QR 020](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:20) |

| #021 Spearow (`pokemon:21`) | #022 Fearow (`pokemon:22`) | #023 Ekans (`pokemon:23`) | #024 Arbok (`pokemon:24`) | #025 Pikachu (`pokemon:25`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 021](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:21) | ![QR 022](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:22) | ![QR 023](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:23) | ![QR 024](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:24) | ![QR 025](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:25) |

| #026 Raichu (`pokemon:26`) | #027 Sandshrew (`pokemon:27`) | #028 Sandslash (`pokemon:28`) | #029 Nidoran♀ (`pokemon:29`) | #030 Nidorina (`pokemon:30`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 026](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:26) | ![QR 027](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:27) | ![QR 028](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:28) | ![QR 029](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:29) | ![QR 030](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:30) |

| #031 Nidoqueen (`pokemon:31`) | #032 Nidoran♂ (`pokemon:32`) | #033 Nidorino (`pokemon:33`) | #034 Nidoking (`pokemon:34`) | #035 Clefairy (`pokemon:35`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 031](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:31) | ![QR 032](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:32) | ![QR 033](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:33) | ![QR 034](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:34) | ![QR 035](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:35) |

| #036 Clefable (`pokemon:36`) | #037 Vulpix (`pokemon:37`) | #038 Ninetales (`pokemon:38`) | #039 Jigglypuff (`pokemon:39`) | #040 Wigglytuff (`pokemon:40`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 036](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:36) | ![QR 037](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:37) | ![QR 038](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:38) | ![QR 039](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:39) | ![QR 040](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:40) |

| #041 Zubat (`pokemon:41`) | #042 Golbat (`pokemon:42`) | #043 Oddish (`pokemon:43`) | #044 Gloom (`pokemon:44`) | #045 Vileplume (`pokemon:45`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 041](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:41) | ![QR 042](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:42) | ![QR 043](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:43) | ![QR 044](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:44) | ![QR 045](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:45) |

| #046 Paras (`pokemon:46`) | #047 Parasect (`pokemon:47`) | #048 Venonat (`pokemon:48`) | #049 Venomoth (`pokemon:49`) | #050 Diglett (`pokemon:50`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 046](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:46) | ![QR 047](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:47) | ![QR 048](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:48) | ![QR 049](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:49) | ![QR 050](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:50) |

| #051 Dugtrio (`pokemon:51`) | #052 Meowth (`pokemon:52`) | #053 Persian (`pokemon:53`) | #054 Psyduck (`pokemon:54`) | #055 Golduck (`pokemon:55`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 051](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:51) | ![QR 052](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:52) | ![QR 053](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:53) | ![QR 054](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:54) | ![QR 055](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:55) |

| #056 Mankey (`pokemon:56`) | #057 Primeape (`pokemon:57`) | #058 Growlithe (`pokemon:58`) | #059 Arcanine (`pokemon:59`) | #060 Poliwag (`pokemon:60`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 056](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:56) | ![QR 057](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:57) | ![QR 058](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:58) | ![QR 059](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:59) | ![QR 060](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:60) |

| #061 Poliwhirl (`pokemon:61`) | #062 Poliwrath (`pokemon:62`) | #063 Abra (`pokemon:63`) | #064 Kadabra (`pokemon:64`) | #065 Alakazam (`pokemon:65`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 061](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:61) | ![QR 062](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:62) | ![QR 063](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:63) | ![QR 064](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:64) | ![QR 065](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:65) |

| #066 Machop (`pokemon:66`) | #067 Machoke (`pokemon:67`) | #068 Machamp (`pokemon:68`) | #069 Bellsprout (`pokemon:69`) | #070 Weepinbell (`pokemon:70`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 066](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:66) | ![QR 067](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:67) | ![QR 068](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:68) | ![QR 069](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:69) | ![QR 070](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:70) |

| #071 Victreebel (`pokemon:71`) | #072 Tentacool (`pokemon:72`) | #073 Tentacruel (`pokemon:73`) | #074 Geodude (`pokemon:74`) | #075 Graveler (`pokemon:75`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 071](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:71) | ![QR 072](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:72) | ![QR 073](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:73) | ![QR 074](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:74) | ![QR 075](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:75) |

| #076 Golem (`pokemon:76`) | #077 Ponyta (`pokemon:77`) | #078 Rapidash (`pokemon:78`) | #079 Slowpoke (`pokemon:79`) | #080 Slowbro (`pokemon:80`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 076](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:76) | ![QR 077](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:77) | ![QR 078](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:78) | ![QR 079](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:79) | ![QR 080](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:80) |

| #081 Magnemite (`pokemon:81`) | #082 Magneton (`pokemon:82`) | #083 Farfetch'd (`pokemon:83`) | #084 Doduo (`pokemon:84`) | #085 Dodrio (`pokemon:85`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 081](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:81) | ![QR 082](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:82) | ![QR 083](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:83) | ![QR 084](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:84) | ![QR 085](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:85) |

| #086 Seel (`pokemon:86`) | #087 Dewgong (`pokemon:87`) | #088 Grimer (`pokemon:88`) | #089 Muk (`pokemon:89`) | #090 Shellder (`pokemon:90`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 086](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:86) | ![QR 087](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:87) | ![QR 088](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:88) | ![QR 089](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:89) | ![QR 090](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:90) |

| #091 Cloyster (`pokemon:91`) | #092 Gastly (`pokemon:92`) | #093 Haunter (`pokemon:93`) | #094 Gengar (`pokemon:94`) | #095 Onix (`pokemon:95`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 091](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:91) | ![QR 092](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:92) | ![QR 093](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:93) | ![QR 094](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:94) | ![QR 095](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:95) |

| #096 Drowzee (`pokemon:96`) | #097 Hypno (`pokemon:97`) | #098 Krabby (`pokemon:98`) | #099 Kingler (`pokemon:99`) | #100 Voltorb (`pokemon:100`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 096](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:96) | ![QR 097](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:97) | ![QR 098](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:98) | ![QR 099](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:99) | ![QR 100](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:100) |

| #101 Electrode (`pokemon:101`) | #102 Exeggcute (`pokemon:102`) | #103 Exeggutor (`pokemon:103`) | #104 Cubone (`pokemon:104`) | #105 Marowak (`pokemon:105`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 101](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:101) | ![QR 102](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:102) | ![QR 103](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:103) | ![QR 104](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:104) | ![QR 105](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:105) |

| #106 Hitmonlee (`pokemon:106`) | #107 Hitmonchan (`pokemon:107`) | #108 Lickitung (`pokemon:108`) | #109 Koffing (`pokemon:109`) | #110 Weezing (`pokemon:110`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 106](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:106) | ![QR 107](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:107) | ![QR 108](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:108) | ![QR 109](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:109) | ![QR 110](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:110) |

| #111 Rhyhorn (`pokemon:111`) | #112 Rhydon (`pokemon:112`) | #113 Chansey (`pokemon:113`) | #114 Tangela (`pokemon:114`) | #115 Kangaskhan (`pokemon:115`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 111](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:111) | ![QR 112](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:112) | ![QR 113](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:113) | ![QR 114](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:114) | ![QR 115](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:115) |

| #116 Horsea (`pokemon:116`) | #117 Seadra (`pokemon:117`) | #118 Goldeen (`pokemon:118`) | #119 Seaking (`pokemon:119`) | #120 Staryu (`pokemon:120`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 116](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:116) | ![QR 117](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:117) | ![QR 118](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:118) | ![QR 119](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:119) | ![QR 120](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:120) |

| #121 Starmie (`pokemon:121`) | #122 Mr. Mime (`pokemon:122`) | #123 Scyther (`pokemon:123`) | #124 Jynx (`pokemon:124`) | #125 Electabuzz (`pokemon:125`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 121](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:121) | ![QR 122](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:122) | ![QR 123](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:123) | ![QR 124](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:124) | ![QR 125](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:125) |

| #126 Magmar (`pokemon:126`) | #127 Pinsir (`pokemon:127`) | #128 Tauros (`pokemon:128`) | #129 Magikarp (`pokemon:129`) | #130 Gyarados (`pokemon:130`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 126](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:126) | ![QR 127](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:127) | ![QR 128](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:128) | ![QR 129](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:129) | ![QR 130](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:130) |

| #131 Lapras (`pokemon:131`) | #132 Ditto (`pokemon:132`) | #133 Eevee (`pokemon:133`) | #134 Vaporeon (`pokemon:134`) | #135 Jolteon (`pokemon:135`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 131](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:131) | ![QR 132](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:132) | ![QR 133](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:133) | ![QR 134](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:134) | ![QR 135](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:135) |

| #136 Flareon (`pokemon:136`) | #137 Porygon (`pokemon:137`) | #138 Omanyte (`pokemon:138`) | #139 Omastar (`pokemon:139`) | #140 Kabuto (`pokemon:140`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 136](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:136) | ![QR 137](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:137) | ![QR 138](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:138) | ![QR 139](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:139) | ![QR 140](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:140) |

| #141 Kabutops (`pokemon:141`) | #142 Aerodactyl (`pokemon:142`) | #143 Snorlax (`pokemon:143`) | #144 Articuno (`pokemon:144`) | #145 Zapdos (`pokemon:145`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 141](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:141) | ![QR 142](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:142) | ![QR 143](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:143) | ![QR 144](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:144) | ![QR 145](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:145) |

| #146 Moltres (`pokemon:146`) | #147 Dratini (`pokemon:147`) | #148 Dragonair (`pokemon:148`) | #149 Dragonite (`pokemon:149`) | #150 Mewtwo (`pokemon:150`) |
| :---: | :---: | :---: | :---: | :---: |
| ![QR 146](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:146) | ![QR 147](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:147) | ![QR 148](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:148) | ![QR 149](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:149) | ![QR 150](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:150) |

| #151 Mew (`pokemon:151`) |
| :---: |
| ![QR 151](https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=pokemon:151) |