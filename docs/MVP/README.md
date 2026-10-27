# QuickMap — MVP (UNLaM)

MVP desarrollado para la validación de la hipótesis de valor de **QuickMap**, enfocado en la visualización interactiva de correlatividades de planes de estudio y el cálculo dinámico del camino crítico para estudiantes de la Universidad Nacional de La Matanza.

---

## 🚀 Cómo ejecutar la aplicación localmente

Tenés dos opciones sencillas para levantar la aplicación en tu entorno local:

### Opción 1: Ejecución con el script de 1 clic (Recomendada en Windows)
1. Abrí la carpeta `docs/MVP/`.
2. Hacé doble clic en el archivo **`run.bat`**.
3. Se abrirá la consola de comandos iniciando el servidor local y tu navegador web se abrirá automáticamente en `http://localhost:8000/`.

---

### Opción 2: Ejecución desde la terminal (PowerShell o CMD)
1. Abrí una terminal en la carpeta `docs/MVP/`:
   ```bash
   cd docs/MVP
   ```
2. Ejecutá el servidor local con Python:
   ```bash
   python server.py
   ```
3. Abrí tu navegador en:
   ```
   http://localhost:8000/
   ```

*(Nota: Para detener el servidor, presioná `Ctrl + C` en la terminal).*

---

## 📋 Funcionalidades implementadas en el MVP

1. **Pantalla 1 — Selección de Carrera:**
   - Permite seleccionar entre las 3 carreras habilitadas:
     - *Medicina* (`Medicina.json`)
     - *Licenciatura en nutrición* (`Nutricion.json`)
     - *Tecnicatura en desarrollo web* (`Desarrollo_Web.json`)
   - El botón "Ver plan de estudio" se activa únicamente tras elegir una opción válida.

2. **Pantalla 2 — Mapa de Grafos de Correlatividades:**
   - Carga el plan de estudios desde la carpeta `Planes_estudio/`.
   - Modela el mapa en un grafo interactivo: cada nodo es una materia y cada flecha dirigida representa una correlatividad.
   - Dispone las materias en columnas por niveles topológicos con trazado Bézier para facilitar la lectura.

3. **Camino Crítico Inicial:**
   - Al cargar el mapa por primera vez, se calcula el camino crítico inicial mediante el algoritmo **CPM** (Critical Path Method).
   - Las materias y aristas de la ruta crítica se destacan en **color rojo**.

4. **Selección de Materias Aprobadas y Promocionadas:**
   - Podés marcar las materias que ya aprobaste haciendo clic directamente sobre la tarjeta de la materia o tildando su casilla.

5. **Guardado Temporal en Sesión y Recálculo del Camino Crítico:**
   - Al presionar el botón **"Guardar"**:
     - Las materias aprobadas se persisten temporalmente en `sessionStorage` (válido durante tu sesión de navegación).
     - Dichas materias pasan a mostrarse **grisadas** con tilde `✓ Aprobada`.
     - El camino crítico **se recalcula dinámicamente**, ajustándose al cuello de botella restante y destacando las materias habilitadas prioritarias para inscribirte el próximo cuatrimestre.

6. **Exploración Fluida:**
   - **Zoom y Paneo:** Podes arrastrar el mapa con el ratón o usar los controles `+`, `−` y `⊙` (Ajustar).
   - **Inspección de Correlatividades:** Al pasar el mouse sobre una materia, se iluminan sus correlativas requeridas (en azul) y las materias que desbloquea a futuro (en verde).
   - **Cambio de carrera:** Podés volver a la pantalla inicial en cualquier momento con el botón "← Cambiar carrera".

---

## 📁 Estructura de archivos del MVP

```text
docs/MVP/
├── Planes_estudio/
│   ├── Desarrollo_Web.json   # Plan de estudios de Tecnicatura en Desarrollo Web
│   ├── Medicina.json         # Plan de estudios de Medicina
│   └── Nutricion.json        # Plan de estudios de Licenciatura en Nutrición
├── index.html                # Interfaz principal (Pantallas 1 y 2)
├── styles.css                # Estilos visuales basados en los wireframes
├── cpm.js                    # Algoritmo de Grafo DAG y Camino Crítico (CPM)
├── app.js                    # Lógica de la app, interacción y sessionStorage
├── data-fallback.js          # Datos embebidos de respaldo para ejecución offline
├── server.py                 # Servidor HTTP local nativo en Python 3
├── run.bat                   # Lanzador automático de 1 clic para Windows
├── DECISIONES.md             # Documentación exhaustiva de todas las decisiones
└── README.md                 # Guía de uso y documentación del MVP
```
