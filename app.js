// POKEDEXX WEB - 001 A 151
let pokemonPendiente = null;

document.addEventListener("DOMContentLoaded", function() {

    const contenedor = document.getElementById("lista-pokemon");
    const buscador = document.getElementById("buscador");
    const botonEscanear = document.getElementById("btn-escanear");
    const botonDetener = document.getElementById("btn-detener-escaner");
    const botonConfirmar = document.getElementById("btn-confirmar");
    const botonScannerFlotante = document.getElementById("btn-ir-scanner");
    const modalPokemon = document.getElementById("modal-pokemon");
    let escanerQR = null;
    let qrProcesado = false;

    // NAVEGACION ENTRE VISTAS
    function cambiarVista(nombreVista) {
        document.querySelectorAll(".vista").forEach(function(vista) {
            vista.classList.add("hidden");
        });
        const vistaSeleccionada = document.getElementById(nombreVista);
        if (vistaSeleccionada) vistaSeleccionada.classList.remove("hidden");

        document.querySelectorAll(".nav-btn").forEach(function(boton) {
            boton.classList.remove("nav-activo", "text-purple-300");
            boton.classList.add("text-gray-400");
        });
        const botonActivo = document.querySelector('.nav-btn[data-vista="' + nombreVista + '"]');
        if (botonActivo) {
            botonActivo.classList.add("nav-activo", "text-purple-300");
            botonActivo.classList.remove("text-gray-400");
        }
        if (nombreVista !== "scanner") detenerEscaner();
        window.scrollTo(0, 0);
    }

    document.querySelectorAll(".nav-btn").forEach(function(boton) {
        boton.addEventListener("click", function() {
            cambiarVista(boton.dataset.vista);
        });
    });

    botonScannerFlotante.addEventListener("click", function() {
        cambiarVista("scanner");
    });

    // BUSCADOR
    buscador.addEventListener("input", function() {
        const texto = buscador.value.trim().toLowerCase();
        document.querySelectorAll(".pokemon-card").forEach(function(tarjeta) {
            const numero = tarjeta.dataset.numero || "";
            const nombre = tarjeta.dataset.nombre || "";
            tarjeta.style.display = numero.includes(texto) || nombre.includes(texto) ? "" : "none";
        });
    });

    // CONFIRMAR CAPTURA
    botonConfirmar.addEventListener("click", function() {
        if (!pokemonPendiente) {
            mostrarToast("❌ No se encontraron los datos del Pokémon.");
            return;
        }
        let pokemonCapturados = JSON.parse(localStorage.getItem("pokemonCapturados")) || [];
        const existe = pokemonCapturados.some(function(pokemon) {
            return pokemon.id === pokemonPendiente.id;
        });
        if (existe) {
            mostrarToast("⚠️ Este Pokémon ya había sido capturado.");
            return;
        }
        pokemonCapturados.push(pokemonPendiente);
        localStorage.setItem("pokemonCapturados", JSON.stringify(pokemonCapturados));
        mostrarPokemon();
        mostrarToast("⭐ ¡" + pokemonPendiente.name.toUpperCase() + " fue agregado a tu Pokédex!");
        document.getElementById("pokemon-preview").classList.add("hidden");
        pokemonPendiente = null;
        cambiarVista("inicio");
    });

    // INICIAR ESCANEO QR
    botonEscanear.addEventListener("click", iniciarEscaner);
    botonDetener.addEventListener("click", detenerEscaner);

    function iniciarEscaner() {
        if (escanerQR) return;
        if (typeof Html5Qrcode === "undefined") {
            mostrarToast("❌ No se pudo cargar el lector QR. Revisa tu conexión.");
            return;
        }
        escanerQR = new Html5Qrcode("qr-reader");
        botonEscanear.disabled = true;
        botonEscanear.textContent = "Iniciando cámara...";
        escanerQR.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            function(textoQR) {
                if (qrProcesado) return;
                qrProcesado = true;
                detenerEscaner().then(function() {
                    const resultado = textoQR.trim().match(/^pokemon:(\d+)$/i);
                    if (!resultado) {
                        mostrarToast("❌ Este código QR no pertenece a nuestra Pokédex.");
                        qrProcesado = false;
                        return;
                    }
                    const numero = parseInt(resultado[1], 10);
                    if (numero < 1 || numero > 151) {
                        mostrarToast("⚠️ El número debe estar entre 1 y 151.");
                        qrProcesado = false;
                        return;
                    }
                    consultarPokemon(numero);
                    qrProcesado = false;
                });
            }
        ).then(function() {
            botonEscanear.textContent = "Escáner activo";
            botonDetener.classList.remove("hidden");
        }).catch(function(error) {
            console.log("Error al iniciar cámara:", error);
            escanerQR = null;
            botonEscanear.disabled = false;
            botonEscanear.textContent = "Iniciar escáner";
            mostrarToast("❌ No se pudo iniciar la cámara. Revisa los permisos.");
        });
    }

    function detenerEscaner() {
        if (!escanerQR) {
            botonEscanear.disabled = false;
            botonEscanear.textContent = "Iniciar escáner";
            botonDetener.classList.add("hidden");
            return Promise.resolve();
        }
        const lector = escanerQR;
        escanerQR = null;
        return lector.stop().catch(function(error) {
            console.log("No se pudo detener el escáner:", error);
        }).then(function() {
            botonEscanear.disabled = false;
            botonEscanear.textContent = "Iniciar escáner";
            botonDetener.classList.add("hidden");
        });
    }

    // MODAL: CERRAR
    document.getElementById("cerrar-modal").addEventListener("click", function() {
        modalPokemon.classList.add("hidden");
    });
    modalPokemon.addEventListener("click", function(event) {
        if (event.target === modalPokemon) modalPokemon.classList.add("hidden");
    });
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") modalPokemon.classList.add("hidden");
    });

    // PRIMER RENDER
    mostrarPokemon();
    actualizarProgreso();

    // REGISTRAR SERVICE WORKER
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
            navigator.serviceWorker.register("service_worker.js").catch(function(error) {
                console.log("No se pudo registrar el Service Worker:", error);
            });
        });
    }
});

