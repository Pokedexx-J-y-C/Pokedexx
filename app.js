const TOTAL_POKEMON = 151;
const CLAVE_COLECCION = "pokemonCapturados";
const CLAVE_CACHE = "pokemonCache";
const TIEMPO_LIMITE_API = 12000;

const COLORES_TIPO = {
    normal: ["#4b5563", "#e5e7eb"],
    fire: ["#7c2d12", "#fdba74"],
    water: ["#1e3a8a", "#93c5fd"],
    electric: ["#713f12", "#fde047"],
    grass: ["#14532d", "#86efac"],
    ice: ["#164e63", "#a5f3fc"],
    fighting: ["#7f1d1d", "#fca5a5"],
    poison: ["#581c87", "#d8b4fe"],
    ground: ["#713f12", "#fcd34d"],
    flying: ["#312e81", "#a5b4fc"],
    psychic: ["#831843", "#f9a8d4"],
    bug: ["#365314", "#bef264"],
    rock: ["#44403c", "#d6d3d1"],
    ghost: ["#3b0764", "#c4b5fd"],
    dragon: ["#1e1b4b", "#a5b4fc"],
    dark: ["#1c1917", "#a8a29e"],
    steel: ["#334155", "#cbd5e1"],
    fairy: ["#831843", "#fbcfe8"]
};

const CLASES_TOAST = {
    exito: "toast-exito",
    error: "toast-error",
    aviso: "toast-aviso",
    info: "toast-info"
};

let temporizadorToast = null;

function formatearNumero(numero) {
    return "#" + String(numero).padStart(3, "0");
}

function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function crearEtiquetaTipo(tipo) {
    const etiqueta = document.createElement("span");
    const colores = COLORES_TIPO[tipo] || ["#3b1767", "#e9d5ff"];
    etiqueta.textContent = tipo;
    etiqueta.className = "inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize";
    etiqueta.style.backgroundColor = colores[0];
    etiqueta.style.color = colores[1];
    return etiqueta;
}

function crearMarcador() {
    const marcador = document.createElement("div");
    marcador.className = "w-24 h-24 sm:w-32 sm:h-32 mx-auto flex items-center justify-center text-5xl text-gray-700";
    marcador.textContent = "?";
    return marcador;
}

function mostrarToast(mensaje, tipo) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    const variante = CLASES_TOAST[tipo] || CLASES_TOAST.info;
    toast.className = "fixed top-16 left-1/2 -translate-x-1/2 z-[100] border px-5 py-3 rounded-xl shadow-lg text-center max-w-[90%] " + variante;
    toast.textContent = mensaje;
    toast.classList.remove("hidden");
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(function() {
        toast.classList.add("hidden");
    }, 3500);
}

function normalizarColeccion(lista) {
    if (!Array.isArray(lista)) return [];
    const vistos = new Set();
    const resultado = [];
    lista.forEach(function(pokemon) {
        if (!pokemon || typeof pokemon !== "object") return;
        const id = Number(pokemon.id);
        if (!Number.isInteger(id) || id < 1 || id > TOTAL_POKEMON) return;
        if (vistos.has(id)) return;
        vistos.add(id);
        resultado.push({
            id: id,
            name: String(pokemon.name || "pokemon"),
            image: String(pokemon.image || ""),
            types: Array.isArray(pokemon.types) ? pokemon.types.map(String) : [],
            abilities: Array.isArray(pokemon.abilities) ? pokemon.abilities.map(String) : [],
            height: typeof pokemon.height === "number" ? pokemon.height : null,
            weight: typeof pokemon.weight === "number" ? pokemon.weight : null,
            capturedAt: pokemon.capturedAt || null
        });
    });
    return resultado.sort(function(a, b) {
        return a.id - b.id;
    });
}

function obtenerColeccion() {
    try {
        const crudo = localStorage.getItem(CLAVE_COLECCION);
        if (!crudo) return [];
        return normalizarColeccion(JSON.parse(crudo));
    } catch (error) {
        console.warn("No se pudo leer la colección guardada:", error);
        return [];
    }
}

