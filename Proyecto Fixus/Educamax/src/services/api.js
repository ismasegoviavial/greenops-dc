// Servicio de IA: OpenRouter (DeepSeek) + fal.ai (FLUX)
import { fal } from '@fal-ai/client';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const FAL_API_KEY = import.meta.env.VITE_FAL_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

fal.config({ credentials: FAL_API_KEY });

// ── Generación de texto via OpenRouter con Fallback Automático ──
export async function generateText(systemPrompt, userPrompt, jsonMode = false) {
  const FALLBACK_MODELS = [
    'deepseek/deepseek-chat:free',          // Intento 1: DeepSeek (gratis si está disponible)
    'openai/gpt-4o-mini',                   // Intento 2: GPT-4o-mini (muy barato/rápido)
    'meta-llama/llama-3-8b-instruct:free',  // Intento 3: Llama 3 (gratis)
  ];

  let lastError = null;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const bodyPayload = {
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      };

      // Si se requiere JSON mode, agregamos el flag soportado por OpenAI/OpenRouter
      if (jsonMode) {
        bodyPayload.response_format = { type: 'json_object' };
      }

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://educamax-creator.web.app',
          'X-Title': 'Educamax Creator',
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status} con el modelo ${modelName}`);
      }

      const data = await res.json();
      if (!data.choices || !data.choices[0]) {
        throw new Error(`Respuesta vacía del modelo ${modelName}`);
      }

      console.log(`✅ Éxito usando el modelo: ${modelName}`);
      return data.choices[0].message.content;

    } catch (err) {
      console.warn(`⚠️ Falló ${modelName}, intentando el siguiente... Error:`, err.message);
      lastError = err;
      // Continúa con el siguiente modelo en el array
    }
  }

  // Si todos fallan, lanzamos el último error
  throw new Error(`Todos los motores de IA fallaron. Último error: ${lastError?.message}`);
}

// ── Generación de evaluación (Agentic Workflow) ──
export async function generateEvaluacion({
  asignatura, nivel, tema, objetivos, indicadores, textoBase, tipoPreguntas, cantidad, dificultad, instrucciones, distribucion
}, onProgress = () => {}) {
  const systemCreator = `Eres un experto en diseño de evaluaciones educativas para el sistema escolar chileno. 
Generas el borrador inicial de evaluaciones. Siempre respondes en español con formato Markdown estructurado.`;

  let distribucionTexto = '';
  if (distribucion) {
    distribucionTexto = `\n- Distribución exacta de las ${cantidad} preguntas:` +
      Object.entries(distribucion)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => `\n  - ${count} de ${type.replace('_', ' ')}`)
        .join('');
  }

  let materialTexto = '';
  if (textoBase) {
    materialTexto = `\n\n--- MATERIAL DE APOYO ---\nUsa EXCLUSIVAMENTE la información del siguiente texto para formular las preguntas:\n\n${textoBase}\n--- FIN DEL MATERIAL DE APOYO ---\n`;
  }

  const promptCreator = `Genera un borrador de evaluación con estas características:
- Asignatura: ${asignatura}
- Nivel: ${nivel}
- Tema: ${tema}
- Objetivos de Aprendizaje: ${objetivos || 'Alinear al currículum nacional'}
- Tipo de preguntas: ${tipoPreguntas}
- Cantidad TOTAL: ${cantidad} ${distribucionTexto}
- Dificultad: ${dificultad}
${instrucciones ? `- Instrucciones adicionales: ${instrucciones}` : ''}
${materialTexto}

Incluye encabezado, objetivo, las preguntas numeradas y la pauta de corrección al final. Formato Markdown.`;

  onProgress("Agente Creador: Redactando borrador inicial...");
  const borrador = await generateText(systemCreator, promptCreator);

  // Paso 2: Agente Revisor UTP
  const systemRevisor = `Eres el Jefe de UTP (Unidad Técnico Pedagógica). Eres el agente encargado del Control de Calidad.
