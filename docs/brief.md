# Brief de Proyecto: QuickMap

**Versión de Documento:** 1.0  
**Fecha:** 23 de Agosto de 2026  
**Materia:** Gestión Aplicada al Desarrollo de Software II (3665)  
**Universidad Nacional de La Matanza (UNLaM)**

---

## 1. Integrantes del Equipo

* **Nombre del Equipo:** QuickMap
* **Repositorio GitHub:** `gadsii-quickmap`
* **Miembros:**
  * Facundo Carballo
  * Matias Garcia Burgio
  * Federico Castro
  * Agostina Mottura
  * Ignacio Romero

### Descripción

QuickMap es una herramienta destinada a los estudiantes de la UNLaM que permite visualizar de forma clara y actualizada su progreso académico. A través de un mapa interactivo de la carrera, muestra las materias aprobadas, las correlatividades disponibles, el camino crítico, el promedio y el porcentaje de avance, facilitando la planificación de las próximas materias a cursar y adaptándose a los cambios en los planes de estudio.

---

## 2. Segmento Elegido y Acceso a los Usuarios

### El Segmento

El segmento seleccionado de la comunidad UNLaM está conformado por los **estudiantes de los primeros años (1° y 2° año) de las carreras de la UNLaM**.

* **Descripción y Tamaño Estimado:** La UNLaM cuenta con una matrícula activa superior a los 60.000 estudiantes. Se estima que el grupo de ingresantes y alumnos de primeros años representa entre un 25% y un 30% del total (aproximadamente entre 15.000 y 18.000 alumnos). Estos alumnos transitan los ciclos básicos, introductorios o las primeras materias específicas de sus respectivas carreras.
* **Qué los distingue del resto:** Provienen principalmente de la escuela secundaria, un entorno con una estructura curricular rígida donde las materias y los horarios están preestablecidos de manera automática. Al ingresar a la universidad, se enfrentan por primera vez a un modelo de autogestión: deben decidir cuántas y cuáles materias cursar en cada cuatrimestre, interpretar regímenes de correlatividades complejos y entender cómo impactan sus notas en su avance académico. Al estar en su etapa inicial, no disponen de una red de contactos consolidada (compañeros de años avanzados, graduados o docentes) que los oriente en la toma de decisiones estratégicas de cursada.
* **Por qué este segmento y no otro:** Los estudiantes de primeros años son los que experimentan el mayor nivel de desorientación inicial y frustración curricular. Son los más propensos a cometer errores de inscripción (como cursar materias secundarias y postergar materias "clave"), lo que genera demoras involuntarias en sus carreras y, en el peor de los casos, deserción temprana. Al enfocar el producto en este segmento, QuickMap ataca el problema de raíz en su punto más crítico. Además, es un segmento altamente escalable: un ingresante que adopte QuickMap lo seguirá utilizando como usuario a lo largo de toda su carrera universitaria.

### El Acceso a los Usuarios

Para validar nuestras hipótesis y probar la solución, hemos seleccionado a tres usuarios reales que pertenecen estrictamente a nuestro segmento y que representan a diferentes departamentos de la UNLaM para asegurar diversidad de perspectivas académicas:

1. **Usuario 1 (U1): Agustín Larizza**
   * **Rol:** Estudiante de 1° año de la Tecnicatura en Desarrollo Web (Departamento de Ingeniería e Investigaciones Tecnológicas - DIIT).
   * **Origen/Relación:** Amigo cercano de un integrante del equipo. Llegamos a él de manera directa en el ámbito social.
   * **Disponibilidad:** Confirmada explícitamente para las dos instancias de validación: el relevamiento de necesidades (TP2 - última semana de agosto) y la prueba de usabilidad del MVP (TP5 - última semana de septiembre).

2. **Usuario 2 (U2): Gonzalo Carballo**
   * **Rol:** Estudiante de 2° año de la Licenciatura en Nutrición (Departamento de Ciencias de la Salud).
   * **Origen/Relación:** Hermano de uno de los integrantes de nuestro equipo. Declaramos esta relación con total transparencia, reconociendo que sus respuestas pueden estar influenciadas por el deseo de apoyar nuestro proyecto. Mitigaremos este sesgo contrastando minuciosamente sus opiniones con el resto de los participantes independientes.
   * **Disponibilidad:** Confirmada explícitamente para las dos instancias de validación: el relevamiento de necesidades (TP2 - última semana de agosto) y la prueba de usabilidad del MVP (TP5 - última semana de septiembre).