function guardarColeccion(coleccion) {
    try {
        localStorage.setItem(CLAVE_COLECCION, JSON.stringify(coleccion));
        return true;
    } catch (error) {
        console.warn("No se pudo guardar la colección:", error);
        return false;
    }
}

function leerCache() {
    try {
        const crudo = localStorage.getItem(CLAVE_CACHE);
        if (!crudo) return {};
        const datos = JSON.parse(crudo);
        return datos && typeof datos === "object" ? datos : {};
    } catch (error) {
        console.warn("No se pudo leer la caché de Pokémon:", error);
        return {};
    }
}

function guardarEnCache(pokemon) {
    try {
        const cache = leerCache();
        cache[pokemon.id] = pokemon;
        localStorage.setItem(CLAVE_CACHE, JSON.stringify(cache));
    } catch (error) {
        console.warn("No se pudo guardar la caché de Pokémon:", error);
    }
}

function mapearPokemon(datos) {
    const artwork = datos.sprites && datos.sprites.other && datos.sprites.other["official-artwork"];
    const imagen = (artwork && artwork.front_default) || (datos.sprites && datos.sprites.front_default) || "";
    return {
        id: Number(datos.id),
        name: String(datos.name || ""),
        image: imagen,
        types: (datos.types || []).map(function(item) {
            return String(item.type.name);
        }),
        abilities: (datos.abilities || []).map(function(item) {
            return String(item.ability.name).replace(/-/g, " ");
        }),
        height: typeof datos.height === "number" ? datos.height / 10 : null,
        weight: typeof datos.weight === "number" ? datos.weight / 10 : null
    };
}

async function pedirPokemonApi(id) {
    const controlador = new AbortController();
    const temporizador = setTimeout(function() {
        controlador.abort();
    }, TIEMPO_LIMITE_API);
    try {
        const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/" + id, {
            signal: controlador.signal,
            cache: "no-cache"
        });
        if (!respuesta.ok) throw new Error("Respuesta " + respuesta.status);
        return mapearPokemon(await respuesta.json());
    } finally {
        clearTimeout(temporizador);
    }
}

async function obtenerPokemon(id) {
    try {
        const pokemon = await pedirPokemonApi(id);
        guardarEnCache(pokemon);
        return { pokemon: pokemon, desdeCache: false };
    } catch (error) {
        const cache = leerCache();
        if (cache[id]) {
            const normalizado = normalizarColeccion([cache[id]])[0];
            if (normalizado) return { pokemon: normalizado, desdeCache: true };
        }
        throw error;
    }
}

