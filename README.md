# CSS Quest

Juego educativo para aprender CSS desde cero hasta nivel avanzado: **200 niveles** repartidos en **10 mundos**, con editor de código, vista previa en vivo, validación real del resultado, ayudas progresivas, guardado automático y modo sin conexión. Funciona en el navegador, sin servidor ni dependencias, y está pensado para el iPhone (vertical y horizontal).

## Mundos

| Mundo | Tema | Niveles |
|---|---|---|
| 1. Taller de pintura | Fundamentos: selectores, colores, bordes, medidas | 1–20 |
| 2. Almacén de cajas | Modelo de caja, `box-sizing`, márgenes, `overflow` | 21–40 |
| 3. Imprenta | Tipografía, sombras, opacidad, contraste | 41–60 |
| 4. Ciudad nocturna | `position`, `z-index`, `sticky`, `float` | 61–80 |
| 5. Puerto | Flexbox | 81–100 |
| 6. Huerto | CSS Grid | 101–120 |
| 7. Laboratorio | Diseño adaptable: `rem`, `vw`, `clamp()`, `@media`, `@container` | 121–140 |
| 8. Galería de robots | Selectores, especificidad, pseudoclases y pseudoelementos | 141–160 |
| 9. Feria espacial | Transiciones, `transform`, `@keyframes`, variables, degradados | 161–180 |
| 10. Ciudadela final | Retos combinados, depuración, optimización y accesibilidad | 181–200 |

## Cómo se juega

1. Lee el enunciado y mira el **objetivo** (miniatura del escenario o pestaña «Objetivo»). En los niveles de colocación, los contornos discontinuos marcan dónde debe acabar cada elemento.
2. Escribe CSS en el editor. La escena se actualiza mientras escribes.
3. Pulsa **Comprobar** (o Ctrl/⌘ + Enter). El juego revisa que el código sea válido y que el **resultado visual** cumpla cada objetivo; se aceptan soluciones distintas a la de referencia si el resultado es el mismo.
4. Si algo falta, verás la lista de objetivos cumplidos y pendientes, o la línea exacta del error.
5. Al superar el nivel aparece **Siguiente nivel**. Los niveles se desbloquean en orden.

Ayudas: **Pista** → **Concepto** → **Solución** (cada una se desbloquea tras la anterior). En el móvil, al escribir aparece una barra sobre el teclado con símbolos (`{ } : ; . # ( ) %`…), el botón Comprobar y un botón para ocultar el teclado. Toca un comando de la lista para escribirlo en el editor.

## Estructura del proyecto

```
index.html            Interfaz
style.css             Estilos de la aplicación (mobile-first)
manifest.json         Datos para instalarla como app
service-worker.js     Caché para jugar sin conexión
.nojekyll             Evita el procesado de Jekyll en GitHub Pages
assets/               Iconos
js/commands.js        Explicación de una frase de cada comando CSS
js/worlds.js          Mundos, estilos base de los escenarios y registro de niveles
js/levels/w01–w10.js  Los 200 niveles (20 por archivo)
js/engine.js          Analizador de CSS, escenario aislado y API de validación
js/editor.js          Editor con resaltado, números de línea y sangría automática
js/game.js            Progreso, guardado, ayudas, mapa e interfaz
tests/                Pruebas automatizadas (Python + Playwright)
```

### Seguridad del editor

El CSS del jugador se aplica dentro de iframes con `sandbox="allow-same-origin"` (sin `allow-scripts`), así que no puede ejecutar JavaScript ni modificar la aplicación. Además se bloquean `@import`, las `url()` externas y las etiquetas HTML dentro del CSS.

### Cómo se valida cada nivel

Cada nivel tiene una función `check(t)` que devuelve una lista de objetivos `{ ok, label }`. La comprobación se hace en un escenario oculto comparándolo con otro escenario donde se aplica la solución de referencia. Algunas funciones de `t`:

- `t.same(selector, texto)`: misma posición y tamaño que en el objetivo.
- `t.color(selector, propiedad, valor, texto)`, `t.px(...)`, `t.eq(...)`: valores calculados.
- `t.center(a, b, texto)`, `t.front(selector, texto)`: centrado y orden de apilamiento.
- `t.at(ancho, fn)`: repite la comprobación con otro ancho de ventana (media queries, `vw`, `clamp()`).
- `t.hover(selector, fn)` / `t.focus(...)`: simula estados.
- `t.frame(selector, fracción, fn)`: congela una animación en un momento del ciclo.
- `t.uses(regex, texto)` / `t.avoid(...)`: restricciones explícitas sobre el código.

Para añadir un nivel, copia uno existente en `js/levels/` y ajusta sus datos (`title`, `brief`, `html`, `css`, `cmds`, `hint`, `help`, `solution`, `why`, `check`).

## Probarlo en tu ordenador

El modo sin conexión necesita un servidor (los Service Workers solo funcionan en `https://` o en `localhost`). Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000`. Alternativas: `npx serve .` (Node.js) o la extensión Live Server de VS Code.

Para probarlo en el iPhone dentro de tu red Wi-Fi, abre `http://IP-DE-TU-ORDENADOR:8000`. El juego funciona, pero el modo sin conexión solo se activa con HTTPS, como en GitHub Pages.

## Publicarlo en GitHub Pages

1. Crea un repositorio vacío en GitHub, por ejemplo `css-quest`.
2. En la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "CSS Quest"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/css-quest.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`, y **Save**.
4. En uno o dos minutos estará en `https://TU-USUARIO.github.io/css-quest/`.

Todas las rutas son relativas, así que funciona dentro de la subcarpeta del repositorio.

### Instalarlo en el iPhone

Abre la dirección en Safari, pulsa **Compartir → Añadir a pantalla de inicio**. Tras la primera carga completa, el juego abre sin conexión. El progreso se guarda en el dispositivo (LocalStorage).

## Actualizar el juego

1. Modifica los archivos.
2. **Cambia `VERSION`** en `service-worker.js` (por ejemplo, `cssquest-v1.0.1`). Si añades archivos nuevos, añádelos también a la lista `ASSETS`.
3. Sube los cambios:
   ```bash
   git add .
   git commit -m "Describe el cambio"
   git push
   ```

Al abrir el juego, el navegador detecta la nueva versión y muestra **«Hay una versión nueva de CSS Quest»** con un botón **Actualizar**. El progreso guardado no se pierde.

## Pruebas automatizadas

```bash
pip install playwright
python3 -m playwright install chromium
python3 tests/run_tests.py          # todas las pruebas
python3 tests/levels_check.py 81 100 # solo un rango de niveles
```

Las pruebas comprueban que hay 200 niveles con todos sus datos; que cada solución supera su nivel y el código inicial no; que se aceptan soluciones alternativas; los mensajes de error; el aislamiento del CSS del jugador; la progresión, el guardado y las ayudas; el modo sin conexión; las rutas relativas, y el diseño en tamaño iPhone 15 (vertical y horizontal).
