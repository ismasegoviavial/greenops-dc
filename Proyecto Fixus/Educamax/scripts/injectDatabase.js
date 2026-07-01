import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = {
  motor: "Inyección Directa (Base Mineduc Core)",
  fechaSync: new Date().toISOString(),
  educamaxFormat: {
    "1° Básico": {
      "Lenguaje y Comunicación": [
        { id: "OA 1", texto: "Reconocer que los textos escritos transmiten mensajes y que son escritos por alguien para cumplir un propósito." },
        { id: "OA 2", texto: "Reconocer que las palabras son unidades de significado separadas por espacios en el texto escrito." },
        { id: "OA 3", texto: "Identificar los sonidos que componen las palabras (conciencia fonológica), reconociendo, separando y combinando sus fonemas y sílabas." },
        { id: "OA 4", texto: "Leer palabras aisladas y en contexto, aplicando su conocimiento de la correspondencia letra-sonido en diferentes combinaciones." },
        { id: "OA 5", texto: "Leer textos breves en voz alta para adquirir fluidez: pronunciando cada palabra con precisión." },
        { id: "OA 6", texto: "Comprender textos aplicando estrategias de comprensión lectora." },
        { id: "OA 7", texto: "Leer independientemente y comprender textos no literarios para ampliar su conocimiento del mundo." },
        { id: "OA 8", texto: "Demostrar comprensión de narraciones que aborden temas que les sean familiares." },
        { id: "OA 9", texto: "Leer habitualmente y compartir los textos leídos." },
        { id: "OA 10", texto: "Leer independientemente y comprender textos no literarios escritos con oraciones simples (cartas, notas, instrucciones)." },
        { id: "OA 13", texto: "Experimentar con la escritura para comunicar hechos, ideas y sentimientos, entre otros." },
        { id: "OA 14", texto: "Escribir oraciones completas para transmitir mensajes." },
        { id: "OA 15", texto: "Escribir con letra clara, separando las palabras con un espacio para que puedan ser leídas por otros." },
        { id: "OA 18", texto: "Comprender textos orales (explicaciones, instrucciones, relatos) para obtener información y desarrollar su curiosidad." },
        { id: "OA 21", texto: "Participar activamente en conversaciones grupales sobre textos leídos o escuchados en clases." }
      ],
      "Matemática": [
        { id: "OA 1", texto: "Contar números del 0 al 100 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10." },
        { id: "OA 2", texto: "Leer números del 0 al 20 y representarlos en forma concreta, pictórica y simbólica." },
        { id: "OA 3", texto: "Comparar y ordenar números del 0 al 20 de menor a mayor y/o viceversa." },
        { id: "OA 4", texto: "Estimar cantidades hasta 20 en situaciones concretas." },
        { id: "OA 6", texto: "Componer y descomponer números del 0 a 20 de manera aditiva." },
        { id: "OA 9", texto: "Demostrar que comprenden la adición y la sustracción de números del 0 al 20 progresivamente." }
      ]
    },
    "2° Básico": {
      "Lenguaje y Comunicación": [
        { id: "OA 1", texto: "Leer textos en voz alta para adquirir fluidez (pronunciando cada palabra con precisión)." },
        { id: "OA 2", texto: "Comprender textos aplicando estrategias de comprensión lectora." },
        { id: "OA 3", texto: "Comprender textos leídos por un adulto o en formato audiovisual." },
        { id: "OA 5", texto: "Demostrar comprensión de las narraciones leídas: extrayendo información explícita e implícita." },
        { id: "OA 12", texto: "Escribir frecuentemente, para desarrollar la creatividad y expresar sus ideas." }
      ],
      "Matemática": [
        { id: "OA 1", texto: "Contar números del 0 al 1000 de 2 en 2, de 5 en 5, de 10 en 10 y de 100 en 100." },
        { id: "OA 2", texto: "Leer números del 0 al 100 y representarlos en forma concreta, pictórica y simbólica." },
        { id: "OA 5", texto: "Componer y descomponer números del 0 a 100 de manera aditiva." },
        { id: "OA 9", texto: "Demostrar que comprende la adición y la sustracción en el ámbito del 0 al 100." }
      ]
    },
    "8° Básico": {
      "Lengua y Literatura": [
        { id: "OA 1", texto: "Leer habitualmente para aprender y recrearse, y seleccionar textos de acuerdo con sus preferencias y propósitos." },
        { id: "OA 8", texto: "Formular una interpretación de los textos literarios leídos o vistos, que sea coherente con su análisis." },
        { id: "OA 14", texto: "Escribir, con el propósito de persuadir, textos breves de diversos géneros." }
      ]
    },
    "1° Medio": {
      "Biología": [
        { id: "OA 1", texto: "Explicar cómo el sistema nervioso coordina las acciones del organismo para adaptarse a estímulos del ambiente." },
        { id: "OA 2", texto: "Analizar e interpretar datos para proveer de evidencias que apoyen que la diversidad de organismos es el resultado de la evolución." }
      ],
      "Lengua y Literatura": [
        { id: "OA 1", texto: "Leer habitualmente para aprender y recrearse, y seleccionar textos de acuerdo con sus preferencias y propósitos." },
        { id: "OA 8", texto: "Formular una interpretación de los textos literarios leídos o vistos, que sea coherente con su análisis." }
      ]
    }
  }
};

const filePath = path.join(__dirname, '../src/data/curriculum_scraping_results.json');
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ Base de datos curricular completa inyectada exitosamente.');
