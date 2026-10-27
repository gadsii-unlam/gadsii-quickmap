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

// Constantes de diseño para el grafo
const LAYOUT = {
  nodeWidth: 220,
  nodeHeight: 76,
  columnGap: 120,
  rowGap: 24,
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
 * Calcula la posición de cada materia en el mapa (Topological Barycenter Layout)
 */
function calculateNodeLayout() {
  state.nodePositions.clear();
  const graph = state.graph;
  const maxLvl = graph.getMaxLevel();

  // Agrupar materias por nivel topológico
  const byLevel = [];
  for (let i = 0; i <= maxLvl; i++) byLevel.push([]);

  graph.nodes.forEach((node, id) => {
    const lvl = graph.levels.get(id) || 0;
    byLevel[lvl].push(id);
  });

  // Ordenamiento de baricentro para minimizar cruces de aristas
  const orderIndex = new Map();
  byLevel.forEach((levelNodes, lvl) => {
    if (lvl > 0) {
      levelNodes.sort((aId, bId) => {
        const getAvgPrereqPos = (id) => {
          const prereqs = graph.nodes.get(id).correlativas;
          if (prereqs.length === 0) return 0;
          let sum = 0;
          let count = 0;
          prereqs.forEach(pId => {
            if (orderIndex.has(pId)) {
              sum += orderIndex.get(pId);
              count++;
            }
          });
          return count > 0 ? sum / count : 0;
        };
        return getAvgPrereqPos(aId) - getAvgPrereqPos(bId);
      });
    }

    levelNodes.forEach((id, row) => {
      orderIndex.set(id, row);
      const x = LAYOUT.paddingLeft + lvl * (LAYOUT.nodeWidth + LAYOUT.columnGap);
      const y = LAYOUT.paddingTop + row * (LAYOUT.nodeHeight + LAYOUT.rowGap);
      state.nodePositions.set(id, { x, y, lvl, row });
    });
  });
}

/**
 * Renderiza el mapa completo (cabeceras, aristas y nodos)
 */
function renderMap() {
  dom.headersLayer.innerHTML = '';
  dom.edgesLayer.innerHTML = '';
  dom.nodesLayer.innerHTML = '';

  const graph = state.graph;
  const cpm = state.cpmResult;
  const maxLvl = graph.getMaxLevel();

  // 1. Renderizar cabeceras de columnas
  for (let lvl = 0; lvl <= maxLvl; lvl++) {
    const colX = LAYOUT.paddingLeft + lvl * (LAYOUT.nodeWidth + LAYOUT.columnGap) + LAYOUT.nodeWidth / 2;
    const headerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    headerText.setAttribute('x', colX);
    headerText.setAttribute('y', LAYOUT.paddingTop - 28);
    headerText.setAttribute('class', 'column-header');
    headerText.textContent = `Nivel ${lvl + 1}`;
    dom.headersLayer.appendChild(headerText);
  }

  // 2. Renderizar aristas (flechas de correlatividad)
  graph.nodes.forEach((node, uId) => {
    const succs = graph.successors.get(uId) || [];
    const uPos = state.nodePositions.get(uId);

    succs.forEach(vId => {
      const vPos = state.nodePositions.get(vId);
      if (!uPos || !vPos) return;

      const edgeKey = `${uId}->${vId}`;
      const isCriticalEdge = cpm.criticalEdges.has(edgeKey);
      const isApprovedEdge = state.savedApproved.has(uId) && state.savedApproved.has(vId);

      // Puntos de inicio y fin (lado derecho del prerequisito -> lado izquierdo del dependiente)
      const x1 = uPos.x + LAYOUT.nodeWidth;
      const y1 = uPos.y + LAYOUT.nodeHeight / 2;
      const x2 = vPos.x;
      const y2 = vPos.y + LAYOUT.nodeHeight / 2;
      const dx = (x2 - x1) / 2;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
      path.setAttribute('d', d);

      let edgeClass = 'edge-path';
      let markerId = 'marker-neutral';

      if (isCriticalEdge) {
        edgeClass += ' edge-critical';
        markerId = 'marker-critical';
      } else if (isApprovedEdge) {
        edgeClass += ' edge-approved';
        markerId = 'marker-approved';
      }

      path.setAttribute('class', edgeClass);
      path.setAttribute('marker-end', `url(#${markerId})`);
      path.setAttribute('data-edge', edgeKey);
      path.setAttribute('data-from', uId);
      path.setAttribute('data-to', vId);

      dom.edgesLayer.appendChild(path);
    });
  });

  // 3. Renderizar nodos (cards de materias)
  graph.nodes.forEach((node, id) => {
    const pos = state.nodePositions.get(id);
    if (!pos) return;

    const statusObj = cpm.nodeStatus.get(id) || { status: 'bloqueada' };
    const isSavedApproved = state.savedApproved.has(id);
    const isPending = state.pendingApproved.has(id);

    // Contenedor ForeignObject para layout HTML rico y accesible
    const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    fo.setAttribute('x', pos.x);
    fo.setAttribute('y', pos.y);
    fo.setAttribute('width', LAYOUT.nodeWidth);
    fo.setAttribute('height', LAYOUT.nodeHeight);
    fo.setAttribute('data-id', id);

    const card = document.createElement('div');
    let cardClass = `node-card status-${statusObj.status}`;
    if (isPending !== isSavedApproved) {
      cardClass += ' pending-selection';
    }
    card.className = cardClass;
    card.setAttribute('data-node-id', id);

    // Fila superior: ID y Checkbox de aprobación
    const topRow = document.createElement('div');
    topRow.className = 'node-top-row';

    const idSpan = document.createElement('span');
    idSpan.className = 'node-id';
    idSpan.textContent = `#${id}`;

    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.className = 'node-checkbox';
    chk.checked = isPending;
    chk.title = 'Marcar como aprobada / promocionada';
    chk.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNodeSelection(id);
    });

    topRow.appendChild(idSpan);
    topRow.appendChild(chk);

    // Fila central: Nombre de la materia
    const nameDiv = document.createElement('div');
    nameDiv.className = 'node-name';
    nameDiv.textContent = node.nombre;
    nameDiv.title = node.nombre;

    // Fila inferior: Etiqueta de estado
    const bottomRow = document.createElement('div');
    bottomRow.className = 'node-bottom-row';

    const tag = document.createElement('span');
    tag.className = `status-tag tag-${statusObj.status}`;
    
    if (statusObj.status === 'aprobada') {
      tag.textContent = '✓ Aprobada';
    } else if (statusObj.status === 'critica') {
      tag.textContent = statusObj.isAvailable ? 'Crítica • Habilitada' : 'Camino crítico';
    } else if (statusObj.status === 'habilitada') {
      tag.textContent = 'Habilitada';
    } else {
      tag.textContent = 'Bloqueada';
    }

    bottomRow.appendChild(tag);

    card.appendChild(topRow);
    card.appendChild(nameDiv);
    card.appendChild(bottomRow);

    // Eventos del nodo
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
 */
function toggleNodeSelection(id) {
  if (state.pendingApproved.has(id)) {
    state.pendingApproved.delete(id);
  } else {
    state.pendingApproved.add(id);
  }

  // Actualizar visualmente la tarjeta del nodo sin redibujar todo
  const card = document.querySelector(`.node-card[data-node-id="${id}"]`);
  if (card) {
    const chk = card.querySelector('.node-checkbox');
    const isPending = state.pendingApproved.has(id);
    const isSaved = state.savedApproved.has(id);
    chk.checked = isPending;

    if (isPending !== isSaved) {
      card.classList.add('pending-selection');
    } else {
      card.classList.remove('pending-selection');
    }
  }

  updateSaveButtonState();
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
  const maxLvl = state.graph ? state.graph.getMaxLevel() : 4;
  const contentWidth = LAYOUT.paddingLeft * 2 + (maxLvl + 1) * (LAYOUT.nodeWidth + LAYOUT.columnGap);
  
  // Escala inicial calculada para que se aprecie la mayor parte del grafo
  const targetScale = Math.min(Math.max(vpRect.width / (contentWidth * 1.05), 0.55), 0.95);
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
 * Verifica si había una carrera activa guardada en la sesión
 */
function checkSessionCareer() {
  const activeCareer = sessionStorage.getItem('quickmap_active_career');
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