3. **Usuario 3 (U3): Martina Bartoli**
   * **Rol:** Estudiante de 1° año de la carrera de Medicina (Departamento de Ciencias de la Salud).
   * **Origen/Relación:** Amiga cercana de un integrante de nuestro equipo. Llegamos a ella de manera directa mediante actividades de ocio compartidas.
   * **Disponibilidad:** Confirmada explícitamente para las dos instancias de validación: el relevamiento de necesidades (TP2 - última semana de agosto) y la prueba de usabilidad del MVP (TP5 - última semana de septiembre).

---

## 3. Definición del Producto

* **Nombre del Producto:** QuickMap
* **Problema concreto que resuelve y a quién:** Resuelve la falta de visibilidad del avance académico y la desorientación en la planificación curricular que sufren los estudiantes de los primeros años de la UNLaM. Les evita tomar decisiones ineficientes de inscripción y demorarse en la carrera al no comprender las relaciones de correlatividad ocultas en planes de estudio en formato texto o PDF.

### Funcionalidades CORE

1. **Mapa de Correlatividades Interactivo (Visualizador de Red):** En lugar de un listado textual, QuickMap ofrece un mapa visual e interactivo del plan de estudios de la carrera del usuario, donde las materias se representan como nodos interconectados. Al seleccionar una materia, se destacan claramente sus correlativas necesarias (hacia atrás) y las asignaturas que habilita (hacia adelante).
2. **Seguimiento Dinámico del Progreso Académico:** Clasificación visual automática de las materias según su estado académico actual mediante una gama de colores intuitiva: *Aprobada* (con nota final), *Cursando* (en cuatrimestre activo), *Regular* (cursada aprobada, final pendiente), *Habilitada para cursar* (cumple con las correlativas) y *Bloqueada* (faltan correlativas).
3. **Proyección del Camino Crítico:** Un motor de sugerencia que resalta la ruta óptima de asignaturas prioritarias que el estudiante debería cursar en el siguiente cuatrimestre para maximizar su avance y evitar bloqueos a futuro por materias con alta densidad de correlatividades.
4. **Simulador de Promedio e Inscripción:** Un módulo que permite al estudiante realizar simulaciones de calificaciones en materias cursando o proyectar cuatrimestres futuros. El sistema calcula en tiempo real el promedio proyectado (con y sin aplazos), el porcentaje de progreso general de la carrera y desbloquea dinámicamente las materias resultantes en el mapa.

### Integraciones Tecnológicas Previstas

* **Sistema de Autenticación de Usuarios de la UNLaM (OAuth / Intraconsulta):** Necesario para verificar de forma segura que el usuario es un alumno regular de la UNLaM y asegurar que solo él pueda ver y operar sobre sus datos de rendimiento académico, resguardando la privacidad de la información.
* **API de Notas e Historial Académico de la UNLaM (o scraper simulado de Intraconsulta):** Es indispensable para extraer automáticamente el historial académico real del alumno (materias aprobadas, notas, planes de estudio activos). Esto evita que el estudiante tenga que cargar manualmente su historial (proceso propenso a errores y abandono) y asegura que el mapa de correlativas, el progreso y el promedio acumulado se sincronicen en tiempo real de manera transparente ni bien se carga un acta de examen en Intraconsulta.

---

## 4. Identificar los Grupos de Usuarios

El producto interactuará con dos perfiles de usuarios diferenciados dentro de la comunidad de estudiantes de la UNLaM:

### Grupo 1: Estudiantes de primeros años (Grupo Primario)

