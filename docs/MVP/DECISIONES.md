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

---

## 7. Mejoras Implementadas a partir del Feedback de Early Adopters

Tras presentar el diseño inicial a *early adopters*, se incorporaron cinco ajustes de alta prioridad para optimizar la comprensión y usabilidad del mapa:

1. **Diferenciación de Materias Bloqueadas vs. No Seleccionadas (Punto 1):**
   - *Problema:* Las materias bloqueadas tenían un aspecto similar al de las materias disponibles no seleccionadas.
   - *Solución:* Las materias bloqueadas (`status-bloqueada`) ahora tienen un fondo visiblemente más opaco (`#d8d5cb`), bordes atenuados y menor opacidad global (`0.72`), diferenciándose a primera vista de las materias disponibles no seleccionadas (`#ffffff`, activas y destacadas).
2. **Agrupación Vertical Estructurada por Año de Cursada (Punto 2):**
   - *Problema:* La disposición libre por niveles topológicos no permitía ubicar temporalmente a qué año de la carrera correspondía cada materia.
   - *Solución:* Se integró el atributo `anio` provisto en los planes JSON para estructurar el mapa en columnas verticales correspondientes a cada año (`1° Año`, `2° Año`, `3° Año`, etc.), disponiendo verticalmente las materias que pertenecen al mismo año y ordenándolas con base en sus correlatividades internas.
3. **Flechas Direccionales Explícitas hacia Materias Desbloqueadas (Punto 3):**
   - *Problema:* Las conexiones sin flechas evidentes inducían a confusión sobre cuál materia era la correlativa y cuál era la desbloqueada.
   - *Solución:* Se ajustaron los marcadores SVG para que las flechas sean grandes, visibles y terminen antes de los nodos, señalando de forma unívoca el sentido del flujo (`prerrequisito -> materia desbloqueada`), tanto en conexiones inter-año (hacia la derecha) como intra-año (bucle curvo lateral orientado hacia el dependiente).
4. **Independencia del Color mediante Símbolos de Accesibilidad / Daltonismo (Punto 4):**
   - *Problema:* Depender únicamente de colores (verde, rojo, azul, gris) perjudicaba a usuarios con daltonismo.
   - *Solución:* Se incorporó un sistema redundante de símbolos estándar tanto en las tarjetas como en la leyenda:
     - Tilde (`✓`): Materias aprobadas / promocionadas.
     - Candado (`🔒`): Materias bloqueadas por correlativas pendientes.
     - Círculo (`○`): Materias habilitadas y disponibles para cursar.
5. **Título Prominente de Carrera en la Pantalla del Mapa (Punto 5):**
   - *Problema:* Al ingresar a la pantalla del mapa se perdía el contexto de la carrera elegida.
   - *Solución:* Se incorporó un encabezado de título jerárquico (`<h1>`) que exhibe claramente el nombre de la carrera activa (`Plan de estudio de: [Carrera]`), manteniendo siempre visible el contexto de navegación.

---

## 8. Modificaciones Post-Revisión del MVP (Iteración de Refinamiento)

Conforme al feedback posterior a la puesta a prueba del MVP, se implementaron 10 modificaciones con prioridad sobre lo definido previamente en los wireframes y el `brief.md`:

1. **Materias Aprobadas o Promocionadas (`status-aprobada`):**
   - *Ajuste:* Fondo blanco (`#ffffff`), borde verde (`2px solid var(--green)`) y texto en color verde (`#2e7d32`).
   - *Impacto:* Reemplaza el grisado previo por una identidad limpia y destacada en verde sobre fondo blanco.
2. **Materias en Camino Crítico (`status-critica`):**
   - *Ajuste:* Fondo blanco (`#ffffff`), con borde rojo (`2px solid var(--red)`) y texto en color rojo (`#c62828`).
   - *Impacto:* Elimina el fondo rosado/rojizo, manteniendo la alerta visual de forma nítida en bordes y tipografía.
3. **Ubicación Exclusiva del Símbolo en la Esquina Superior Derecha:**
   - *Ajuste:* El símbolo (`✓`, `○`, `🔒`) se ubica únicamente en la parte superior derecha de la tarjeta. Se eliminó el checkbox interactivo (`<input type="checkbox">`); la selección se realiza haciendo clic directamente sobre la tarjeta del nodo.
4. **Mayor Separación Espacial entre Nodos:**
   - *Ajuste:* Se incrementó la separación vertical entre tarjetas (`rowGap` de 24px a 40px) y la separación entre columnas de años (`yearGap` a 130px), facilitando la lectura clara de qué materia desbloquea a cuál sin saturación visual.
5. **Puntas de Flechas más Pequeñas:**
   - *Ajuste:* Se rediseñaron los marcadores SVG (`markerWidth="5"`, `markerHeight="5"`), reduciendo el tamaño de las puntas de flecha para un acabado visual refinado y preciso.
6. **Restricción Estricta de Aprobación por Correlatividades Previas:**
   - *Ajuste:* Se bloquea la selección de una materia como aprobada a menos que todas las materias correlativas que la desbloquean hayan sido marcadas previamente como aprobadas. Al intentar marcar una materia bloqueada, el sistema emite un aviso Toast detallando las materias faltantes y dispara una animación de rechazo (`shake-error`) en la tarjeta. Al desmarcar una materia, se desmarcan en cascada las materias dependientes para asegurar consistencia total.
7. **Fondo del Mapa más Claro:**
   - *Ajuste:* Se actualizó `--bg` a un tono blanco cálido más luminoso (`#f8f7f4`), optimizando el contraste general.
8. **Eliminación del Texto de Estado debajo del Nombre:**
   - *Ajuste:* Se suprimió la fila inferior de etiquetas de estado (`.node-bottom-row`). El estado de la materia se visualiza exclusivamente mediante el color del nodo (borde/letra) y el símbolo superior derecho.
9. **Distribución Horizontal Intra-Año para Materias que Desbloquean Otras del Mismo Año:**
   - *Ajuste:* Dentro de cada columna de año, las materias que desbloquean a otras del mismo año se posicionan a la izquierda (sub-columna 0) y las dependientes a la derecha (sub-columna 1), agrupadas bajo el mismo encabezado y recuadro contenedor tenue de año. Esto garantiza que todas las flechas fluyan naturalmente de izquierda a derecha.
10. **Ajuste de la Barra de Leyenda de Estados:**
    - *Ajuste:* El símbolo de cada estado se ubicó a la derecha de su nombre, se eliminaron los paréntesis `(Grisada)` y `(Opaca)`, y el color de las letras de cada ítem de leyenda coincide exactamente con su color asignado (Rojo para crítico, Azul para disponible, Gris para bloqueada, Verde para aprobada).
