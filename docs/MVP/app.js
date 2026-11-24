/**
 * QuickMap - Aplicación Principal (MVP)
 * 
 * Flujo:
 * 1. Pantalla 1: Selección de carrera (Medicina, Nutrición, Desarrollo Web).
 * 2. Pantalla 2: Visualización del mapa de correlatividades en grafo interactivo.
 * 3. Cálculo del Camino Crítico inicial (destacado en rojo).
 * 4. Selección temporal de materias aprobadas en la sesión.
 * 5. Al presionar "Guardar": las materias aprobadas se grisan y el camino crítico
 *    se recalcula dinámicamente ajustándose a las materias disponibles restantes.
 */

import { CurriculumGraph } from './cpm.js';
import { FALLBACK_PLANS } from './data-fallback.js';

// Mapeo de carreras disponibles en el MVP
const CAREER_CONFIG = {
  'Desarrollo_Web': {
    nombre: 'Tecnicatura en desarrollo web',
    file: 'Desarrollo_Web.json'
  },
  'Nutricion': {
    nombre: 'Licenciatura en nutrición',
    file: 'Nutricion.json'
  },
  'Medicina': {
    nombre: 'Medicina',
    file: 'Medicina.json'
  }
};

// Estado global de la aplicación
const state = {
  currentCareer: null,
  planData: null,
  graph: null,
  cpmResult: null,
  savedApproved: new Set(),    // Materias guardadas en sessionStorage
  pendingApproved: new Set(),  // Materias seleccionadas temporalmente antes de guardar
  nodePositions: new Map(),
  yearLayout: new Map(),       // Posicionamiento y dimensiones de cada columna de año
  
  // Transformación de la vista del mapa (Pan & Zoom)
  view: {
    panX: 40,
    panY: 40,
    scale: 0.85,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0
  }
};

// Constantes de diseño para el grafo (Req 4: mayor separación espacial entre nodos)
const LAYOUT = {
  nodeWidth: 210,
  nodeHeight: 68,
  rowGap: 40,        // Mayor separación vertical entre nodos (Req 4)
  subColGap: 80,     // Separación entre sub-columnas del mismo año (Req 9)
  yearGap: 130,      // Separación entre años de cursada (Req 4)
  paddingLeft: 60,
  paddingTop: 80
};

// Elementos DOM
const dom = {
  screenSelection: document.getElementById('screen-selection'),
  screenMap: document.getElementById('screen-map'),
  careerSelect: document.getElementById('career-select'),
  btnViewPlan: document.getElementById('btn-view-plan'),
  btnChangeCareer: document.getElementById('btn-change-career'),
  btnSave: document.getElementById('btn-save'),
  btnReset: document.getElementById('btn-reset'),
  mapCareerName: document.getElementById('map-career-name'),
  mapViewport: document.getElementById('map-viewport'),
  mapSvg: document.getElementById('map-svg'),
  edgesLayer: document.getElementById('edges-layer'),
  nodesLayer: document.getElementById('nodes-layer'),
  headersLayer: document.getElementById('headers-layer'),
  statAvailable: document.getElementById('stat-available'),
  statApproved: document.getElementById('stat-approved'),
  statCritical: document.getElementById('stat-critical'),
  toast: document.getElementById('toast-notice'),
  btnZoomIn: document.getElementById('btn-zoom-in'),
  btnZoomOut: document.getElementById('btn-zoom-out'),
  btnZoomReset: document.getElementById('btn-zoom-reset')
};

/**
 * Inicialización de la aplicación
 */
function init() {
  bindEvents();
  checkSessionCareer();
}

/**
 * Enlaza los escuchadores de eventos
 */
