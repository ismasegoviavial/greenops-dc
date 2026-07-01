import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const START_URL = 'https://www.curriculumnacional.cl/curriculum';
const OUTPUT_FILE = path.join(__dirname, '../src/data/curriculum_scraping_results.json');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function runScraper() {
  console.log('🤖 Iniciando el Scraper Definitivo del Mineduc (Base Oficial)...');
  console.log('⚠️ Este proceso simula clics humanos profundos. Tardará bastante.');

  let curriculumData = {
    motor: "Puppeteer Mineduc Oficial",
    fechaSync: new Date().toISOString(),
    educamaxFormat: {}
  };
  
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      const backup = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      if (backup.educamaxFormat) {
        curriculumData.educamaxFormat = backup.educamaxFormat;
        console.log('📦 Archivo previo detectado. Actualizando sobre base existente.');
      }
    } catch(e) { }
  }

  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  let page = await browser.newPage();
  page.setDefaultNavigationTimeout(120000); 

  try {
    console.log(`🌍 Explorando el laberinto principal: ${START_URL}`);
    await page.goto(START_URL, { waitUntil: 'networkidle2' });
    
    // Obtener los niveles del primer select
    const nivelesInfo = await page.evaluate(() => {
      const s = document.querySelectorAll('select')[0];
      if (!s) return [];
      return Array.from(s.options)
        .map(opt => ({ value: opt.value, text: opt.innerText.trim() }))
        .filter(opt => opt.value !== '_none' && !opt.text.toLowerCase().includes('seleccionar'));
    });

    console.log(`📚 Encontrados ${nivelesInfo.length} Niveles/Ciclos. Iniciando escaneo total...`);

    for (const nivel of nivelesInfo) {
      console.log(`\n▶️ Procesando Nivel: ${nivel.text}`);
      if (!curriculumData.educamaxFormat[nivel.text]) {
        curriculumData.educamaxFormat[nivel.text] = {};
      }

      // El Mineduc resetea el segundo select, mejor ir calculando las asignaturas
      // Para saber qué asignaturas hay, seleccionamos el nivel
      await page.goto(START_URL, { waitUntil: 'networkidle2' });
      await page.evaluate((val) => {
        const s = document.querySelectorAll('select')[0];
        s.value = val;
        s.dispatchEvent(new Event('change'));
      }, nivel.value);
      
      await delay(3000); // Esperar que Vue.js cargue el segundo select

      const asignaturasInfo = await page.evaluate(() => {
        const s = document.querySelectorAll('select')[1];
        if (!s) return [];
        return Array.from(s.options)
          .filter(opt => opt.value !== '_none' && !opt.text.toLowerCase().includes('seleccione'))
          .map(opt => {
            let asig = opt.text.trim();
            let base = 'General';
            if (opt.parentElement && opt.parentElement.tagName === 'OPTGROUP') {
               asig = opt.parentElement.label.trim();
               base = opt.text.trim();
            }
            return { value: opt.value, asig: asig, base: base };
          });
      });

      console.log(`   🔸 Encontradas ${asignaturasInfo.length} Bases Curriculares.`);

      for (const asignatura of asignaturasInfo) {
        console.log(`      - Buscando OAs en: ${asignatura.asig} -> ${asignatura.base}`);
        
        // Volvemos a empezar la navegación limpia por cada asignatura
        await page.goto(START_URL, { waitUntil: 'networkidle2' });
        
        // 1. Seleccionar Nivel
        await page.evaluate((val) => {
          const s = document.querySelectorAll('select')[0];
          s.value = val;
          s.dispatchEvent(new Event('change'));
        }, nivel.value);
        
        await delay(2000);

        // 2. Seleccionar Asignatura
        await page.evaluate((val) => {
          const s = document.querySelectorAll('select')[1];
          s.value = val;
          s.dispatchEvent(new Event('change'));
        }, asignatura.value);
        
        await delay(1500);

        // 3. Hacer clic en Buscar y esperar a que cargue la página de resultados
        try {
            await Promise.all([
              page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 45000 }),
              page.evaluate(() => {
                const btn = document.querySelector('input[value="Buscar"]');
                if (btn) btn.click();
              })
            ]);
        } catch(e) {
            console.log(`        ⚠️ Error de red al navegar, reintentando... recuperando navegador.`);
            // Para evitar el error de Detached Frame, cerramos y abrimos una nueva pestaña
            await page.close();
            page = await browser.newPage();
            page.setDefaultNavigationTimeout(120000); 
            continue;
        }

        await delay(2000);

        // Extraer los OAs de la página de resultados
        const oas = await page.evaluate(() => {
           const resultados = [];
           const bodyText = document.body.innerText;
           
           // Dividimos todo el texto de la página por las palabras clave
           const parts = bodyText.split(/Objetivo de aprendizaje|Aprendizaje esperado/i);
           
           for (let i = 1; i < parts.length; i++) {
             const lines = parts[i].trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
             
             // Si tiene al menos 3 líneas, la estructura suele ser: ID, ID repetido, Texto descriptivo
             if (lines.length >= 3) {
                // Buscamos si la primera línea parece un ID (ej: FG-ARTE-3y4-OAC-01 o OA 05 o AE 01)
                const idMatch = lines[0].match(/([A-Z0-9]+-[A-Z0-9]+-\d+[a-z]?\d*-[A-Z0-9]+-\d+|OA\s*\d+|OAT\s*\d+|AE\s*\d+|OAH\s*[a-z]+|OAA\s*[a-z]+)/i);
                
                if (idMatch) {
                   const id = idMatch[0];
                   // El texto suele estar en lines[2] porque lines[1] repite el ID
                   let descripcion = lines[2];
                   
                   // Si lines[2] es "Ver actividades", entonces la descripcion estaba en lines[1]
                   if (descripcion.toLowerCase().includes('ver actividades')) {
                      descripcion = lines[1] !== id ? lines[1] : '';
                   }
                   
                   if (descripcion.length > 20) {
                      resultados.push({ id, texto: descripcion });
                   }
                }
             }
           }
           
           // Eliminar duplicados
           const unicos = [];
           const map = new Set();
           for (const item of resultados) {
             if (!map.has(item.texto)) {
               map.add(item.texto);
               unicos.push(item);
             }
           }
           return unicos;
        });

        if (!curriculumData.educamaxFormat[nivel.text][asignatura.asig]) {
          curriculumData.educamaxFormat[nivel.text][asignatura.asig] = {};
        }
        curriculumData.educamaxFormat[nivel.text][asignatura.asig][asignatura.base] = oas;
        console.log(`        ✅ ${oas.length} OAs extraídos (Guardados).`);
        
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(curriculumData, null, 2));
      }
    }

    console.log(`\n🎉 Extracción Completada. Base de datos actualizada.`);
  } catch (error) {
    console.error('❌ Error crítico:', error.message);
  } finally {
    await browser.close();
  }
}

runScraper();
