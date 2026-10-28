/**
 * QuickMap - Módulo de Algoritmo de Camino Crítico (CPM) y Grafos
 * 
 * Implementa la lógica de teoría de grafos y gestión de proyectos:
 * 1. Modelado del plan de estudios como Grafo Dirigido Acíclico (DAG).
 * 2. Asignación de niveles topológicos para ordenamiento en columnas.
 * 3. Cálculo del Camino Crítico Inicial mediante CPM (Critical Path Method) con holgura cero (slack = 0).
 * 4. Clasificación de materias:
 *    - Aprobada/Promocionada: registrada en la sesión del alumno.
 *    - Habilitada para cursar: todas sus correlativas están aprobadas.
 *    - Bloqueada: adeuda una o más correlativas.
 *    - Camino Crítico: materias cuya duración acumulada hasta el egreso es máxima (cuello de botella).
 * 5. Recálculo dinámico del Camino Crítico al guardar materias aprobadas, ajustándose
 *    exclusivamente al subgrafo de materias no aprobadas restantes.
 */

export class CurriculumGraph {
  constructor(materiasData) {
    this.rawMaterias = materiasData;
    this.nodes = new Map();
    this.successors = new Map();
    this.predecessors = new Map();
    this.levels = new Map();
    this.years = new Map();
    
    this._buildGraph();
    this._computeTopologicalLevels();
  }

  /**
   * Construye las listas de adyacencia directa e inversa.
   */
  _buildGraph() {
    this.rawMaterias.forEach(m => {
      const anioNum = Number(m.anio) || 1;
      this.nodes.set(m.id, {
        id: String(m.id),
        nombre: m.nombre,
        anio: anioNum,
        correlativas: m.correlativas.map(String)
      });
      this.years.set(String(m.id), anioNum);
      this.successors.set(String(m.id), []);
      this.predecessors.set(String(m.id), m.correlativas.map(String));
    });

    // Armar sucesores (aristas salientes: correlativa -> materia dependiente)
    this.nodes.forEach(node => {
      node.correlativas.forEach(prereqId => {
        if (this.successors.has(prereqId)) {
          this.successors.get(prereqId).push(node.id);
        }
      });
    });
  }

  /**
   * Asigna a cada materia un nivel topológico (columna en el mapa)
   * basado en la longitud máxima de la cadena de correlativas previas.
   */
  _computeTopologicalLevels() {
    const memo = new Map();

    const getLevel = (id) => {
      if (memo.has(id)) return memo.get(id);
      const node = this.nodes.get(id);
      if (!node || node.correlativas.length === 0) {
        memo.set(id, 0);
        return 0;
      }
      let maxPrereqLevel = 0;
      node.correlativas.forEach(prereqId => {
        if (this.nodes.has(prereqId)) {
          maxPrereqLevel = Math.max(maxPrereqLevel, getLevel(prereqId) + 1);
        }
      });
      memo.set(id, maxPrereqLevel);
      return maxPrereqLevel;
    };

    this.nodes.forEach((_, id) => {
      this.levels.set(id, getLevel(id));
    });
  }

  /**
   * Obtiene la cantidad total de niveles (columnas) del plan.
   */
  getMaxLevel() {
    let max = 0;
    this.levels.forEach(lvl => {
      if (lvl > max) max = lvl;
    });
    return max;
  }

  /**
   * Obtiene la cantidad total de años de la carrera.
   */
  getMaxYear() {
    let max = 1;
    this.years.forEach(y => {
      if (y > max) max = y;
    });
    return max;
  }