function bindEvents() {
  // Pantalla 1: Selección de carrera
  dom.careerSelect.addEventListener('change', () => {
    dom.btnViewPlan.disabled = !dom.careerSelect.value;
  });

  dom.btnViewPlan.addEventListener('click', () => {
    const careerKey = dom.careerSelect.value;
    if (careerKey) {
      loadCareer(careerKey);
    }
  });

  // Pantalla 2: Botones de barra superior
  dom.btnChangeCareer.addEventListener('click', () => {
    switchScreen('selection');
  });

  dom.btnSave.addEventListener('click', handleSave);
  dom.btnReset.addEventListener('click', handleReset);

  // Pan y Zoom
  setupPanAndZoom();
}

/**
 * Carga la carrera seleccionada
 */
async function loadCareer(careerKey) {
  state.currentCareer = careerKey;
  sessionStorage.setItem('quickmap_active_career', careerKey);

  // Cargar materias aprobadas de la sesión
  const sessionKey = `quickmap_approved_${careerKey}`;
  const storedApproved = sessionStorage.getItem(sessionKey);
  if (storedApproved) {
    try {
      const arr = JSON.parse(storedApproved);
      state.savedApproved = new Set(arr.map(String));
      state.pendingApproved = new Set(arr.map(String));
    } catch (e) {
      state.savedApproved = new Set();
      state.pendingApproved = new Set();
    }
  } else {
    state.savedApproved = new Set();
    state.pendingApproved = new Set();
  }

  // Cargar datos del JSON del plan de estudio
  try {
    const data = await fetchCareerPlan(careerKey);
    state.planData = data;
    state.graph = new CurriculumGraph(data.materias);
    
    // Ejecutar análisis CPM con las materias ya aprobadas
    state.cpmResult = state.graph.analyze(state.savedApproved);
    
    // Actualizar UI
    dom.mapCareerName.textContent = CAREER_CONFIG[careerKey].nombre;
    calculateNodeLayout();
    renderMap();
    updateMetrics();
    switchScreen('map');
    centerView();
  } catch (err) {
    console.error('Error cargando plan de estudio:', err);
    showToast('Error al cargar el plan de estudio: ' + err.message);
  }
}

/**
 * Busca y obtiene el archivo JSON correspondiente a la carrera
 */
async function fetchCareerPlan(careerKey) {
  const cfg = CAREER_CONFIG[careerKey];
  if (!cfg) throw new Error('Carrera no configurada');

  const fileName = cfg.file;
  const candidateUrls = [
    `Planes_estudio/${fileName}`,
    `MVP/Planes_estudio/${fileName}`,
    `docs/MVP/Planes_estudio/${fileName}`,
    `./Planes_estudio/${fileName}`,
    `../MVP/Planes_estudio/${fileName}`,
    `/docs/MVP/Planes_estudio/${fileName}`
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {
      // Probar siguiente ruta
    }
  }

  // Fallback si fetch local es bloqueado (ej: file://)
  if (FALLBACK_PLANS && FALLBACK_PLANS[careerKey]) {
    console.warn(`Usando datos embebidos para ${careerKey} (fallback)`);
    return FALLBACK_PLANS[careerKey];
  }

  throw new Error(`No se pudo encontrar el archivo ${fileName}`);
}

/**
 * Calcula la posición de cada materia agrupada de forma vertical por año de la carrera
 * Req 9: En el caso de materias que desbloquean materias del mismo año, se posicionan
 * aquellas que desbloquean a la izquierda (subCol 0) y las desbloqueadas a la derecha (subCol 1),
 * manteniendo la agrupación visual del mismo año.
 */
