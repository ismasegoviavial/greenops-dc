from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Manual de Comandos y Prompts para Agente IA', 0, 1, 'C')
        self.set_font('Arial', 'I', 11)
        self.cell(0, 10, 'Fixus & La Treve - Escalamiento de Negocios', 0, 1, 'C')
        self.ln(10)

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 10, title, 0, 1, 'L', 1)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Arial', '', 11)
        # Use multi_cell for text wrapping
        # Encodings handling: ensure latin-1 compatible characters
        body = body.encode('latin-1', 'replace').decode('latin-1')
        self.multi_cell(0, 7, body)
        self.ln(10)

pdf = PDF()
pdf.add_page()

# Intro
pdf.set_font('Arial', '', 11)
intro = ("Este manual contiene los 'Megaprompts' avanzados disenados especificamente "
         "para que copies y pegues en Discord. Estas instrucciones maximizan el uso "
         "del agente Hermes para ventas B2B, investigacion de mercado y creacion de contenido.")
pdf.multi_cell(0, 7, intro)
pdf.ln(10)

# Section 1
pdf.chapter_title('1. Reporte Gerencial Diario (Automatizado via /schedule)')
body1 = ("> Hermes, haz tu rutina matutina para mis dos empresas:\n\n"
         "Parte 1 (La Treve): Usa el entorno en chile_furniture_scrapers y ejecuta "
         "bigquery_pricing_engine.py para analizar precios de competencia. Luego ejecuta "
         "pinterest_trend_analyzer.py para evaluar tendencias globales.\n\n"
         "Parte 2 (Fixus): Usa el entorno en fixus_ltda_website/venv y ejecuta "
         "fixus_research_agent.py buscando oportunidades en 'Retail y Logistica'.\n\n"
         "Parte 3 (Reporte): Haz un resumen de 4 parrafos separando los descubrimientos. "
         "Ve a la carpeta de La Treve, usa internal_reporter.py y enviame ese resumen "
         "a mi correo con el asunto 'Reporte Diario - Fixus & La Treve'.")
pdf.chapter_body(body1)

# Section 2
pdf.chapter_title('2. Prospeccion B2B y Cierre de Ventas (Fixus)')
body2 = ("> Hermes, usa el entorno de python en fixus_ltda_website/venv. "
         "Ejecuta b2b_lead_gen.py para buscar el rol 'Gerente de Sustentabilidad' en la "
         "industria 'Mineria'. Tomando esa lista, ejecuta fixus_research_agent.py para 'Mineria' "
         "y genera una propuesta. Finalmente, usa email_closer.py para enviarle esa propuesta "
         "a los correos encontrados desde la cuenta de Fixus.")
pdf.chapter_body(body2)

# Section 3
pdf.chapter_title('3. Estrategia de Marketing SEO Autonoma (La Treve)')
body3 = ("> Hermes, usa el entorno en chile_furniture_scrapers. Primero, "
         "ejecuta pinterest_trend_analyzer.py para ver que mueble es tendencia hoy. "
         "Segundo, usa wordpress_seo_bot.py pasandole como parametro la tendencia "
         "que encontraste para crear y publicar un articulo de blog.\n\n"
         "NOTA: Si quieres revisar el articulo antes de que se publique, puedes agregar: "
         "'Pero no lo publiques todavia, damelo para que yo lo lea primero'.")
pdf.chapter_body(body3)

# Section 4
pdf.chapter_title('4. Monitoreo Activo de Competencia (La Treve)')
body4 = ("> Hermes, usa chile_furniture_scrapers y ejecuta bigquery_pricing_engine.py. "
         "Necesito que analices estrictamente la tabla de BoConcept y Area Design. "
         "Dime si lanzaron algun producto nuevo esta semana o si bajaron el precio "
         "de sus sofas. Extrae las alertas y damelas en formato de viñetas.")
pdf.chapter_body(body4)

# Output
pdf.output('Manual_Prompts_Gerenciales.pdf')
print("PDF generado exitosamente.")
