from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        # Header banner
        self.set_fill_color(24, 90, 157) # Steel blue
        self.rect(0, 0, 210, 15, 'F')
        
        self.ln(10)
        self.set_text_color(24, 90, 157)
        self.set_font('Arial', 'B', 13)
        self.cell(0, 10, 'Manual Completo: Google Cloud Lab ARC110', 0, 1, 'C')
        self.set_font('Arial', 'I', 9)
        self.set_text_color(100, 100, 100)
        self.cell(0, 5, 'Create a Streaming Data Lake on Cloud Storage', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f'Pagina {self.page_no()}', 0, 0, 'C')

    def chapter_title(self, num, title):
        self.set_font('Arial', 'B', 11)
        self.set_text_color(24, 90, 157)
        self.set_fill_color(230, 240, 255)
        self.cell(0, 8, f'{num}. {title}', 0, 1, 'L', 1)
        self.ln(2)

    def method_header(self, title):
        self.set_font('Arial', 'B', 12)
        self.set_text_color(255, 255, 255)
        self.set_fill_color(24, 90, 157)
        self.cell(0, 10, title, 0, 1, 'C', 1)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Arial', '', 9.5)
        self.set_text_color(50, 50, 50)
        body = body.encode('latin-1', 'replace').decode('latin-1')
        self.multi_cell(0, 5, body)
        self.ln(3)
        
    def code_block(self, code):
        self.set_font('Courier', '', 9)
        self.set_text_color(30, 30, 30)
        self.set_fill_color(245, 245, 245)
        code = code.encode('latin-1', 'replace').decode('latin-1')
        self.multi_cell(0, 4.5, code, 1, 'L', 1)
        self.ln(3)

pdf = PDF()
pdf.add_page()

# Introduction
intro_text = (
    "Este manual contiene las instrucciones detalladas para realizar el laboratorio de desafio ARC110 "
    "(Create a Streaming Data Lake on Cloud Storage). Se presentan dos alternativas para resolverlo:\n\n"
    "- METODO A: Ejecucion rapida mediante la terminal de comandos (Cloud Shell).\n"
    "- METODO B: Paso a paso visual utilizando la Consola Web de Google Cloud (Sin comandos).\n\n"
    "El laboratorio tiene politicas restrictivas (constraints/gcp.resourceLocations) que impiden crear recursos "
    "en la region por defecto del laboratorio (us-east4). Por lo tanto, usaremos la region 'us-west1' para todos "
    "los recursos (Bucket, App Engine, Scheduler y Dataflow), la cual esta totalmente permitida por la politica."
)
pdf.set_font('Arial', '', 10)
pdf.set_text_color(50, 50, 50)
pdf.multi_cell(0, 6, intro_text.encode('latin-1', 'replace').decode('latin-1'))
pdf.ln(5)

# --- METODO A ---
pdf.method_header('METODO A: USANDO CLOUD SHELL (CON COMANDOS)')

# Paso A1
pdf.chapter_title('A.1', 'Configurar las Variables de Entorno')
pdf.chapter_body(
    "Abre Cloud Shell y ejecuta los siguientes comandos para definir las variables. Reemplaza los valores "
    "si tu laboratorio te asigna parametros especificos en las instrucciones:"
)
code_a1 = (
    "export TOPIC_ID=mypubsub\n"
    "export MESSAGE=\"Hello!\"\n"
    "export REGION=us-west1\n"
    "export PROJECT_ID=$(gcloud config get-value project)\n"
    "export BUCKET_NAME=\"${PROJECT_ID}-bucket\""
)
pdf.code_block(code_a1)

# Paso A2
pdf.chapter_title('A.2', 'Habilitar APIs de Google Cloud')
pdf.chapter_body(
    "Establece la region y activa las APIs de Dataflow y Cloud Scheduler. Es recomendable deshabilitar "
    "e iniciar nuevamente el servicio de Dataflow para asegurar su correcto estado de activacion."
)
code_a2 = (
    "gcloud config set compute/region $REGION\n\n"
    "gcloud services disable dataflow.googleapis.com --force\n"
    "gcloud services enable dataflow.googleapis.com cloudscheduler.googleapis.com"
)
pdf.code_block(code_a2)

