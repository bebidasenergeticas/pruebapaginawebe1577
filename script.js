/* =========================================================
   NÓMADA TRAVEL — script.js
   Aquí vive todo lo que "se mueve" o "responde" en la página:
   menú, galerías, favoritos, ventana de experiencia,
   formulario y animaciones.
   ========================================================= */

/* ---------- 0. Ayudantes ---------- */
// Atajos para buscar elementos en la página
const $ = (selector, dentro = document) => dentro.querySelector(selector);
const $$ = (selector, dentro = document) => [...dentro.querySelectorAll(selector)];

// ¿La persona pidió reducir el movimiento en su sistema?
const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ¿Cargó GSAP desde internet?
const hayGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

// Fecha de hoy en formato AAAA-MM-DD (el que usan los campos de fecha)
function fechaDeHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}
const HOY = fechaDeHoy();

/* ---------- 1. Menú superior ---------- */
const nav = $('#nav');
const btnMenu = $('#btnMenu');

// Al bajar un poco, el menú pasa de transparente a sólido
function actualizarMenu() {
  nav.classList.toggle('nav--solida', window.scrollY > 40);
}
window.addEventListener('scroll', actualizarMenu, { passive: true });
actualizarMenu();

// Menú de celular (botón hamburguesa)
function abrirCerrarMenu(abrir) {
  nav.classList.toggle('nav--abierto', abrir);
  btnMenu.setAttribute('aria-expanded', abrir);
  btnMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflow = abrir ? 'hidden' : '';
}
btnMenu.addEventListener('click', () => abrirCerrarMenu(!nav.classList.contains('nav--abierto')));
$$('#menu a').forEach((enlace) => enlace.addEventListener('click', () => abrirCerrarMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') abrirCerrarMenu(false);
});

/* ---------- 2. Galerías de las tarjetas ---------- */
$$('[data-galeria]').forEach((galeria) => {
  const pista = $('.galeria__pista', galeria);
  const puntos = $$('.galeria__puntos i', galeria);
  const total = pista.children.length;
  let actual = 0;

  function mostrar(numero) {
    actual = (numero + total) % total; // da la vuelta al llegar al final
    pista.style.transform = `translateX(-${actual * 100}%)`;
    puntos.forEach((punto, i) => punto.classList.toggle('activo', i === actual));
  }

  $('.galeria__flecha--izq', galeria).addEventListener('click', () => mostrar(actual - 1));
  $('.galeria__flecha--der', galeria).addEventListener('click', () => mostrar(actual + 1));

  // En celular: deslizar el dedo a la izquierda o derecha también cambia la imagen
  let inicioX = null;
  galeria.addEventListener('touchstart', (e) => (inicioX = e.touches[0].clientX), { passive: true });
  galeria.addEventListener('touchend', (e) => {
    if (inicioX === null) return;
    const distancia = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(distancia) > 40) mostrar(actual + (distancia < 0 ? 1 : -1));
    inicioX = null;
  });

  mostrar(0);
});

/* ---------- 3. Botón de favoritos (corazón) ---------- */
$$('.favorito').forEach((boton) => {
  boton.addEventListener('click', () => {
    const activo = boton.getAttribute('aria-pressed') === 'true';
    boton.setAttribute('aria-pressed', String(!activo));
  });
});