* **Quiénes son:** Estudiantes que están cursando su primer o segundo año de carrera en la UNLaM, usualmente recién salidos del secundario.
* **Relación con el problema:** Tienen muy poco conocimiento sobre cómo gestionar su carrera, no comprenden del todo las correlativas y se sienten abrumados por la transición de tener un horario escolar preestablecido a tener que planificar autónomamente su cursada.
* **Qué los motivaría a usar QuickMap:** Encontrar una herramienta amigable, visual y libre de burocracia que les diga exactamente qué materias pueden cursar, cuáles les conviene priorizar para avanzar más rápido y cómo organizar sus próximos cuatrimestres sin cometer errores que retrasen su graduación.

### Grupo 2: Estudiantes intermedios o avanzados (Grupo Secundario)

* **Quiénes son:** Estudiantes en su tercer año o superior, que ya dominan los procesos administrativos de la universidad.
* **Relación con el problema:** Aunque entienden el sistema, invierten tiempo excesivo en Excel o anotadores manuales para proyectar promedios, simular escenarios en base a su carga laboral, u organizar las materias restantes cuando ocurren cambios de plan de estudios.
* **Qué los motivaría a usar QuickMap:** Ahorrar tiempo administrativo mediante la automatización de sus proyecciones de promedio, utilizar el simulador interactivo para planificar su egreso y evaluar rápidamente las alternativas de inscripción ante horarios laborales restrictivos.

### Justificación del Grupo Primario

Hemos seleccionado a los **Estudiantes de Primeros Años** como nuestro grupo primario de análisis y diseño. Un estudiante avanzado ya ha desarrollado estrategias (manuales y costosas en tiempo) para sobrevivir al sistema. En cambio, en los primeros años es donde se genera el mayor dolor inicial, donde se toman decisiones erróneas por falta de información y donde una solución como QuickMap tiene el mayor poder preventivo, evitando la deserción y optimizando el trayecto educativo desde el día uno.

### Perfil del usuario real

Encuestamos a estudiantes de primeros y últimos años de la UNLaM para obtener información y perspectivas de alumnos que recién ingresan y alumnos que ya pasaron años en la Universidad; este contraste es de alto valor para validar que nuestro producto va a ser útil no solamente para los estudiantes de primeros años sino también para estudiantes ya avanzados. El 64% se encuentra en los primeros años de cursada y manifiesta una dependencia absoluta de metodologías informales para la autogestión de sus trayectorias institucionales.

### Necesidades

Lo que necesitan, que hoy no tienen es tener la información brindada de una manera amigable para que el estudiante pueda entender fácilmente cuales son los caminos críticos de tu carrera.

* **Automatización del Historial:** Urgencia de prescindir de la carga manual. Los usuarios demandan que sus materias aprobadas se sincronicen de manera directa sin intervenciones propensas a errores.
* **Visibilidad del Camino Crítico:** Necesidad explícita de recibir sugerencias de rutas óptimas mediante alertas o recomendaciones predictivas antes de cada período de inscripción para evitar bloqueos futuros.
* **Centralización de Indicadores:** Centralizar en una única interfaz gráfica el porcentaje exacto de avance de la carrera y el promedio dinámico recalculado en tiempo real.

### Problemas

* **Opacidad de los Formatos Oficiales:** El formato estático en texto plano o PDF provisto por la facultad impide dimensionar la interconectividad de las correlatividades, induciendo a confusiones estructurales.
* **Bloqueos Curriculares Involuntarios:** La mayor frustración detectada radica en no percatarse a tiempo de qué asignaturas bloquean a otras a mediano plazo, obstaculizando el avance fluido.
* **Colapso del Sistema y Cupos:** Fricciones críticas al momento de la inscripción debido a la saturación de las plataformas oficiales y la falta de alternativas ante la ausencia de vacantes planificadas.

### Contexto de uso

**Dispositivos y Condiciones:** Si bien la planificación profunda se realiza prioritariamente desde computadoras de escritorio o notebooks en el hogar (para evaluar escenarios con tiempo), existe un uso simultáneo y de alta frecuencia desde teléfonos celulares (Smartphones) en condiciones de movilidad o apuro laboral para verificar estados académicos rápidos.

---

## 5. Los Supuestos del Proyecto

Hemos identificado los siguientes supuestos que consideramos verdaderos para el diseño de nuestro producto, los cuales validaremos empíricamente con nuestros usuarios primarios a lo largo del cuatrimestre:

