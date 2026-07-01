import fs from 'fs';

async function generateText(systemPrompt, userPrompt) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer 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`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini', // use one of the models
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });
  const data = await res.json();
  if (!data.choices) {
    console.error("API Error:", data);
    return "";
  }
  return data.choices[0].message.content;
}

const system = `Eres un diseñador instruccional experto.
Devuelves EXCLUSIVAMENTE código JSON válido. NO uses bloques Markdown como \`\`\`json. Solo el array JSON puro.
El JSON debe ser un array de objetos "bloque" para construir una infografía vertical.
Tipos de bloque soportados:
- "header": Título gigante y subtítulo. Atributos: type, title, subtitle, theme.
- "content-image": Texto explicativo y un prompt para generar una imagen. Atributos: type, title, content (array de strings cortos), imagePrompt (en INGLÉS, descriptivo), theme.
- "stats": Un dato numérico destacado. Atributos: type, title, stat (ej. "85%"), content (string), icon (emoji).
- "list": Una lista de puntos clave. Atributos: type, title, items (array de strings), icon (emoji).
- "footer": Conclusión. Atributos: type, content (string).

Asegúrate de que haya flujo lógico y variedad visual (alterna temas: 'primary', 'accent', 'light', 'dark').`;

const user = `Crea la estructura JSON para una infografía:
- Tema: el ciclo del agua
- Asignatura: ciencias
- Nivel: basico
- Objetivo: aprender
- Estilo de imágenes: moderno
- Instrucciones: Ninguna

Devuelve solo el array JSON con 5 a 7 bloques.`;

async function run() {
  const text = await generateText(system, user);
  fs.writeFileSync('raw_llm_output.txt', text);
  console.log("Written to raw_llm_output.txt");
}

run();