function calculateNodeLayout() {
  state.nodePositions.clear();
  state.yearLayout.clear();
  const graph = state.graph;
  const maxYear = graph.getMaxYear();

  // Agrupar materias por año
  const byYear = new Map();
  for (let y = 1; y <= maxYear; y++) {
    byYear.set(y, []);
  }

  graph.nodes.forEach((node, id) => {
    const y = node.anio || 1;
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(id);
  });

  let currentX = LAYOUT.paddingLeft;

  for (let year = 1; year <= maxYear; year++) {
    const yearNodes = byYear.get(year) || [];
    if (yearNodes.length === 0) continue;

    // Sub-col 0: Materias sin correlativas dentro del mismo año (van más a la izquierda)
    // Sub-col 1: Materias que dependen de otra del mismo año (van a la derecha)
    const subCol0 = [];
    const subCol1 = [];

    yearNodes.forEach(id => {
      const node = graph.nodes.get(id);
      const sameYearPrereqs = (node.correlativas || []).filter(cId => {
        const pNode = graph.nodes.get(cId);
        return pNode && (pNode.anio || 1) === year;
      });

      if (sameYearPrereqs.length === 0) {
        subCol0.push(id);
      } else {
        subCol1.push(id);
      }
    });

    // Ordenar de manera estable por ID numérico
    subCol0.sort((a, b) => Number(a) - Number(b));
    subCol1.sort((a, b) => Number(a) - Number(b));

    const hasSubCol1 = subCol1.length > 0;
    const yearWidth = hasSubCol1 ? (LAYOUT.nodeWidth * 2 + LAYOUT.subColGap) : LAYOUT.nodeWidth;
    const subCol0_X = currentX;
    const subCol1_X = currentX + LAYOUT.nodeWidth + LAYOUT.subColGap;
    const headerX = currentX + yearWidth / 2;

    subCol0.forEach((id, row) => {
      const x = subCol0_X;
      const y = LAYOUT.paddingTop + row * (LAYOUT.nodeHeight + LAYOUT.rowGap);
      state.nodePositions.set(id, { x, y, year, subCol: 0, row });
    });

    subCol1.forEach((id, row) => {
      const x = subCol1_X;
      const y = LAYOUT.paddingTop + row * (LAYOUT.nodeHeight + LAYOUT.rowGap);
      state.nodePositions.set(id, { x, y, year, subCol: 1, row });
    });

    const maxRowsInYear = Math.max(subCol0.length, subCol1.length);
    const yearHeight = maxRowsInYear * LAYOUT.nodeHeight + Math.max(0, maxRowsInYear - 1) * LAYOUT.rowGap;

    state.yearLayout.set(year, {
      startX: currentX,
      width: yearWidth,
      headerX,
      maxHeight: yearHeight
    });

    currentX += yearWidth + LAYOUT.yearGap;
  }
}

/**
 * Renderiza el mapa completo (cabeceras por año, aristas direccionadas y nodos)
 */