* **Supuesto 1:** *"Asumimos que los estudiantes de los primeros años de la UNLaM experimentan confusión y cometen errores al planificar sus cuatrimestres debido a la dificultad para interpretar el formato de planes de estudio tradicionales (texto plano o PDFs) provistos por la facultad."*
* **Potencial Evidencia:** Consultar en las entrevistas la frecuencia de consulta a los PDF/listados oficiales e indicar al entrevistado que interprete las correlativas de una materia específica en dicho documento para observar si comete inconsistencias o manifiesta dificultad.
* **Supuesto 2 (SUPUESTO CRÍTICO):** *"Asumimos que el desconocimiento del 'camino crítico' de correlativas óptimas de una carrera genera que los estudiantes de los primeros años tomen decisiones de inscripción ineficientes, provocando retrasos no deseados en sus fechas de egreso."*
* **Potencial Evidencia:** Indagar si alguna vez postergaron o no pudieron cursar una asignatura clave que bloqueó la cursada de otras en cuatrimestres posteriores, y evaluar si pueden identificar espontáneamente cuáles son las materias del camino crítico de su plan de estudios.
* **Supuesto 3:** *"Asumimos que los estudiantes están dispuestos a iniciar sesión con sus credenciales universitarias (o un token de integración) dentro de QuickMap con tal de obtener su historial de materias sincronizado de forma automática en tiempo real."*
* **Potencial Evidencia:** Consultar expresamente el grado de confianza y la predisposición del estudiante a autorizar la sincronización de sus datos académicos en una herramienta de terceros si eso le evita la carga manual de su historial.
* **Supuesto 4:** *"Asumimos que los estudiantes realizan actualmente un seguimiento paralelo e informal de sus promedios y avance curricular mediante herramientas analógicas o digitales externas (ej. planillas de Excel, anotaciones en cuadernos, grupos de WhatsApp)."*
* **Potencial Evidencia:** Observar si el entrevistado recurre a planillas personales, cuadernos o notas digitales para organizar su avance, y preguntar por la frecuencia de uso y la molestia que le genera mantener actualizada esa información.
* **Supuesto 5:** *"Asumimos que los estudiantes se sienten frustrados y desorientados al enfrentar un cambio de plan de estudios en su carrera (como ha sucedido en informática o medicina), por no comprender la tabla de equivalencias de materias."*
* **Potencial Evidencia:** Preguntar a los estudiantes si han transitado o temen un cambio de plan de estudios, indagando específicamente sobre las dificultades operativas al interpretar tablas de equivalencia o la incertidumbre respecto a las asignaturas ya reconocidas.
* **Supuesto 6:** *"Asumimos que la UNLaM no planea desarrollar ni integrar una interfaz visual interactiva de planes de estudios y correlativas dentro de Intraconsulta en el corto o mediano plazo."*
* **Potencial Evidencia:** Indagar si los estudiantes conocen o han escuchado sobre alguna iniciativa o actualización oficial del sistema Intraconsulta orientada al seguimiento gráfico interactivo de correlatividades.
* **Supuesto 7:** *"Asumimos que una visualización clara del porcentaje exacto de avance de la carrera y el promedio dinámico actúa como un factor motivacional positivo que incentiva al alumno a continuar con sus estudios en momentos de frustración académica."*
* **Potencial Evidencia:** Presentar una representación o boceto conceptual de porcentaje de avance y consultar al estudiante si ver reflejado su progreso de forma clara modificaría su nivel de motivación ante dificultades académicas.

| Supuesto del TP1 | ¿Se confirmó? | Evidencia que lo sostiene o refuta |
| :--- | :--- | :--- |
| 1 | Sí | Múltiples encuestados señalaron explícitamente como dificultad "El formato en el que lo entrega la facultad (texto plano o PDF)" |
| 2 | Sí | Validado como el punto de mayor frustración por los alumnos: "No darme cuenta de qué materias me van a bloquear otras más adelante" |
| 3 | Sí | Alta demanda de la funcionalidad "Historial automático: Que mis materias aprobadas se sincronicen solas sin cargarlas a mano" |
| 4 | Sí | Los datos reflejan un uso extendido de "Excel propio", "Cálculo manual con calculadora" y consultas en "Grupos de WhatsApp" |
| 5 | Sí | Estudiantes de Educación Física y Nutrición indicaron explícitamente la complejidad de "Entender la tabla de equivalencias" |
| 6 | No | Los estudiantes se limitan a usar Intraconsulta por "Prueba y error" en el momento, sin conocer planes del departamento |
| 7 | Sí | Masiva selección de opciones orientadas a incorporar "Indicadores duros de progreso" y "Esquemas de semáforos por colores" |

