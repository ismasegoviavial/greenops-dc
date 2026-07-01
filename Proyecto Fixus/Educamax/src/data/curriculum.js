// Niveles hardcodeados ahora están al final del archivo

const ASIGNATURAS_BASICA = [
  "Lenguaje y Comunicación",
  "Matemática",
  "Ciencias Naturales",
  "Historia, Geografía y Ciencias Sociales",
  "Inglés",
  "Artes Visuales",
  "Música",
  "Educación Física y Salud",
  "Orientación",
  "Tecnología"
];

const ASIGNATURAS_MEDIA = [
  "Lengua y Literatura",
  "Matemática",
  "Biología",
  "Física",
  "Química",
  "Historia, Geografía y Ciencias Sociales",
  "Inglés",
  "Artes Visuales",
  "Artes Musicales",
  "Educación Física y Salud",
  "Tecnología",
  "Orientación"
];

const ASIGNATURAS_MEDIA_3_4 = [
  "Lengua y Literatura",
  "Matemática",
  "Ciencias para la Ciudadanía",
  "Educación Ciudadana",
  "Filosofía",
  "Inglés",
  "Historia, Geografía y Ciencias Sociales",
  "Artes",
  "Educación Física y Salud",
  "Orientación"
];

export const ASIGNATURAS_POR_NIVEL = {
  "1° Básico": ASIGNATURAS_BASICA,
  "2° Básico": ASIGNATURAS_BASICA,
  "3° Básico": ASIGNATURAS_BASICA,
  "4° Básico": ASIGNATURAS_BASICA,
  "5° Básico": ASIGNATURAS_BASICA,
  "6° Básico": ASIGNATURAS_BASICA,
  "7° Básico": ASIGNATURAS_BASICA,
  "8° Básico": ASIGNATURAS_BASICA,
  "1° Medio": ASIGNATURAS_MEDIA,
  "2° Medio": ASIGNATURAS_MEDIA,
  "3° Medio": ASIGNATURAS_MEDIA_3_4,
  "4° Medio": ASIGNATURAS_MEDIA_3_4,
};

// ═══════════════════════════════════════════════════════════════════
// BASE DE DATOS COMPLETA DE OBJETIVOS DE APRENDIZAJE
// Fuente: Bases Curriculares del Ministerio de Educación de Chile
// https://www.curriculumnacional.cl
// ═══════════════════════════════════════════════════════════════════