/* ---------- 4. Ventana "Ver experiencia" ---------- */
// Contenido de cada experiencia (texto de ejemplo, editable)
const experiencias = {
  japon: {
    destino: 'Japón',
    lugar: 'Asia · 12–14 días sugeridos',
    imagen: 'img/japon.svg',
    alt: 'Monte Fuji con pagoda y cerezos en flor',
    texto: 'Un recorrido que combina la energía de Tokio con la calma de Kioto y los paisajes del monte Fuji.',
    momentos: [
      'Tokio: los barrios de Shibuya y Asakusa',
      'Kioto: templos y el bosque de bambú de Arashiyama',
      'Noche en un ryokan con vista al monte Fuji',
      'Traslados en tren bala (Shinkansen)',
    ],
    dato: 'Sugerencia: primavera (temporada de cerezos) y otoño suelen ser las épocas más agradables.',
  },
  italia: {
    destino: 'Italia',
    lugar: 'Europa · 10–12 días sugeridos',
    imagen: 'img/italia.svg',
    alt: 'Pueblo costero italiano con casas de colores',
    texto: 'Historia, arte y buena mesa: de las ruinas de Roma a los pueblos colgados sobre el Mediterráneo.',
    momentos: [
      'Roma: el Coliseo y los Museos Vaticanos',
      'Florencia y los viñedos de la Toscana',
      'Clase de cocina italiana',
      'Costa Amalfitana: Positano y paseo en barco',
    ],
    dato: 'Sugerencia: primavera y septiembre ofrecen buen clima con menos calor que el verano.',
  },
  riviera: {
    destino: 'Riviera Maya',
    lugar: 'México · 6–8 días sugeridos',
    imagen: 'img/riviera-maya.svg',
    alt: 'Templo maya frente al mar Caribe',
    texto: 'Playas de arena blanca, historia maya y naturaleza única en el Caribe mexicano.',
    momentos: [
      'Zona arqueológica de Tulum frente al mar',
      'Nado en cenotes de agua cristalina',
      'Excursión a Chichén Itzá',
      'Snorkel en los arrecifes de Cozumel',
    ],
    dato: 'Sugerencia: de diciembre a abril es la temporada más seca.',
  },
};

const modal = $('#modal');
let destinoElegido = '';

function abrirExperiencia(clave) {
  const exp = experiencias[clave];
  destinoElegido = exp.destino;
  $('#modalImagen').src = exp.imagen;
  $('#modalImagen').alt = exp.alt;
  $('#modalLugar').textContent = exp.lugar;
  $('#modalTitulo').textContent = exp.destino;
  $('#modalTexto').textContent = exp.texto;
  $('#modalDato').textContent = exp.dato;

  const lista = $('#modalLista');
  lista.innerHTML = '';
  exp.momentos.forEach((momento) => {
    const li = document.createElement('li');
    li.textContent = momento;
    lista.appendChild(li);
  });

  modal.showModal();
}

$$('[data-experiencia]').forEach((boton) => {
  boton.addEventListener('click', () => abrirExperiencia(boton.dataset.experiencia));
});

$('#modalCerrar').addEventListener('click', () => modal.close());

// Clic fuera de la ventana (en el fondo oscuro) = cerrar
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close();
});

// "Cotizar este viaje": cierra la ventana y prellena el formulario
$('#modalCotizar').addEventListener('click', () => {
  modal.close();
  irAlFormulario({ destino: destinoElegido });
});

/* ---------- 5. Ir al formulario con datos prellenados ---------- */
function irAlFormulario(datos = {}) {
  if (datos.destino) $('#destino').value = datos.destino;
  if (datos.fecha) $('#fecha').value = datos.fecha;
  if (datos.viajeros) $('#viajeros').value = datos.viajeros;

  // Si ya se había enviado una solicitud, volvemos a mostrar el formulario
  if (!$('#exito').hidden) mostrarFormularioDeNuevo();

  $('#cotizar').scrollIntoView({ behavior: menosMovimiento ? 'auto' : 'smooth' });
  setTimeout(() => $('#nombre').focus({ preventScroll: true }), 700);
}

// Buscador rápido del hero
$('#buscador').addEventListener('submit', (e) => {
  e.preventDefault();
  irAlFormulario({
    destino: $('#bDestino').value,
    fecha: $('#bFecha').value,
    viajeros: $('#bViajeros').value,
  });
});

/* ---------- 6. Formulario de cotización ---------- */
const formulario = $('#formulario');
const exito = $('#exito');

// No se pueden elegir fechas pasadas
$('#fecha').min = HOY;
$('#bFecha').min = HOY;

// Reglas: cada función devuelve un mensaje de error, o '' si todo está bien
const reglas = {
  nombre: (valor) => (valor.trim().length >= 2 ? '' : 'Escribe tu nombre (mínimo 2 letras).'),
  correo: (valor) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim()) ? '' : 'Escribe un correo válido, por ejemplo ana@correo.com.',
  destino: (valor) => (valor ? '' : 'Elige un destino.'),
  viajeros: (valor) => {
    const numero = Number(valor);
    return Number.isInteger(numero) && numero >= 1 && numero <= 20 ? '' : 'Indica entre 1 y 20 viajeros.';
  },
  fecha: (valor) => {
    if (!valor) return 'Elige una fecha aproximada.';
    if (valor < HOY) return 'La fecha no puede ser anterior a hoy.';
    return '';
  },
};