## 6. Hipótesis de valor

Creemos que los estudiantes de los primeros años de la UNLaM (1° y 2° año de cursada) tienen el problema de la desorientación en la planificación de sus cuatrimestres debido a la opacidad de los planes de estudio en PDF y la consecuente frustración de incurrir en bloqueos involuntarios de correlatividades por no visualizar el camino crítico. Nuestra solución es QuickMap: una plataforma interactiva basada en un mapa de red de correlatividades con código de colores (semáforo), proyecciones predictivas de trayectorias óptimas y sincronización automatizada del historial académico. Sabremos que estamos en lo correcto cuando logremos que el 80% de los usuarios testeados en el MVP del TP5 utilicen la proyección del camino crítico para estructurar su simulación de inscripción, y declaren una reducción significativa en el tiempo invertido en calcular su promedio y verificar sus materias habilitadas.

# Trabajo práctico 3: Scope del MVP y Diseño de la Interacción

## Parte 1 - Qué construir

### 1. Scope del MVP

La hipótesis de valor formulada en el TP 2 es:

Creemos que los estudiantes de los primeros años de la UNLaM (1° y 2° año de cursada) tienen el problema de la desorientación en la planificación de sus cuatrimestres debido a la opacidad de los planes de estudio en PDF y la consecuente frustración de incurrir en bloqueos involuntarios de correlatividades por no visualizar el camino crítico. Nuestra solución es QuickMap: una plataforma interactiva basada en un mapa de red de correlatividades con código de colores (semáforo), proyecciones predictivas de trayectorias óptimas y sincronización automatizada del historial académico. Sabremos que estamos en lo correcto cuando logremos que el 80% de los usuarios testeados en el MVP del TP5 utilicen la proyección del camino crítico para estructurar su simulación de inscripción, y declaren una reducción significativa en el tiempo invertido en calcular su promedio y verificar sus materias habilitadas.

| Incluido en el MVP | Para qué parte de la hipótesis sirve |
| :--- | :--- |
| Selección de la carrera | Sirve para poder mostrarle el mapa de materias asociado a la carrera que está cursando el alumno que utilice el producto. No sirve de nada mostrar un mapa genérico porque los usuarios podrían no comprender el impacto de lo que representa ver visualmente el orden y distribución de materias de su carrera, ni tampoco mostrar un mapa específico de una sola carrer, ya que nuestra hipótesis de valor se sustenta a través de alumnos de distintas carreras tienen problemas similares. |
| Mapa de materias | Es la base fundamental de nuestro producto, es a partir de él que vamos a poder desarrollar todas funcionalidades en el futuro y es lo que nos permitirá entender si al usuario le convence nuestro producto o no. Sirve para la parte de la hipótesis en la cual se menciona que los usuarios tienen problemas al entender los planes de estudio en formato PDF (listado). |
| Camino crítico | Se fundamenta en la parte de la hipótesis que menciona que los alumnos sufren de mucha frustración debido a bloqueos involuntarios por desconocer aquellas materias que desbloquean muchas otras materias, o aquellas materias que necesitan de muchas otras materias previas para poder ser cursadas. |

