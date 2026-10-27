# Documento de Decisiones de Diseño y Arquitectura — QuickMap (MVP)

**Materia:** Gestión Aplicada al Desarrollo de Software II (UNLaM)  
**Proyecto:** QuickMap — Planificador Curricular y Visualizador de Camino Crítico  
**Versión:** MVP 1.0  

Este documento detalla y justifica cada una de las decisiones técnicas, algorítmicas, arquitectónicas y de usabilidad tomadas durante el desarrollo del MVP de QuickMap, en cumplimiento estricto con el [brief.md](../brief.md) y las especificaciones del proyecto.

---

## 1. Decisiones de Arquitectura y Stack Tecnológico

### 1.1 Front-end: HTML5 + CSS3 Vanilla + JavaScript ES6+ (Módulos)
* **Decisión:** Se utilizó Vanilla JavaScript modular nativo, HTML5 semántico y CSS3 puro con variables (Custom Properties), sin frameworks pesados (React, Angular, Vue) ni dependencias de npm.
* **Justificación:**
  1. **Entorno local:** El sistema operativo anfitrión no contaba con Node.js / npm instalados. Una arquitectura Vanilla no requiere etapas de transpilación, bundlers (`vite`, `webpack`) ni carpetas `node_modules` de cientos de megabytes.
  2. **Rendimiento y velocidad de carga:** La aplicación carga de manera instantánea en cualquier navegador moderno sin latencia de renderizado virtual.
  3. **Portabilidad y entrega:** El código fuente es directamente legible, auditable y mantenible por cualquier evaluador o estudiante sin configuración previa.

### 1.2 Back-end y Servidor Local: Python 3.11 (`http.server` optimizado)
* **Decisión:** Se implementó `server.py` utilizando únicamente la biblioteca estándar de Python 3 (`http.server`, `socketserver`, `webbrowser`). Adicionalmente se creó `run.bat` para ejecución en 1 clic en Windows.
* **Justificación:**
  1. **Disponibilidad en el entorno:** Python 3.11.9 está instalado de forma nativa en el equipo.
  2. **Cero dependencias externas:** No requiere `pip install` ni entornos virtuales `venv`.
  3. **Seguridad y compatibilidad:** Resuelve las restricciones de CORS que imponen los navegadores al leer archivos JSON locales mediante `fetch()` sobre el protocolo `file://`, garantizando al mismo tiempo tipos MIME correctos (`application/javascript`, `application/json`).
  4. **Resiliencia cliente (Fallback):** En `app.js` y `data-fallback.js` se incluyó un respaldo de datos en memoria para que, en caso de que alguien abra directamente el `index.html` sin servidor, la aplicación continúe funcionando sin interrupciones.

---

## 2. Decisión del Algoritmo de Camino Crítico (CPM)

* **Decisión:** Se adoptó el algoritmo **Critical Path Method (CPM)** modelando el plan de estudios como un **Grafo Dirigido Acíclico (DAG)** con duración unitaria por materia ($D = 1$ cuatrimestre), evaluando holgura nula ($Slack = 0$) y recalculando dinámicamente sobre el subgrafo de materias restantes no aprobadas.
* **Justificación:**
  1. **Fundamento en Ingeniería de Software y Gestión de Proyectos:** GADS II es una materia centrada en gestión de proyectos. El método de la ruta crítica (CPM) es el estándar formal de la industria para determinar la secuencia de actividades cuello de botella que condicionan la fecha de finalización del proyecto (en este caso, la graduación del estudiante).
  2. **Cálculo Matemático Riguroso:**
     - En el subgrafo de materias no aprobadas $R$:
       - $remES(u)$: Distancia mínima en cuatrimestres desde las materias disponibles actualmente hasta $u$. Si $u$ ya está habilitada para cursar, $remES(u) = 1$. Si adeuda correlativas no aprobadas, $remES(u) = 1 + \max_{c \in prereqs(u) \cap R} remES(c)$.
       - $remLF(u)$: Distancia máxima en cuatrimestres desde $u$ hasta los nodos terminales (materias finales de la carrera).
       - Longitud total de la cadena que pasa por $u$: $Chain(u) = remES(u) + remLF(u) - 1$.
       - La duración máxima remanente es $L_{max} = \max_{u \in R} Chain(u)$.
       - Toda materia con $Chain(u) == L_{max}$ posee **holgura cero** y pertenece al Camino Crítico.
  3. **Dinámica adaptativa al guardar materias:** Cuando el estudiante guarda materias aprobadas, estas salen del conjunto $R$ de esfuerzo pendiente. El algoritmo detecta automáticamente las nuevas materias habilitadas y recalcula la cadena crítica más larga hacia el egreso, señalando al alumno qué materia priorizar para no demorarse.

