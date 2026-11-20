Pokedexx

By:
Carolina Islas Iturriaga
Jorge Cervantes Valdez


Descripción del proyecto

Pokédex es una aplicación web progresiva (PWA) inspirada en una Pokédex, que permite descubrir y capturar Pokémon de la primera generación, desde el número 001 hasta el 151, mediante el escaneo de códigos QR.

Al escanear un código QR válido, la aplicación obtiene la información del Pokémon utilizando PokéAPI, muestra sus datos y permite al usuario confirmar su captura.

Los Pokémon capturados se almacenan localmente en el navegador, permitiendo conservar la colección sin necesidad de crear una cuenta o utilizar una base de datos.

Tecnologías utilizadas
    -HTML5
    -JavaScript
    -Tailwind CSS
    -PokéAPI
    -HTML5-QRCode (html5-qrcode)
    -LocalStorage
    -Progressive Web App (PWA)
    -Service Worker

Funcionalidades
    -Visualización de los 151 Pokémon de la primera generación.
    -Pokémon no capturados representados mediante tarjetas bloqueadas.
    -Escaneo de códigos QR mediante la cámara del dispositivo.
    -Validación de códigos QR y de identificadores entre 1 y 151.
    -Consulta de información de Pokémon mediante PokéAPI.
    -Captura de Pokémon mediante confirmación del usuario.
    -Guardado local de Pokémon capturados mediante localStorage.
    -Prevención de capturas duplicadas.
    -Buscador por nombre o número.
    -Visualización de detalles de cada Pokémon capturado.
    -Seguimiento del progreso de captura.
    -Notificaciones Toast.
    -Navegación entre las vistas de Pokédex, Progreso y Acerca de.
    -Instalación como aplicación mediante PWA.

Cómo ejecutar la aplicación
    1. Descargar o clonar el repositorio.
    2. Abrir la carpeta del proyecto en Visual Studio Code.
    3. Instalar y utilizar la extensión Live Server.
    4. Abrir el archivo index.html.
    5. Presionar clic derecho y seleccionar Open with Live Server.
    6. La aplicación se abrirá en el navegador.

Se recomienda ejecutar la aplicación mediante Live Server o un servidor HTTPS para permitir el acceso a la cámara y las funciones de la PWA.

Librería utilizada para QR

Se utilizó html5-qrcode, una librería de JavaScript que permite acceder a la cámara del dispositivo y detectar códigos QR.

La librería se utiliza para leer los códigos QR que contienen el identificador del Pokémon y posteriormente consultar su información.

API utilizada

Se utiliza PokéAPI para obtener información de los Pokémon.

Endpoint:

https://pokeapi.co/api/v2/pokemon/{id}

Los datos obtenidos incluyen nombre, imagen, tipos, habilidades, altura y peso.

Instalación de la PWA
    1. Abrir la aplicación en un navegador compatible.
    2. Acceder al menú del navegador.
    3. Seleccionar la opción Instalar aplicación o Instalar Pokédex, si está disponible.
    4. Confirmar la instalación.
    5. Abrir la aplicación desde el acceso directo creado en el dispositivo.

La aplicación utiliza un Manifest y un Service Worker para permitir su instalación y almacenar recursos principales.

Códigos QR

El proyecto cuenta con 151 códigos QR correspondientes a los Pokémon de la primera generación.

Cada código utiliza el siguiente formato:

pokemon:{id}

Ejemplos:
    -Bulbasaur: pokemon:1
    -Pikachu: pokemon:25
    -Mew: pokemon:151

Los códigos QR se incluyen como recursos para realizar pruebas de captura dentro de la aplicación.