| Excluido del MVP | Por qué se excluye |
| :--- | :--- |
| Login del usuario | En el MVP no es necesario persistir el estado del alumno, sólo se necesita que interactúe con el mapa y pueda visualizar el camino crítico según sus materias disponibles. Por lo tanto, esta funcionalidad no es importante para validar la hipótesis. |
| Promedio del alumno | Para poder conocer el promedio del alumno es necesario realizar una integración con la plataforma Intraconsulta para conocer la nota final de cada materia aprobada/promocionada, lo cual requiere de un esfuerzo que no es necesario para validar la hipótesis porque no es uno de los principales problemas de los alumnos. Además, se debería persistir información del alumno, lo cual ya se mencionó anteriormente que no es necesario para validar la hipótesis. |
| Porcentaje de completitud de la carrera | Para poder conocer el porcentaje de completitud de la carrera del alumno es necesario realizar una integración con la plataforma Intraconsulta para conocer el historial de materias del alumno, lo cual requiere de un esfuerzo que no es necesario para validar la hipótesis porque no es uno de los principales problemas de los alumnos. Además, se debería persistir información del alumno, lo cual ya se mencionó anteriormente que no es necesario para validar la hipótesis. |
| Historial de materias aprobadas | Para poder conocer el historial de materias aprobadas del alumno es necesario realizar una integración con la plataforma Intraconsulta para conocer el historial de materias del alumno, lo cual requiere de un esfuerzo que no es necesario para validar la hipótesis porque no es uno de los principales problemas de los alumnos. |
| Interacción con el mapa de materias para poder mover de lugar las materias y acomodarlas al gusto del alumno. | Es un detalle visual que no aporte valor a la hipótesis. |

### 2. Qué se construye y qué se simula

| Elemento | Se construye | Se simula / se resuelve a mano | Por qué |
| :--- | :---: | :---: | :--- |
| Selección de la carrera | X | | Porque solamente implica crear un listado de carreras acotadas a las principales carreras de la universidad y luego asocia cada elección a un mapa de correlativas |
| Mapa de materias | | X | Porque la forma correcta de hacerlo sería solicitarle a Universidad una api de la cual obtener cada plan de estudio que permite ajustarnos a los cambios de planes o nuevas materias que vayan sumando, pero esta integración es innecesaria de forma inicial y lo que haremos será un web scrapping de la página oficial de la universidad sobre los planes de cada carrera que utilizaremos en el MVP y almacenaremos esa información de forma estática en una base de datos local. |
| Camino crítico | x | | Porque es necesario aplicar algún algoritmo que permita conocer el camino crítico y que vaya cambiando a medida que el alumno marque las materias que ya tiene aprobadas/promocionadas porque únicamente mostrar el mapa de correlativas no resuelve el problema de que el alumno incurra en bloqueos involuntarios |

### 3. Flujo principal del MVP

1. El alumno accede a la aplicación y visualiza un desplegable con las carreras disponibles.
2. Selecciona el desplegable y se le muestran las carreras disponibles.
3. Selecciona la carrera sobre la cual desea ver el plan de estudio.
4. Se carga el mapa del plan de estudio con las materias, las conexiones y dependencias entre materias, y un camino crítico que se logra distinguir debido a que se marca en color rojo las materias que lo conforman.
5. El alumno marca las materias aprobadas/promocionadas.
6. Cuando “guarda” su estado actual de materias, se actualiza el camino crítico de la carrera según las materias disponibles para cursar.

### 4. Atributos de usabilidad priorizados

Los atributos que seleccionamos en base al análisis del TP 2 son:

*   **Facilidad de aprendizaje:** El producto debe ser fácil de aprender a utilizarlo porque los estudiantes hoy en día ya utilizan otras herramientas como por ejemplo: planillas de Excel, anotaciones en cuadernos y grupos de WhatsApp para poder dar seguimiento a sus planes de estudio, por lo que si nuestro producto es difícil de aprender a utilizar, es probable que los usuarios continúen utilizando las mismas herramientas que hasta ahora porque ya las conocen.
*   **Recuerdo en el tiempo:** Nuestro producto no será utilizado por los usuarios todo el tiempo, su uso es más esporádico, seguramente cuando más se utilice sea en las fechas cercanas a las inscripciones y un par de veces más durante el año de forma aislada, por lo tanto es necesario que cada vez que el usuario acceda recuerde fácilmente cómo utilizar el sistema, porque al igual que en el punto anterior, si cada vez que deben volver a utilizarlo tardan mucho en recordar cómo acceder a lo que necesitan o tienen que “re aprender” como hacerlo, pueden frustrarse y optar por opciones ya conocidas.
*   **Satisfacción:** Es importante que los usuarios se sientan satisfechos con el sistema ya que por lo que obtuvimos en las encuestas sienten una gran frustración por no poder entender correctamente a qué materias les conviene anotarse en cada inscripción, por lo que si logramos que los alumnos entiendan bien su situación actual y los ayudamos a planificar sus cuatrimestres de la mejor manera posible a través de los camino críticos, entonces lograremos tener un impacto positivos en ellos y que puedan atravesar la etapa de inscripción de una mejor manera.