// TOAST
function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensaje;
    toast.classList.remove("hidden");
    clearTimeout(toast._temporizador);
    toast._temporizador = setTimeout(function() {
        toast.classList.add("hidden");
    }, 3000);
}

// CONSULTAR POKEAPI
function consultarPokemon(numero) {
    mostrarToast("🔎 Buscando Pokémon...");
    fetch("https://pokeapi.co/api/v2/pokemon/" + numero)
        .then(function(respuesta) {
            if (!respuesta.ok) throw new Error("Respuesta de API no válida");
            return respuesta.json();
        })
        .then(function(pokemon) {
            const nombre = pokemon.name;
            const imagen = pokemon.sprites.other && pokemon.sprites.other["official-artwork"] && pokemon.sprites.other["official-artwork"].front_default
                ? pokemon.sprites.other["official-artwork"].front_default
                : pokemon.sprites.front_default;
            const tipos = pokemon.types.map(function(item) { return item.type.name; });
            const habilidades = pokemon.abilities.map(function(item) { return item.ability.name.replace(/-/g, " "); });
            const altura = pokemon.height / 10;
            const peso = pokemon.weight / 10;

            document.getElementById("pokemon-numero").textContent = "#" + String(numero).padStart(3, "0");
            document.getElementById("pokemon-imagen").src = imagen || "";
            document.getElementById("pokemon-imagen").alt = nombre;
            document.getElementById("pokemon-nombre").textContent = nombre;
            document.getElementById("pokemon-altura").textContent = altura + " m";
            document.getElementById("pokemon-peso").textContent = peso + " kg";

            const contenedorTipos = document.getElementById("pokemon-tipos");
            contenedorTipos.innerHTML = "";
            tipos.forEach(function(tipo) {
                const etiqueta = document.createElement("span");
                etiqueta.className = "tipo";
                etiqueta.textContent = tipo;
                contenedorTipos.appendChild(etiqueta);
            });
            const contenedorHabilidades = document.getElementById("pokemon-habilidades");
            contenedorHabilidades.innerHTML = "";
            habilidades.forEach(function(habilidad) {
                const etiqueta = document.createElement("span");
                etiqueta.className = "bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs";
                etiqueta.textContent = habilidad;
                contenedorHabilidades.appendChild(etiqueta);
            });

            pokemonPendiente = {
                id: numero,
                name: nombre,
                image: imagen || "",
                types: tipos,
                abilities: habilidades,
                height: altura,
                weight: peso,
                capturedAt: new Date().toISOString()
            };
            document.getElementById("pokemon-preview").classList.remove("hidden");
            mostrarToast("Pokémon encontrado. Confirma si quieres capturarlo.");
        })
        .catch(function(error) {
            console.log("Error al consultar Pokémon:", error);
            mostrarToast("❌ No se pudo cargar el Pokémon. Intenta nuevamente.");
        });
}