# Paso A3
pdf.chapter_title('A.3', 'Crear Bucket y Topic de Pub/Sub')
pdf.chapter_body("Crea el bucket de Storage (Data Lake) y el Topic de Pub/Sub:")
code_a3 = (
    "gsutil mb -l $REGION gs://$BUCKET_NAME\n"
    "gcloud pubsub topics create $TOPIC_ID"
)
pdf.code_block(code_a3)

# Paso A4
pdf.chapter_title('A.4', 'Crear App Engine y Cloud Scheduler Job en us-west1')
pdf.chapter_body(
    "Crea la aplicacion de App Engine en 'us-west1' (requerida por el Scheduler) y luego inicializa "
    "el scheduler job para publicar en el topic de Pub/Sub cada minuto:"
)
code_a4 = (
    "gcloud app create --region=us-west1\n\n"
    "gcloud scheduler jobs create pubsub publisher-job \\\n"
    "    --schedule=\"* * * * *\" \\\n"
    "    --topic=$TOPIC_ID \\\n"
    "    --message-body=\"$MESSAGE\" \\\n"
    "    --location=us-west1"
)
pdf.code_block(code_a4)

# Paso A5
pdf.chapter_title('A.5', 'Forzar Ejecucion del Scheduler Job')
pdf.chapter_body("Ejecuta manualmente el job en un bucle hasta que se ejecute exitosamente:")
code_a5 = (
    "echo \"Ejecutando Cloud Scheduler...\"\n"
    "while true; do\n"
    "    if gcloud scheduler jobs run publisher-job --location=\"us-west1\"; then\n"
    "        echo \"Job ejecutado!\"\n"
    "        break\n"
    "    fi\n"
    "    sleep 5\n"
    "done"
)
pdf.code_block(code_a5)

# Paso A6
pdf.chapter_title('A.6', 'Iniciar Job de Dataflow')
pdf.chapter_body("Inicia el pipeline de streaming con la plantilla de Pub/Sub a Cloud Storage:")
code_a6 = (
    "gcloud dataflow jobs run streaming-lake-job \\\n"
    "    --gcs-location=gs://dataflow-templates/latest/Cloud_PubSub_to_GCS_Text \\\n"
    "    --region=$REGION \\\n"
    "    --worker-zone=us-west1-a \\\n"
    "    --staging-location=gs://$BUCKET_NAME/tmp \\\n"
    "    --parameters inputTopic=projects/$PROJECT_ID/topics/$TOPIC_ID,outputDirectory=gs://$BUCKET_NAME/temp/,outputFilenamePrefix=output"
)
pdf.code_block(code_a6)

# Next Page for Method B
pdf.add_page()
pdf.method_header('METODO B: USANDO LA INTERFAZ WEB (SIN COMANDOS)')

# Paso B1
pdf.chapter_title('B.1', 'Habilitar las APIs en la Consola Web')
pdf.chapter_body(
    "1. Ve al menu de navegacion (tres lineas horizontales arriba a la izquierda) y selecciona API y Servicios > Biblioteca.\n"
    "2. Busca 'Dataflow API', haz clic sobre ella y presiona el boton Habilitar.\n"
    "3. Regresa a la Biblioteca, busca 'Cloud Scheduler API' y haz clic en Habilitar."
)

# Paso B2
pdf.chapter_title('B.2', 'Crear el Bucket de Storage (Data Lake)')
pdf.chapter_body(
    "1. En el menu de navegacion, selecciona Cloud Storage > Buckets.\n"
    "2. Haz clic en Crear en la parte superior.\n"
    "3. En Nombre de tu bucket, ingresa: '[ID_DE_TU_PROYECTO]-bucket' (ej: 'qwiklabs-gcp-03-be9cf5ea332d-bucket').\n"
    "4. En Tipo de Ubicacion, selecciona Regional e ingresa 'us-west1'.\n"
    "5. Deja todas las demas opciones por defecto y haz clic en el boton Crear. Confirma si aparece una advertencia de seguridad."
)