---

## 3. Decisión del Layout del Grafo (Estratificación Topológica)

* **Decisión:** Se implementó un algoritmo de **nivelación topológica por columnas** combinado con ordenamiento de baricentro (*barycenter heuristic*) para el posicionamiento vertical dentro de cada nivel, con conexiones mediante curvas Bézier cúbicas vectoriales (`<svg>`).
* **Justificación:**
  1. **Modelo mental curricular:** Los grafos de simulación física (fuerza dirigida como D3 force) resultan desordenados y oscilantes para un estudiante universitario, quien necesita ver la progresión temporal clara de izquierda a derecha (Nivel 1 a Nivel N).
  2. **Minimización de cruces de aristas:** La heurística del baricentro ubica verticalmente cada materia cerca del promedio de las posiciones de sus correlativas previas, reduciendo drásticamente el cruce de líneas.
  3. **Trazado Bézier:** Las curvas cúbicas conectan el borde derecho del prerrequisito con el borde izquierdo de la materia habilitada, garantizando legibilidad y flechas orientadas limpiamente.

---

## 4. Decisión de Persistencia Temporal en Sesión

* **Decisión:** Se utilizó `window.sessionStorage` bajo la clave `quickmap_approved_{carrera}` para almacenar la lista de materias aprobadas.
* **Justificación:**
  1. **Alineación con el Brief y el Scope del MVP:** El brief excluye intencionalmente el sistema de login y cuentas de usuario en el MVP para evitar sobrecostos innecesarios en la validación de la hipótesis central.
  2. **Ciclo de vida exacto:** El requerimiento estipula que las materias aprobadas deben persistir *solamente mientras dure la sesión del usuario*. `sessionStorage` mantiene los datos intactos si el usuario refresca la página o navega entre carreras, pero se destruye automáticamente al cerrar la pestaña o el navegador, asegurando privacidad y cumplimiento estricto.

---

## 5. Decisiones de Diseño Visual y Usabilidad (UX/UI)

* **Decisión:** Adopción estricta de los tokens de color y layout de los wireframes conceptuales (`docs/diseno/wireframe/wireframe_quickmap.html` y `alternativa_c.html`).
* **Justificación de los estados visuales:**
  - **Materias Aprobadas / Promocionadas (`status-aprobada`):** Se muestran **grisadas** (`background: var(--gray-bg); border: var(--gray-border); opacity: 0.65;`) con ícono de verificación `✓ Aprobada`. Cumple la instrucción explícita del usuario de que aparezcan grisadas tras presionar "Guardar".
  - **Camino Crítico (`status-critica`):** Resaltado en color rojo (`background: var(--red-bg); border: 2px solid var(--red); color: var(--red-text)`), tal como define el brief en su flujo principal ("se marca en color rojo las materias que lo conforman").
  - **Habilitadas para cursar (`status-habilitada`):** Fondo blanco y borde azul distintivo (`#1a2b6b`), indicando que el alumno puede inscribirse inmediatamente el próximo cuatrimestre.
  - **Bloqueadas (`status-bloqueada`):** Fondo neutro y borde gris regular, señalando que faltan correlativas.
  - **Interacciones de Paneo y Zoom:** Para planes con muchas materias (como Medicina con 36 o Nutrición con 44), se incluyeron controles de zoom (+, -, restablecer) y arrastre con mouse, permitiendo explorar la red con total fluidez.
  - **Inspección de correlatividades al pasar el mouse (Hover):** Al situar el cursor sobre una materia, se iluminan en azul sus correlativas previas y en verde las materias que desbloquea, atenuando el resto de las líneas para evitar sobrecarga cognitiva.

---

## 6. Cumplimiento Estricto de Restricciones (Scope del MVP)

* **Decisión:** Se evitó deliberadamente incluir cualquier funcionalidad fuera del scope, conforme a la instrucción *"NO DEBES AGREGAR NINGUNA FUNCIONALIDAD EXTRA NI DETALLE VISUAL QUE NO APORTE AL MVP"*.
* **Elementos expresamente excluidos y justificados:**
  1. *Sin módulo de Login / Registro:* Excluido porque en el MVP no se requiere almacenar perfiles de alumnos en bases de datos remotas.
  2. *Sin cálculo de promedio acumulado ni aplazos:* Requiere integración compleja con Intraconsulta que no aporta a la validación del camino crítico.
  3. *Sin porcentaje de completitud:* Excluido para focalizar la atención del usuario en qué materias cursar a continuación.
  4. *Sin movimiento libre drag-and-drop de materias:* Excluido según el brief (pág. 176) por tratarse de un detalle cosmético que no aporta a la hipótesis de valor.