export const OBJETIVOS_APRENDIZAJE = {

  // ─────────────────────────────────────────────
  // 1° BÁSICO
  // ─────────────────────────────────────────────
  "1° Básico": {
    "Matemática": [
      { id: "OA 1", texto: "Contar números del 0 al 100 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10, hacia adelante y hacia atrás." },
      { id: "OA 2", texto: "Identificar el orden de los elementos de una serie, utilizando números ordinales del primero (1°) al décimo (10°)." },
      { id: "OA 3", texto: "Leer números del 0 al 20 y representarlos en forma concreta, pictórica y simbólica." },
      { id: "OA 4", texto: "Comparar y ordenar números del 0 al 20 de menor a mayor y viceversa, utilizando material concreto y/o software educativo." },
      { id: "OA 5", texto: "Estimar cantidades hasta 20 en situaciones concretas, usando un referente." },
      { id: "OA 6", texto: "Componer y descomponer números del 0 al 20 de manera aditiva, en forma concreta, pictórica y simbólica." },
      { id: "OA 7", texto: "Describir y aplicar estrategias de cálculo mental para las adiciones y sustracciones hasta 20." },
      { id: "OA 9", texto: "Demostrar que comprenden la adición y la sustracción de números del 0 al 20, progresivamente." },
      { id: "OA 14", texto: "Identificar en el entorno figuras 3D y figuras 2D y relacionarlas, usando material concreto." },
      { id: "OA 17", texto: "Usar unidades no estandarizadas de tiempo para comparar la duración de eventos cotidianos." }
    ],
    "Lenguaje y Comunicación": [
      { id: "OA 1", texto: "Reconocer que los textos escritos transmiten mensajes y que son escritos por alguien para cumplir un propósito." },
      { id: "OA 3", texto: "Identificar los sonidos que componen las palabras (conciencia fonológica), reconociendo, separando y combinando sus fonemas y sílabas." },
      { id: "OA 4", texto: "Leer palabras aisladas y en contexto, aplicando su conocimiento de la correspondencia letra-sonido en diferentes combinaciones." },
      { id: "OA 5", texto: "Leer textos breves en voz alta para adquirir fluidez: pronunciando cada palabra con precisión." },
      { id: "OA 8", texto: "Demostrar comprensión de narraciones que aborden temas que les sean familiares." },
      { id: "OA 10", texto: "Leer independientemente y comprender textos no literarios escritos con oraciones simples (cartas, notas, instrucciones)." },
      { id: "OA 13", texto: "Experimentar con la escritura para comunicar hechos, ideas y sentimientos, entre otros." },
      { id: "OA 15", texto: "Escribir con letra clara, separando las palabras con un espacio para que puedan ser leídas por otros." },
      { id: "OA 18", texto: "Comprender textos orales (explicaciones, instrucciones, relatos) para obtener información y desarrollar su curiosidad." },
      { id: "OA 21", texto: "Participar activamente en conversaciones grupales sobre textos leídos o escuchados en clases." }
    ],
    "Ciencias Naturales": [
      { id: "OA 1", texto: "Reconocer y observar, por medio de la exploración, que los seres vivos crecen, responden a estímulos del medio, se reproducen y necesitan agua, alimento y aire para vivir." },
      { id: "OA 3", texto: "Observar e identificar, por medio de la exploración, las estructuras principales de las plantas: hojas, flores, tallos y raíces." },
      { id: "OA 5", texto: "Reconocer y comparar diversas plantas y animales de nuestro país, considerando las características observables." },
      { id: "OA 6", texto: "Identificar y describir la ubicación y la función de los sentidos proponiendo medidas para protegerlos." },
      { id: "OA 7", texto: "Describir, dar ejemplos y practicar hábitos de vida saludable para mantener el cuerpo sano y prevenir enfermedades." },
      { id: "OA 9", texto: "Observar y describir los cambios que se producen en los materiales al aplicarles fuerza, luz, calor y agua." },
      { id: "OA 11", texto: "Describir y comunicar los cambios del ciclo de las estaciones y sus efectos en los seres vivos y el ambiente." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Nombrar y secuenciar días de la semana y meses del año, utilizando calendarios e identificar el año en curso." },
      { id: "OA 2", texto: "Secuenciar acontecimientos y actividades de la vida cotidiana, personal y familiar, usando categorías relativas de ubicación temporal." },
      { id: "OA 4", texto: "Obtener información explícita sobre su entorno a partir de fuentes orales y gráficas dadas, mediante preguntas dirigidas." },
      { id: "OA 6", texto: "Conocer expresiones culturales locales y nacionales (como comidas, flores y animales típicos, música y juegos, entre otros)." },
      { id: "OA 8", texto: "Reconocer que las personas tienen derechos que deben ser respetados por los pares y por la comunidad." },
      { id: "OA 9", texto: "Identificar la labor que cumplen en beneficio de la comunidad instituciones como la escuela, la municipalidad, el hospital o la posta." },
      { id: "OA 12", texto: "Conocer cómo viven otros niños en diferentes partes del mundo por medio de imágenes y relatos." },
      { id: "OA 14", texto: "Explicar y aplicar algunas normas para la buena convivencia y para la seguridad, en su familia, en la escuela y en la vía pública." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Comprender textos leídos por un adulto o en formato audiovisual, breves y simples, como rimas, chants, canciones y cuentos." },
      { id: "OA 5", texto: "Reaccionar a lo escuchado, estableciendo relaciones con experiencias personales y/o expresando preferencias, sentimientos u opiniones." },
      { id: "OA 9", texto: "Experimentar con la escritura de palabras (copy), completando y/o escribiendo de acuerdo a un modelo." },
      { id: "OA 10", texto: "Reproducir chants, rimas y canciones muy breves y simples para familiarizarse con los sonidos propios del inglés." }
    ],
    "Artes Visuales": [
      { id: "OA 1", texto: "Expresar y crear trabajos de arte a partir de la observación del entorno natural: paisaje, animales y plantas." },
      { id: "OA 3", texto: "Expresar emociones e ideas en sus trabajos de arte, a partir de la experimentación con materiales de modelado, de reciclaje, naturales, papeles, cartones, pegamentos, lápices, pinturas, textiles." },
      { id: "OA 4", texto: "Observar y comunicar oralmente sus primeras impresiones de lo que sienten y piensan de obras de arte por variados medios." }
    ],
    "Música": [
      { id: "OA 1", texto: "Escuchar cualidades del sonido (altura, timbre, intensidad, duración) y elementos del lenguaje musical (pulsos, acentos, patrones)." },
      { id: "OA 3", texto: "Escuchar música en forma abundante de diversos contextos y culturas poniendo énfasis en tradición escrita, oral y popular." },
      { id: "OA 5", texto: "Cantar al unísono y tocar instrumentos de percusión convencionales y no convencionales." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Demostrar habilidades motrices básicas de locomoción, manipulación y estabilidad en diferentes direcciones." },
      { id: "OA 6", texto: "Ejecutar actividades físicas de intensidad moderada a vigorosa que incrementen la condición física." },
      { id: "OA 9", texto: "Practicar actividades físicas en forma segura, demostrando la adquisición de hábitos de higiene, posturales y de vida saludable." },
      { id: "OA 11", texto: "Practicar actividades físicas, demostrando comportamiento seguro, como utilizar implementos bajo supervisión." }
    ],
    "Orientación": [
      { id: "OA 1", texto: "Observar, describir y valorar sus características personales, sus habilidades e intereses." },
      { id: "OA 4", texto: "Identificar y practicar, en forma guiada, conductas protectoras y de autocuidado en relación a rutinas de higiene, actividades de descanso y hábitos de alimentación." },
      { id: "OA 5", texto: "Manifestar actitudes de solidaridad y respeto, que favorezcan la convivencia." }
    ],
    "Tecnología": [
      { id: "OA 1", texto: "Crear diseños de objetos tecnológicos, representando sus ideas a través de dibujos a mano alzada o modelos concretos." },
      { id: "OA 3", texto: "Elaborar un objeto tecnológico según las indicaciones del profesor, seleccionando y experimentando con técnicas y materiales." },
      { id: "OA 5", texto: "Usar software de dibujo para crear y representar ideas por medio de imágenes." }
    ]
  },

  // ─────────────────────────────────────────────
  // 2° BÁSICO
  // ─────────────────────────────────────────────
  "2° Básico": {
    "Matemática": [
      { id: "OA 1", texto: "Contar números del 0 al 1 000 de 2 en 2, de 5 en 5, de 10 en 10 y de 100 en 100, hacia adelante y hacia atrás." },
      { id: "OA 2", texto: "Leer números del 0 al 100 y representarlos en forma concreta, pictórica y simbólica." },
      { id: "OA 6", texto: "Componer y descomponer números del 0 al 100 de manera aditiva, en forma concreta, pictórica y simbólica." },
      { id: "OA 9", texto: "Demostrar que comprende la adición y la sustracción en el ámbito del 0 al 100." },
      { id: "OA 11", texto: "Demostrar que comprende la multiplicación: usando representaciones concretas y pictóricas." },
      { id: "OA 15", texto: "Describir, comparar y construir figuras 2D (triángulos, cuadrados, rectángulos y círculos) con material concreto." },
      { id: "OA 18", texto: "Leer horas y medias horas en relojes digitales, en el contexto de la resolución de problemas." },
      { id: "OA 22", texto: "Recolectar y registrar datos para responder preguntas estadísticas usando bloques, tablas de conteo y pictogramas." }
    ],
    "Lenguaje y Comunicación": [
      { id: "OA 1", texto: "Leer textos significativos que incluyan palabras con hiatos y diptongos, con grupos consonánticos y con combinación ce-ci, que-qui, ge-gi, gue-gui, güe-güi." },
      { id: "OA 3", texto: "Comprender textos aplicando estrategias de comprensión lectora." },
      { id: "OA 5", texto: "Demostrar comprensión de las narraciones leídas: extrayendo información explícita e implícita." },
      { id: "OA 7", texto: "Leer independientemente y comprender textos no literarios (cartas, notas, instrucciones y artículos informativos)." },
      { id: "OA 12", texto: "Escribir frecuentemente, para desarrollar la creatividad y expresar sus ideas." },
      { id: "OA 15", texto: "Escribir con letra clara, separando las palabras con un espacio, para que pueda ser leída por otros con facilidad." },
      { id: "OA 18", texto: "Incorporar de manera pertinente en la escritura el vocabulario nuevo extraído de textos escuchados o leídos." },
      { id: "OA 21", texto: "Comprender textos orales (explicaciones, instrucciones, relatos, anécdotas, etc.) para obtener información." }
    ],
    "Ciencias Naturales": [
      { id: "OA 1", texto: "Observar, describir y clasificar los vertebrados en mamíferos, aves, reptiles, anfibios y peces." },
      { id: "OA 2", texto: "Observar, describir y clasificar, por medio de la exploración, las características de los animales sin columna vertebral (insectos, arácnidos, crustáceos)." },
      { id: "OA 3", texto: "Observar y comparar las características de las etapas del ciclo de vida de distintos animales (metamorfosis)." },
      { id: "OA 5", texto: "Observar e identificar algunos animales nativos que se encuentran en peligro de extinción." },
      { id: "OA 6", texto: "Identificar y describir las condiciones de un hábitat que permiten la vida (agua, alimento, refugio)." },
      { id: "OA 8", texto: "Describir y comunicar los cambios del ciclo de las estaciones y sus efectos en los seres vivos y el ambiente." },
      { id: "OA 10", texto: "Observar, describir y clasificar, por medio de la exploración, los diferentes tipos de materiales en diversos estados (sólido, líquido y gaseoso)." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Describir los modos de vida de algunos pueblos originarios de Chile en el periodo precolombino." },
      { id: "OA 3", texto: "Distinguir los diversos aportes a la sociedad chilena proveniente de los pueblos originarios (mapuche, aimara, rapa nui) y de los españoles." },
      { id: "OA 5", texto: "Reconocer diversas expresiones del patrimonio cultural del país y de su región (ej. manifestaciones artísticas, tradiciones, leyendas)." },
      { id: "OA 7", texto: "Ubicar Chile, Santiago, la propia región y su capital en el globo terráqueo o en mapas." },
      { id: "OA 9", texto: "Identificar en el entorno representaciones del patrimonio cultural." },
      { id: "OA 11", texto: "Practicar y proponer acciones para cuidar y respetar los espacios públicos dentro de la escuela y de la comunidad." },
      { id: "OA 14", texto: "Conocer, proponer, aplicar y explicar la importancia de algunas normas necesarias para la buena convivencia y para la seguridad." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Comprender textos leídos por un adulto o en formato audiovisual, breves y simples, como cuentos, rimas y canciones." },
      { id: "OA 5", texto: "Reaccionar a lo escuchado, estableciendo relaciones con experiencias personales." },
      { id: "OA 9", texto: "Experimentar con la escritura de palabras (copy) y oraciones cortas de acuerdo a un modelo." },
      { id: "OA 12", texto: "Participar en diálogos, interacciones de la clase y exposiciones muy breves y simples." }
    ],
    "Artes Visuales": [
      { id: "OA 1", texto: "Expresar y crear trabajos de arte a partir de la observación del entorno natural: paisaje, animales y plantas." },
      { id: "OA 2", texto: "Expresar y crear trabajos de arte a partir de la observación del entorno cultural: vida cotidiana y familiar; y del entorno artístico." },
      { id: "OA 4", texto: "Comunicar y explicar sus impresiones de lo que sienten y piensan de obras de arte por variados medios." }
    ],
    "Música": [
      { id: "OA 1", texto: "Escuchar cualidades del sonido (altura, timbre, intensidad, duración) y elementos del lenguaje musical." },
      { id: "OA 4", texto: "Cantar al unísono y tocar instrumentos de percusión convencionales y no convencionales." },
      { id: "OA 6", texto: "Presentar su trabajo musical al curso y a la comunidad, en forma individual y grupal." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Demostrar habilidades motrices básicas de locomoción, manipulación y estabilidad en diferentes direcciones." },
      { id: "OA 5", texto: "Ejecutar actividades físicas de intensidad moderada a vigorosa que incrementen la condición física." },
      { id: "OA 9", texto: "Practicar actividades físicas en forma segura, demostrando la adquisición de hábitos de higiene, posturales y de vida saludable." }
    ],
    "Orientación": [
      { id: "OA 1", texto: "Observar, describir y valorar sus características personales, sus habilidades e intereses." },
      { id: "OA 3", texto: "Identificar y aceptar sus propias emociones y las de los demás, y practicar estrategias personales de manejo emocional." },
      { id: "OA 5", texto: "Manifestar actitudes de solidaridad y respeto que favorezcan la convivencia." }
    ],
    "Tecnología": [
      { id: "OA 1", texto: "Crear diseños de objetos tecnológicos, representando sus ideas a través de dibujos a mano alzada, modelos concretos o usando TIC." },
      { id: "OA 3", texto: "Elaborar un objeto tecnológico según las indicaciones del profesor, seleccionando y experimentando con técnicas y materiales." },
      { id: "OA 5", texto: "Usar software de dibujo para crear y representar diferentes ideas por medio de imágenes." }
    ]
  },

  // ─────────────────────────────────────────────
  // 3° BÁSICO
  // ─────────────────────────────────────────────
  "3° Básico": {
    "Matemática": [
      { id: "OA 1", texto: "Contar números del 0 al 1 000 de 5 en 5, de 10 en 10, de 100 en 100, hacia adelante y hacia atrás." },
      { id: "OA 2", texto: "Leer números hasta 1 000 y representarlos en forma concreta, pictórica y simbólica." },
      { id: "OA 5", texto: "Componer y descomponer números naturales hasta 1 000 de manera aditiva." },
      { id: "OA 8", texto: "Demostrar que comprenden las tablas de multiplicar hasta 10 de manera progresiva." },
      { id: "OA 9", texto: "Demostrar que comprenden la división en el contexto de las tablas de multiplicar hasta 10." },
      { id: "OA 12", texto: "Generar, describir y registrar patrones numéricos usando una variedad de estrategias." },
      { id: "OA 15", texto: "Demostrar que comprenden la relación que existe entre figuras 3D y figuras 2D." },
      { id: "OA 21", texto: "Demostrar que comprenden el perímetro de una figura regular e irregular." },
      { id: "OA 24", texto: "Realizar encuestas, clasificar y organizar los datos obtenidos en tablas y visualizarlos en gráficos de barra." }
    ],
    "Lenguaje y Comunicación": [
      { id: "OA 2", texto: "Comprender textos aplicando estrategias de comprensión lectora; por ejemplo: relacionar la información del texto con sus experiencias y conocimientos." },
      { id: "OA 4", texto: "Profundizar su comprensión de las narraciones leídas: extrayendo información explícita e implícita." },
      { id: "OA 6", texto: "Leer independientemente y comprender textos no literarios (cartas, biografías, relatos históricos, instrucciones, libros y artículos informativos, noticias)." },
      { id: "OA 7", texto: "Desarrollar el gusto por la lectura, leyendo habitualmente diversos textos." },
      { id: "OA 11", texto: "Buscar información sobre un tema en una fuente dada por el docente (página de internet, sección del diario, capítulo de un libro)." },
      { id: "OA 13", texto: "Escribir creativamente narraciones (experiencias personales, relatos de hechos, cuentos, etc.)." },
      { id: "OA 14", texto: "Escribir cartas, instrucciones, afiches, reportes de una experiencia, entre otros." },
      { id: "OA 17", texto: "Planificar la escritura, generando ideas a partir de observación de imágenes, conversaciones y de la lectura." },
      { id: "OA 22", texto: "Comprender y disfrutar versiones completas de obras de la literatura, narradas o leídas por un adulto." }
    ],
    "Ciencias Naturales": [
      { id: "OA 1", texto: "Observar y describir, por medio de la investigación experimental, las necesidades de las plantas (luz, agua y nutrientes)." },
      { id: "OA 2", texto: "Observar y comparar las características de las etapas del ciclo de vida de distintas plantas, en función del tiempo." },
      { id: "OA 4", texto: "Describir la importancia de las plantas para los seres vivos y el medio ambiente (alimento, aire, refugio)." },
      { id: "OA 5", texto: "Clasificar los alimentos, distinguiendo sus efectos sobre la salud, y proponer hábitos alimenticios saludables." },
      { id: "OA 7", texto: "Comparar fuentes luminosas naturales y artificiales, y distinguir los objetos que emiten luz de aquellos que la reflejan." },
      { id: "OA 8", texto: "Investigar experimentalmente y explicar las características del sonido: tono e intensidad." },
      { id: "OA 11", texto: "Describir las características de algunos de los componentes del sistema solar (Sol, planetas, lunas, cometas y asteroides)." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Reconocer aspectos de la vida cotidiana de la civilización griega de la Antigüedad e identificar algunos elementos de su legado." },
      { id: "OA 2", texto: "Reconocer aspectos de la vida cotidiana de la civilización romana de la Antigüedad e identificar algunos elementos de su legado." },
      { id: "OA 5", texto: "Investigar sobre algún tema de su interés con relación a las civilizaciones estudiadas utilizando diversas fuentes." },
      { id: "OA 7", texto: "Distinguir hemisferios, círculo del Ecuador, trópicos, polos, continentes y océanos del planeta en mapas y globos terráqueos." },
      { id: "OA 10", texto: "Asumir sus deberes y responsabilidades como estudiante y en situaciones de la vida cotidiana." },
      { id: "OA 12", texto: "Mostrar actitudes y realizar acciones concretas en su entorno cercano que reflejen valores y virtudes ciudadanas." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Comprender textos leídos por un adulto o en formato audiovisual, breves y simples, como cuentos y rimas." },
      { id: "OA 5", texto: "Reaccionar a lo escuchado, estableciendo relaciones con experiencias personales." },
      { id: "OA 6", texto: "Leer y demostrar comprensión de textos como cuentos, rimas, chants y canciones." },
      { id: "OA 9", texto: "Escribir (copy, ej.) para: completar información personal; escribir listas de palabras." }
    ],
    "Artes Visuales": [
      { id: "OA 1", texto: "Crear trabajos de arte con un propósito expresivo personal y basados en la observación del entorno natural." },
      { id: "OA 3", texto: "Crear trabajos de arte a partir de experiencias, intereses y temas del entorno natural y artístico." },
      { id: "OA 4", texto: "Describir sus observaciones de obras de arte y objetos, usando elementos del lenguaje visual y expresando lo que sienten y piensan." }
    ],
    "Música": [
      { id: "OA 1", texto: "Escuchar cualidades del sonido (altura, timbre, intensidad, duración) y elementos del lenguaje musical." },
      { id: "OA 4", texto: "Cantar al unísono y tocar instrumentos de percusión y melódicos." },
      { id: "OA 7", texto: "Identificar y describir experiencias musicales y sonoras en su propia vida." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Demostrar habilidades motrices básicas de locomoción, manipulación y estabilidad en una variedad de juegos y actividades físicas." },
      { id: "OA 2", texto: "Ejecutar acciones motrices que presenten una solución a un problema." },
      { id: "OA 6", texto: "Ejecutar actividades físicas de intensidad moderada a vigorosa que incrementen la condición física." }
    ],
    "Orientación": [
      { id: "OA 2", texto: "Identificar y aceptar sus propias emociones y las de los demás, y practicar estrategias personales de manejo emocional." },
      { id: "OA 3", texto: "Reconocer que sus acciones y decisiones, en relación a su persona y hacia los demás, influyen en su bienestar y en sus relaciones." },
      { id: "OA 6", texto: "Manifestar actitudes de solidaridad y respeto que favorezcan la convivencia, como utilizar el diálogo para resolver conflictos." }
    ],
    "Tecnología": [
      { id: "OA 1", texto: "Crear diseños de objetos o sistemas tecnológicos simples para resolver problemas." },
      { id: "OA 2", texto: "Planificar la elaboración de un objeto tecnológico, incorporando la secuencia de acciones, materiales, herramientas y técnicas necesarias." },
      { id: "OA 5", texto: "Usar software de presentación para organizar y comunicar ideas." }
    ]
  },

  // ─────────────────────────────────────────────
  // 4° BÁSICO
  // ─────────────────────────────────────────────
  "4° Básico": {
    "Matemática": [
      { id: "OA 1", texto: "Representar y describir números del 0 al 10 000." },
      { id: "OA 3", texto: "Demostrar que comprenden la adición y la sustracción de números hasta 1 000." },
      { id: "OA 5", texto: "Demostrar que comprenden la multiplicación de números de tres dígitos por números de un dígito." },
      { id: "OA 6", texto: "Demostrar que comprenden la división con dividendos de dos dígitos y divisores de un dígito." },
      { id: "OA 8", texto: "Demostrar que comprenden las fracciones con denominadores 2, 3, 4, 5, 6, 8, 10 y 12." },
      { id: "OA 13", texto: "Resolver inecuaciones de un paso que involucren adiciones y sustracciones." },
      { id: "OA 17", texto: "Demostrar que comprenden una línea de simetría." },
      { id: "OA 22", texto: "Medir longitudes con unidades estandarizadas (m, cm) y realizar transformaciones entre estas unidades." },
      { id: "OA 26", texto: "Realizar encuestas, analizar los datos y comparar con los resultados de muestras aleatorias, usando tablas y gráficos." }
    ],
    "Lenguaje y Comunicación": [
      { id: "OA 2", texto: "Comprender textos, aplicando estrategias de comprensión lectora: relacionar la información del texto con sus experiencias." },
      { id: "OA 4", texto: "Profundizar su comprensión de las narraciones leídas: extrayendo información explícita e implícita, determinando las consecuencias de hechos o acciones." },
      { id: "OA 6", texto: "Leer independientemente y comprender textos no literarios (cartas, biografías, relatos históricos, instrucciones, artículos informativos, noticias)." },
      { id: "OA 11", texto: "Escribir frecuentemente, para desarrollar la creatividad y expresar sus ideas." },
      { id: "OA 13", texto: "Escribir artículos informativos para comunicar información sobre un tema." },
      { id: "OA 15", texto: "Escribir cartas, instrucciones, afiches, reportes de una experiencia o noticias." },
      { id: "OA 17", texto: "Planificar la escritura, generando ideas a partir de observación de imágenes, conversaciones, investigaciones, entre otros." },
      { id: "OA 22", texto: "Comprender y disfrutar versiones completas de obras de la literatura, narradas o leídas por un adulto." }
    ],
    "Ciencias Naturales": [
      { id: "OA 1", texto: "Reconocer, por medio de la exploración, que un ecosistema está compuesto por elementos vivos (animales, plantas, etc.) y no vivos (agua, rocas, etc.)." },
      { id: "OA 2", texto: "Observar y comparar adaptaciones de plantas y animales para sobrevivir en los ecosistemas." },
      { id: "OA 3", texto: "Dar ejemplos de cadenas alimentarias, identificando la función de los organismos productores, consumidores y descomponedores." },
      { id: "OA 5", texto: "Identificar y comunicar los efectos de la actividad humana sobre los animales y su hábitat." },
      { id: "OA 7", texto: "Identificar, por medio de la investigación experimental, diferentes tipos de fuerza y sus efectos." },
      { id: "OA 10", texto: "Identificar las capas de la Tierra (corteza, manto y núcleo) y describir sus características." },
      { id: "OA 12", texto: "Describir, por medio de modelos, que la Tierra tiene una estructura de capas (corteza, manto y núcleo) con características distintivas." },
      { id: "OA 14", texto: "Describir, por medio de modelos, el movimiento de rotación y de traslación de la Tierra y la Luna." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Describir la civilización maya, considerando ubicación geográfica, organización política, actividades económicas." },
      { id: "OA 2", texto: "Describir la civilización azteca, considerando ubicación geográfica, organización política, actividades económicas." },
      { id: "OA 4", texto: "Analizar y comparar las principales características de las civilizaciones americanas (mayas, aztecas e incas)." },
      { id: "OA 6", texto: "Ubicar lugares en un mapa, utilizando coordenadas geográficas como referencia (paralelos y meridianos)." },
      { id: "OA 9", texto: "Reconocer y dar ejemplos de la diversidad cultural presente en Chile y en el mundo." },
      { id: "OA 11", texto: "Opinar y argumentar con fundamentos sobre temas de la asignatura u otros." },
      { id: "OA 15", texto: "Participar en su comunidad, tomando parte en elecciones para una directiva del curso, asignando funciones y demostrando respeto." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Comprender textos leídos por un adulto o en formato audiovisual, breves y simples, relacionados con temas conocidos." },
      { id: "OA 6", texto: "Leer y demostrar comprensión de textos, como cuentos, rimas, chants, tarjetas de saludo." },
      { id: "OA 10", texto: "Escribir para: completar información personal, listas de palabras, oraciones simples." },
      { id: "OA 12", texto: "Participar en diálogos, interacciones de la clase y exposiciones muy breves y simples." }
    ],
    "Artes Visuales": [
      { id: "OA 1", texto: "Crear trabajos de arte con un propósito expresivo personal y basados en la observación del entorno cultural." },
      { id: "OA 3", texto: "Crear trabajos de arte a partir de registros visuales, experiencias, intereses y temas del entorno natural." },
      { id: "OA 5", texto: "Describir sus observaciones de obras de arte y objetos, usando elementos del lenguaje visual." }
    ],
    "Música": [
      { id: "OA 1", texto: "Escuchar cualidades del sonido (altura, timbre, intensidad, duración) y elementos del lenguaje musical (pulsos, acentos, patrones, reiteraciones, contrastes, variaciones, dinámica, tempo, preguntas-respuestas, secciones, A-AB-ABA)." },
      { id: "OA 4", texto: "Cantar al unísono y a más voces y tocar instrumentos de percusión, melódicos (metalófono, flauta dulce u otros)." },
      { id: "OA 6", texto: "Presentar su trabajo musical, en forma individual y grupal, compartiendo con el curso y la comunidad." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Demostrar habilidades motrices básicas de locomoción, manipulación y estabilidad en una variedad de juegos." },
      { id: "OA 5", texto: "Ejecutar actividades físicas de intensidad moderada a vigorosa que incrementen la condición física." },
      { id: "OA 7", texto: "Practicar de manera regular y autónoma actividades físicas de intensidad moderada a vigorosa." }
    ],
    "Orientación": [
      { id: "OA 1", texto: "Observar, describir y valorar sus características personales, sus habilidades e intereses." },
      { id: "OA 4", texto: "Practicar en forma autónoma conductas protectoras y de autocuidado." },
      { id: "OA 7", texto: "Resolver conflictos entre pares en forma guiada, y práctica de estrategias como el diálogo y la negociación." }
    ],
    "Tecnología": [
      { id: "OA 1", texto: "Crear diseños de objetos o sistemas tecnológicos simples para resolver problemas." },
      { id: "OA 3", texto: "Elaborar un objeto tecnológico, usando los materiales y las herramientas apropiados." },
      { id: "OA 5", texto: "Usar software de presentación para organizar y comunicar ideas de diferentes maneras." }
    ]
  },

  // ─────────────────────────────────────────────
  // 5° BÁSICO
  // ─────────────────────────────────────────────
  "5° Básico": {
    "Matemática": [
      { id: "OA 1", texto: "Representar y describir números naturales de hasta más de 6 dígitos y menores que 1 000 millones." },
      { id: "OA 3", texto: "Demostrar que comprenden la multiplicación de números naturales de dos dígitos por números naturales de dos dígitos." },
      { id: "OA 6", texto: "Demostrar que comprenden las fracciones propias: representándolas de manera concreta, pictórica y simbólica." },
      { id: "OA 7", texto: "Demostrar que comprenden la adición y sustracción de fracciones de igual denominador." },
      { id: "OA 9", texto: "Demostrar que comprenden los decimales (décimos y centésimos): representándolos en forma concreta, pictórica y simbólica." },
      { id: "OA 14", texto: "Descubrir alguna regla que explique una sucesión dada y que permita hacer predicciones." },
      { id: "OA 18", texto: "Demostrar que comprenden el concepto de congruencia, usando la traslación, la reflexión y la rotación." },
      { id: "OA 22", texto: "Realizar transformaciones entre unidades de medidas de longitud, de masa y de tiempo." },
      { id: "OA 24", texto: "Calcular el promedio de datos e interpretarlo en su contexto." }
    ],
    "Lenguaje y Comunicación": [
      { id: "OA 2", texto: "Comprender textos aplicando estrategias de comprensión lectora; por ejemplo: relacionar la información con sus experiencias." },
      { id: "OA 4", texto: "Analizar aspectos relevantes de las narraciones leídas para profundizar su comprensión: identificando las acciones principales del relato." },
      { id: "OA 6", texto: "Leer independientemente y comprender textos no literarios (cartas, biografías, relatos históricos, libros y artículos informativos)." },
      { id: "OA 9", texto: "Desarrollar el gusto por la lectura, leyendo habitualmente diversos textos." },
      { id: "OA 12", texto: "Escribir frecuentemente, para desarrollar la creatividad y expresar sus ideas." },
      { id: "OA 14", texto: "Escribir artículos informativos para comunicar información sobre un tema." },
      { id: "OA 17", texto: "Planificar sus textos: estableciendo propósito y destinatario, generando ideas a partir de sus conocimientos e investigación." },
      { id: "OA 24", texto: "Comprender textos orales (explicaciones, instrucciones, noticias, documentales) para obtener información." }
    ],
    "Ciencias Naturales": [
      { id: "OA 1", texto: "Reconocer y explicar que los seres vivos están formados por una o más células y que estas se organizan en tejidos, órganos y sistemas." },
      { id: "OA 3", texto: "Explicar la función de transporte del sistema circulatorio (sustancias alimenticias y oxígeno y dióxido de carbono)." },
      { id: "OA 5", texto: "Analizar el consumo de alimento diario (variedad, tamaño y frecuencia de porciones) reconociendo los alimentos para el crecimiento, la reparación, el desarrollo y el movimiento del cuerpo." },
      { id: "OA 7", texto: "Investigar e identificar algunos microorganismos beneficiosos y dañinos para la salud." },
      { id: "OA 8", texto: "Reconocer los cambios que experimenta la energía eléctrica al pasar de una forma a otra." },
      { id: "OA 10", texto: "Explorar y describir las características del agua en sus tres estados físicos (sólido, líquido y gaseoso)." },
      { id: "OA 12", texto: "Describir las características de las capas de la Tierra (atmósfera, litósfera e hidrósfera) que posibilitan el desarrollo de la vida." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Describir el proceso de Conquista de América y de Chile, incluyendo a los principales actores, las motivaciones y la resistencia mapuche." },
      { id: "OA 2", texto: "Describir el proceso de formación de la sociedad colonial americana y chilena." },
      { id: "OA 4", texto: "Investigar sobre algún tema de su interés con relación a las sociedades y civilizaciones estudiadas." },
      { id: "OA 9", texto: "Caracterizar las grandes zonas de Chile y sus paisajes (Norte Grande, Norte Chico, Zona Central, Zona Sur y Zona Austral)." },
      { id: "OA 13", texto: "Reconocer que todas las personas son sujetos de derecho, que deben ser respetados por los pares, la comunidad y el Estado." },
      { id: "OA 15", texto: "Participar en su comunidad, tomando parte en elecciones para una directiva del curso, usando los mecanismos de participación existentes." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Demostrar comprensión de textos orales adaptados y auténticos simples, como canciones y cuentos." },
      { id: "OA 5", texto: "Presentarse a sí mismo y a otros, dar información personal y expresar preferencias, sentimientos y opiniones." },
      { id: "OA 9", texto: "Demostrar comprensión de textos literarios y no literarios breves y simples." },
      { id: "OA 14", texto: "Escribir para: saludar, describir e invitar; contestar preguntas; describir acciones que ocurren al momento de hablar." }
    ],
    "Artes Visuales": [
      { id: "OA 1", texto: "Crear trabajos de arte y diseños a partir de sus propias ideas y de la observación del entorno cultural." },
      { id: "OA 3", texto: "Crear trabajos de arte y diseños a partir de diferentes desafíos y temas del entorno cultural y artístico." },
      { id: "OA 4", texto: "Analizar e interpretar obras de arte y diseño en relación con la aplicación del lenguaje visual." }
    ],
    "Música": [
      { id: "OA 1", texto: "Describir la música escuchada e interpretar su significado a partir de los elementos del lenguaje musical." },
      { id: "OA 4", texto: "Cantar al unísono y a más voces y tocar instrumentos de percusión, melódicos (metalófono, flauta dulce u otros) y/o armónicos." },
      { id: "OA 7", texto: "Explicar la relación entre las obras escuchadas, interpretadas y el contexto en que éstas surgen." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Demostrar la aplicación de habilidades motrices básicas de locomoción, manipulación y estabilidad en juegos y actividades físicas." },
      { id: "OA 4", texto: "Practicar regularmente una variedad de actividades físicas alternativas y/o deportivas en diferentes entornos." },
      { id: "OA 8", texto: "Determinar la intensidad del esfuerzo físico de forma manual, mediante el pulso o utilizando escalas de percepción de esfuerzo." }
    ],
    "Orientación": [
      { id: "OA 2", texto: "Identificar y aceptar sus propias emociones y las de los demás, y practicar estrategias personales de manejo emocional." },
      { id: "OA 5", texto: "Manifestar actitudes de solidaridad y respeto que favorezcan la convivencia." },
      { id: "OA 7", texto: "Resolver conflictos de convivencia en forma autónoma, seleccionando y aplicando diversas estrategias de resolución de problemas." }
    ],
    "Tecnología": [
      { id: "OA 1", texto: "Crear diseños de objetos o sistemas tecnológicos para resolver problemas o aprovechar oportunidades." },
      { id: "OA 2", texto: "Planificar la elaboración de objetos tecnológicos, incorporando la secuencia de acciones, materiales, herramientas, técnicas y medidas de seguridad." },
      { id: "OA 5", texto: "Usar software para organizar y comunicar los resultados de investigaciones e intercambiar ideas con diferentes propósitos." }
    ]
  },

  // ─────────────────────────────────────────────
  // 6° BÁSICO
  // ─────────────────────────────────────────────
  "6° Básico": {
    "Matemática": [
      { id: "OA 1", texto: "Representar y describir números naturales de hasta más de 9 dígitos." },
      { id: "OA 3", texto: "Demostrar que comprenden el concepto de razón de manera concreta, pictórica y simbólica." },
      { id: "OA 4", texto: "Demostrar que comprenden el concepto de porcentaje de manera concreta, pictórica y simbólica." },
      { id: "OA 7", texto: "Demostrar que comprenden la multiplicación y la división de decimales por números naturales de un dígito." },
      { id: "OA 9", texto: "Demostrar que comprenden la adición y sustracción de fracciones propias con denominadores distintos." },
      { id: "OA 11", texto: "Resolver ecuaciones de primer grado con una incógnita, utilizando estrategias como usar una balanza, métodos de ensayo y error." },
      { id: "OA 15", texto: "Construir ángulos agudos, obtusos, rectos y extendidos con instrumentos geométricos o software." },
      { id: "OA 20", texto: "Calcular el volumen de cubos y paralelepípedos, expresando el resultado en cm³, m³ y mm³." },
      { id: "OA 23", texto: "Representar datos obtenidos en una muestra mediante tablas de frecuencias absolutas y relativas." }
    ],
    "Lenguaje y Comunicación": [
      { id: "OA 3", texto: "Leer y familiarizarse con un amplio repertorio de literatura para aumentar su conocimiento del mundo, desarrollar su imaginación." },
      { id: "OA 4", texto: "Analizar aspectos relevantes de las narraciones leídas para profundizar su comprensión." },
      { id: "OA 6", texto: "Leer independientemente y comprender textos no literarios." },
      { id: "OA 9", texto: "Desarrollar el gusto por la lectura, leyendo habitualmente diversos textos." },
      { id: "OA 12", texto: "Escribir frecuentemente, para desarrollar la creatividad y expresar sus ideas." },
      { id: "OA 14", texto: "Escribir artículos informativos para comunicar información sobre un tema." },
      { id: "OA 15", texto: "Escribir cartas, instrucciones, afiches, reportes de una experiencia o noticias." },
      { id: "OA 18", texto: "Escribir, revisar y editar sus textos para satisfacer un propósito y transmitir sus ideas con claridad." }
    ],
    "Ciencias Naturales": [
      { id: "OA 1", texto: "Reconocer y explicar que los seres vivos están formados por una o más células y que estas se organizan en tejidos, órganos y sistemas." },
      { id: "OA 2", texto: "Identificar y describir las funciones de las principales estructuras del sistema reproductor humano femenino y masculino." },
      { id: "OA 4", texto: "Reconocer los cambios que experimenta el organismo durante la pubertad." },
      { id: "OA 8", texto: "Explicar que la energía es necesaria para que los objetos cambien y que la luz y el sonido son formas de energía." },
      { id: "OA 9", texto: "Investigar experimentalmente la formación de mezclas y soluciones." },
      { id: "OA 12", texto: "Explicar, a partir de modelos, que la Tierra tiene una estructura de capas (corteza, manto y núcleo)." },
      { id: "OA 14", texto: "Describir las características de las capas de la Tierra (atmósfera, litósfera e hidrósfera)." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Explicar los principales antecedentes de la independencia de las colonias americanas." },
      { id: "OA 2", texto: "Explicar el desarrollo del proceso de independencia de Chile, considerando actores y bandos." },
      { id: "OA 5", texto: "Describir cómo se conformó el territorio de Chile durante el siglo XIX." },
      { id: "OA 8", texto: "Identificar elementos constitutivos del territorio nacional: su ubicación en el mundo, extensión, principales macroformas del relieve." },
      { id: "OA 11", texto: "Identificar los principales recursos naturales de Chile." },
      { id: "OA 15", texto: "Explicar algunos elementos fundamentales de la organización democrática de Chile." },
      { id: "OA 18", texto: "Opinar y argumentar con fundamentos sobre temas de la asignatura." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Demostrar comprensión de textos orales adaptados y auténticos simples." },
      { id: "OA 6", texto: "Leer y demostrar comprensión de textos como cuentos, poemas, tarjetas e historias breves." },
      { id: "OA 10", texto: "Escribir para: describir rutinas diarias; crear una historia breve original basada en un modelo." },
      { id: "OA 12", texto: "Participar en diálogos con pares y profesores al practicar entrevistas de al menos cuatro intercambios." }
    ],
    "Artes Visuales": [
      { id: "OA 1", texto: "Crear trabajos de arte y diseños a partir de sus propias ideas y de la observación del entorno cultural." },
      { id: "OA 3", texto: "Crear trabajos de arte y diseños a partir de diferentes desafíos y temas del entorno cultural y artístico." },
      { id: "OA 5", texto: "Evaluar críticamente trabajos de arte y diseño personales y de sus pares considerando expresión, materialidades, procedimientos." }
    ],
    "Música": [
      { id: "OA 1", texto: "Describir la música escuchada e interpretar su significado a partir de los elementos del lenguaje musical." },
      { id: "OA 4", texto: "Cantar al unísono y a más voces y tocar instrumentos de percusión, melódicos y/o armónicos." },
      { id: "OA 7", texto: "Explicar la relación entre las obras escuchadas, interpretadas y el contexto en que surgen." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Demostrar la aplicación de habilidades motrices básicas de locomoción, manipulación y estabilidad." },
      { id: "OA 3", texto: "Practicar y ejecutar de manera regular actividades físicas y/o deportivas de intensidad moderada a vigorosa." },
      { id: "OA 7", texto: "Practicar actividades físicas y/o deportivas, demostrando comportamiento seguro." }
    ],
    "Orientación": [
      { id: "OA 2", texto: "Identificar y aceptar sus propias emociones y las de los demás, y practicar estrategias personales de manejo emocional." },
      { id: "OA 5", texto: "Manifestar actitudes de solidaridad y respeto que favorezcan la convivencia." },
      { id: "OA 8", texto: "Resolver conflictos de convivencia en forma autónoma, seleccionando y aplicando diversas estrategias." }
    ],
    "Tecnología": [
      { id: "OA 1", texto: "Crear diseños de objetos o sistemas tecnológicos para resolver problemas o aprovechar oportunidades." },
      { id: "OA 3", texto: "Evaluar los objetos tecnológicos, aplicando criterios propios y técnicos." },
      { id: "OA 5", texto: "Usar software para organizar, comunicar los resultados de investigaciones e intercambiar ideas con diferentes propósitos." }
    ]
  },

  // ─────────────────────────────────────────────
  // 7° BÁSICO
  // ─────────────────────────────────────────────
  "7° Básico": {
    "Matemática": [
      { id: "OA 1", texto: "Mostrar que comprenden la adición y la sustracción de números enteros." },
      { id: "OA 2", texto: "Mostrar que comprenden la multiplicación y la división de números enteros." },
      { id: "OA 3", texto: "Mostrar que comprenden la adición y la sustracción de fracciones y de números decimales positivos." },
      { id: "OA 4", texto: "Mostrar que comprenden el concepto de porcentaje." },
      { id: "OA 5", texto: "Mostrar que comprenden las proporciones directas e inversas." },
      { id: "OA 7", texto: "Mostrar que comprenden las potencias de base natural y exponente natural." },
      { id: "OA 9", texto: "Representar, en el plano cartesiano, puntos, vectores, figuras y transformaciones isométricas." },
      { id: "OA 11", texto: "Mostrar que comprenden el círculo: describiendo las relaciones entre el radio, el diámetro y el perímetro." },
      { id: "OA 13", texto: "Representar datos obtenidos en una muestra mediante tablas de frecuencias absolutas y relativas." }
    ],
    "Lenguaje y Comunicación": [
      { id: "OA 2", texto: "Reflexionar sobre las diferentes dimensiones de la experiencia humana, propia y ajena, a partir de la lectura de obras literarias." },
      { id: "OA 3", texto: "Analizar las narraciones leídas para enriquecer su comprensión, considerando, cuando sea pertinente: el conflicto de la historia." },
      { id: "OA 6", texto: "Leer independientemente y comprender textos no literarios para ampliar su conocimiento del mundo." },
      { id: "OA 8", texto: "Formular una interpretación de los textos literarios leídos o vistos, que sea coherente con su análisis." },
      { id: "OA 12", texto: "Aplicar estrategias de comprensión de acuerdo con sus propósitos de lectura." },
      { id: "OA 14", texto: "Escribir, con el propósito de persuadir, textos breves de diversos géneros." },
      { id: "OA 16", texto: "Planificar, escribir, revisar, reescribir y editar sus textos en función del contexto, el destinatario y el propósito." },
      { id: "OA 20", texto: "Comprender, comparar y evaluar textos orales y audiovisuales." }
    ],
    "Ciencias Naturales": [
      { id: "OA 1", texto: "Explicar los aspectos biológicos, afectivos y sociales que se integran en la sexualidad, considerando los cambios que ocurren en la pubertad." },
      { id: "OA 2", texto: "Explicar la formación de un nuevo individuo, considerando: el ciclo menstrual, la fecundación, el embarazo y el parto." },
      { id: "OA 3", texto: "Describir, por medio de la investigación, los mecanismos de intercambio de partículas entre la célula y su ambiente por difusión y ósmosis." },
      { id: "OA 6", texto: "Investigar experimentalmente la formación de soluciones, considerando la solubilidad de los solutos en diversos solventes." },
      { id: "OA 7", texto: "Desarrollar modelos que expliquen que la materia está constituida por átomos que interactúan." },
      { id: "OA 10", texto: "Explorar y describir cualitativamente la presión, considerando su relación con la fuerza y el área de contacto." },
      { id: "OA 13", texto: "Investigar experimentalmente y explicar el comportamiento de gases ideales en situaciones cotidianas." },
      { id: "OA 14", texto: "Investigar y analizar cómo ha evolucionado el conocimiento de la estructura del átomo a través del tiempo." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Explicar el proceso de hominización, reconociendo las principales etapas de la evolución de la especie humana." },
      { id: "OA 2", texto: "Reconocer el impacto de la revolución del Neolítico en el paso de la vida nómade a la sedentaria." },
      { id: "OA 3", texto: "Identificar las principales características de las primeras civilizaciones." },
      { id: "OA 5", texto: "Caracterizar el mar Mediterráneo como ecúmene y como espacio de circulación e intercambio." },
      { id: "OA 7", texto: "Comparar los principales rasgos de la organización política, económica y social de la Grecia clásica y el mundo romano." },
      { id: "OA 9", texto: "Explicar que la civilización europea se conforma a partir de la herencia de la Antigüedad clásica." },
      { id: "OA 12", texto: "Analizar las relaciones entre el ser humano y el medio geográfico, y sus consecuencias." },
      { id: "OA 18", texto: "Explicar las características de la democracia ateniense." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Demostrar comprensión de ideas generales e información explícita en textos orales adaptados y auténticos simples." },
      { id: "OA 5", texto: "Presentar información en forma oral, usando recursos multimodales que refuercen el mensaje." },
      { id: "OA 9", texto: "Demostrar comprensión de ideas generales e información explícita en textos adaptados y auténticos simples, no literarios y literarios." },
      { id: "OA 14", texto: "Escribir una variedad de textos breves, como cuentos, correos electrónicos, folletos, rimas, descripciones, utilizando los pasos del proceso de escritura." }
    ],
    "Artes Visuales": [
      { id: "OA 1", texto: "Crear trabajos visuales basados en la apreciación y el análisis de manifestaciones estéticas referidas a la relación entre personas, naturaleza y medio ambiente." },
      { id: "OA 2", texto: "Crear trabajos visuales a partir de intereses personales, experimentando con materiales sustentables en dibujo, pintura, grabado, escultura, técnicas mixtas, instalación, fotografía, entre otros." },
      { id: "OA 5", texto: "Evaluar críticamente trabajos de arte y diseño personales y de sus pares." }
    ],
    "Música": [
      { id: "OA 1", texto: "Reconocer sentimientos, sensaciones e ideas al escuchar manifestaciones y obras musicales de Chile y el mundo." },
      { id: "OA 4", texto: "Cantar y tocar repertorio diverso, desarrollando habilidades tales como la precisión rítmica y melódica." },
      { id: "OA 7", texto: "Apreciar el rol de la música en la sociedad, considerando sus propias experiencias musicales." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Aplicar, combinar y ajustar las habilidades motrices específicas de locomoción, manipulación y estabilidad." },
      { id: "OA 3", texto: "Diseñar y aplicar un plan de entrenamiento personal para alcanzar una condición física saludable." },
      { id: "OA 5", texto: "Practicar regularmente una variedad de actividades físicas alternativas y/o deportivas en diferentes entornos, aplicando conductas de autocuidado." }
    ],
    "Orientación": [
      { id: "OA 2", texto: "Analizar, considerando sus experiencias e inquietudes, la importancia que tiene para el desarrollo personal el conocimiento de sí mismo, la autoestima y el autocuidado." },
      { id: "OA 4", texto: "Integrar a su vida cotidiana acciones que favorezcan el bienestar y la vida saludable." },
      { id: "OA 6", texto: "Resolver conflictos de convivencia en forma autónoma, seleccionando y aplicando diversas estrategias de resolución de problemas." }
    ],
    "Tecnología": [
      { id: "OA 1", texto: "Diseñar, hacer y probar un producto tecnológico que resuelva un problema, aprovechando diversas herramientas digitales." },
      { id: "OA 4", texto: "Comunicar el diseño, la planificación u otros procesos de la resolución de un problema tecnológico, utilizando herramientas TIC." },
      { id: "OA 5", texto: "Usar procesador de textos para crear, editar, dar formato, incorporar elementos de diseño y guardar un documento." }
    ]
  },

  // ─────────────────────────────────────────────
  // 8° BÁSICO
  // ─────────────────────────────────────────────
  "8° Básico": {
    "Matemática": [
      { id: "OA 1", texto: "Mostrar que comprenden la multiplicación y la división de números enteros." },
      { id: "OA 2", texto: "Utilizar las operaciones con números racionales (fracciones y decimales positivos y negativos) en el contexto de la resolución de problemas." },
      { id: "OA 4", texto: "Mostrar que comprenden las raíces cuadradas de números naturales." },
      { id: "OA 5", texto: "Resolver problemas que involucren proporciones directas e inversas, porcentajes." },
      { id: "OA 6", texto: "Modelar situaciones de la vida diaria y de otras asignaturas con ecuaciones lineales." },
      { id: "OA 8", texto: "Mostrar que comprenden el concepto de función por medio de tablas y gráficos." },
      { id: "OA 9", texto: "Explicar las relaciones entre los ángulos que se forman al cortar dos rectas paralelas por una transversal." },
      { id: "OA 11", texto: "Desarrollar las fórmulas para encontrar el área de superficies y el volumen de prismas rectos y cilindros." },
      { id: "OA 13", texto: "Mostrar que comprenden las medidas de tendencia central y el rango." }
    ],
    "Lenguaje y Comunicación": [
      { id: "OA 2", texto: "Reflexionar sobre las diferentes dimensiones de la experiencia humana, propia y ajena, a partir de la lectura de obras literarias." },
      { id: "OA 3", texto: "Analizar las narraciones leídas para enriquecer su comprensión, considerando el narrador, los personajes y el ambiente." },
      { id: "OA 6", texto: "Leer independientemente y comprender textos no literarios para ampliar su conocimiento del mundo." },
      { id: "OA 8", texto: "Formular una interpretación de los textos literarios leídos o vistos, que sea coherente con su análisis." },
      { id: "OA 12", texto: "Aplicar estrategias de comprensión de acuerdo con sus propósitos de lectura." },
      { id: "OA 14", texto: "Escribir, con el propósito de persuadir, textos breves de diversos géneros." },
      { id: "OA 16", texto: "Planificar, escribir, revisar, reescribir y editar sus textos en función del contexto, el destinatario y el propósito." },
      { id: "OA 21", texto: "Dialogar constructivamente para debatir o explorar ideas." }
    ],
    "Ciencias Naturales": [
      { id: "OA 1", texto: "Explicar, basándose en evidencia, que la célula es la unidad estructural y funcional de todo ser vivo." },
      { id: "OA 2", texto: "Desarrollar modelos que expliquen la relación entre la función de una célula y sus partes." },
      { id: "OA 4", texto: "Crear modelos que expliquen que las plantas, los animales y los microorganismos tienen diferentes mecanismos para mantener el equilibrio interno." },
      { id: "OA 6", texto: "Crear modelos que expliquen los efectos de una fuerza neta sobre un objeto, utilizando las Leyes de Newton." },
      { id: "OA 8", texto: "Explorar y describir cuantitativamente la presión en contextos cotidianos." },
      { id: "OA 9", texto: "Investigar las transformaciones de la energía en distintos contextos." },
      { id: "OA 11", texto: "Crear modelos que expliquen el funcionamiento del sistema solar y los fenómenos astronómicos." },
      { id: "OA 13", texto: "Investigar experimentalmente y explicar las características de los circuitos eléctricos." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Analizar, apoyándose en diversas fuentes, la formación de la sociedad medieval europea, considerando la síntesis cristiano-germánica." },
      { id: "OA 3", texto: "Caracterizar la sociedad medieval, considerando la visión cristiana del mundo como factor de unidad cultural." },
      { id: "OA 5", texto: "Analizar la influencia de la cultura árabe en la conformación de la cultura medieval europea." },
      { id: "OA 7", texto: "Analizar factores que posibilitaron la expansión europea hacia nuevos continentes." },
      { id: "OA 10", texto: "Analizar cómo los descubrimientos geográficos ampliaron el conocimiento del mundo." },
      { id: "OA 13", texto: "Reconocer los ideales que motivaron el surgimiento del Humanismo y las principales consecuencias." },
      { id: "OA 16", texto: "Analizar las relaciones de influencia y dependencia entre la sociedad y el medio geográfico a escala local y global." },
      { id: "OA 20", texto: "Reconocer la importancia de los Derechos Humanos y la Declaración Universal de Derechos Humanos." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Demostrar comprensión de ideas generales e información explícita en textos orales adaptados y auténticos simples." },
      { id: "OA 5", texto: "Presentar información en forma oral, usando recursos multimodales que refuercen el mensaje en forma creativa." },
      { id: "OA 9", texto: "Demostrar comprensión de ideas generales e información explícita en textos adaptados y auténticos simples." },
      { id: "OA 14", texto: "Escribir una variedad de textos breves, como cuentos, correos electrónicos, folletos, rimas, descripciones, biografías, instrucciones, artículos." }
    ],
    "Artes Visuales": [
      { id: "OA 1", texto: "Crear trabajos visuales basados en las percepciones, sentimientos e ideas generados a partir de la observación de manifestaciones estéticas." },
      { id: "OA 3", texto: "Interpretar manifestaciones visuales patrimoniales y contemporáneas, atendiendo a criterios como materialidad, lenguaje visual y contexto." },
      { id: "OA 5", texto: "Evaluar críticamente trabajos de arte y diseño personales y de sus pares." }
    ],
    "Música": [
      { id: "OA 1", texto: "Reconocer sentimientos, sensaciones e ideas al escuchar manifestaciones y obras musicales de Chile y el mundo." },
      { id: "OA 4", texto: "Cantar y tocar repertorio diverso, desarrollando habilidades tales como la precisión rítmica y melódica." },
      { id: "OA 7", texto: "Apreciar el rol de la música en la sociedad, considerando sus propias experiencias musicales." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Aplicar, combinar y ajustar las habilidades motrices específicas de locomoción, manipulación y estabilidad." },
      { id: "OA 3", texto: "Diseñar y aplicar un plan de entrenamiento personal para alcanzar una condición física saludable." },
      { id: "OA 5", texto: "Practicar regularmente una variedad de actividades físicas alternativas y/o deportivas." }
    ],
    "Orientación": [
      { id: "OA 2", texto: "Analizar la importancia que tiene para el desarrollo personal el conocimiento de sí mismo, la autoestima y el autocuidado." },
      { id: "OA 4", texto: "Integrar a su vida cotidiana acciones que favorezcan el bienestar y la vida saludable." },
      { id: "OA 7", texto: "Evaluar la importancia de desarrollar relaciones basadas en el diálogo, el respeto mutuo y la valoración del otro." }
    ],
    "Tecnología": [
      { id: "OA 1", texto: "Diseñar y crear un producto tecnológico que resuelva un problema o aproveche una oportunidad." },
      { id: "OA 3", texto: "Evaluar el producto tecnológico desarrollado, aplicando criterios de funcionamiento, técnicos, medioambientales y de seguridad." },
      { id: "OA 5", texto: "Usar planilla de cálculo para organizar datos, crear gráficos y hacer operaciones con fórmulas simples." }
    ]
  },

  // ─────────────────────────────────────────────
  // 1° MEDIO
  // ─────────────────────────────────────────────
  "1° Medio": {
    "Matemática": [
      { id: "OA 1", texto: "Mostrar que comprenden los números racionales: representándolos en la recta numérica, comparándolos, realizando operaciones." },
      { id: "OA 2", texto: "Mostrar que comprenden las potencias de base racional y exponente entero." },
      { id: "OA 3", texto: "Mostrar que comprenden las raíces enésimas." },
      { id: "OA 4", texto: "Resolver sistemas de ecuaciones lineales (2x2) relacionados con problemas de la vida diaria." },
      { id: "OA 5", texto: "Resolver problemas que involucren la función afín." },
      { id: "OA 6", texto: "Resolver problemas que involucren variaciones porcentuales en contextos diversos." },
      { id: "OA 7", texto: "Mostrar que comprenden la relación entre las medidas de los lados y los ángulos en triángulos y polígonos." },
      { id: "OA 8", texto: "Mostrar que comprenden las transformaciones isométricas y la homotecia." },
      { id: "OA 9", texto: "Mostrar que comprenden el Teorema de Pitágoras." },
      { id: "OA 10", texto: "Desarrollar las fórmulas para encontrar el área y el volumen de prismas, pirámides, cilindros, conos y esferas." },
      { id: "OA 11", texto: "Mostrar que comprenden el concepto de probabilidad empírica y la ley de los grandes números." }
    ],
    "Lengua y Literatura": [
      { id: "OA 1", texto: "Leer habitualmente para aprender y recrearse, y seleccionar textos de acuerdo con sus preferencias y propósitos." },
      { id: "OA 2", texto: "Reflexionar sobre las diferentes dimensiones de la experiencia humana, propia y ajena, a partir de la lectura de obras literarias y otros textos que forman parte de nuestras herencias culturales." },
      { id: "OA 3", texto: "Analizar las narraciones leídas para enriquecer su comprensión, considerando el o los conflictos de la historia." },
      { id: "OA 7", texto: "Formular una interpretación de los textos literarios leídos o vistos, que sea coherente con su análisis." },
      { id: "OA 9", texto: "Analizar y evaluar textos de los medios de comunicación, como noticias, reportajes, cartas al director, textos publicitarios o de las redes sociales." },
      { id: "OA 12", texto: "Aplicar flexiblemente y creativamente las habilidades de escritura adquiridas en clases como medio de expresión personal." },
      { id: "OA 14", texto: "Escribir, con el propósito de persuadir, textos breves de diversos géneros, aplicando diversas estrategias." },
      { id: "OA 18", texto: "Escribir correctamente para facilitar la comprensión por parte del lector, aplicando las reglas ortográficas aprendidas en años anteriores." },
      { id: "OA 22", texto: "Dialogar constructivamente para debatir o explorar ideas." }
    ],
    "Biología": [
      { id: "OA 1", texto: "Explicar, basándose en evidencias, la interacción de sistemas del cuerpo humano, organizados por estructuras especializadas que contribuyen al equilibrio del organismo (homeostasis)." },
      { id: "OA 2", texto: "Investigar y explicar cómo se organizan e interactúan los seres vivos en diversos ecosistemas." },
      { id: "OA 3", texto: "Explicar, basándose en investigaciones, cómo los organismos mantienen el equilibrio (homeostasis) frente a cambios del medio, incluyendo termorregulación, osmorregulación y regulación de la glicemia." },
      { id: "OA 4", texto: "Investigar y explicar cómo se organiza y funciona la célula, considerando la membrana celular, el citoesqueleto, el núcleo y los organelos." },
      { id: "OA 6", texto: "Investigar y argumentar, basándose en evidencias, que la evolución de los seres vivos es el resultado de cambios genéticos y de la selección natural." }
    ],
    "Física": [
      { id: "OA 9", texto: "Demostrar que comprenden, por medio de la experimentación, que las ondas transfieren energía y que se pueden reflejar, refractar y absorber." },
      { id: "OA 10", texto: "Explicar fenómenos luminosos, como la reflexión, la refracción, la interferencia y el efecto Doppler, entre otros." },
      { id: "OA 11", texto: "Explicar que el sonido es una onda que se propaga a través de medios materiales y que se caracteriza por su frecuencia, amplitud y velocidad de propagación." },
      { id: "OA 12", texto: "Explicar, por medio de investigaciones experimentales, las características de la luz y de la óptica geométrica." },
      { id: "OA 14", texto: "Investigar y analizar las transformaciones de la energía mecánica (cinética y potencial), considerando la ley de conservación de la energía." }
    ],
    "Química": [
      { id: "OA 15", texto: "Explicar, por medio de modelos y la tabla periódica, cómo la configuración electrónica determina las propiedades del átomo y las tendencias periódicas." },
      { id: "OA 16", texto: "Desarrollar un modelo del enlace químico (iónico, covalente y metálico), basándose en la interacción electrostática entre partículas." },
      { id: "OA 17", texto: "Clasificar sustancias puras (elementos y compuestos) y mezclas (homogéneas y heterogéneas)." },
      { id: "OA 18", texto: "Investigar experimentalmente y explicar las propiedades de las soluciones (concentración, solubilidad y dilución)." },
      { id: "OA 19", texto: "Crear modelos del carbono y explicar su importancia para la vida y los seres vivos." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Analizar, apoyándose en diversas fuentes, los antecedentes, el desarrollo y las consecuencias de la Primera Guerra Mundial." },
      { id: "OA 3", texto: "Analizar los efectos de la crisis económica de 1929 y de los regímenes totalitarios en la vida de las personas." },
      { id: "OA 5", texto: "Analizar los principales antecedentes, el desarrollo y las consecuencias de la Segunda Guerra Mundial." },
      { id: "OA 7", texto: "Analizar la Guerra Fría como un período histórico marcado por la pugna ideológica entre Estados Unidos y la Unión Soviética." },
      { id: "OA 10", texto: "Evaluar las principales transformaciones y desafíos que generó la Guerra Fría en América, Chile y el mundo." },
      { id: "OA 14", texto: "Analizar cómo los procesos de urbanización y de la industrialización impactaron en Chile durante el siglo XX." },
      { id: "OA 17", texto: "Analizar la importancia del legado cultural de la Antigüedad clásica y evaluar su vigencia en el mundo contemporáneo." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Demostrar comprensión de ideas principales e información relevante en textos orales, adaptados y auténticos simples." },
      { id: "OA 4", texto: "Identificar palabras y frases clave, expresiones de uso frecuente, vocabulario temático, conectores." },
      { id: "OA 9", texto: "Demostrar comprensión de ideas principales e información relevante en textos no literarios y literarios simples." },
      { id: "OA 14", texto: "Escribir una variedad de textos breves utilizando los pasos del proceso de escritura (organizar ideas, redactar, editar, publicar)." }
    ],
    "Artes Visuales": [
      { id: "OA 1", texto: "Crear trabajos visuales basados en la apreciación y el análisis de manifestaciones estéticas referidas a la relación entre personas, naturaleza y medio ambiente, en diferentes contextos." },
      { id: "OA 2", texto: "Crear trabajos visuales a partir de intereses artísticos personales, experimentando con materiales sustentables." },
      { id: "OA 5", texto: "Evaluar críticamente trabajos de arte y diseño personales y de sus pares, considerando criterios como: materialidad, lenguaje visual, propósito expresivo." }
    ],
    "Artes Musicales": [
      { id: "OA 1", texto: "Reconocer sentimientos, sensaciones e ideas al escuchar manifestaciones y obras musicales de Chile y el mundo." },
      { id: "OA 4", texto: "Cantar y tocar repertorio diverso, desarrollando habilidades tales como la precisión rítmica y melódica, la fluidez, la expresividad." },
      { id: "OA 7", texto: "Apreciar el rol de la música en la sociedad y la cultura, considerando sus propias experiencias." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Aplicar y combinar con precisión las habilidades motrices específicas de locomoción, manipulación y estabilidad." },
      { id: "OA 2", texto: "Seleccionar y aplicar estrategias y tácticas específicas para la resolución de problemas durante la práctica de juegos o deportes." },
      { id: "OA 4", texto: "Diseñar y aplicar un plan de entrenamiento personal para alcanzar una condición física saludable, desarrollando la resistencia cardiovascular, la fuerza muscular, la velocidad y la flexibilidad." }
    ],
    "Tecnología": [
      { id: "OA 1", texto: "Identificar oportunidades o necesidades personales, grupales o locales que impliquen la creación de un producto tecnológico." },
      { id: "OA 2", texto: "Diseñar un producto tecnológico y un plan de acción para elaborarlo, considerando precauciones necesarias para el uso de materiales y herramientas." },
      { id: "OA 5", texto: "Usar herramientas y aplicaciones de uso extendido para buscar, acceder, almacenar, comunicar y colaborar." }
    ],
    "Orientación": [
      { id: "OA 2", texto: "Analizar la importancia del autoconocimiento, la autoestima y el autocuidado para el desarrollo personal." },
      { id: "OA 5", texto: "Practicar en forma autónoma conductas protectoras y de autocuidado, como mantener una comunicación efectiva con la familia." },
      { id: "OA 8", texto: "Practicar la resolución de conflictos entre pares y con adultos de forma asertiva y constructiva." }
    ]
  },

  // ─────────────────────────────────────────────
  // 2° MEDIO
  // ─────────────────────────────────────────────
  "2° Medio": {
    "Matemática": [
      { id: "OA 1", texto: "Resolver problemas que involucren composición de funciones, usando representaciones gráficas y algebraicas." },
      { id: "OA 2", texto: "Mostrar que comprenden las relaciones entre potencias, raíces enésimas y logaritmos." },
      { id: "OA 3", texto: "Mostrar que comprenden la función cuadrática." },
      { id: "OA 4", texto: "Resolver problemas que involucren ecuaciones cuadráticas." },
      { id: "OA 5", texto: "Resolver problemas que involucren inecuaciones lineales." },
      { id: "OA 6", texto: "Mostrar que comprenden las semejanzas de figuras planas." },
      { id: "OA 7", texto: "Resolver problemas que involucren la ley de los senos y del coseno." },
      { id: "OA 8", texto: "Mostrar que comprenden las razones trigonométricas de seno, coseno y tangente en triángulos rectángulos." },
      { id: "OA 9", texto: "Resolver problemas que involucren calcular el volumen y el área de superficie de cuerpos geométricos." },
      { id: "OA 10", texto: "Explicar las medidas de posición, percentiles y cuartiles, aplicándolas a poblaciones y muestras." },
      { id: "OA 11", texto: "Resolver problemas que involucren probabilidades, usando la regla de la suma y la regla del producto." }
    ],
    "Lengua y Literatura": [
      { id: "OA 1", texto: "Leer habitualmente para aprender y recrearse, y seleccionar textos de acuerdo con sus preferencias y propósitos." },
      { id: "OA 2", texto: "Reflexionar sobre las diferentes dimensiones de la experiencia humana, propia y ajena, a partir de la lectura de obras literarias." },
      { id: "OA 3", texto: "Analizar las narraciones leídas para enriquecer su comprensión, considerando el narrador, los personajes y el ambiente." },
      { id: "OA 7", texto: "Formular una interpretación de los textos literarios leídos o vistos, que sea coherente con su análisis." },
      { id: "OA 9", texto: "Analizar y evaluar textos de los medios de comunicación." },
      { id: "OA 12", texto: "Aplicar flexiblemente y creativamente las habilidades de escritura adquiridas en clases." },
      { id: "OA 14", texto: "Escribir, con el propósito de persuadir, textos breves de diversos géneros." },
      { id: "OA 22", texto: "Dialogar constructivamente para debatir o explorar ideas." }
    ],
    "Biología": [
      { id: "OA 1", texto: "Explicar, basándose en evidencias, que los tejidos, los órganos y los sistemas de los organismos pluricelulares están formados por células especializadas." },
      { id: "OA 2", texto: "Desarrollar modelos que expliquen la regulación de la expresión génica en los organismos." },
      { id: "OA 4", texto: "Desarrollar modelos que expliquen cómo el ADN almacena, transmite y expresa la información genética." },
      { id: "OA 5", texto: "Explicar los principios básicos de la ingeniería genética y sus aplicaciones." },
      { id: "OA 6", texto: "Investigar y argumentar, basándose en evidencias, los factores que contribuyen a la extinción de especies." }
    ],
    "Física": [
      { id: "OA 9", texto: "Analizar, sobre la base de la experimentación, el movimiento rectilíneo uniforme y uniformemente acelerado de un objeto." },
      { id: "OA 10", texto: "Explicar, con base en las Leyes de Newton, cómo actúan las fuerzas simultáneamente sobre un objeto." },
      { id: "OA 11", texto: "Describir investigaciones sobre las fuerzas en el contexto de los fenómenos naturales (fuerza gravitacional, de roce, centrípeta)." },
      { id: "OA 12", texto: "Investigar experimentalmente y explicar el concepto de momentum lineal y el principio de conservación del momentum lineal." },
      { id: "OA 14", texto: "Analizar la ley de conservación de la energía mecánica y aplicarla en la resolución de problemas." }
    ],
    "Química": [
      { id: "OA 15", texto: "Explicar, por medio de modelos y la experimentación, las propiedades de las soluciones en diversos contextos." },
      { id: "OA 16", texto: "Planificar y conducir una investigación experimental para proveer evidencias que demuestren que las reacciones químicas involucran reorganización de átomos y transferencia de energía." },
      { id: "OA 17", texto: "Explicar, por medio de modelos, las reacciones de combustión, descomposición, neutralización y dilución." },
      { id: "OA 18", texto: "Desarrollar un modelo que explique la estequiometría de las reacciones químicas." },
      { id: "OA 19", texto: "Evaluar los efectos de las reacciones de combustión sobre el medioambiente y la salud de las personas." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Explicar los factores que inciden en el crecimiento y distribución de la población mundial." },
      { id: "OA 3", texto: "Analizar los principales procesos migratorios en Chile y en el mundo." },
      { id: "OA 6", texto: "Evaluar las principales transformaciones culturales, sociales y económicas que caracterizan al mundo globalizado." },
      { id: "OA 9", texto: "Analizar el impacto de la globalización en la cultura, la economía y las comunicaciones." },
      { id: "OA 11", texto: "Analizar la importancia de los principios de soberanía popular, representación y el derecho a ser elegido." },
      { id: "OA 14", texto: "Evaluar situaciones de la vida cotidiana en las que se vean afectados los derechos de las personas." },
      { id: "OA 16", texto: "Evaluar los principales desafíos que Chile debe enfrentar en el ámbito del bicentenario." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Demostrar comprensión de ideas principales e información relevante en textos orales adaptados y auténticos simples." },
      { id: "OA 5", texto: "Presentar información en forma oral, usando recursos multimodales que refuercen el mensaje." },
      { id: "OA 9", texto: "Demostrar comprensión de ideas principales e información relevante en textos adaptados y auténticos simples." },
      { id: "OA 14", texto: "Escribir una variedad de textos breves utilizando los pasos del proceso de escritura." }
    ],
    "Artes Visuales": [
      { id: "OA 1", texto: "Crear trabajos visuales basados en la apreciación y el análisis de manifestaciones estéticas referidas a la relación entre personas, naturaleza y medio ambiente." },
      { id: "OA 2", texto: "Crear trabajos visuales a partir de intereses artísticos personales, experimentando con materiales sustentables en dibujo, pintura, grabado, escultura, técnicas mixtas." },
      { id: "OA 5", texto: "Evaluar críticamente trabajos de arte y diseño personales y de sus pares." }
    ],
    "Artes Musicales": [
      { id: "OA 1", texto: "Reconocer sentimientos, sensaciones e ideas al escuchar manifestaciones y obras musicales de Chile y el mundo." },
      { id: "OA 4", texto: "Cantar y tocar repertorio diverso, desarrollando habilidades tales como la precisión rítmica y melódica." },
      { id: "OA 7", texto: "Apreciar el rol de la música en la sociedad, considerando sus propias experiencias musicales." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Aplicar y combinar con precisión las habilidades motrices específicas de locomoción, manipulación y estabilidad." },
      { id: "OA 3", texto: "Diseñar y aplicar un plan de entrenamiento personal para alcanzar una condición física saludable." },
      { id: "OA 5", texto: "Practicar regularmente una variedad de actividades físicas alternativas y/o deportivas." }
    ],
    "Tecnología": [
      { id: "OA 1", texto: "Identificar oportunidades o necesidades personales, grupales o locales que impliquen la creación de un producto tecnológico." },
      { id: "OA 3", texto: "Evaluar el producto tecnológico desarrollado, aplicando criterios de funcionamiento, técnicos, medioambientales y de seguridad." },
      { id: "OA 5", texto: "Usar herramientas y aplicaciones de uso extendido para buscar, acceder, almacenar, comunicar y colaborar." }
    ],
    "Orientación": [
      { id: "OA 2", texto: "Analizar la importancia del autoconocimiento, la autoestima, el manejo emocional y el autocuidado para el desarrollo personal." },
      { id: "OA 5", texto: "Evaluar y practicar conductas protectoras y de autocuidado." },
      { id: "OA 7", texto: "Analizar factores que influyen en la toma de decisiones y reflexionar sobre la responsabilidad que implican." }
    ]
  },

  // ─────────────────────────────────────────────
  // 3° MEDIO
  // ─────────────────────────────────────────────
  "3° Medio": {
    "Matemática": [
      { id: "OA 1", texto: "Fundamentar decisiones en el ámbito financiero y económico personal o comunitario, a partir de modelos matemáticos (funciones lineales, exponenciales y logarítmicas, y distribuciones binomial y normal)." },
      { id: "OA 2", texto: "Tomar decisiones en situaciones de incerteza que involucren el análisis de datos estadísticos y distribuciones de probabilidad." },
      { id: "OA 3", texto: "Modelar fenómenos o situaciones cotidianas del ámbito científico y del ámbito social con funciones y con ecuaciones diferenciales." },
      { id: "OA 4", texto: "Resolver problemas que involucren sucesiones de números reales, de sumas parciales y de series convergentes." },
      { id: "OA 5", texto: "Resolver problemas del ámbito de las ciencias, haciendo uso de las nociones de límite, derivada e integral." }
    ],
    "Lengua y Literatura": [
      { id: "OA 1", texto: "Formular interpretaciones de obras literarias a partir de su lectura, considerando recursos estilísticos, contexto de producción, ideas relevantes y la relación con otras obras." },
      { id: "OA 2", texto: "Participar activamente en conversaciones, discusiones y debates sobre textos leídos en clases." },
      { id: "OA 3", texto: "Analizar críticamente textos de diversos géneros discursivos no literarios orales, escritos y audiovisuales." },
      { id: "OA 4", texto: "Evaluar los recursos lingüísticos y no lingüísticos (visuales, sonoros y gestuales) al comprender textos." },
      { id: "OA 6", texto: "Producir textos (orales, escritos o audiovisuales) coherentes y cohesionados, para comunicar sus análisis e interpretaciones." },
      { id: "OA 8", texto: "Investigar sobre diversos temas para enriquecer sus lecturas y análisis, o para responder interrogantes." }
    ],
    "Ciencias para la Ciudadanía": [
      { id: "OA 1", texto: "Analizar, a partir de evidencia, situaciones de transmisión de agentes infecciosos a nivel nacional y mundial." },
      { id: "OA 2", texto: "Investigar y argumentar, basándose en evidencias, que existen interacciones entre los sistemas del cuerpo humano." },
      { id: "OA 3", texto: "Evaluar cómo distintos factores (biológicos, ambientales y sociales) afectan la salud de las comunidades." },
      { id: "OA 5", texto: "Investigar y comunicar la importancia de la conservación de la biodiversidad en distintos ecosistemas." },
      { id: "OA 6", texto: "Evaluar y debatir las implicancias bioéticas, sociales, económicas y ambientales de la biotecnología." },
      { id: "OA 7", texto: "Analizar la relación entre los ciclos biogeoquímicos (carbono, nitrógeno y fósforo) y los impactos antrópicos." },
      { id: "OA c", texto: "Evaluar la crisis socioambiental actual (cambio climático, pérdida de biodiversidad, contaminación) y proponer acciones para la sustentabilidad." }
    ],
    "Educación Ciudadana": [
      { id: "OA 1", texto: "Identificar los fundamentos, atributos y dimensiones de la democracia y la ciudadanía, considerando las libertades fundamentales." },
      { id: "OA 2", texto: "Explicar los derechos que la Constitución reconoce a todas las personas y los mecanismos del Estado para garantizar su cumplimiento." },
      { id: "OA 3", texto: "Analizar el rol del Estado en la protección de los derechos de las personas y de los grupos vulnerables." },
      { id: "OA 4", texto: "Evaluar las formas en que la ciudadanía puede incidir en las políticas públicas a nivel local, regional y nacional." },
      { id: "OA 5", texto: "Participar en acciones colaborativas orientadas al bienestar de la comunidad y la solución de problemas sociales." },
      { id: "OA 6", texto: "Evaluar situaciones cotidianas en las que se vean afectados los derechos de las personas y proponer acciones concretas." }
    ],
    "Filosofía": [
      { id: "OA 1", texto: "Formular preguntas filosóficas sobre el sentido de la existencia, la moralidad de las acciones, la naturaleza de la realidad y el conocimiento." },
      { id: "OA 2", texto: "Analizar problemas filosóficos relativos a la ética, la estética, la epistemología y la metafísica." },
      { id: "OA 3", texto: "Dialogar filosóficamente, fundamentando racionalmente sus planteamientos, evaluando argumentos." },
      { id: "OA 4", texto: "Analizar y fundamentar problemas éticos de la actualidad, utilizando conceptos como justicia, bien, responsabilidad, libertad, verdad." },
      { id: "OA 5", texto: "Evaluar visiones y argumentos filosóficos sobre temas como la muerte, el amor, la amistad, la felicidad, el sentido de la vida." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Demostrar comprensión de información explícita e ideas principales en textos orales adaptados y auténticos simples y de creciente complejidad." },
      { id: "OA 5", texto: "Producir textos orales (monólogos y diálogos) para comunicar información, expresar opiniones y narrar experiencias." },
      { id: "OA 9", texto: "Demostrar comprensión de información explícita y de ideas principales en textos literarios y no literarios." },
      { id: "OA 14", texto: "Escribir textos como ensayos, reportes, resúmenes, y textos creativos con el propósito de narrar, describir, opinar y argumentar." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Analizar diversas perspectivas historiográficas sobre cambios recientes en la sociedad chilena y sus impactos a nivel local y nacional." },
      { id: "OA 3", texto: "Investigar sobre la diversidad cultural en el mundo actual y evaluar sus efectos en las sociedades contemporáneas." },
      { id: "OA 5", texto: "Evaluar las consecuencias del proceso de globalización en el medio ambiente, la economía y la cultura." }
    ],
    "Artes": [
      { id: "OA 1", texto: "Crear proyectos visuales, musicales, escénicos, multimediales u otro, basados en la apreciación de manifestaciones estéticas de diversos contextos." },
      { id: "OA 3", texto: "Interpretar obras y manifestaciones artísticas considerando criterios como materialidad, lenguaje artístico y contexto." },
      { id: "OA 5", texto: "Argumentar juicios estéticos sobre diversas manifestaciones artísticas, fundamentándolos con criterios técnicos, expresivos y culturales." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Diseñar y aplicar un plan de entrenamiento personal para mejorar la condición física, considerando sus características y metas personales." },
      { id: "OA 3", texto: "Practicar regularmente actividades físicas y/o deportivas fuera del contexto escolar, planificando su frecuencia, intensidad y duración." },
      { id: "OA 5", texto: "Promover y participar en actividades físicas y/o deportivas inclusivas, demostrando empatía y respeto a la diversidad." }
    ],
    "Orientación": [
      { id: "OA 1", texto: "Elaborar un proyecto de vida, considerando sus características, intereses, motivaciones, habilidades y expectativas personales." },
      { id: "OA 3", texto: "Analizar la influencia de modelos, medios de comunicación y grupos de pertenencia en la toma de decisiones personales." },
      { id: "OA 6", texto: "Practicar en forma autónoma conductas protectoras y de autocuidado en el ámbito de la sexualidad y la afectividad." }
    ]
  },

  // ─────────────────────────────────────────────
  // 4° MEDIO
  // ─────────────────────────────────────────────
  "4° Medio": {
    "Matemática": [
      { id: "OA 1", texto: "Fundamentar decisiones en situaciones de incerteza, a partir del análisis crítico de datos estadísticos y de estudios científicos o sociales." },
      { id: "OA 2", texto: "Resolver problemas que involucren modelos de funciones lineales, cuadráticas, exponenciales o logarítmicas." },
      { id: "OA 3", texto: "Modelar fenómenos o situaciones cotidianas usando la matemática, incluyendo funciones, ecuaciones y probabilidades." },
      { id: "OA 4", texto: "Usar las propiedades de vectores y de la geometría analítica para resolver problemas del ámbito de las ciencias." },
      { id: "OA 5", texto: "Resolver problemas que involucren probabilidad condicional y distribuciones de probabilidad discreta." }
    ],
    "Lengua y Literatura": [
      { id: "OA 1", texto: "Formular interpretaciones de obras literarias que aborden un mismo tema o problema, comparando las visiones de mundo." },
      { id: "OA 2", texto: "Participar activamente en conversaciones, discusiones y debates sobre textos leídos en clases, aportando interpretaciones fundamentadas." },
      { id: "OA 3", texto: "Analizar críticamente textos de diversos géneros discursivos no literarios orales, escritos y audiovisuales." },
      { id: "OA 4", texto: "Evaluar los recursos lingüísticos y no lingüísticos al comprender textos." },
      { id: "OA 6", texto: "Producir textos (orales, escritos o audiovisuales) coherentes y cohesionados, para comunicar sus análisis e interpretaciones." },
      { id: "OA 8", texto: "Investigar sobre diversos temas para enriquecer sus lecturas y producir textos en diferentes formatos." }
    ],
    "Ciencias para la Ciudadanía": [
      { id: "OA 1", texto: "Investigar y analizar las fuentes de energía convencionales y no convencionales que se utilizan en Chile y el mundo." },
      { id: "OA 2", texto: "Evaluar los efectos del uso de la energía nuclear, la fisión y la fusión nuclear, considerando aspectos éticos, sociales y ambientales." },
      { id: "OA 3", texto: "Investigar y evaluar tecnologías actuales y emergentes, considerando sus implicancias éticas y sociales." },
      { id: "OA 5", texto: "Evaluar alcances y limitaciones de la tecnología y la ciencia en la resolución de problemas socioambientales." },
      { id: "OA 7", texto: "Investigar tecnologías que contribuyan al desarrollo sustentable del país (energías renovables, gestión de residuos, agricultura sustentable)." }
    ],
    "Educación Ciudadana": [
      { id: "OA 1", texto: "Analizar la importancia de participar en la vida política y social del país para el fortalecimiento de la democracia." },
      { id: "OA 2", texto: "Evaluar la importancia de los mecanismos de acceso a la justicia y de las instituciones que velan por los derechos de las personas." },
      { id: "OA 3", texto: "Analizar los principios que inspiran los Derechos Humanos y la importancia de la Declaración Universal." },
      { id: "OA 4", texto: "Evaluar el rol de los medios de comunicación y las redes sociales en la participación ciudadana y la deliberación pública." },
      { id: "OA 5", texto: "Participar de forma responsable y constructiva en iniciativas de incidencia ciudadana orientadas al bien común." }
    ],
    "Filosofía": [
      { id: "OA 1", texto: "Formular preguntas filosóficas sobre temas actuales, como la relación entre tecnología y ser humano, la justicia social, los desafíos ambientales." },
      { id: "OA 2", texto: "Analizar y evaluar éticamente problemas contemporáneos, como la desigualdad social, la discriminación, el cambio climático." },
      { id: "OA 3", texto: "Elaborar visiones personales sobre problemas filosóficos, dialogando con las principales tradiciones del pensamiento." },
      { id: "OA 4", texto: "Evaluar acciones y decisiones cotidianas a la luz de conceptos como responsabilidad, autonomía, dignidad humana y bien común." },
      { id: "OA 5", texto: "Investigar y debatir problemas filosóficos vinculados a la existencia, la identidad, la libertad y la trascendencia." }
    ],
    "Inglés": [
      { id: "OA 1", texto: "Demostrar comprensión de ideas principales e información relevante en textos orales adaptados y auténticos de creciente complejidad." },
      { id: "OA 5", texto: "Producir textos orales para comunicar información, expresar opiniones y narrar experiencias, usando vocabulario temático variado." },
      { id: "OA 9", texto: "Demostrar comprensión de información e ideas principales en textos literarios y no literarios de mayor complejidad." },
      { id: "OA 14", texto: "Escribir textos de mediana extensión, como ensayos, reportes y textos creativos, utilizando los pasos del proceso de escritura." }
    ],
    "Historia, Geografía y Ciencias Sociales": [
      { id: "OA 1", texto: "Analizar distintas interpretaciones historiográficas sobre el período de la dictadura militar en Chile y la transición a la democracia." },
      { id: "OA 3", texto: "Investigar los desafíos pendientes de la sociedad chilena: superación de la pobreza, reconocimiento de los pueblos originarios, equidad de género." },
      { id: "OA 5", texto: "Analizar la importancia de la participación ciudadana y las organizaciones de la sociedad civil para el fortalecimiento de la democracia." }
    ],
    "Artes": [
      { id: "OA 1", texto: "Crear proyectos artísticos que integren elementos de diversas disciplinas (artes visuales, música, danza, teatro, medios audiovisuales)." },
      { id: "OA 3", texto: "Interpretar manifestaciones artísticas y culturales, considerando criterios como materialidad, lenguaje artístico y contexto histórico." },
      { id: "OA 5", texto: "Argumentar juicios estéticos sobre diversas manifestaciones artísticas contemporáneas y patrimoniales." }
    ],
    "Educación Física y Salud": [
      { id: "OA 1", texto: "Diseñar y aplicar un plan de entrenamiento personal para mejorar la condición física." },
      { id: "OA 3", texto: "Practicar regularmente actividades físicas y/o deportivas fuera del contexto escolar." },
      { id: "OA 5", texto: "Promover y participar en actividades físicas y/o deportivas inclusivas." }
    ],
    "Orientación": [
      { id: "OA 1", texto: "Evaluar su proyecto de vida a la luz de sus características, intereses, motivaciones y expectativas personales." },
      { id: "OA 3", texto: "Analizar críticamente y evaluar las oportunidades de estudio y/o trabajo que ofrece el medio." },
      { id: "OA 5", texto: "Practicar en forma autónoma conductas protectoras y de autocuidado en distintos ámbitos de la vida." }
    ]
  }
};

import scraperData from './curriculum_scraping_results.json';

const hardcodedNiveles = [
  "1° Básico", "2° Básico", "3° Básico", "4° Básico",
  "5° Básico", "6° Básico", "7° Básico", "8° Básico",
  "1° Medio", "2° Medio"
];

export const NIVELES = scraperData?.educamaxFormat 
  ? Array.from(new Set([...hardcodedNiveles, ...Object.keys(scraperData.educamaxFormat)]))
  : hardcodedNiveles;

export function getAsignaturasPorNivel(nivel) {
  if (scraperData?.educamaxFormat?.[nivel]) {
    return Object.keys(scraperData.educamaxFormat[nivel]);
  }
  return ASIGNATURAS_POR_NIVEL[nivel] || [];
}

export function getBasesCurriculares(nivel, asignatura) {
  if (scraperData?.educamaxFormat?.[nivel]?.[asignatura]) {
    // Si la asignatura tiene bases curriculares (es un objeto y no un array por error antiguo)
    const bases = scraperData.educamaxFormat[nivel][asignatura];
    if (!Array.isArray(bases)) {
      return Object.keys(bases);
    }
  }
  return ["General"]; // Fallback if no bases are found or if using old data
}

export function getObjetivosAprendizaje(nivel, asignatura, baseCurricular = "General") {
  // 1. Primero, intentar extraer desde la base de datos viva del Scraper
  if (scraperData?.educamaxFormat?.[nivel]?.[asignatura]) {
    const asigData = scraperData.educamaxFormat[nivel][asignatura];
    if (!Array.isArray(asigData) && asigData[baseCurricular]) {
      return asigData[baseCurricular]; // New 4-level format
    } else if (Array.isArray(asigData)) {
      return asigData; // Old 3-level format fallback
    }
  }

  // 2. Si el Scraper aún no tiene esa asignatura, usamos la base manual (Fallback)
  if (!OBJETIVOS_APRENDIZAJE[nivel]) return [];
  return OBJETIVOS_APRENDIZAJE[nivel][asignatura] || [];
}
