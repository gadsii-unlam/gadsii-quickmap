// Datos de respaldo para funcionamiento sin servidor HTTP (e.g. file:///)
export const FALLBACK_PLANS = {
  "Desarrollo_Web": {
    "carrera": "Tecnicatura Universitaria en Web",
    "materias": [
      {
        "id": "2619",
        "nombre": "Programación Básica I",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "2620",
        "nombre": "Informática General",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "2621",
        "nombre": "Matemática General",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "2622",
        "nombre": "Inglés Técnico I",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "2623",
        "nombre": "Programación Básica II",
        "anio": 1,
        "correlativas": [
          "2619"
        ]
      },
      {
        "id": "2624",
        "nombre": "Programación Web I",
        "anio": 1,
        "correlativas": [
          "2619",
          "2620"
        ]
      },
      {
        "id": "2625",
        "nombre": "Base de Datos I",
        "anio": 1,
        "correlativas": [
          "2619",
          "2620",
          "2621"
        ]
      },
      {
        "id": "2626",
        "nombre": "Introducción al Diseño Gráfico en la Web",
        "anio": 1,
        "correlativas": [
          "2620"
        ]
      },
      {
        "id": "2627",
        "nombre": "Inglés Técnico II",
        "anio": 1,
        "correlativas": [
          "2622"
        ]
      },
      {
        "id": "2628",
        "nombre": "Programación Web II",
        "anio": 2,
        "correlativas": [
          "2623",
          "2624",
          "2625"
        ]
      },
      {
        "id": "2629",
        "nombre": "Diseño de Aplicaciones Web",
        "anio": 2,
        "correlativas": [
          "2623",
          "2624",
          "2625"
        ]
      },
      {
        "id": "2630",
        "nombre": "Visualización e Interfaces",
        "anio": 2,
        "correlativas": [
          "2624",
          "2626"
        ]
      },
      {
        "id": "2631",
        "nombre": "Taller Web I",
        "anio": 2,
        "correlativas": [
          "2623",
          "2624",
          "2625"
        ]
      },
      {
        "id": "2632",
        "nombre": "Base de Datos II",
        "anio": 2,
        "correlativas": [
          "2625",
          "2629"
        ]
      },
      {
        "id": "2633",
        "nombre": "Programación Web III",
        "anio": 2,
        "correlativas": [
          "2628",
          "2629",
          "2630"
        ]
      },
      {
        "id": "2634",
        "nombre": "Tecnología de Redes",
        "anio": 2,
        "correlativas": [
          "2630"
        ]
      },
      {
        "id": "2635",
        "nombre": "Taller Web II",
        "anio": 2,
        "correlativas": [
          "2631"
        ]
      },
      {
        "id": "2636",
        "nombre": "Seguridad y Calidad en Aplicaciones Web",
        "anio": 2,
        "correlativas": [
          "2628",
          "2629"
        ]
      },
      {
        "id": "2637",
        "nombre": "Introducción a la Administración de Proyectos",
        "anio": 3,
        "correlativas": [
          "2632",
          "2633",
          "2634"
        ]
      },
      {
        "id": "2638",
        "nombre": "Taller Práctico Integrador",
        "anio": 3,
        "correlativas": [
          "2632",
          "2633",
          "2634",
          "2635",
          "2636"
        ]
      }
    ]
  },
  "Medicina": {
    "carrera": "Medicina",
    "materias": [
      {
        "id": "03242",
        "nombre": "Psicología y Relación Médico Paciente",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "00901",
        "nombre": "Inglés Nivel I",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "03243",
        "nombre": "Promoción Intercultural de la Salud y Ambiente",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "03261",
        "nombre": "Integradora Básica I",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "03262",
        "nombre": "Integradora Básica II",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "03240",
        "nombre": "Formación del Ser Humano",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "03241",
        "nombre": "Articulación Básico Clínica I",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "00902",
        "nombre": "Inglés Nivel II",
        "anio": 2,
        "correlativas": [
          "00901"
        ]
      },
      {
        "id": "03247",
        "nombre": "Epidemiología e Investigación en Salud",
        "anio": 2,
        "correlativas": [
          "03243"
        ]
      },
      {
        "id": "03263",
        "nombre": "Integradora Salud Pública I",
        "anio": 2,
        "correlativas": [
          "03261",
          "03262"
        ]
      },
      {
        "id": "03264",
        "nombre": "Integradora Salud Pública II",
        "anio": 2,
        "correlativas": [
          "03261",
          "03262"
        ]
      },
      {
        "id": "00903",
        "nombre": "Inglés Nivel III",
        "anio": 2,
        "correlativas": [
          "00902"
        ]
      },
      {
        "id": "03244",
        "nombre": "Nacimiento, Crecimiento y Desarrollo",
        "anio": 2,
        "correlativas": [
          "03240",
          "03241"
        ]
      },
      {
        "id": "03245",
        "nombre": "Articulación Básico Clínica II",
        "anio": 2,
        "correlativas": [
          "03240",
          "03241"
        ]
      },
      {
        "id": "03246",
        "nombre": "Agentes, Mecanismos de Defensa y Nutrición",
        "anio": 2,
        "correlativas": [
          "03240",
          "03241"
        ]
      },
      {
        "id": "00904",
        "nombre": "Inglés Nivel IV",
        "anio": 3,
        "correlativas": [
          "00903"
        ]
      },
      {
        "id": "03249",
        "nombre": "Farmacología I. Bases Fisiopatológicas del Tratamiento",
        "anio": 3,
        "correlativas": [
          "03245",
          "03246"
        ]
      },
      {
        "id": "00911",
        "nombre": "Computación Nivel I",
        "anio": 3,
        "correlativas": []
      },
      {
        "id": "03251",
        "nombre": "Gestión de Redes y Servicios de Salud",
        "anio": 3,
        "correlativas": [
          "03247"
        ]
      },
      {
        "id": "03248",
        "nombre": "Articulación Básico Clínica III",
        "anio": 3,
        "correlativas": [
          "03245",
          "03246"
        ]
      },
      {
        "id": "03250",
        "nombre": "Salud Integral de la Mujer",
        "anio": 3,
        "correlativas": [
          "03244",
          "03245",
          "03246"
        ]
      },
      {
        "id": "00912",
        "nombre": "Computación Nivel II",
        "anio": 4,
        "correlativas": [
          "00911"
        ]
      },
      {
        "id": "03254",
        "nombre": "Farmacología II. Clínica y Terapéutica",
        "anio": 4,
        "correlativas": [
          "03248",
          "03249"
        ]
      },
      {
        "id": "03255",
        "nombre": "Medicina General",
        "anio": 4,
        "correlativas": [
          "03248"
        ]
      },
      {
        "id": "03265",
        "nombre": "Integradora Clínica I",
        "anio": 4,
        "correlativas": [
          "03249",
          "03261",
          "03262",
          "03263",
          "03264"
        ]
      },
      {
        "id": "03266",
        "nombre": "Integradora Clínica II",
        "anio": 4,
        "correlativas": [
          "03251",
          "03261",
          "03262",
          "03263",
          "03264"
        ]
      },
      {
        "id": "03256",
        "nombre": "Salud Mental",
        "anio": 4,
        "correlativas": [
          "03242",
          "03248",
          "03249"
        ]
      },
      {
        "id": "03252",
        "nombre": "Salud del Niño, Niña y Adolescente",
        "anio": 4,
        "correlativas": [
          "03244",
          "03248",
          "03249"
        ]
      },
      {
        "id": "03253",
        "nombre": "Medicina Interna y Campos Clínicos I",
        "anio": 4,
        "correlativas": [
          "03248",
          "03249"
        ]
      },
      {
        "id": "03257",
        "nombre": "Salud del Adulto Mayor",
        "anio": 5,
        "correlativas": [
          "03253",
          "03254"
        ]
      },
      {
        "id": "03260",
        "nombre": "Bioética, Derechos Humanos y Legislación en Salud",
        "anio": 5,
        "correlativas": [
          "03251",
          "03265",
          "03266"
        ]
      },
      {
        "id": "03267",
        "nombre": "Integradora Avanzada I",
        "anio": 5,
        "correlativas": [
          "03261",
          "03262",
          "03263",
          "03264",
          "03265",
          "03266"
        ]
      },
      {
        "id": "03268",
        "nombre": "Integradora Avanzada II",
        "anio": 5,
        "correlativas": [
          "03261",
          "03262",
          "03263",
          "03264",
          "03265",
          "03266"
        ]
      },
      {
        "id": "03258",
        "nombre": "Medicina Interna y Campos Clínicos II",
        "anio": 5,
        "correlativas": [
          "03253",
          "03254"
        ]
      },
      {
        "id": "03259",
        "nombre": "Clínica Quirúrgica",
        "anio": 5,
        "correlativas": [
          "03250",
          "03253",
          "03254"
        ]
      },
      {
        "id": "03269",
        "nombre": "Práctica Final Obligatoria",
        "anio": 6,
        "correlativas": [
          "03252",
          "03255",
          "03256",
          "03257",
          "03258",
          "03259",
          "03260",
          "03267",
          "03268"
        ]
      }
    ]
  },
  "Nutricion": {
    "carrera": "Licenciatura en Nutrición",
    "materias": [
      {
        "id": "01533",
        "nombre": "Educación para la Salud",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "01534",
        "nombre": "Introducción al Pensamiento Científico",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "01535",
        "nombre": "Biofísica",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "01536",
        "nombre": "Relaciones Psicosociales",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "01537",
        "nombre": "Embriología y Desarrollo",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "01538",
        "nombre": "Nutrición del Niño y Adolescente Sano",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "01530",
        "nombre": "Anatomía Descriptiva y Topográfica",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "01531",
        "nombre": "Bioquímica",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "01532",
        "nombre": "Nutrición Normal",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "00901",
        "nombre": "Inglés Nivel I",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "00911",
        "nombre": "Computación Nivel I",
        "anio": 1,
        "correlativas": []
      },
      {
        "id": "01541",
        "nombre": "Psicología Social e Institucional",
        "anio": 2,
        "correlativas": [
          "01533",
          "01536",
          "01537"
        ]
      },
      {
        "id": "01542",
        "nombre": "Epidemiología",
        "anio": 2,
        "correlativas": [
          "01534"
        ]
      },
      {
        "id": "01543",
        "nombre": "Bromatología y Tecnología de los Alimentos",
        "anio": 2,
        "correlativas": [
          "01531",
          "01532"
        ]
      },
      {
        "id": "01544",
        "nombre": "Atención Primaria para la Salud",
        "anio": 2,
        "correlativas": [
          "01532",
          "01533",
          "01534",
          "01536",
          "01537",
          "01538"
        ]
      },
      {
        "id": "01545",
        "nombre": "Administración, Organización y Gestión de Servicios",
        "anio": 2,
        "correlativas": [
          "01541"
        ]
      },
      {
        "id": "01539",
        "nombre": "Fisiología",
        "anio": 2,
        "correlativas": [
          "01530",
          "01531",
          "01535",
          "01537"
        ]
      },
      {
        "id": "01540",
        "nombre": "Técnicas y Manejo de Alimentos",
        "anio": 2,
        "correlativas": [
          "01531",
          "01532",
          "01535"
        ]
      },
      {
        "id": "00902",
        "nombre": "Inglés Nivel II",
        "anio": 2,
        "correlativas": [
          "00901"
        ]
      },
      {
        "id": "00912",
        "nombre": "Computación Nivel II",
        "anio": 2,
        "correlativas": [
          "00911"
        ]
      },
      {
        "id": "01549",
        "nombre": "Microbiología",
        "anio": 3,
        "correlativas": [
          "01530",
          "01531",
          "01532",
          "01533",
          "01534",
          "01535",
          "01536",
          "01537",
          "01538",
          "01539",
          "01540",
          "01543"
        ]
      },
      {
        "id": "01550",
        "nombre": "Farmacología General",
        "anio": 3,
        "correlativas": [
          "01530",
          "01531",
          "01532",
          "01533",
          "01534",
          "01535",
          "01536",
          "01537",
          "01538",
          "01539"
        ]
      },
      {
        "id": "01551",
        "nombre": "Fisiopatología y Dietoterapia del Niño y del Adolescente",
        "anio": 3,
        "correlativas": [
          "01530",
          "01531",
          "01532",
          "01533",
          "01534",
          "01535",
          "01536",
          "01537",
          "01538",
          "01539",
          "01540"
        ]
      },
      {
        "id": "01552",
        "nombre": "Antropología, Cultura y Nutrición",
        "anio": 3,
        "correlativas": [
          "01530",
          "01531",
          "01532",
          "01533",
          "01534",
          "01535",
          "01536",
          "01537",
          "01538",
          "01541",
          "01544"
        ]
      },
      {
        "id": "01553",
        "nombre": "Toxicología de los Alimentos",
        "anio": 3,
        "correlativas": [
          "01530",
          "01531",
          "01532",
          "01533",
          "01534",
          "01535",
          "01536",
          "01537",
          "01538",
          "01540",
          "01543"
        ]
      },
      {
        "id": "01546",
        "nombre": "Técnica Dietoterápica",
        "anio": 3,
        "correlativas": [
          "01530",
          "01531",
          "01532",
          "01533",
          "01534",
          "01535",
          "01536",
          "01537",
          "01538",
          "01539",
          "01540",
          "01543"
        ]
      },
      {
        "id": "01547",
        "nombre": "Fisiopatología y Dietoterapia del Adulto",
        "anio": 3,
        "correlativas": [
          "01530",
          "01531",
          "01532",
          "01533",
          "01534",
          "01535",
          "01536",
          "01537",
          "01538",
          "01539",
          "01540",
          "01543"
        ]
      },
      {
        "id": "01548",
        "nombre": "Atención Comunitaria I",
        "anio": 3,
        "correlativas": [
          "01530",
          "01531",
          "01532",
          "01533",
          "01534",
          "01535",
          "01536",
          "01537",
          "01538",
          "01539",
          "01540",
          "01543"
        ]
      },
      {
        "id": "01555",
        "nombre": "Atención Comunitaria II",
        "anio": 4,
        "correlativas": [
          "01545",
          "01546",
          "01547",
          "01548"
        ]
      },
      {
        "id": "01556",
        "nombre": "Metodología de la Investigación",
        "anio": 4,
        "correlativas": [
          "01545",
          "01546",
          "01547",
          "01548"
        ]
      },
      {
        "id": "01557",
        "nombre": "Soporte Nutricional",
        "anio": 4,
        "correlativas": [
          "01546",
          "01547",
          "01548"
        ]
      },
      {
        "id": "01558",
        "nombre": "Historia Argentina y Latinoamericana de las Ciencias de la Salud",
        "anio": 4,
        "correlativas": [
          "01546",
          "01547",
          "01548"
        ]
      },
      {
        "id": "01559",
        "nombre": "Deontología",
        "anio": 4,
        "correlativas": [
          "01545",
          "01546",
          "01547",
          "01548"
        ]
      },
      {
        "id": "01560",
        "nombre": "Política y Evaluación en Nutrición",
        "anio": 4,
        "correlativas": [
          "01545",
          "01546",
          "01547",
          "01548"
        ]
      },
      {
        "id": "01561",
        "nombre": "Economía, Comercialización y Distribución de Alimentos",
        "anio": 4,
        "correlativas": [
          "01545",
          "01546",
          "01547",
          "01548"
        ]
      },
      {
        "id": "01562",
        "nombre": "Técnicas Pedagógicas en Nutrición",
        "anio": 4,
        "correlativas": [
          "01545",
          "01546",
          "01547",
          "01548"
        ]
      },
      {
        "id": "01563",
        "nombre": "Nutrición y Deporte",
        "anio": 4,
        "correlativas": [
          "01545",
          "01546",
          "01547",
          "01548"
        ]
      },
      {
        "id": "01564",
        "nombre": "Marketing, Investigación y Desarrollo de Alimentos",
        "anio": 4,
        "correlativas": [
          "01545",
          "01546",
          "01547",
          "01548"
        ]
      },
      {
        "id": "01565",
        "nombre": "Bioética y Ética Profesional",
        "anio": 4,
        "correlativas": [
          "01559"
        ]
      },
      {
        "id": "01554",
        "nombre": "Administración en Servicios de Alimentación",
        "anio": 4,
        "correlativas": [
          "01545",
          "01546",
          "01547",
          "01548"
        ]
      },
      {
        "id": "00903",
        "nombre": "Inglés Nivel III",
        "anio": 4,
        "correlativas": [
          "00902"
        ]
      },
      {
        "id": "01566",
        "nombre": "Práctica Profesional en Servicios de Alimentación",
        "anio": 5,
        "correlativas": [
          "01530",
          "01531",
          "01532",
          "01533",
          "01534",
          "01535",
          "01536",
          "01537",
          "01538",
          "01539",
          "01540",
          "01541",
          "01542",
          "01543",
          "01544",
          "01545",
          "01546",
          "01547",
          "01548",
          "01549",
          "01550",
          "01551",
          "01552",
          "01553",
          "01554",
          "01555",
          "01556",
          "01557",
          "01558",
          "01559",
          "01560",
          "01561",
          "01562",
          "01563",
          "01564",
          "01565"
        ]
      },
      {
        "id": "01567",
        "nombre": "Práctica Profesional en Nutrición Clínica",
        "anio": 5,
        "correlativas": [
          "01530",
          "01531",
          "01532",
          "01533",
          "01534",
          "01535",
          "01536",
          "01537",
          "01538",
          "01539",
          "01540",
          "01541",
          "01542",
          "01543",
          "01544",
          "01545",
          "01546",
          "01547",
          "01548",
          "01549",
          "01550",
          "01551",
          "01552",
          "01553",
          "01554",
          "01555",
          "01556",
          "01557",
          "01558",
          "01559",
          "01560",
          "01561",
          "01562",
          "01563",
          "01564",
          "01565"
        ]
      },
      {
        "id": "00904",
        "nombre": "Inglés Nivel IV",
        "anio": 5,
        "correlativas": [
          "00903"
        ]
      }
    ]
  }
};
