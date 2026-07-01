const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/curriculum_scraping_results.json', 'utf8'));

const mappings = {
  'Artes': ['Artes visuales, audiovisuales y multimediales', 'Creación y composición musical', 'Diseño y arquitectura', 'Interpretación musical', 'Interpretación y creación en danza', 'Interpretación y creación en teatro'],
  'Ciencias': ['Biología celular y molecular', 'Biología de los ecosistemas', 'Ciencias de la salud', 'Física', 'Química'],
  'Educación física y salud': ['Ciencias del ejercicio físico y deportivo', 'Expresión corporal', 'Promoción de estilos de vida activos y saludables'],
  'Filosofía': ['Estética', 'Filosofía política', 'Seminario de filosofía'],
  'Historia, geografía y ciencias sociales': ['Comprensión histórica del presente', 'Economía y sociedad', 'Geografía, territorio y desafíos socioambientales'],
  'Lengua y literatura': ['Lectura y escritura especializadas', 'Participación y argumentación en democracia', 'Taller de literatura'],
  'Matemática': ['Geometría 3D', 'Límites, derivadas e integrales', 'Pensamiento computacional y programación', 'Probabilidades y estadística descriptiva e inferencial']
};

for (const nivel of Object.keys(data.educamaxFormat)) {
  if (nivel.includes('3° Medio') || nivel.includes('4° Medio')) {
    const asigs = data.educamaxFormat[nivel];
    const newAsigs = {};

    for (const [key, val] of Object.entries(asigs)) {
      // Si ya estaba en el formato nuevo (ej. { "General": [...] }), hay que manejarlo
      const isAlreadyFormatted = !Array.isArray(val);
      const items = isAlreadyFormatted ? val['General'] : val;

      let isMapped = false;
      for (const [parent, children] of Object.entries(mappings)) {
        if (children.includes(key)) {
          if (!newAsigs[parent]) newAsigs[parent] = {};
          newAsigs[parent][key] = items;
          isMapped = true;
          break;
        }
      }
      
      if (!isMapped) {
        if (!newAsigs[key]) newAsigs[key] = {};
        // Conservar las keys existentes si ya era objeto, si no, crear 'General'
        if (isAlreadyFormatted) {
           newAsigs[key] = val;
        } else {
           newAsigs[key]['General'] = items;
        }
      }
    }
    
    data.educamaxFormat[nivel] = newAsigs;
  } else {
    // Para 1ro a 2do medio y basica, transformar todo a objeto { General: [] } si no lo estaba
    const asigs = data.educamaxFormat[nivel];
    const newAsigs = {};
    for (const [key, val] of Object.entries(asigs)) {
       if (Array.isArray(val)) {
           newAsigs[key] = { 'General': val };
       } else {
           newAsigs[key] = val;
       }
    }
    data.educamaxFormat[nivel] = newAsigs;
  }
}

fs.writeFileSync('./src/data/curriculum_scraping_results.json', JSON.stringify(data, null, 2));
console.log('JSON refactored successfully.');