  /**
   * Calcula el estado de cada materia y el camino crítico dinámico.
   * 
   * @param {Set<string>} approvedIds - Conjunto de IDs de materias aprobadas.
   * @returns {Object} Resultado con estados de nodos, aristas críticas y métricas.
   */
  analyze(approvedIds = new Set()) {
    const nodeStatus = new Map();
    const remainingNodes = new Set();

    // 1. Clasificación base: Aprobadas vs Restantes
    this.nodes.forEach((node, id) => {
      if (approvedIds.has(id)) {
        nodeStatus.set(id, {
          status: 'aprobada',
          isApproved: true,
          isAvailable: false,
          isCritical: false,
          isBlocked: false
        });
      } else {
        remainingNodes.add(id);
      }
    });

    // Si todas las materias están aprobadas (carrera completada)
    if (remainingNodes.size === 0) {
      return {
        nodeStatus,
        criticalPathNodes: new Set(),
        criticalEdges: new Set(),
        availableCount: 0,
        remainingMaxDuration: 0,
        isCompleted: true
      };
    }

    // 2. Determinar cuáles de las materias restantes están Habilitadas (disponibles para cursar)
    const isAvailableMap = new Map();
    remainingNodes.forEach(id => {
      const node = this.nodes.get(id);
      // Una materia está habilitada si TODAS sus correlativas ya fueron aprobadas
      const allPrereqsApproved = node.correlativas.every(cId => approvedIds.has(cId));
      isAvailableMap.set(id, allPrereqsApproved);
    });

    // 3. Algoritmo CPM (Critical Path Method) en el subgrafo de materias restantes:
    //    Cada materia no aprobada representa 1 cuatrimestre de cursada (duración = 1).
    //    
    //    remES(u): Distancia mínima en cuatrimestres desde una materia actualmente disponible hasta u.
    //              Si u está habilitada ahora, remES(u) = 1.
    //              Si no, remES(u) = 1 + max(remES(c) para toda correlativa c de u que aún NO esté aprobada).
    const remES = new Map();
    const computeES = (id) => {
      if (remES.has(id)) return remES.get(id);
      const node = this.nodes.get(id);
      const unapprovedPrereqs = node.correlativas.filter(cId => remainingNodes.has(cId));
      
      if (unapprovedPrereqs.length === 0) {
        remES.set(id, 1);
        return 1;
      }
      let maxPrereqES = 0;
      unapprovedPrereqs.forEach(cId => {
        maxPrereqES = Math.max(maxPrereqES, computeES(cId));
      });
      const val = 1 + maxPrereqES;
      remES.set(id, val);
      return val;
    };

    remainingNodes.forEach(id => computeES(id));

    //    remLF(u): Distancia máxima en cuatrimestres desde u hasta el final de la carrera (sinks no aprobados).
    //              Si u no tiene materias dependientes no aprobadas, remLF(u) = 1.
    //              Si no, remLF(u) = 1 + max(remLF(s) para todo sucesor s no aprobado).
    const remLF = new Map();
    const computeLF = (id) => {
      if (remLF.has(id)) return remLF.get(id);
      const succs = this.successors.get(id) || [];
      const unapprovedSuccs = succs.filter(sId => remainingNodes.has(sId));
      
      if (unapprovedSuccs.length === 0) {
        remLF.set(id, 1);
        return 1;
      }
      let maxSuccLF = 0;
      unapprovedSuccs.forEach(sId => {
        maxSuccLF = Math.max(maxSuccLF, computeLF(sId));
      });
      const val = 1 + maxSuccLF;
      remLF.set(id, val);
      return val;
    };

    remainingNodes.forEach(id => computeLF(id));

    // 4. Duración máxima restante para graduarse
    let maxChainLength = 0;
    remainingNodes.forEach(id => {
      const chainLen = remES.get(id) + remLF.get(id) - 1;
      if (chainLen > maxChainLength) {
        maxChainLength = chainLen;
      }
    });

    // 5. Identificar nodos del Camino Crítico (Holgura = 0 en el subgrafo restante)
    const criticalPathNodes = new Set();
    remainingNodes.forEach(id => {
      const chainLen = remES.get(id) + remLF.get(id) - 1;
      if (chainLen === maxChainLength) {
        criticalPathNodes.add(id);
      }
    });

    // 6. Identificar aristas críticas (conexiones entre nodos críticos consecutivos)
    const criticalEdges = new Set();
    criticalPathNodes.forEach(uId => {
      const succs = this.successors.get(uId) || [];
      succs.forEach(vId => {
        if (criticalPathNodes.has(vId) && remES.get(vId) === remES.get(uId) + 1) {
          criticalEdges.add(`${uId}->${vId}`);
        }
      });
    });

    // 7. Consolidar estados para cada materia restante
    let availableCount = 0;
    remainingNodes.forEach(id => {
      const isCrit = criticalPathNodes.has(id);
      const isAvail = isAvailableMap.get(id);
      if (isAvail) availableCount++;

      let status = 'bloqueada';
      if (isCrit) {
        status = 'critica';
      } else if (isAvail) {
        status = 'habilitada';
      }

      nodeStatus.set(id, {
        status,
        isApproved: false,
        isAvailable: isAvail,
        isCritical: isCrit,
        isBlocked: !isAvail && !isCrit,
        es: remES.get(id),
        lf: remLF.get(id)
      });
    });

    return {
      nodeStatus,
      criticalPathNodes,
      criticalEdges,
      availableCount,
      remainingMaxDuration: maxChainLength,
      isCompleted: false
    };
  }
}
