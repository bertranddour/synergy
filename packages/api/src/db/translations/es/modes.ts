import type { ModeTranslation } from '../../schema.js'

export const esModes: Record<string, ModeTranslation> = {
  validation: {
    name: 'Modo Validacion',
    purpose:
      'Pon a prueba tu hipotesis de negocio mas arriesgada con evidencia y toma una decision clara: Perseverar/Pivotar/Experimentar de nuevo.',
    trigger:
      'Usar cuando estas a punto de tomar una decision de negocio importante basada en algo que crees pero no has probado.',
    flowName: 'Validacion',
    doneSignal: 'Puedes enunciar tu hipotesis, la evidencia a favor o en contra, y tu decision en una frase?',
    fieldsSchema: [
      {
        name: 'Hipotesis',
        description: 'La creencia especifica que estas poniendo a prueba. Debe ser falsificable.',
        type: 'text' as const,
        required: true,
        example: 'Los disenadores freelance pagaran 49 $/mes por facturacion automatizada.',
      },
      {
        name: 'Nivel de riesgo',
        description: 'Cuanto dano si esta hipotesis es incorrecta.',
        type: 'text' as const,
        required: true,
        options: ['Alto', 'Medio', 'Bajo'],
      },
      {
        name: 'Evidencia actual',
        description: 'Lo que ya sabes. Datos, conversaciones, senales.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Diseno del experimento',
        description: 'La prueba mas barata y rapida que podria refutar la hipotesis.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Criterios de exito',
        description: 'El numero especifico que significa que la hipotesis se sostiene.',
        type: 'text' as const,
        required: true,
        example: '5 % de tasa de registro en 7 dias.',
      },
      {
        name: 'Plazo limitado',
        description: 'Cuanto tiempo dura el experimento.',
        type: 'text' as const,
        required: true,
        example: '7 dias.',
      },
      {
        name: 'Resultados',
        description: 'Lo que realmente paso. Datos brutos, no interpretacion.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Decision',
        description: 'Basandose en la evidencia: Perseverar, Pivotar o Experimentar de nuevo.',
        type: 'text' as const,
        required: true,
        options: ['Perseverar', 'Pivotar', 'Experimentar de nuevo'],
      },
      {
        name: 'Proxima accion',
        description: 'El siguiente paso concreto con una fecha.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Actualizacion de la hipotesis',
        description: 'Como ha cambiado esta hipotesis en base a lo que aprendiste?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Las hipotesis identificadas en el Motor de Negocio alimentan la Validacion',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La hipotesis de mayor prioridad de la Pila de Prioridades',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Los resultados del experimento alimentan la Captura de Insights',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Los resultados validados pueden empaquetarse para revision del equipo',
      },
    ],
  },
  'insight-capture': {
    name: 'Modo Captura de Insights',
    purpose: 'Transforma las senales brutas de tu mercado en patrones estructurados y proximos pasos accionables.',
    trigger:
      'Usar cuando tienes datos brutos, conversaciones con clientes o senales del mercado que necesitan estructura.',
    flowName: 'Validacion',
    doneSignal:
      'Puedes explicar este insight a alguien que no estaba en la sala, con suficiente contexto para que pueda actuar?',
    fieldsSchema: [
      {
        name: 'Fuente de la senal',
        description: 'De donde vino este insight?',
        type: 'text' as const,
        required: true,
        options: [
          'Conversacion con cliente',
          'Datos de uso',
          'Investigacion de mercado',
          'Observacion de competencia',
          'Feedback del equipo',
          'Otro',
        ],
      },
      {
        name: 'Senal bruta',
        description: 'La observacion exacta, cita o dato.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Coincidencia de patron',
        description: 'Se conecta esto con algo que hayas visto antes?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Intensidad',
        description: 'Que tan fuerte es esta senal?',
        type: 'text' as const,
        required: true,
        options: ['Fuerte (multiples fuentes)', 'Moderada (2+ senales)', 'Debil (senal unica)'],
      },
      {
        name: 'Implicacion',
        description: 'Si esta senal es real, que significa para tu negocio?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Accion',
        description: 'Que siguiente paso concreto impulsa este insight?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Los resultados del experimento alimentan la Captura de Insights',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Los insights validados orientan las propuestas de valor',
      },
    ],
  },
  'proposition-builder': {
    name: 'Modo Constructor de Propuesta',
    purpose:
      'Construye propuestas de valor respaldadas por evidencia en tres niveles: Basico, Satisfactorio, Encantador.',
    trigger: 'Usar cuando necesitas articular lo que ofreces y por que importa, basandote en evidencia.',
    flowName: 'Validacion',
    doneSignal:
      'Puede un nuevo miembro del equipo explicar tu propuesta de valor en 30 segundos, incluyendo para quien es y por que les importa?',
    fieldsSchema: [
      {
        name: 'Cliente objetivo',
        description: 'Para quien exactamente es esta propuesta?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Enunciado del problema',
        description: 'El problema especifico que resuelves, en sus palabras.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Nivel Basico',
        description: 'El valor minimo viable -- lo que debes entregar.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Nivel Satisfactorio',
        description: 'El valor esperado que cumple con el estandar.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Nivel Encantador',
        description: 'El valor inesperado que crea fidelidad.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evidencia',
        description: 'Que datos validados respaldan cada nivel?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Diferenciacion',
        description: 'Que hace que tu propuesta sea diferente de las alternativas?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Los insights validados orientan las propuestas' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La propuesta alimenta el diseno del modelo de negocio',
      },
    ],
  },
  'business-engine': {
    name: 'Modo Motor de Negocio',
    purpose: 'Mapea las hipotesis de tu modelo de negocio e identifica cuales podrian romper el motor.',
    trigger: 'Usar cuando necesitas entender como funciona tu negocio como sistema y que hipotesis son fundamentales.',
    flowName: 'Estrategia',
    doneSignal:
      'Puedes explicar tu modelo de negocio en una frase, nombrar la hipotesis mas arriesgada y decir que evidencia tienes?',
    fieldsSchema: [
      {
        name: 'Modelo de ingresos',
        description: 'Como entra el dinero? Se especifico con precios y canales.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Estructura de costos',
        description: 'A donde va el dinero? Costos fijos vs variables.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Hipotesis clave',
        description: 'Lista las 3 a 5 hipotesis de las que depende tu modelo.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Hipotesis mas arriesgada',
        description: 'Cual hipotesis, si es incorrecta, rompe el modelo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evidencia actual',
        description: 'Que datos respaldan o cuestionan cada hipotesis?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Economia unitaria',
        description: 'Ingreso por unidad, costo por unidad, margen.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Las hipotesis alimentan la clasificacion por prioridad',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'La hipotesis mas arriesgada debe ser validada' },
    ],
  },
  'priority-stack': {
    name: 'Modo Pila de Prioridades',
    purpose: 'Crea un ranking forzado de prioridades basado en evidencia con una lista clara de lo que No Haces.',
    trigger:
      'Usar cuando tienes mas cosas por hacer que tiempo para hacerlas, y necesitas claridad despiadada sobre lo que importa.',
    flowName: 'Estrategia',
    doneSignal: 'Puedes decirle a alguien tus 3 prioridades principales y tu lista de No Hacer sin dudar?',
    fieldsSchema: [
      {
        name: 'Candidatos',
        description: 'Lista todo lo que compite por tu atencion ahora mismo.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Criterios',
        description: 'Que criterios usaras para clasificar? Impacto, urgencia, solidez de la evidencia.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ranking forzado',
        description: 'Clasifica todos los candidatos del 1 al N. No se permiten empates.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Top 3',
        description: 'Tus 3 prioridades principales con una justificacion de una frase cada una.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Lista No Hacer',
        description: 'Todo lo que queda por debajo de la linea de corte. Dilo explicitamente.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Asignacion de tiempo',
        description: 'Como se distribuira tu tiempo entre el top 3 este periodo?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Las hipotesis del Motor de Negocio necesitan clasificacion',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Las prioridades principales alimentan el seguimiento de ejecucion',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La hipotesis de mayor prioridad va a Validacion',
      },
    ],
  },
  'execution-tracker': {
    name: 'Modo Seguimiento de Ejecucion',
    purpose: 'Haz seguimiento de la visibilidad del trabajo e identifica bloqueos con seguimiento asincrono.',
    trigger: 'Usar cuando necesitas ver que esta pasando, que esta bloqueado y que necesita desbloquearse.',
    flowName: 'Ejecucion',
    doneSignal:
      'Puedes ver todo el trabajo activo, saber que esta bloqueado y tener una accion de desbloqueo especifica para cada obstáculo?',
    fieldsSchema: [
      {
        name: 'Elementos de trabajo',
        description: 'Lista los elementos de trabajo activos conectados a tus prioridades.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Estado',
        description: 'Para cada elemento: No iniciado, En progreso, Bloqueado, Terminado.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Bloqueos',
        description: 'Que esta bloqueado y por que? Se especifico.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Acciones de desbloqueo',
        description: 'Para cada bloqueo: quien necesita hacer que y para cuando?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Tiempo de ciclo',
        description: 'Cuanto tiempo desde el inicio hasta la finalizacion de los elementos recientes?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Las prioridades definen que rastrear' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Los elementos terminados van al Control de Entrega',
      },
    ],
  },
  'delivery-check': {
    name: 'Modo Control de Entrega',
    purpose: 'Portal de calidad para el trabajo terminado y seguimiento del rendimiento post-entrega.',
    trigger: 'Usar cuando el trabajo esta terminado y necesita un control de calidad antes de darlo por entregado.',
    flowName: 'Ejecucion',
    doneSignal: 'Puedes afirmar con confianza que este entregable esta listo para la persona que lo recibe?',
    fieldsSchema: [
      { name: 'Entregable', description: 'Que se entrego? Se especifico.', type: 'text' as const, required: true },
      {
        name: 'Criterios de calidad',
        description: 'Que estandares debe cumplir?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evaluacion de calidad',
        description: 'Cumple con cada criterio? Pasa/Falla por elemento.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Problemas encontrados',
        description: 'Que necesita corregirse antes de la entrega?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Seguimiento post-entrega',
        description: 'Que monitorearas despues de la entrega para confirmar la calidad?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Elementos de trabajo terminados del Seguimiento de Ejecucion',
      },
    ],
  },
  'information-architecture': {
    name: 'Modo Arquitectura de la Informacion',
    purpose:
      'Disena donde vive la informacion para que las personas encuentren lo que necesitan en 5 minutos sin preguntar.',
    trigger:
      'Usar cuando la gente no para de preguntar donde estan las cosas, la informacion esta duplicada o perdida, o los nuevos integrantes no encuentran lo que necesitan.',
    flowName: 'Informar',
    doneSignal:
      'Puede un nuevo miembro del equipo encontrar cualquier informacion critica en 5 minutos sin preguntar a alguien?',
    fieldsSchema: [
      {
        name: 'Auditoria de informacion',
        description: 'Donde vive actualmente la informacion? Lista todas las herramientas y ubicaciones.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Puntos de dolor',
        description: 'Que informacion es la mas dificil de encontrar? Que preguntas se hacen repetidamente?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Categorias',
        description: 'Agrupa la informacion en categorias logicas.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Fuente unica de verdad',
        description: 'Para cada categoria, cual es la ubicacion canonica?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Prueba de encontrabilidad',
        description: 'Puede un nuevo miembro del equipo encontrar X en 5 minutos? Prueba con 3 elementos comunes.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La estructura de informacion habilita el diseno de trabajo asincrono',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Las categorias de informacion alimentan la estructura de conocimiento IA',
      },
    ],
  },
  'flex-work-design': {
    name: 'Modo Diseno de Trabajo Flexible',
    purpose:
      'Define los parametros asincronos por defecto, las excepciones sincronas, el presupuesto de reuniones y los ritmos de energia de tu equipo.',
    trigger:
      'Usar cuando tu equipo pasa demasiado tiempo en reuniones, trabaja en distintas zonas horarias o tiene dificultades con el equilibrio vida-trabajo.',
    flowName: 'Informar',
    doneSignal:
      'Cada miembro del equipo puede explicar cuando usar asincrono por defecto, cuando lo sincrono es apropiado y cual es su presupuesto de reuniones?',
    fieldsSchema: [
      {
        name: 'Carga de reuniones actual',
        description: 'Cuantas horas por semana pasa cada persona en reuniones?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Asincrono por defecto',
        description: 'Cual es tu modo por defecto: asincrono o sincrono? Define la regla.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Excepciones sincronas',
        description: 'Que requiere especificamente interaccion en tiempo real?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Presupuesto de reuniones',
        description: 'Horas maximas de reunion por persona por semana.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ritmos de energia',
        description: 'Cuando son las personas mas productivas? Como proteges el trabajo profundo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocolo de zonas horarias',
        description: 'Como manejas lo asincrono entre zonas? Horas de superposicion?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La estructura de informacion habilita el trabajo flexible',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'El diseno de trabajo alimenta la cadencia del equipo',
      },
    ],
  },
  'team-rhythm': {
    name: 'Modo Ritmo de Equipo',
    purpose:
      'Disena tu cadencia semanal: puntos de contacto sincronos, bloques de trabajo profundo, puntos de control de energia.',
    trigger:
      'Usar cuando el equipo carece de una cadencia consistente, la gente no sabe cuando esperar actualizaciones, o el trabajo profundo se interrumpe constantemente.',
    flowName: 'Coordinar',
    doneSignal: 'Cada miembro del equipo conoce el ritmo semanal sin consultar un calendario?',
    fieldsSchema: [
      {
        name: 'Cadencia semanal',
        description: 'Mapea el ritmo semanal recurrente del equipo.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Puntos de contacto sincronos',
        description: 'Lista los momentos sincronos esenciales y su proposito.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Bloques de trabajo profundo',
        description: 'Cuando son los periodos de concentracion protegidos? Como se hacen cumplir?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Puntos de control de energia',
        description: 'Como verificas la energia y carga de trabajo del equipo?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'El diseno de trabajo define las restricciones de ritmo',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'El ritmo define cuando las decisiones se toman asincrona vs sincronamente',
      },
    ],
  },
  'async-decision': {
    name: 'Modo Decision Asincrona',
    purpose:
      'Toma una decision clara de forma asincrona con una pregunta estructurada, opciones, fecha limite y protocolo de disenso.',
    trigger: 'Usar cuando se necesita tomar una decision y una reunion no es la mejor forma de tomarla.',
    flowName: 'Coordinar',
    doneSignal: 'Esta la decision registrada, la justificacion documentada y todas las partes interesadas notificadas?',
    fieldsSchema: [
      {
        name: 'Pregunta de decision',
        description: 'La pregunta especifica que se esta decidiendo. Una frase.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Opciones',
        description: 'Las opciones que se consideran, con pros/contras de cada una.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Decisor', description: 'Quien toma la decision final?', type: 'text' as const, required: true },
      { name: 'Fecha limite', description: 'Cuando debe tomarse la decision?', type: 'text' as const, required: true },
      {
        name: 'Opinion solicitada a',
        description: 'Quien debe opinar antes de la fecha limite?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocolo de disenso',
        description: 'Como puede alguien expresar su desacuerdo? Que pasa con las objeciones?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Registro de decision',
        description: 'La decision final, la justificacion y quienes fueron consultados.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Las decisiones deben empaquetarse para la visibilidad del equipo',
      },
    ],
  },
  package: {
    name: 'Modo Empaquetado',
    purpose: 'Crea paquetes de comunicacion autonomos que no requieren preguntas de seguimiento.',
    trigger: 'Usar cuando compartes trabajo, actualizaciones o decisiones con personas que no estaban en la sala.',
    flowName: 'Comunicar',
    doneSignal: 'Puede alguien actuar sobre este paquete sin hacer una sola pregunta de aclaracion?',
    fieldsSchema: [
      {
        name: 'Contexto',
        description: 'Que necesita saber el lector para entender esto?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Puntos clave',
        description: 'Las 3 a 5 cosas mas importantes. Numeradas.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Decision necesaria',
        description: 'Se necesita una decision? De quien? Para cuando?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Fecha limite', description: 'Cuando debe responder el lector?', type: 'text' as const, required: true },
      {
        name: 'Formato de respuesta',
        description: 'Como debe responder el lector? Comentar, aprobar, editar?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Los resultados de validacion pueden empaquetarse',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Las decisiones deben empaquetarse' },
    ],
  },
  'contribution-tracker': {
    name: 'Modo Seguimiento de Contribuciones',
    purpose: 'Haz visible el trabajo invisible a traves de 5 tipos de contribuciones.',
    trigger:
      'Usar cuando algunos miembros del equipo hacen trabajo critico que nadie ve, o el reconocimiento esta sesgado hacia los entregables visibles.',
    flowName: 'Reconocer',
    doneSignal: 'Puedes ver las contribuciones en los 5 tipos, no solo la entrega?',
    fieldsSchema: [
      {
        name: 'Miembro del equipo',
        description: 'Para quien estas haciendo seguimiento de contribuciones?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Entrega', description: 'Productos tangibles entregados.', type: 'text' as const, required: true },
      {
        name: 'Mentoria',
        description: 'Ayudar a otros a crecer, trabajo en pares, revision, ensenanza.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Documentacion',
        description: 'Escritos que ayudan a otros a trabajar de forma autonoma.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Mejora de procesos',
        description: 'Mejorar sistemas, herramientas o flujos de trabajo.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Desbloqueo', description: 'Eliminar obstaculos para otros.', type: 'text' as const, required: true },
    ],
    composabilityHooks: [],
  },
  'culture-at-distance': {
    name: 'Modo Cultura a Distancia',
    purpose:
      'Define comportamientos observables, rituales, protocolo de conflicto y senales de confianza para equipos distribuidos.',
    trigger:
      'Usar cuando la cultura se siente debil en un equipo distribuido -- la gente es productiva pero desconectada.',
    flowName: 'Cultura',
    doneSignal: 'Podria un nuevo integrante remoto entender la cultura de tu equipo solo con la documentacion?',
    fieldsSchema: [
      {
        name: 'Comportamientos observables',
        description: 'Que comportamientos definen tu cultura? Lista 5 que sean visibles en el trabajo asincrono.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Rituales',
        description: 'Practicas regulares que refuerzan la cultura. No reuniones -- rituales.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocolo de conflicto',
        description: 'Como manejas los desacuerdos cuando no puedes leer el lenguaje corporal?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Senales de confianza',
        description: 'Que construye confianza en tu equipo distribuido? Que la erosiona?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Anti-patrones',
        description: 'Que comportamientos estas tratando activamente de prevenir?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  dashboard: {
    name: 'Modo Tablero de Control',
    purpose:
      'Configura metricas duales: rendimiento (tiempo de resolucion, tiempo de ciclo) y dinamicas (aprendizaje, colaboracion, diversion).',
    trigger:
      'Usar cuando superas las 50 personas y las metricas tradicionales no capturan el lado humano de la organizacion.',
    flowName: 'Monitorear',
    doneSignal: 'Puedes ver tanto el rendimiento como las dinamicas de un vistazo, y saber cuando actuar?',
    fieldsSchema: [
      {
        name: 'Metricas de rendimiento',
        description: 'Indicadores operativos clave: tiempo de ciclo, tiempo de resolucion, tiempo de entrega.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Metricas de dinamicas',
        description: 'Indicadores humanos: tasa de aprendizaje, puntaje de colaboracion, compromiso, diversion.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Fuentes de datos', description: 'De donde viene cada metrica?', type: 'text' as const, required: true },
      {
        name: 'Cadencia de revision',
        description: 'Con que frecuencia se revisan y por quien?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Disparadores de accion',
        description: 'Que niveles de metricas disparan una accion?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Las senales del tablero alimentan la revision de la estructura organizativa',
      },
    ],
  },
  'org-map': {
    name: 'Modo Mapa Organizacional',
    purpose: 'Crea una vista panoramica de tu organizacion: tipos de equipos, brechas y superposiciones.',
    trigger: 'Usar cuando la organizacion esta creciendo y necesitas ver el panorama completo.',
    flowName: 'Estructura',
    doneSignal: 'Puedes explicar tu estructura organizacional a un nuevo VP en 5 minutos?',
    fieldsSchema: [
      {
        name: 'Equipos',
        description: 'Lista todos los equipos con tipo: Mision, Plataforma o Circulo de Liderazgo.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Tamano de equipos', description: 'Personal por equipo.', type: 'text' as const, required: true },
      { name: 'Brechas', description: 'Que capacidades faltan?', type: 'text' as const, required: true },
      {
        name: 'Superposiciones',
        description: 'Donde estan duplicando esfuerzo los equipos?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'El mapa organizacional identifica equipos que necesitan blueprints',
      },
    ],
  },
  'team-blueprint': {
    name: 'Modo Blueprint de Equipo',
    purpose: 'Define mision, miembros, autoridad de decision, cadencia y estandares de calidad de un equipo.',
    trigger:
      'Usar cuando creas un nuevo equipo o cuando un equipo existente carece de claridad sobre su proposito y autoridad.',
    flowName: 'Estructura',
    doneSignal: 'Cada miembro del equipo puede enunciar la mision, su rol y que decisiones puede tomar?',
    fieldsSchema: [
      {
        name: 'Mision del equipo',
        description: 'Por que existe este equipo? Una frase.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Miembros',
        description: 'Quien esta en el equipo y cuales son sus roles?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Autoridad de decision',
        description: 'Que decisiones puede tomar este equipo sin escalar?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadencia',
        description: 'Como se comunica y coordina el equipo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Estandares de calidad',
        description: 'Que nivel de calidad mantiene este equipo?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Los blueprints de equipo definen los nodos en el mapa de conexiones',
      },
    ],
  },
  'connection-map': {
    name: 'Modo Mapa de Conexiones',
    purpose: 'Mapea las interacciones entre equipos: fluidas, con friccion o rotas. Encuentra los cuellos de botella.',
    trigger:
      'Usar cuando la coordinacion entre equipos es lenta, las transferencias fallan o los equipos se culpan mutuamente.',
    flowName: 'Conectar',
    doneSignal:
      'Puedes mostrarle a alguien un mapa de todas las conexiones entre equipos con calificaciones de calidad y soluciones a los cuellos de botella?',
    fieldsSchema: [
      {
        name: 'Pares de equipos',
        description: 'Lista todos los pares de interaccion equipo-a-equipo.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Calidad de la interaccion',
        description: 'Para cada par: Fluida, Con friccion o Rota.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cuellos de botella',
        description: 'Que pares de equipos son los mayores cuellos de botella?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Causas raiz',
        description: 'Por que esta atascado cada cuello de botella?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Acciones correctivas',
        description: 'Que accion especifica mejorara cada cuello de botella?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Los blueprints definen los equipos a mapear' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Las conexiones problematicas necesitan un diagnostico de salud',
      },
    ],
  },
  'relationship-health': {
    name: 'Modo Salud Relacional',
    purpose: 'Diagnostica y repara la friccion entre equipos con un analisis estructurado.',
    trigger: 'Usar cuando dos equipos tienen una conexion Con friccion o Rota que necesita reparacion.',
    flowName: 'Conectar',
    doneSignal:
      'Ambos equipos han acordado el protocolo de reparacion y se han comprometido con una fecha de revision?',
    fieldsSchema: [
      {
        name: 'Equipos involucrados',
        description: 'Que dos equipos tienen la friccion?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Generadores de dolor',
        description: 'Que acciones o inacciones especificas causan dolor?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Brecha de expectativas',
        description: 'Que espera cada equipo del otro? Donde difieren las expectativas?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Propuesta de valor',
        description: 'Que valor aporta cada equipo al otro?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocolo de reparacion',
        description: 'Acciones acordadas para mejorar la relacion.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Conexiones problematicas identificadas en el Mapa de Conexiones',
      },
    ],
  },
  'company-priority': {
    name: 'Modo Prioridades de la Empresa',
    purpose: 'Alinea 3 a 5 prioridades de empresa con evidencia, traduccion por equipo y mapeo de dependencias.',
    trigger:
      'Usar cuando la empresa tiene demasiadas prioridades, los equipos tiran en direcciones distintas o se necesita una planificacion trimestral.',
    flowName: 'Alinear',
    doneSignal: 'Puede cada lider de equipo explicar las prioridades de la empresa y como contribuye su equipo?',
    fieldsSchema: [
      {
        name: 'Prioridades de la empresa',
        description: 'Lista 3 a 5 prioridades de la empresa con su base de evidencia.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Traduccion por equipo',
        description: 'Que significa cada prioridad para cada equipo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dependencias',
        description: 'Que prioridades dependen de que equipos?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Resolucion de conflictos',
        description: 'Cuando las prioridades entran en conflicto, cual gana?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Las prioridades impulsan el seguimiento de ejecucion a escala',
      },
    ],
  },
  'scaled-execution': {
    name: 'Modo Ejecucion a Gran Escala',
    purpose:
      'Haz seguimiento de la ejecucion entre equipos con conexiones a prioridades, entregables clave y dependencias.',
    trigger:
      'Usar cuando multiples equipos trabajan hacia las mismas prioridades y necesitan visibilidad del progreso de los demas.',
    flowName: 'Ejecutar',
    doneSignal: 'Puedes ver todo el trabajo entre equipos, dependencias y bloqueos en una sola vista?',
    fieldsSchema: [
      {
        name: 'Conexion a prioridades',
        description: 'A que prioridad de la empresa se conecta este trabajo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Entregables clave',
        description: 'Que debe entregarse y por cual equipo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dependencias entre equipos',
        description: 'Que equipos dependen de que entregables?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Estado', description: 'Estado actual de cada entregable.', type: 'text' as const, required: true },
      {
        name: 'Bloqueos',
        description: 'Bloqueos entre equipos y acciones de desbloqueo.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Las prioridades definen que rastrear a gran escala',
      },
    ],
  },
  'quality-matrix': {
    name: 'Modo Matriz de Calidad',
    purpose: 'Define estandares de calidad consistentes entre equipos: a nivel de empresa y especificos por equipo.',
    trigger:
      'Usar cuando la calidad varia entre equipos y no hay una definicion compartida de "suficientemente bueno".',
    flowName: 'Calidad',
    doneSignal:
      'Cualquier miembro del equipo puede consultar el estandar de calidad para su trabajo y saber si lo cumple?',
    fieldsSchema: [
      {
        name: 'Estandares a nivel de empresa',
        description: 'Estandares de calidad que aplican a todos los equipos.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Estandares especificos por equipo',
        description: 'Estandares propios de cada equipo segun su dominio.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Medicion',
        description: 'Como se mide la calidad para cada estandar?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Proceso de revision',
        description: 'Quien revisa la calidad y con que frecuencia?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-onboarding': {
    name: 'Modo Integracion del Colega IA',
    purpose:
      'Define los roles del colega IA, las fuentes de conocimiento, los limites de acceso y las metricas de exito.',
    trigger:
      'Usar cuando empiezas a trabajar con herramientas de IA y necesitas configurar la colaboracion correctamente.',
    flowName: 'Contexto',
    doneSignal:
      'Podrias entregar este documento de integracion a un nuevo miembro del equipo y sabria exactamente como tu equipo usa la IA?',
    fieldsSchema: [
      {
        name: 'Rol de la IA',
        description: 'Que rol juega la IA en tu flujo de trabajo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Fuentes de conocimiento',
        description: 'A que informacion necesita acceder la IA?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Limites de acceso',
        description: 'A que NO deberia tener acceso la IA?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Metricas de exito',
        description: 'Como mediras si la colaboracion con IA esta funcionando?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadencia de revision',
        description: 'Con que frecuencia revisaras la configuracion de colaboracion IA?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Disparadores de escalamiento',
        description: 'Cuando deberia un humano tomar el control de la IA?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La configuracion IA alimenta la evaluacion de delegacion de tareas',
      },
    ],
  },
  'centaur-assessment': {
    name: 'Modo Evaluacion Centauro',
    purpose:
      'Mapea cada tarea: dirigida por humano, dirigida por IA, o centauro (ambos) con evaluacion de capacidades.',
    trigger: 'Usar cuando necesitas decidir que tareas puede manejar la IA y cuales necesitan juicio humano.',
    flowName: 'Contexto',
    doneSignal: 'Puedes explicar para cada tarea recurrente quien la realiza (humano, IA o ambos) y por que?',
    fieldsSchema: [
      {
        name: 'Inventario de tareas',
        description: 'Lista todas las tareas recurrentes en tu flujo de trabajo.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Clasificacion',
        description: 'Para cada tarea: Dirigida por humano, Dirigida por IA o Centauro.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evaluacion de capacidades',
        description: 'Para tareas IA/Centauro: en que es buena la IA y donde necesita ayuda?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ruta de evolucion',
        description: 'Que tareas Dirigidas por humano podrian volverse Centauro con el tiempo?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La configuracion IA informa la delegacion de tareas',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'El mapa de delegacion informa los protocolos de decision',
      },
    ],
  },
  'decision-protocol': {
    name: 'Modo Protocolo de Decision',
    purpose: 'Define cuando la IA lidera decisiones vs humanos, condiciones de anulacion y cadencia de retrospectiva.',
    trigger: 'Usar cuando la IA esta involucrada en decisiones y necesitas reglas claras sobre autoridad y anulacion.',
    flowName: 'Gobernar',
    doneSignal:
      'Para cualquier tipo de decision, puedes decir instantaneamente quien tiene la autoridad y que desencadena una anulacion?',
    fieldsSchema: [
      {
        name: 'Categorias de decisiones',
        description: 'Lista los tipos de decisiones en tu flujo de trabajo.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Mapa de autoridad',
        description: 'Para cada categoria: la IA lidera, el Humano lidera o Compartido.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Condiciones de anulacion',
        description:
          'Cuando puede un humano anular una decision de IA? Cuando puede la IA anular una recomendacion humana?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadencia de retrospectiva',
        description: 'Con que frecuencia revisas la calidad de las decisiones?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'El mapa de delegacion informa la autoridad de decision',
      },
    ],
  },
  'verification-ritual': {
    name: 'Modo Ritual de Verificacion',
    purpose:
      'Construye protocolos de revision ajustados al riesgo: revision profunda para alto riesgo, flujo libre para bajo riesgo.',
    trigger:
      'Usar cuando la calidad de la produccion de IA varia y necesitas verificacion consistente sin frenar todo.',
    flowName: 'Gobernar',
    doneSignal:
      'Tu equipo puede clasificar instantaneamente cualquier produccion de IA por nivel de riesgo y conocer el protocolo de revision?',
    fieldsSchema: [
      {
        name: 'Categorias de produccion',
        description: 'Lista los tipos de produccion de IA de tu equipo.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Nivel de riesgo',
        description: 'Para cada categoria: riesgo Alto, Medio o Bajo.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocolo de revision',
        description: 'Para cada nivel de riesgo: que revision se requiere?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Umbral de calidad',
        description: 'Que tasa de aceptacion desencadena una revision del protocolo?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'knowledge-architecture': {
    name: 'Modo Arquitectura del Conocimiento',
    purpose:
      'Estructura el contexto persistente de la IA para que tu colega IA no haga las mismas preguntas en cada sesion.',
    trigger:
      'Usar cuando la IA sigue pidiendo contexto que ya deberia tener, o da respuestas que ignoran las particularidades de tu negocio.',
    flowName: 'Conocimiento',
    doneSignal:
      'Tu colega IA puede iniciar una nueva sesion y tener inmediatamente el contexto que necesita para ser util?',
    fieldsSchema: [
      {
        name: 'Dominios de conocimiento',
        description: 'Que categorias de conocimiento necesita la IA?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Contexto persistente',
        description: 'Para cada dominio: que deberia saber la IA siempre?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Disparadores de actualizacion',
        description: 'Cuando deberia actualizarse cada dominio de conocimiento?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Patron de acceso',
        description: 'Como accede la IA a este conocimiento? Archivos, APIs, prompts?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La estructura de informacion alimenta el conocimiento de la IA',
      },
    ],
  },
  'trust-calibration': {
    name: 'Modo Calibracion de Confianza',
    purpose:
      'Fija niveles de confianza basados en evidencia, no en sentimientos. Calibra la sobre-confianza y la sub-confianza.',
    trigger:
      'Usar cuando sospechas que el equipo confia demasiado o demasiado poco en la IA, y las decisiones se toman por instinto en vez de por datos.',
    flowName: 'Confianza',
    doneSignal: 'Puedes justificar cada nivel de confianza con evidencia, no con intuicion?',
    fieldsSchema: [
      {
        name: 'Inventario de confianza',
        description:
          'Para cada caso de uso de IA: nivel de confianza actual (Sobre-confianza, Calibrado, Sub-confianza, No probado).',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evidencia',
        description: 'Que datos respaldan cada nivel de confianza?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Acciones de calibracion',
        description: 'Para sobre-confianza: agregar verificacion. Para sub-confianza: ejecutar un piloto.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Calendario de revision',
        description: 'Cuando recalibraras los niveles de confianza?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-scaling': {
    name: 'Modo Escalamiento de la Colaboracion IA',
    purpose: 'Planifica como evoluciona la colaboracion humano-IA a medida que la organizacion crece.',
    trigger: 'Usar cuando la colaboracion IA funciona para una persona o equipo y necesita escalar a la organizacion.',
    flowName: 'Escala',
    doneSignal: 'Puedes presentar una hoja de ruta para la colaboracion IA que cualquier lider de equipo pueda seguir?',
    fieldsSchema: [
      {
        name: 'Estado actual',
        description: 'Como funciona la colaboracion IA hoy? Quien la usa, para que?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ruta de escalamiento',
        description: 'Como deberia evolucionar la colaboracion IA? Solo -> Equipo -> Organizacion.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Estandarizacion vs Personalizacion',
        description: 'Que deberia ser estandar entre equipos vs personalizado por equipo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Necesidades de infraestructura',
        description: 'Que herramientas, acceso o capacitacion se necesitan para escalar?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evaluacion de riesgos',
        description: 'Que podria salir mal al escalar la colaboracion IA?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
}