Tu trabajo es revisar la evaluación que acaba de crear otro profesor y ser crítico.
Evalúa: 
1. ¿Están las preguntas alienadas a la Taxonomía de Bloom esperada para la dificultad (${dificultad})?
2. ¿Se cumple el nivel de exigencia escolar de Chile para ${nivel}?
3. ¿Hay errores conceptuales?
Devuelve un breve listado de CRÍTICAS (qué está mal o es muy básico) y CÓMO MEJORARLO. Si la prueba es perfecta, responde "Aprobada sin cambios".`;

  onProgress("Agente Revisor UTP: Evaluando Taxonomía de Bloom y Alineación Curricular...");
  const criticas = await generateText(systemRevisor, `Evalúa críticamente este borrador:\n\n${borrador}`);

  // Paso 3: Agente Corrector (Final)
  if (criticas.includes("Aprobada sin cambios") || criticas.toLowerCase().includes("aprobada sin cambios")) {
    onProgress("Agente Revisor UTP: Prueba aprobada. Finalizando...");
    return borrador;
  }

  const systemCorrector = `Eres un experto diseñador de evaluaciones. Tu trabajo es tomar un borrador y aplicar ESTRICTAMENTE las mejoras exigidas por el Jefe de UTP. Devuelve SOLO la prueba final corregida en Markdown limpio (sin conversar).`;
  
  const promptCorrector = `Borrador original:
${borrador}

Críticas y exigencias de UTP:
${criticas}

Por favor, reescribe la prueba completa aplicando estas mejoras. Asegúrate de incluir el encabezado, las preguntas y la pauta de corrección al final.`;

  onProgress("Agente Corrector: Aplicando mejoras pedagógicas y generando versión final...");
  const pruebaFinal = await generateText(systemCorrector, promptCorrector);

  // Paso 4: Agente D.U.A. (Diferenciación Inclusiva Automática)
  onProgress("Agente D.U.A: Generando adecuación curricular (PIE)...");
  const systemPIE = `Eres un Educador Diferencial experto en el Programa de Integración Escolar (PIE) de Chile.
Tu tarea es tomar una evaluación estándar y adaptarla (Adecuación Curricular Significativa o No Significativa según corresponda) para estudiantes con Necesidades Educativas Especiales (NEE).
Instrucciones obligatorias:
1. Simplifica el lenguaje y las instrucciones, pero MANTÉN EL MISMO CONTENIDO DE FONDO.
2. Reduce la complejidad visual (ej: viñetas claras).
3. Si hay preguntas de alternativas, reduce de 4 a 3 opciones descartando la más distractora.
4. Incluye apoyos explícitos (ej. "Recuerda que la mitocondria da energía") o descriptores visuales si aplica.
5. Devuelve SOLO la prueba adaptada en formato Markdown.`;

  const pruebaPIE = await generateText(systemPIE, `Por favor adapta esta evaluación para estudiantes PIE:\n\n${pruebaFinal}`);

  onProgress("Evaluación y Adecuación PIE completadas con éxito.");
  return {
    formaA: pruebaFinal,
    formaB: pruebaPIE
  };
}

// ── Iteración Guiada (Refinador IA) ──
export async function refinarDocumento(documentoActual, instruccion) {
  const system = `Eres un asistente experto en edición de material educativo.
Se te entregará un documento Markdown (como una evaluación, rúbrica o planificación) y una instrucción específica de un profesor sobre qué cambiar.
Tu tarea es reescribir TODO EL DOCUMENTO aplicando la instrucción solicitada. 
Mantén el formato Markdown, encabezados y estructura general (a menos que la instrucción pida cambiar la estructura). 
No agregues comentarios conversacionales, devuelve SOLO el documento modificado.`;

  const user = `DOCUMENTO ACTUAL:
${documentoActual}

INSTRUCCIÓN DE EDICIÓN:
${instruccion}