// DIBUJAR LOS 151 ESPACIOS DE LA POKEDEX
function mostrarPokemon() {
    const contenedor = document.getElementById("lista-pokemon");
    const pokemonCapturados = JSON.parse(localStorage.getItem("pokemonCapturados")) || [];
    contenedor.innerHTML = "";

    for (let numero = 1; numero <= 151; numero++) {
        const pokemon = pokemonCapturados.find(function(p) { return p.id === numero; });
        const tarjeta = document.createElement("div");
        tarjeta.className = "pokemon-card tarjeta rounded-2xl p-3 sm:p-4 text-center hover:border-purple-500 transition duration-300";
        tarjeta.dataset.numero = String(numero).padStart(3, "0");
        tarjeta.dataset.nombre = pokemon ? pokemon.name.toLowerCase() : "";

        if (!pokemon) {
            tarjeta.innerHTML = `
                <p class="text-purple-300 text-sm">#${String(numero).padStart(3, "0")}</p>
                <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto flex items-center justify-center">
                    <span class="text-6xl text-gray-700">?</span>
                </div>
                <h3 class="text-gray-500 font-bold text-sm sm:text-base">No descubierto</h3>
                <p class="text-gray-600 text-xs mt-2">🔒 Bloqueado</p>
            `;
        } else {
            let tiposHTML = "";
            (pokemon.types || []).forEach(function(tipo) {
                tiposHTML += `<span class="tipo">${tipo}</span>`;
            });
            tarjeta.innerHTML = `
                <p class="text-purple-300 text-sm">#${String(pokemon.id).padStart(3, "0")}</p>
                <img src="${pokemon.image}" alt="${pokemon.name}" class="w-24 h-24 sm:w-32 sm:h-32 mx-auto object-contain">
                <h3 class="text-white font-bold capitalize text-sm sm:text-base">${pokemon.name}</h3>
                <div class="flex justify-center gap-1 mt-2 flex-wrap">${tiposHTML}</div>
            `;
            tarjeta.addEventListener("click", function() { abrirDetalles(pokemon); });
        }
        contenedor.appendChild(tarjeta);
    }

    const texto = document.getElementById("buscador").value.trim().toLowerCase();
    if (texto) {
        contenedor.querySelectorAll(".pokemon-card").forEach(function(tarjeta) {
            const numero = tarjeta.dataset.numero || "";
            const nombre = tarjeta.dataset.nombre || "";
            tarjeta.style.display = numero.includes(texto) || nombre.includes(texto) ? "" : "none";
        });
    }
    actualizarProgreso();
}

// MODAL DE DETALLES
function abrirDetalles(pokemon) {
    document.getElementById("modal-pokemon").classList.remove("hidden");
    document.getElementById("detalle-numero").textContent = "#" + String(pokemon.id).padStart(3, "0");
    document.getElementById("detalle-imagen").src = pokemon.image || "";
    document.getElementById("detalle-imagen").alt = pokemon.name;
    document.getElementById("detalle-nombre").textContent = pokemon.name;

    const tipos = document.getElementById("detalle-tipos");
    tipos.innerHTML = "";
    (pokemon.types || []).forEach(function(tipo) {
        const etiqueta = document.createElement("span");
        etiqueta.className = "tipo";
        etiqueta.textContent = tipo;
        tipos.appendChild(etiqueta);
    });
    const habilidades = document.getElementById("detalle-habilidades");
    habilidades.innerHTML = "";
    (pokemon.abilities || []).forEach(function(habilidad) {
        const etiqueta = document.createElement("span");
        etiqueta.className = "bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs";
        etiqueta.textContent = habilidad;
        habilidades.appendChild(etiqueta);
    });
    document.getElementById("detalle-altura").textContent = pokemon.height ? pokemon.height + " m" : "No disponible";
    document.getElementById("detalle-peso").textContent = pokemon.weight ? pokemon.weight + " kg" : "No disponible";
}

// ACTUALIZAR PROGRESO
function actualizarProgreso() {
    const pokemonCapturados = JSON.parse(localStorage.getItem("pokemonCapturados")) || [];
    const total = pokemonCapturados.length;
    const porcentaje = (total / 151) * 100;
    const restante = 151 - total;
    const textoContador = total + " / 151";

    document.getElementById("contador-panel").textContent = textoContador;
    document.getElementById("contador-progreso").textContent = textoContador;
    document.getElementById("barra-panel").style.width = porcentaje + "%";
    document.getElementById("barra-progreso").style.width = porcentaje + "%";
    document.getElementById("porcentaje-progreso").textContent = porcentaje.toFixed(1) + "%";
    document.getElementById("pokemon-restantes").textContent = restante === 0
        ? "¡Felicidades! Completaste la Pokédex."
        : "Te faltan " + restante + " Pokémon.";
}