// Revisa un campo y muestra (o quita) su mensaje de error
function validarCampo(campo) {
  const error = reglas[campo.name](campo.value);
  const contenedor = campo.closest('.campo');
  contenedor.classList.toggle('campo--error', error !== '');
  $('.campo__error', contenedor).textContent = error;
  campo.setAttribute('aria-invalid', error !== '');
  return error === '';
}

const camposConReglas = Object.keys(reglas).map((nombre) => formulario.elements[nombre]);

camposConReglas.forEach((campo) => {
  // Revisa al salir del campo, si ya escribió algo…
  campo.addEventListener('blur', () => {
    if (campo.value !== '') validarCampo(campo);
  });
  // …y mientras escribe, solo si ya tenía un error (para no regañar antes de tiempo)
  campo.addEventListener('input', () => {
    if (campo.closest('.campo').classList.contains('campo--error')) validarCampo(campo);
  });
});

formulario.addEventListener('submit', (e) => {
  e.preventDefault(); // no hay servidor: nos quedamos en la página

  const resultados = camposConReglas.map(validarCampo);
  const primerError = camposConReglas[resultados.indexOf(false)];
  if (primerError) {
    primerError.focus();
    return;
  }

  // Todo correcto: armamos el mensaje de éxito
  const datos = Object.fromEntries(new FormData(formulario));
  const [anio, mes, dia] = datos.fecha.split('-').map(Number);
  const fechaBonita = new Date(anio, mes - 1, dia).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const viajeros = Number(datos.viajeros) === 1 ? '1 viajero' : `${datos.viajeros} viajeros`;
  const destino = datos.destino === 'Otro' ? 'un destino a tu medida' : datos.destino;
  const nombre = datos.nombre.trim().split(' ')[0];

  $('#exitoTitulo').textContent = `¡Gracias, ${nombre}!`;
  $('#exitoTexto').textContent =
    `Recibimos tu solicitud para ${destino} (${viajeros}, alrededor del ${fechaBonita}). ` +
    `En un sitio real, un asesor te escribiría a ${datos.correo.trim()} con tu propuesta.`;

  formulario.hidden = true;
  exito.hidden = false;
  exito.scrollIntoView({ behavior: menosMovimiento ? 'auto' : 'smooth', block: 'center' });
});

function mostrarFormularioDeNuevo() {
  formulario.reset();
  $$('.campo--error', formulario).forEach((c) => c.classList.remove('campo--error'));
  $$('.campo__error', formulario).forEach((p) => (p.textContent = ''));
  exito.hidden = true;
  formulario.hidden = false;
}

$('#btnOtra').addEventListener('click', () => {
  mostrarFormularioDeNuevo();
  $('#nombre').focus();
});

/* ---------- 7. Año actual en el footer ---------- */
$('#anio').textContent = new Date().getFullYear();

/* ---------- 8. Animaciones ---------- */
const avion = $('#avion');

// Hace visible el avión y lo pone a volar por la ruta
function lanzarAvion() {
  avion.setAttribute('opacity', '1');
  $('#vuelo').beginElement();
}

if (!hayGSAP || menosMovimiento) {
  // Sin GSAP (o con movimiento reducido): todo queda visible y quieto
  $('.intro').remove();
  if (!menosMovimiento) setTimeout(lanzarAvion, 500);
} else {
  gsap.registerPlugin(ScrollTrigger);
  animacionHero();
  animacionesScroll();
  efectoProfundidad();
}