# Trabajo práctico 5: Construcción del MVP, Prueba y Aprendizaje

## Parte 1 - Antes de construir

### 1. Métricas y criterios de éxito

#### Métricas accionables

*   **Tasa de correción de planificación (TCP):** Esta métrica se basa en medir el porcentaje de estudiantes que modifican su elección inicial de materias inmediatamente después de interactuar con el MVP de QuickMap, al descubrir su camino crítico. La forma de medirla es pedirles a los estudiantes que anoten las materias a las cuales planean inscribirse en el próximo cuatrimestre utilizando los métodos tradicionales, y luego verificar si modifican su elección al interactuar con QuickMap. En caso de que la TCP supere el 30% se confirma nuestra hipótesis inicial.

*   **Tasa de conocimiento de camino crítico (TCCC):** Esta métrica se basa en medir el porcentaje de estudiantes que conocen el camino crítico de su carrera antes de interactuar con QuickMap utilizando los métodos tradicionales. Para medirla se les plantearía un caso con su historial académico y se les pediría que marquen cuales son las 3 materias que se deberían anotar en el siguiente cuatrimestre para recibirse lo antes posible. En caso de que el 80% de los estudiantes conozcan el camino crítico de su carrera antes de interactuar con QuickMap, se refuta nuestra hipótesis inicial.

#### Métrica vanidosa

*   **Tasa de alumnos que vuelven a utilizar QuickMap en el siguiente cuatrimestre:** Esta métrica es vanidosa porque parecería indicar que si los alumnos vuelven a usar la herramienta es porque les sirve para determinar a que materias les conviene anotarse, pero la realidad es que esto no comprueba de ninguna manera que hoy en día exista opacidad o dificultar para conocer el camino crítico. Los alumnos por ejemplo podrían volver a utilizar la herramienta simplemente porque les gusta la interfaz o porque almacena el historial académico, pero no porque les ayude a tomar mejores decisiones.

## Parte 3 - Probar
### Tarea
Tenés tiempo para cursar solamente 3 materias el próximo cuatrimestre. Tu objetivo es elegir las 3 materias que más te convengan para no trabarte en tercer año y recibirte lo antes posible. Mostrame cómo resolverías esto y decime en qué 3 materias te anotarías.

### ¿Qué se observa?
* **Comprensión del código de colores:**
* ¿El usuario entiende de inmediato como debe seleccionar las materias que ya tiene aprobadas o promocionadas?
* ¿El usuario entiende de inmediato que materias tiene habilitadas para cursar en el siguiente cuatrimestre luego de guardar las materias que ya tiene aprobadas o promocionadas?
* **Identificación del camino crítico:** ¿Para elegir las 3 materias, sigue el camino crítico generado o debe ir buscando materia por materia cuál tiene habilitada?
* **Pedidos de asistencia:** ¿Cuantas veces dice "no entiendo" o solicita ayuda?

### Registro
* **Grabación de pantalla + Audio con protocolo Think Aloud (Pensar en voz alta):** Se le pide al usuario que relate todo lo que va pensando mientras mueve el mouse.
* **Registro de tiempos y tasa de éxito:** Se cronometra cuántos minutos/segundos tarda desde que carga sus materias aprobadas hasta que define las 3 materias a cursar (Time on Task), y se registra si las 3 elegidas son efectivamente las del camino crítico óptimo.

### Preguntas finales
* **Validar el criterio de decisión:** ¿Por qué elegiste esas 3 materias en particular y descartaste las demás?
* **Comparar con experiencia tradicional:** ¿Cómo sentiste este proceso comparado con la forma en la que armaste tu inscripción el cuatrimestre pasado?
* **Detectar fricción oculta:** ¿Hubo algún momento o algún color del mapa que te haya hecho dudar sobre qué significaba?