# Paso B3
pdf.chapter_title('B.3', 'Crear el Topic de Pub/Sub')
pdf.chapter_body(
    "1. Navega a Pub/Sub > Topics en el menu lateral.\n"
    "2. Haz clic en Crear Topic en la barra superior.\n"
    "3. En ID del topic, ingresa: 'mypubsub'.\n"
    "4. Asegurate de que la casilla 'Agregar una suscripcion predeterminada' este seleccionada y haz clic en Crear."
)

# Paso B4
pdf.chapter_title('B.4', 'Crear la Aplicacion de App Engine')
pdf.chapter_body(
    "1. Ve a App Engine en el menu lateral de la consola.\n"
    "2. Si se te solicita, haz clic en el boton Crear aplicacion.\n"
    "3. En Region, selecciona 'us-west1' (Oregon) para cumplir con las politicas de la organizacion. IMPORTANTE: No elijas la region del lab si esta bloqueada.\n"
    "4. Selecciona un lenguaje (por ejemplo, Python) en la configuracion inicial y finaliza la creacion."
)

# Paso B5
pdf.chapter_title('B.5', 'Crear y Lanzar el Cloud Scheduler Job')
pdf.chapter_body(
    "1. Navega a Cloud Scheduler en el menu lateral.\n"
    "2. Haz clic en Crear trabajo.\n"
    "3. Llena la informacion basica:\n"
    "   - Nombre: 'publisher-job'\n"
    "   - Region: selecciona 'us-west1'\n"
    "   - Frecuencia: escribe '* * * * *' (para que corra cada minuto)\n"
    "   - Zona horaria: selecciona UTC\n"
    "4. Configura el Destino:\n"
    "   - Tipo de destino: selecciona 'Pub/Sub'\n"
    "   - Tema (Topic): busca y selecciona el topic creado en el Paso B.3 (mypubsub)\n"
    "   - Cuerpo del mensaje: escribe 'Hello!'\n"
    "5. Haz clic en Crear.\n"
    "6. Una vez creado, selecciona el trabajo en la lista y haz clic en el boton Forzar Ejecucion (Force Run). Esto enviara el primer mensaje al topic de inmediato."
)

# Paso B6
pdf.chapter_title('B.6', 'Configurar y Desplegar el Job de Dataflow')
pdf.chapter_body(
    "1. Selecciona Dataflow > Jobs en el menu lateral de navegacion.\n"
    "2. Haz clic en Crear Job a partir de plantilla (Create job from template) en la barra superior.\n"
    "3. Rellena los campos con la siguiente informacion:\n"
    "   - Nombre del job: 'streaming-lake-job'\n"
    "   - Endpoint regional: selecciona 'us-west1'\n"
    "   - Plantilla de Dataflow: selecciona la plantilla 'Pub/Sub Topic to Text Files on Cloud Storage' (dentro del grupo de Process Data Continuously / Streaming).\n"
    "4. Configura los parametros requeridos en el formulario:\n"
    "   - Input Pub/Sub topic: ingresa 'projects/[ID_DE_TU_PROYECTO]/topics/mypubsub'\n"
    "   - Output directory in Cloud Storage: ingresa 'gs://[ID_DE_TU_PROYECTO]-bucket/temp/' (asegurate de terminar con barra '/')\n"
    "   - Output filename prefix: ingresa 'output'\n"
    "   - Staging/Temporary directory: ingresa 'gs://[ID_DE_TU_PROYECTO]-bucket/tmp/'\n"
    "5. Despliega el job haciendo clic en Ejecutar Job (Run Job). El pipeline tardara 2-3 minutos en arrancar los recursos virtuales."
)

pdf.output('Guia_Paso_a_Paso_ARC110.pdf')
print("PDF creado exitosamente con ambos metodos.")