/* 8.1 La animación WOW del hero */
function animacionHero() {
  // Preparamos la ruta para "dibujarla" de inicio a fin
  const ruta = $('#rutaDibujo');
  const largo = ruta.getTotalLength();
  gsap.set(ruta, { strokeDasharray: largo, strokeDashoffset: largo });

  const linea = gsap.timeline({ defaults: { ease: 'power4.out' } });

  linea
    // 1) Cortina: aparecen y desaparecen las letras de "Nómada"
    .from('.intro__logo span', { yPercent: 110, duration: 0.7, stagger: 0.05 })
    .to('.intro__logo span', { yPercent: -110, duration: 0.45, stagger: 0.03, ease: 'power3.in' }, '+=0.25')
    .to('.intro', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.15')
    .set('.intro', { display: 'none' })

    // 2) El paisaje: se acerca, sale el sol y suben las montañas
    .from('.hero__escena', { scale: 1.2, transformOrigin: '50% 80%', duration: 2.4, ease: 'power3.out' }, '-=0.75')
    .from('#sol', { y: 220, duration: 2.2 }, '<')
    .from('.montana', { scaleY: 0, transformOrigin: '50% 100%', duration: 1.6, stagger: 0.12 }, '<0.1')

    // 3) El título sube palabra por palabra
    .from('.hero__titulo .palabra', { yPercent: 115, duration: 1.1, stagger: 0.08 }, '<0.3')
    .from(['.hero__etiqueta', '.hero__texto', '.hero__botones', '.buscador'],
      { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 }, '<0.4')

    // 4) Se dibuja la ruta y despega el avión
    .to(ruta, { strokeDashoffset: 0, duration: 3, ease: 'power2.inOut', onStart: lanzarAvion }, '<');

  // Parallax del hero: cada capa baja a su propia velocidad al hacer scroll
  $$('.hero .capa').forEach((capa) => {
    const velocidad = parseFloat(capa.dataset.velocidad);
    gsap.to(capa, {
      y: velocidad * 500,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  // Los textos del hero suben y se desvanecen al salir
  gsap.to('.hero__contenido', {
    y: -90,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true },
  });

  // Con mouse: el paisaje sigue suavemente al cursor
  if (window.matchMedia('(pointer: fine)').matches) {
    const capas = $$('.hero .capa').map((capa) => ({
      mover: gsap.quickTo(capa, 'x', { duration: 1.2, ease: 'power3.out' }),
      fuerza: 60 * (0.6 - parseFloat(capa.dataset.velocidad)),
    }));
    $('.hero').addEventListener('pointermove', (e) => {
      const centro = e.clientX / window.innerWidth - 0.5; // de -0.5 a 0.5
      capas.forEach((c) => c.mover(-centro * c.fuerza));
    });
  }
}

/* 8.2 Animaciones al hacer scroll */
function animacionesScroll() {
  // Los bloques marcados con data-revelar aparecen subiendo
  gsap.set('[data-revelar]', { y: 50, opacity: 0 });
  ScrollTrigger.batch('[data-revelar]', {
    start: 'top 88%',
    once: true,
    onEnter: (lote) => gsap.to(lote, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out' }),
  });

  // La frase grande se "enciende" palabra por palabra
  const frase = $('#frase');
  frase.innerHTML = frase.textContent
    .trim()
    .split(' ')
    .map((palabra) => `<span class="p">${palabra}</span>`)
    .join(' ');
  gsap.fromTo('#frase .p', { opacity: 0.15 }, {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: '.frase', start: 'top 75%', end: 'bottom 70%', scrub: true },
  });

  // Parallax ligero en imágenes con data-parallax
  $$('[data-parallax]').forEach((imagen) => {
    const fuerza = parseFloat(imagen.dataset.parallax) * 100;
    gsap.fromTo(imagen, { yPercent: -fuerza }, {
      yPercent: fuerza,
      ease: 'none',
      scrollTrigger: { trigger: imagen.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* 8.3 Tarjetas con profundidad: se inclinan siguiendo el mouse */
function efectoProfundidad() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  $$('.tarjeta').forEach((tarjeta) => {
    tarjeta.addEventListener('pointermove', (e) => {
      const caja = tarjeta.getBoundingClientRect();
      const x = (e.clientX - caja.left) / caja.width - 0.5;
      const y = (e.clientY - caja.top) / caja.height - 0.5;
      gsap.to(tarjeta, { rotateY: x * 8, rotateX: -y * 8, z: 20, duration: 0.5, ease: 'power2.out' });
    });
    tarjeta.addEventListener('pointerleave', () => {
      gsap.to(tarjeta, { rotateY: 0, rotateX: 0, z: 0, duration: 0.8, ease: 'elastic.out(1, 0.6)' });
    });
  });
}