Por favor, reescribe el documento aplicando esta instrucción.`;

  return generateText(system, user);
}


// ── Generación de Rúbricas e Instrumentos de Evaluación ──
export async function generateRubrica({
  instrumento, pregunta, puntaje, criterios, nivel, asignatura, objetivos
}) {
  const system = `Eres un experto evaluador educativo del sistema escolar chileno. Creas instrumentos de evaluación (rúbricas, listas de cotejo o escalas de valoración) detallados, precisos y alineados al currículo nacional. Respondes en español con formato Markdown estructurado usando tablas.`;

  const user = `Diseña un instrumento de evaluación con las siguientes características:
- Tipo de instrumento: ${instrumento}
- Asignatura: ${asignatura || 'General'}
- Nivel/Curso: ${nivel || 'General'}
${objetivos ? `- Objetivo de Aprendizaje (Mineduc): ${objetivos}\n` : ''}- Pregunta o Actividad a evaluar: ${pregunta}
- Puntaje total asignado: ${puntaje} puntos
${criterios ? `- Criterios a incluir: ${criterios}\n` : ''}
Por favor, incluye:
1. Título principal del instrumento
2. Una breve descripción de cómo usar este instrumento.
3. Una tabla clara y detallada con los criterios, descriptores de desempeño (niveles) y puntajes que sumen exactamente los ${puntaje} puntos totales.
4. Si es rúbrica, pon los niveles en las columnas y los criterios en las filas.
5. Formato Markdown limpio.`;

  return generateText(system, user);
}

// ── Generación de Planificaciones ──
export async function generatePlanificacion({
  tipoPlan, nivel, asignatura, objetivos, tema, actitudes, duracion
}) {
  const system = `Eres un experto en currículum y pedagogía escolar chilena. Diseñas planificaciones de clases (Inicio, Desarrollo y Cierre) altamente efectivas, estructuradas y alineadas estrictamente al Currículum Nacional vigente. Respondes en español con formato Markdown limpio.`;

  const user = `Crea una planificación de clases con las siguientes características:
- Tipo de Planificación: ${tipoPlan}
- Duración: ${duracion}
- Nivel/Curso: ${nivel}
- Asignatura: ${asignatura || 'General'}
${objetivos ? `- Objetivo de Aprendizaje (Mineduc): ${objetivos}\n` : ''}- Tema o Foco de la clase: ${tema}
${actitudes ? `- Actitudes / OAT: ${actitudes}\n` : ''}
La planificación debe incluir:
1. Encabezado completo con la información de la clase.
2. Objetivo de la clase (redactado integrando Habilidad + Contenido + Actitud).
3. **Inicio (Motivación y conocimientos previos)**: Detalla la actividad, el rol del docente, el rol del alumno y el tiempo estimado.
4. **Desarrollo (Actividad central)**: Detalla los pasos, la actividad del estudiante, estrategias docentes y tiempo estimado.
5. **Cierre (Síntesis)**: Detalla cómo se cierra la clase y qué mecanismo de evaluación formativa (ej. ticket de salida) se utilizará, con tiempo estimado.
6. Sugerencia breve de recursos o materiales necesarios.

Entrégalo en formato Markdown, usando negritas, listas y viñetas para que la lectura sea fácil para el profesor.`;

  return generateText(system, user);
}

// ── Generación de imagen gratuita con Pollinations.ai (Temporal) ──
export async function generateImage({ prompt, style, aspectRatio = '1:1' }) {
  const fullPrompt = `Educational illustration, ${style} style, ${prompt}. High quality, suitable for classroom use, clear and engaging, professional educational content, infographic illustration`;
  
  let width = 1024;
  let height = 1024;
  
  if (aspectRatio === '16:9') {
    width = 1792;
    height = 1024;
  } else if (aspectRatio === '9:16') {
    width = 1024;
    height = 1792;
  }
  
  // Usamos pollinations.ai que es 100% gratis temporalmente
  const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&nologo=true&enhance=true`;
  
  return imgUrl;
}
