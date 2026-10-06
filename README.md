# Nómada Travel · Landing page

Landing page de demostración para una agencia de viajes **ficticia**. Su objetivo es que la persona se interese por un destino y solicite una cotización.

## Cómo verla

Abre `index.html` en el navegador (doble clic). Para ver las animaciones y las tipografías se necesita internet, porque GSAP y las fuentes se cargan desde un CDN. Sin conexión, la página funciona igual pero sin animaciones.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | El **contenido y la estructura**: menú, hero, destinos, beneficios, pasos, formulario y footer. |
| `styles.css` | El **diseño**: colores (blanco hueso y grafito), tipografías, tarjetas, botones y adaptación a celular. |
| `script.js` | El **comportamiento**: menú móvil, galerías, favoritos, ventana "Ver experiencia", validación del formulario y animaciones con GSAP. |
| `img/` | Ilustraciones SVG originales de cada destino. |

## Cambiar las imágenes por fotografías

Guarda tus fotos (con licencia de uso) en `img/`, por ejemplo `img/japon.jpg`, y cambia `img/japon.svg` por `img/japon.jpg` en `index.html` y en `script.js`.

## Aviso

Marca, textos y destinos son de ejemplo con fines educativos. La página no guarda datos: al enviar el formulario se abre WhatsApp con la solicitud escrita, dirigida al número configurado en `script.js` (constante `WHATSAPP`), y la persona decide si la manda.

## Cambiar el número de WhatsApp

En `script.js`, edita `const WHATSAPP = '527735751575';` (código de país + número, sin espacios ni signo +). En `index.html` cambia también el número del footer y el del botón "Enviar por WhatsApp".