document.addEventListener("DOMContentLoaded", function() {

    const contenedor = document.getElementById("lista-pokemon");
    const buscador = document.getElementById("buscador");
    const estadoVacio = document.getElementById("estado-vacio");
    const sinResultados = document.getElementById("sin-resultados");

    const botonEscanear = document.getElementById("btn-escanear");
    const botonDetener = document.getElementById("btn-detener-escaner");
    const botonConfirmar = document.getElementById("btn-confirmar");
    const botonReintentar = document.getElementById("btn-reintentar");
    const botonScannerFlotante = document.getElementById("btn-ir-scanner");
    const botonVacioEscanear = document.getElementById("btn-vacio-escanear");
    const estadoEscaner = document.getElementById("scanner-estado");

    const preview = document.getElementById("pokemon-preview");
    const previewLoading = document.getElementById("pokemon-loading");
    const previewError = document.getElementById("pokemon-error");
    const previewContenido = document.getElementById("pokemon-contenido");

    const modalPokemon = document.getElementById("modal-pokemon");
    const botonCerrarModal = document.getElementById("cerrar-modal");

    const botonInstalar = document.getElementById("btn-instalar");
    const ayudaInstalar = document.getElementById("instalar-ayuda");
    const appInstalada = document.getElementById("app-instalada");

    let escanerQR = null;
    let iniciandoEscaner = false;
    let procesandoQR = false;
    let ultimoCodigo = "";
    let ultimoCodigoTs = 0;
    let pokemonPendiente = null;
    let idSolicitado = null;
    let focoAnterior = null;
    let promptInstalacion = null;

    function texto(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    }

    function mostrarCargandoPreview() {
        preview.classList.remove("hidden");
        previewLoading.classList.remove("hidden");
        previewError.classList.add("hidden");
        previewContenido.classList.add("hidden");
        botonConfirmar.disabled = true;
    }

    function mostrarErrorPreview() {
        preview.classList.remove("hidden");
        previewLoading.classList.add("hidden");
        previewContenido.classList.add("hidden");
        previewError.classList.remove("hidden");
        botonConfirmar.disabled = true;
    }

    function rellenarPreview(pokemon) {
        texto("pokemon-numero", formatearNumero(pokemon.id));
        texto("pokemon-nombre", capitalizar(pokemon.name));
        texto("pokemon-altura", pokemon.height !== null ? pokemon.height + " m" : "No disponible");
        texto("pokemon-peso", pokemon.weight !== null ? pokemon.weight + " kg" : "No disponible");

        const imagen = document.getElementById("pokemon-imagen");
        imagen.src = pokemon.image || "";
        imagen.alt = "Imagen de " + capitalizar(pokemon.name);

        const tipos = document.getElementById("pokemon-tipos");
        tipos.innerHTML = "";
        pokemon.types.forEach(function(tipo) {
            tipos.appendChild(crearEtiquetaTipo(tipo));
        });

        const habilidades = document.getElementById("pokemon-habilidades");
        habilidades.innerHTML = "";
        pokemon.abilities.forEach(function(habilidad) {
            const etiqueta = document.createElement("span");
            etiqueta.className = "bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs capitalize";
            etiqueta.textContent = habilidad;
            habilidades.appendChild(etiqueta);
        });

        preview.classList.remove("hidden");
        previewLoading.classList.add("hidden");
        previewError.classList.add("hidden");
        previewContenido.classList.remove("hidden");
        botonConfirmar.disabled = false;
    }

    function limpiarPreview() {
        preview.classList.add("hidden");
        previewLoading.classList.add("hidden");
        previewError.classList.add("hidden");
        previewContenido.classList.add("hidden");
        pokemonPendiente = null;
        idSolicitado = null;
        procesandoQR = false;
        botonConfirmar.disabled = true;
        botonConfirmar.textContent = "⭐ Capturar Pokémon";
    }

    async function consultarYMostrar(id) {
        idSolicitado = id;
        mostrarCargandoPreview();
        try {
            const resultado = await obtenerPokemon(id);
            pokemonPendiente = resultado.pokemon;
            rellenarPreview(resultado.pokemon);
            if (resultado.desdeCache) {
                mostrarToast("Sin conexión: mostrando datos guardados.", "aviso");
            } else {
                mostrarToast("Pokémon encontrado. Confirma si quieres capturarlo.", "info");
            }
        } catch (error) {
            console.warn("No se pudo consultar el Pokémon:", error);
            mostrarErrorPreview();
            mostrarToast("No fue posible consultar la información del Pokémon.", "error");
        } finally {
            procesandoQR = false;
        }
    }

    function estaCapturado(id) {
        return obtenerColeccion().some(function(pokemon) {
            return pokemon.id === id;
        });
    }

    function validarCodigoQR(textoQR) {
        const limpio = String(textoQR || "").trim();
        const coincidencia = limpio.match(/^pokemon:(\d{1,3})$/i);
        if (!coincidencia) {
            return { valido: false, mensaje: "Este código QR no pertenece a la Pokédex." };
        }
        const id = parseInt(coincidencia[1], 10);
        if (!Number.isInteger(id) || id < 1 || id > TOTAL_POKEMON) {
            return { valido: false, mensaje: "El número debe estar entre 1 y 151." };
        }
        return { valido: true, id: id };
    }

    function alEscanear(textoQR) {
        if (procesandoQR) return;
        const ahora = Date.now();
        if (textoQR === ultimoCodigo && ahora - ultimoCodigoTs < 4000) return;
        ultimoCodigo = textoQR;
        ultimoCodigoTs = ahora;

        const resultado = validarCodigoQR(textoQR);
        if (!resultado.valido) {
            mostrarToast(resultado.mensaje, "error");
            return;
        }
        if (estaCapturado(resultado.id)) {
            mostrarToast("Este Pokémon ya había sido capturado.", "aviso");
            return;
        }
        procesandoQR = true;
        detenerEscaner().then(function() {
            consultarYMostrar(resultado.id);
        });
    }

    function establecerEstadoEscaner(activo) {
        botonEscanear.disabled = activo;
        botonEscanear.textContent = activo ? "Escáner activo" : "Iniciar escáner";
        botonDetener.classList.toggle("hidden", !activo);
        estadoEscaner.classList.toggle("hidden", !activo);
        estadoEscaner.textContent = activo ? "Cámara activa. Apunta al código QR." : "";
    }

    function mensajeErrorCamara(error) {
        const nombre = (error && error.name) || "";
        const detalle = String((error && (error.message || error)) || "");
        if (nombre === "NotAllowedError" || /permission|denied/i.test(detalle)) {
            return "No se pudo iniciar la cámara: permiso denegado.";
        }
        if (nombre === "NotFoundError" || /no.*camera|notfound/i.test(detalle)) {
            return "No se encontró ninguna cámara disponible.";
        }
        if (nombre === "NotReadableError" || /in use|could not start/i.test(detalle)) {
            return "La cámara está en uso por otra aplicación.";
        }
        return "No se pudo iniciar la cámara. Revisa los permisos.";
    }

    async function iniciarEscaner() {
        if (escanerQR || iniciandoEscaner) return;
        if (typeof Html5Qrcode === "undefined") {
            mostrarToast("No se pudo cargar el lector QR. Revisa tu conexión.", "error");
            return;
        }
        if (window.isSecureContext === false) {
            mostrarToast("La cámara requiere HTTPS o localhost.", "error");
            return;
        }
        limpiarPreview();
        iniciandoEscaner = true;
        botonEscanear.disabled = true;
        botonEscanear.textContent = "Iniciando cámara...";
        const lector = new Html5Qrcode("qr-reader");
        try {
            await lector.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                alEscanear,
                function() {}
            );
            escanerQR = lector;
            establecerEstadoEscaner(true);
        } catch (error) {
            console.warn("No se pudo iniciar la cámara:", error);
            escanerQR = null;
            try {
                await lector.clear();
            } catch (limpiarError) {
                console.warn(limpiarError);
            }
            establecerEstadoEscaner(false);
            mostrarToast(mensajeErrorCamara(error), "error");
        } finally {
            iniciandoEscaner = false;
        }
    }

    async function detenerEscaner() {
        const lector = escanerQR;
        escanerQR = null;
        if (!lector) {
            establecerEstadoEscaner(false);
            return;
        }
        try {
            await lector.stop();
        } catch (error) {
            console.warn("No se pudo detener el escáner:", error);
        }
        try {
            lector.clear();
        } catch (error) {
            console.warn("No se pudo limpiar el lector:", error);
        }
        establecerEstadoEscaner(false);
    }

    function crearTarjeta(numero, pokemon) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "pokemon-card tarjeta rounded-2xl p-3 sm:p-4 text-center";
        tarjeta.dataset.numero = String(numero).padStart(3, "0");
        tarjeta.dataset.nombre = pokemon ? String(pokemon.name).toLowerCase() : "";

        const etiquetaNumero = document.createElement("p");
        etiquetaNumero.className = "text-purple-300 text-sm";
        etiquetaNumero.textContent = formatearNumero(numero);
        tarjeta.appendChild(etiquetaNumero);

        if (!pokemon) {
            const bloqueado = document.createElement("div");
            bloqueado.innerHTML = `
                <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto flex items-center justify-center">
                    <span class="text-6xl text-gray-700">?</span>
                </div>
                <h3 class="text-gray-500 font-bold text-sm sm:text-base">? Pokémon no descubierto</h3>
                <p class="text-gray-600 text-xs mt-2">🔒 Bloqueado</p>
            `;
            tarjeta.appendChild(bloqueado);
            return tarjeta;
        }

        tarjeta.classList.add("cursor-pointer", "hover:border-purple-500", "transition", "duration-300");
        tarjeta.setAttribute("role", "button");
        tarjeta.setAttribute("tabindex", "0");
        tarjeta.setAttribute("aria-label", "Ver detalles de " + capitalizar(pokemon.name));

        if (pokemon.image) {
            const imagen = document.createElement("img");
            imagen.src = pokemon.image;
            imagen.alt = "Imagen de " + capitalizar(pokemon.name);
            imagen.loading = "lazy";
            imagen.className = "w-24 h-24 sm:w-32 sm:h-32 mx-auto object-contain";
            imagen.addEventListener("error", function() {
                imagen.replaceWith(crearMarcador());
            });
            tarjeta.appendChild(imagen);
        } else {
            tarjeta.appendChild(crearMarcador());
        }

        const nombre = document.createElement("h3");
        nombre.className = "text-white font-bold capitalize text-sm sm:text-base";
        nombre.textContent = pokemon.name;
        tarjeta.appendChild(nombre);

        const tipos = document.createElement("div");
        tipos.className = "flex justify-center gap-1 mt-2 flex-wrap";
        pokemon.types.forEach(function(tipo) {
            tipos.appendChild(crearEtiquetaTipo(tipo));
        });
        tarjeta.appendChild(tipos);

        function abrir() {
            abrirDetalle(pokemon);
        }
        tarjeta.addEventListener("click", abrir);
        tarjeta.addEventListener("keydown", function(event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                abrir();
            }
        });

        return tarjeta;
    }

    function renderizarPokedex() {
        const coleccion = obtenerColeccion();
        const porId = new Map();
        coleccion.forEach(function(pokemon) {
            porId.set(pokemon.id, pokemon);
        });

        const fragmento = document.createDocumentFragment();
        for (let numero = 1; numero <= TOTAL_POKEMON; numero++) {
            fragmento.appendChild(crearTarjeta(numero, porId.get(numero)));
        }
        contenedor.replaceChildren(fragmento);

        estadoVacio.classList.toggle("hidden", coleccion.length > 0);
        aplicarFiltro();
        actualizarProgreso();
    }

    function aplicarFiltro() {
        const textoBusqueda = buscador.value.trim().toLowerCase();
        let visibles = 0;
        contenedor.querySelectorAll(".pokemon-card").forEach(function(tarjeta) {
            const numero = tarjeta.dataset.numero || "";
            const nombre = tarjeta.dataset.nombre || "";
            const coincide = !textoBusqueda || numero.includes(textoBusqueda) || nombre.includes(textoBusqueda);
            tarjeta.style.display = coincide ? "" : "none";
            if (coincide) visibles++;
        });
        sinResultados.classList.toggle("hidden", !textoBusqueda || visibles > 0);
    }

    function actualizarProgreso() {
        const total = Math.min(obtenerColeccion().length, TOTAL_POKEMON);
        const porcentaje = (total / TOTAL_POKEMON) * 100;
        const restantes = TOTAL_POKEMON - total;
        const contador = total + " / " + TOTAL_POKEMON;

        texto("contador-panel", contador);
        texto("contador-progreso", contador);
        texto("porcentaje-progreso", porcentaje.toFixed(1) + "%");
        texto("pokemon-restantes", restantes === 0
            ? "¡Felicidades! Completaste la Pokédex."
            : "Te faltan " + restantes + " Pokémon.");

        const barraPanel = document.getElementById("barra-panel");
        const barraProgreso = document.getElementById("barra-progreso");
        if (barraPanel) barraPanel.style.width = porcentaje + "%";
        if (barraProgreso) barraProgreso.style.width = porcentaje + "%";
    }

    function abrirDetalle(pokemon) {
        focoAnterior = document.activeElement;
        texto("detalle-numero", formatearNumero(pokemon.id));
        texto("detalle-nombre", capitalizar(pokemon.name));
        texto("detalle-altura", typeof pokemon.height === "number" ? pokemon.height + " m" : "No disponible");
        texto("detalle-peso", typeof pokemon.weight === "number" ? pokemon.weight + " kg" : "No disponible");

        const imagen = document.getElementById("detalle-imagen");
        imagen.style.display = "";
        imagen.src = pokemon.image || "";
        imagen.alt = "Imagen de " + capitalizar(pokemon.name);

        const tipos = document.getElementById("detalle-tipos");
        tipos.innerHTML = "";
        pokemon.types.forEach(function(tipo) {
            tipos.appendChild(crearEtiquetaTipo(tipo));
        });

        const habilidades = document.getElementById("detalle-habilidades");
        habilidades.innerHTML = "";
        if (pokemon.abilities.length === 0) {
            const etiqueta = document.createElement("span");
            etiqueta.className = "text-gray-400 text-sm";
            etiqueta.textContent = "No disponible";
            habilidades.appendChild(etiqueta);
        } else {
            pokemon.abilities.forEach(function(habilidad) {
                const etiqueta = document.createElement("span");
                etiqueta.className = "bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs capitalize";
                etiqueta.textContent = habilidad;
                habilidades.appendChild(etiqueta);
            });
        }

        modalPokemon.classList.remove("hidden");
        document.getElementById("modal-panel").focus();
    }

    function cerrarDetalle() {
        if (modalPokemon.classList.contains("hidden")) return;
        modalPokemon.classList.add("hidden");
        if (focoAnterior && typeof focoAnterior.focus === "function") focoAnterior.focus();
        focoAnterior = null;
    }

    function cambiarVista(nombreVista) {
        document.querySelectorAll(".vista").forEach(function(vista) {
            vista.classList.add("hidden");
        });
        const vistaSeleccionada = document.getElementById(nombreVista);
        if (vistaSeleccionada) vistaSeleccionada.classList.remove("hidden");

        document.querySelectorAll(".nav-btn").forEach(function(boton) {
            boton.classList.remove("nav-activo", "text-purple-300");
            boton.classList.add("text-gray-400");
            boton.setAttribute("aria-current", "false");
        });
        const botonActivo = document.querySelector('.nav-btn[data-vista="' + nombreVista + '"]');
        if (botonActivo) {
            botonActivo.classList.add("nav-activo", "text-purple-300");
            botonActivo.classList.remove("text-gray-400");
            botonActivo.setAttribute("aria-current", "page");
        }
        if (nombreVista !== "scanner") detenerEscaner();
        window.scrollTo(0, 0);
    }

    async function confirmarCaptura() {
        if (!pokemonPendiente) {
            mostrarToast("No se encontraron los datos del Pokémon.", "error");
            return;
        }
        if (estaCapturado(pokemonPendiente.id)) {
            mostrarToast("Este Pokémon ya había sido capturado.", "aviso");
            limpiarPreview();
            return;
        }
        botonConfirmar.disabled = true;
        botonConfirmar.textContent = "Guardando...";

        const coleccion = obtenerColeccion();
        const registro = Object.assign({}, pokemonPendiente, {
            capturedAt: new Date().toISOString()
        });
        coleccion.push(registro);

        if (!guardarColeccion(coleccion)) {
            mostrarToast("No se pudo guardar el Pokémon en este dispositivo.", "error");
            botonConfirmar.disabled = false;
            botonConfirmar.textContent = "⭐ Capturar Pokémon";
            return;
        }

        mostrarToast("⭐ ¡" + capitalizar(registro.name) + " fue agregado a tu Pokédex!", "exito");
        limpiarPreview();
        renderizarPokedex();
        cambiarVista("inicio");
    }

    function actualizarConexion() {
        const banner = document.getElementById("banner-offline");
        if (banner) banner.classList.toggle("hidden", navigator.onLine);
    }

    function configurarInstalacion() {
        const esStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
        const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        if (esStandalone) {
            appInstalada.classList.remove("hidden");
            return;
        }
        window.addEventListener("beforeinstallprompt", function(event) {
            event.preventDefault();
            promptInstalacion = event;
            botonInstalar.classList.remove("hidden");
        });
        window.addEventListener("appinstalled", function() {
            promptInstalacion = null;
            botonInstalar.classList.add("hidden");
            ayudaInstalar.classList.add("hidden");
            appInstalada.classList.remove("hidden");
            mostrarToast("Aplicación instalada correctamente.", "exito");
        });
        if (esIOS) ayudaInstalar.classList.remove("hidden");
        botonInstalar.addEventListener("click", async function() {
            if (!promptInstalacion) return;
            promptInstalacion.prompt();
            try {
                await promptInstalacion.userChoice;
            } catch (error) {
                console.warn(error);
            }
            promptInstalacion = null;
            botonInstalar.classList.add("hidden");
        });
    }

    function registrarServiceWorker() {
        if (!("serviceWorker" in navigator)) return;
        if (location.protocol === "file:") {
            mostrarToast("Abre la app con un servidor local para habilitar la PWA.", "aviso");
            return;
        }
        window.addEventListener("load", function() {
            navigator.serviceWorker.register("service_worker.js").catch(function(error) {
                console.warn("No se pudo registrar el Service Worker:", error);
            });
        });
    }

    document.querySelectorAll(".nav-btn").forEach(function(boton) {
        boton.addEventListener("click", function() {
            cambiarVista(boton.dataset.vista);
        });
    });

    buscador.addEventListener("input", aplicarFiltro);

    botonEscanear.addEventListener("click", iniciarEscaner);
    botonDetener.addEventListener("click", detenerEscaner);
    botonConfirmar.addEventListener("click", confirmarCaptura);

    botonReintentar.addEventListener("click", function() {
        if (idSolicitado === null) return;
        consultarYMostrar(idSolicitado);
    });

    botonScannerFlotante.addEventListener("click", function() {
        cambiarVista("scanner");
        iniciarEscaner();
    });

    botonVacioEscanear.addEventListener("click", function() {
        cambiarVista("scanner");
        iniciarEscaner();
    });

    botonCerrarModal.addEventListener("click", cerrarDetalle);
    modalPokemon.addEventListener("click", function(event) {
        if (event.target === modalPokemon) cerrarDetalle();
    });
    document.getElementById("detalle-imagen").addEventListener("error", function() {
        this.style.display = "none";
    });
    modalPokemon.addEventListener("keydown", function(event) {
        if (event.key !== "Tab") return;
        const panel = document.getElementById("modal-panel");
        const focusables = modalPokemon.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;
        const primero = focusables[0];
        const ultimo = focusables[focusables.length - 1];
        if (!modalPokemon.contains(document.activeElement)) {
            event.preventDefault();
            primero.focus();
            return;
        }
        if (event.shiftKey && (document.activeElement === primero || document.activeElement === panel)) {
            event.preventDefault();
            ultimo.focus();
        } else if (!event.shiftKey && document.activeElement === ultimo) {
            event.preventDefault();
            primero.focus();
        }
    });
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") cerrarDetalle();
    });

    window.addEventListener("online", actualizarConexion);
    window.addEventListener("offline", actualizarConexion);
    document.addEventListener("visibilitychange", function() {
        if (document.hidden) detenerEscaner();
    });

    actualizarConexion();
    configurarInstalacion();
    registrarServiceWorker();
    cambiarVista("inicio");
    renderizarPokedex();
});