function renderMap() {
  dom.headersLayer.innerHTML = '';
  dom.edgesLayer.innerHTML = '';
  dom.nodesLayer.innerHTML = '';

  const graph = state.graph;
  const cpm = state.cpmResult;
  const maxYear = graph.getMaxYear();

  // 1. Renderizar cabeceras de columnas y agrupación visual del año (Req 9)
  for (let year = 1; year <= maxYear; year++) {
    const yInfo = state.yearLayout.get(year);
    if (!yInfo) continue;

    // Caja de agrupación que abarca todo el año
    const yearBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    yearBox.setAttribute('x', yInfo.startX - 14);
    yearBox.setAttribute('y', LAYOUT.paddingTop - 18);
    yearBox.setAttribute('width', yInfo.width + 28);
    yearBox.setAttribute('height', yInfo.maxHeight + 36);
    yearBox.setAttribute('rx', '8');
    yearBox.setAttribute('class', 'year-group-box');
    dom.headersLayer.appendChild(yearBox);

    // Texto de cabecera centrado sobre la agrupación del año
    const headerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    headerText.setAttribute('x', yInfo.headerX);
    headerText.setAttribute('y', LAYOUT.paddingTop - 28);
    headerText.setAttribute('class', 'column-header');
    headerText.textContent = `${year}° Año`;
    dom.headersLayer.appendChild(headerText);
  }

  // 2. Renderizar aristas (flechas con puntas más pequeñas apuntando a las materias que desbloquea)
  graph.nodes.forEach((node, uId) => {
    const succs = graph.successors.get(uId) || [];
    const uPos = state.nodePositions.get(uId);

    succs.forEach(vId => {
      const vPos = state.nodePositions.get(vId);
      if (!uPos || !vPos) return;

      const edgeKey = `${uId}->${vId}`;
      const isCriticalEdge = cpm.criticalEdges.has(edgeKey);
      const isApprovedEdge = state.pendingApproved.has(uId) && state.pendingApproved.has(vId);

      let edgeClass = 'edge-path';
      let markerId = 'marker-neutral';

      if (isCriticalEdge) {
        edgeClass += ' edge-critical';
        markerId = 'marker-critical';
      } else if (isApprovedEdge) {
        edgeClass += ' edge-approved';
        markerId = 'marker-approved';
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      // Gracias al sub-posicionamiento dentro del mismo año y entre años, u siempre está a la izquierda de v (uPos.x < vPos.x)
      const x1 = uPos.x + LAYOUT.nodeWidth;
      const y1 = uPos.y + LAYOUT.nodeHeight / 2;
      const x2 = vPos.x - 3; // 3px antes para que la punta de la flecha toque con precisión
      const y2 = vPos.y + LAYOUT.nodeHeight / 2;
      const dx = Math.max((x2 - x1) * 0.45, 25);

      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
      path.setAttribute('d', d);
      path.setAttribute('class', edgeClass);
      path.setAttribute('marker-end', `url(#${markerId})`);
      path.setAttribute('data-edge', edgeKey);
      path.setAttribute('data-from', uId);
      path.setAttribute('data-to', vId);

      dom.edgesLayer.appendChild(path);
    });
  });

  // 3. Renderizar nodos (cards con fondo blanco, colores por estado, símbolo sólo superior derecha)
  graph.nodes.forEach((node, id) => {
    const pos = state.nodePositions.get(id);
    if (!pos) return;

    const statusObj = cpm.nodeStatus.get(id) || { status: 'bloqueada', isAvailable: false, isCritical: false, isApproved: false };
    const isApproved = state.pendingApproved.has(id);
    const isSavedApproved = state.savedApproved.has(id);

    // Contenedor ForeignObject
    const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    fo.setAttribute('x', pos.x);
    fo.setAttribute('y', pos.y);
    fo.setAttribute('width', LAYOUT.nodeWidth);
    fo.setAttribute('height', LAYOUT.nodeHeight);
    fo.setAttribute('data-id', id);

    let symbol = '🔒';
    let cardClass = 'node-card status-bloqueada';

    if (isApproved) {
      // Req 1: Materias aprobadas o promocionadas: fondo blanco, borde y letra verde, símbolo ✓
      symbol = '✓';
      cardClass = 'node-card status-aprobada';
      if (!isSavedApproved) {
        cardClass += ' pending-selection';
      }
    } else if (statusObj.isCritical) {
      // Req 2: Materias críticas: fondo blanco, borde y letras rojo
      cardClass = 'node-card status-critica';
      symbol = statusObj.isAvailable ? '○' : '🔒';
    } else if (statusObj.isAvailable) {
      // Habilitada disponible: fondo blanco, borde azul, símbolo ○
      cardClass = 'node-card status-habilitada';
      symbol = '○';
    } else {
      // Bloqueada: fondo opaco #d8d5cb, borde gris, símbolo 🔒
      cardClass = 'node-card status-bloqueada';
      symbol = '🔒';
    }

    const card = document.createElement('div');
    card.className = cardClass;
    card.setAttribute('data-node-id', id);

    // Fila superior: ID a la izquierda, Símbolo a la derecha (Req 3: sin tildes interactivos en este sector)
    const topRow = document.createElement('div');
    topRow.className = 'node-top-row';

    const idSpan = document.createElement('span');
    idSpan.className = 'node-id';
    idSpan.textContent = `#${id}`;

    const symbolSpan = document.createElement('span');
    symbolSpan.className = 'node-symbol';
    symbolSpan.textContent = symbol;

    topRow.appendChild(idSpan);
    topRow.appendChild(symbolSpan);

    // Fila central: Nombre de la materia (Req 8: debajo del nombre no debe verse el estado)
    const nameDiv = document.createElement('div');
    nameDiv.className = 'node-name';
    nameDiv.textContent = node.nombre;
    nameDiv.title = node.nombre;

    card.appendChild(topRow);
    card.appendChild(nameDiv);

    // Evento de clic en la tarjeta para alternar aprobación
    card.addEventListener('click', () => {
      toggleNodeSelection(id);
    });

    card.addEventListener('mouseenter', () => highlightConnections(id, true));
    card.addEventListener('mouseleave', () => highlightConnections(id, false));

    fo.appendChild(card);
    dom.nodesLayer.appendChild(fo);
  });
}

/**
 * Alterna la selección de una materia como aprobada
 * Req 6: No debe dejar seleccionar una materia como aprobada a menos que todas las materias
 * anteriores que la desbloquean hayan sido marcadas como aprobadas previamente.
 */
function toggleNodeSelection(id) {
  const node = state.graph.nodes.get(id);
  if (!node) return;

  if (state.pendingApproved.has(id)) {
    // Si ya estaba marcada, desmarcarla junto a cualquier dependiente
    unmarkWithDependents(id);
  } else {
    // Verificar si todas las correlativas previas que la desbloquean están aprobadas (Req 6)
    const missingPrereqs = (node.correlativas || []).filter(cId => !state.pendingApproved.has(cId));
    if (missingPrereqs.length > 0) {
      const missingNames = missingPrereqs.map(cId => {
        const pNode = state.graph.nodes.get(cId);
        return pNode ? pNode.nombre : `#${cId}`;
      }).join(', ');

      showToast(`No podés marcar "${node.nombre}". Primero debés aprobar: ${missingNames}`);

      // Animación de rechazo en la tarjeta
      const card = document.querySelector(`.node-card[data-node-id="${id}"]`);
      if (card) {
        card.classList.remove('shake-error');
        void card.offsetWidth; // Forzar reflow
        card.classList.add('shake-error');
      }
      return;
    }

    // Cumple todas las correlativas previas: marcar como aprobada
    state.pendingApproved.add(id);
  }

  renderMap();
  updateMetrics();
  updateSaveButtonState();
}

/**
 * Desmarca una materia y, en cascada, cualquier materia dependiente marcada en pendingApproved
 */
function unmarkWithDependents(id) {
  state.pendingApproved.delete(id);

  const removedDependents = [];
  const checkDependents = (uId) => {
    const succs = state.graph.successors.get(uId) || [];
    succs.forEach(vId => {
      if (state.pendingApproved.has(vId)) {
        state.pendingApproved.delete(vId);
        removedDependents.push(vId);
        checkDependents(vId);
      }
    });
  };

  checkDependents(id);

  if (removedDependents.length > 0) {
    const names = removedDependents.map(dId => {
      const pNode = state.graph.nodes.get(dId);
      return pNode ? pNode.nombre : `#${dId}`;
    }).join(', ');
    const baseName = state.graph.nodes.get(id)?.nombre || `#${id}`;
    showToast(`Se desmarcó "${baseName}" y también sus correlativas dependientes: ${names}`);
  }
}

/**
 * Actualiza el texto y estado del botón "Guardar"
 */
function updateSaveButtonState() {
  const pendingCount = state.pendingApproved.size;
  const hasChanges = !setsAreEqual(state.pendingApproved, state.savedApproved);

  if (hasChanges) {
    dom.btnSave.textContent = `Guardar (${pendingCount} aprobadas)`;
    dom.btnSave.classList.add('btn-primary');
    dom.btnSave.classList.remove('btn-save');
  } else {
    dom.btnSave.textContent = 'Guardar';
    dom.btnSave.classList.remove('btn-primary');
    dom.btnSave.classList.add('btn-save');
  }
}

/**
 * Compara si dos Sets son idénticos
 */
function setsAreEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

/**
 * Guarda las materias seleccionadas en la sesión del usuario
 * y recalcula el camino crítico dinámicamente.
 */
function handleSave() {
  state.savedApproved = new Set(state.pendingApproved);

  // Almacenar de forma temporal en sessionStorage durante la sesión
  const sessionKey = `quickmap_approved_${state.currentCareer}`;
  sessionStorage.setItem(sessionKey, JSON.stringify([...state.savedApproved]));

  // Recalcular camino crítico y estados con las nuevas materias aprobadas
  state.cpmResult = state.graph.analyze(state.savedApproved);

  // Re-renderizar mapa con materias aprobadas grisadas y nuevo camino crítico
  renderMap();
  updateMetrics();
  updateSaveButtonState();

  showToast('Materias guardadas en sesión. Camino crítico recalculado.');
}

/**
 * Reinicia la selección de la carrera activa
 */
function handleReset() {
  if (state.savedApproved.size === 0 && state.pendingApproved.size === 0) return;

  state.savedApproved.clear();
  state.pendingApproved.clear();

  const sessionKey = `quickmap_approved_${state.currentCareer}`;
  sessionStorage.removeItem(sessionKey);

  // Recalcular camino crítico inicial
  state.cpmResult = state.graph.analyze(state.savedApproved);

  renderMap();
  updateMetrics();
  updateSaveButtonState();

  showToast('Selección reiniciada. Se muestra el camino crítico inicial.');
}

/**
 * Actualiza los indicadores numéricos del encabezado
 */
function updateMetrics() {
  const cpm = state.cpmResult;
  const total = state.graph.nodes.size;
  const approvedCount = state.savedApproved.size;

  dom.statApproved.textContent = `Aprobadas: ${approvedCount}/${total}`;
  dom.statAvailable.textContent = `Habilitadas para cursar: ${cpm.availableCount}`;
  dom.statCritical.textContent = `En camino crítico: ${cpm.criticalPathNodes.size}`;
}

/**
 * Resalta aristas entrantes (correlativas previas) y salientes (materias que desbloquea)
 */
function highlightConnections(nodeId, active) {
  const incoming = state.graph.predecessors.get(nodeId) || [];
  const outgoing = state.graph.successors.get(nodeId) || [];

  const allEdges = dom.edgesLayer.querySelectorAll('.edge-path');

  if (!active) {
    // Restaurar estilos normales
    allEdges.forEach(el => {
      el.classList.remove('edge-highlight-in', 'edge-highlight-out');
      el.style.opacity = '';
    });
    return;
  }

  // Atenuar aristas no relacionadas
  allEdges.forEach(el => {
    const fromId = el.getAttribute('data-from');
    const toId = el.getAttribute('data-to');

    if (toId === nodeId && incoming.includes(fromId)) {
      el.classList.add('edge-highlight-in');
      el.setAttribute('marker-end', 'url(#marker-highlight-in)');
    } else if (fromId === nodeId && outgoing.includes(toId)) {
      el.classList.add('edge-highlight-out');
      el.setAttribute('marker-end', 'url(#marker-highlight-out)');
    } else {
      el.style.opacity = '0.12';
    }
  });
}

/**
 * Configuración del Paneo y Zoom interactivo
 */
function setupPanAndZoom() {
  const vp = dom.mapViewport;

  // Zoom con la rueda del ratón
  vp.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(Math.max(state.view.scale * zoomFactor, 0.3), 2.5);

    // Zoom centrado hacia la posición del cursor
    const rect = vp.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    state.view.panX = mouseX - (mouseX - state.view.panX) * (newScale / state.view.scale);
    state.view.panY = mouseY - (mouseY - state.view.panY) * (newScale / state.view.scale);
    state.view.scale = newScale;

    applyTransform();
  }, { passive: false });

  // Paneo con arrastre del ratón
  vp.addEventListener('mousedown', (e) => {
    // Si se hizo clic sobre una tarjeta de nodo o control, no arrastrar
    if (e.target.closest('.node-card') || e.target.closest('.zoom-controls')) return;

    state.view.isDragging = true;
    state.view.dragStartX = e.clientX - state.view.panX;
    state.view.dragStartY = e.clientY - state.view.panY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.view.isDragging) return;
    state.view.panX = e.clientX - state.view.dragStartX;
    state.view.panY = e.clientY - state.view.dragStartY;
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    state.view.isDragging = false;
  });

  // Botones de Zoom flotantes
  dom.btnZoomIn.addEventListener('click', () => {
    state.view.scale = Math.min(state.view.scale * 1.2, 2.5);
    applyTransform();
  });

  dom.btnZoomOut.addEventListener('click', () => {
    state.view.scale = Math.max(state.view.scale / 1.2, 0.3);
    applyTransform();
  });

  dom.btnZoomReset.addEventListener('click', centerView);
}

/**
 * Aplica la transformación CSS al contenedor principal del SVG
 */
function applyTransform() {
  const g = dom.mapSvg.querySelector('#transform-group');
  if (g) {
    g.setAttribute('transform', `translate(${state.view.panX}, ${state.view.panY}) scale(${state.view.scale})`);
  }
}

/**
 * Centra y ajusta la vista del mapa según las dimensiones de la pantalla
 */
function centerView() {
  const vpRect = dom.mapViewport.getBoundingClientRect();
  let totalWidth = LAYOUT.paddingLeft * 2;
  if (state.yearLayout && state.yearLayout.size > 0) {
    state.yearLayout.forEach(yInfo => {
      totalWidth += yInfo.width + LAYOUT.yearGap;
    });
  } else {
    const maxYear = state.graph ? state.graph.getMaxYear() : 4;
    totalWidth += maxYear * (LAYOUT.nodeWidth + LAYOUT.yearGap);
  }

  // Escala inicial calculada para que se aprecie la mayor parte del grafo
  const targetScale = Math.min(Math.max(vpRect.width / (totalWidth * 1.05), 0.45), 0.95);
  state.view.scale = targetScale;
  state.view.panX = 30;
  state.view.panY = 20;

  applyTransform();
}

/**
 * Cambia entre la Pantalla 1 y la Pantalla 2
 */
function switchScreen(screenName) {
  if (screenName === 'selection') {
    dom.screenSelection.classList.add('active');
    dom.screenMap.classList.remove('active');
    sessionStorage.removeItem('quickmap_active_career');
  } else if (screenName === 'map') {
    dom.screenSelection.classList.remove('active');
    dom.screenMap.classList.add('active');
  }
}

/**
 * Verifica si había una carrera activa guardada en la sesión o indicada en la URL
 */
function checkSessionCareer() {
  const urlParams = new URLSearchParams(window.location.search);
  const careerParam = urlParams.get('carrera');
  const activeCareer = (careerParam && CAREER_CONFIG[careerParam]) ? careerParam : sessionStorage.getItem('quickmap_active_career');
  if (activeCareer && CAREER_CONFIG[activeCareer]) {
    dom.careerSelect.value = activeCareer;
    dom.btnViewPlan.disabled = false;
    loadCareer(activeCareer);
  } else {
    switchScreen('selection');
  }
}

/**
 * Muestra un mensaje temporal Toast
 */
let toastTimeout = null;
function showToast(msg) {
  if (!dom.toast) return;
  dom.toast.textContent = msg;
  dom.toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    dom.toast.classList.remove('show');
  }, 2800);
}

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', init);
