# GreenOps DC: Estrategia de Adquisición del Primer Cliente Piloto (GTM)

Este documento detalla el plan de desarrollo de negocios (Business Development) para asegurar el primer cliente piloto (Proof of Concept - PoC) de GreenOps DC en el mercado chileno.

---

## 1. ¿A quién ir a buscar? (Empresas Target en Chile)

Los grandes operadores internacionales (como Equinix, Google o AWS) tienen políticas corporativas globales extremadamente burocráticas que hacen que venderles un piloto tome de 12 a 18 meses. Por lo tanto, el foco inicial debe ser **operadores locales o regionales medianos y centros de supercómputo**:

### Grupo A: Operadores de Telecomunicaciones y Colocation Locales (Decisión Local)
* **GTD (Grupo GTD):**
  * *Por qué:* Tienen data centers modernos de tamaño medio (Santiago Lidia, Puerto Montt). Su toma de decisiones es local (Chile) y tienen un historial de apoyar la innovación tecnológica nacional.
* **Entel (Data Centers de Ciudad de los Valles):**
  * *Por qué:* Poseen infraestructura de gran escala certificada Tier III, con metas corporativas de sostenibilidad y eficiencia muy agresivas.
* **KIO Networks Chile / Odata:**
  * *Por qué:* Operadores medianos y ágiles que compiten activamente con gigantes globales y buscan ventajas competitivas rápidas en eficiencia (PUE).

### Grupo B: Data Centers Académicos e Investigación (Baja Fricción de Entrada)
* **NLHPC (National Laboratory for High-Performance Computing - U. de Chile):**
  * *Por qué:* Aloja el supercomputador más potente de Chile (*Guacolda-Leftraru*). Los supercomputadores generan densidades térmicas altísimas (similares a los clusters de IA) y sus costos de energía son críticos. Al ser una entidad académica y estatal, son sumamente abiertos a colaborar en proyectos piloto de I+D nacional.

---

## 2. ¿Con quién hablar? (Los Cargos Clave / Buyer Personas)

En la venta corporativa de infraestructura, debes dirigir el mensaje a tres perfiles específicos dentro de la organización del cliente:

```
                  ┌──────────────────────────────────────────────┐
                  │          Director de Operaciones / TI        │
                  │   (Le interesa el Uptime y reducir OPEX)     │
                  └──────┬────────────────────────────────┬──────┘
                         │                                │
  ┌──────────────────────▼───────┐                ┌───────▼──────────────────────┐
  │      Facility Manager        │                │   Director de Sostenibilidad │
  │ (Le interesan los Chillers/  │                │   (Le interesan los reportes │
  │     temperatura de racks)    │                │       Scope 2 y ESG)         │
  └──────────────────────────────┘                └──────────────────────────────┘
```

1. **Director de Operaciones / Infraestructura (El Decisor):**
   * *Su dolor:* Es el responsable de que el data center no se apague y de controlar el presupuesto eléctrico (OPEX). 
   * *El gancho:* "Te ayudamos a reducir la factura eléctrica de enfriamiento hasta en un 30%".
2. **Facility Manager / Ingeniero de Climatización (El Evaluador Técnico):**
   * *Su dolor:* Monitorea los chillers, bombas y temperaturas de pasillo diariamente. Teme que un software externo dañe sus máquinas.
   * *El gancho:* "Nuestra IA actúa como un copiloto de recomendación. Los guardrails por hardware protegen tus equipos con prioridad absoluta".
3. **Gerente de Sustentabilidad / ESG (Tu Aliado Interno):**
   * *Su dolor:* Debe generar los reportes de reducción de emisiones de carbono anuales para la junta directiva y reguladores.
   * *El gancho:* "Automatizamos al 100% la auditoría Scope 2 bajo GHG Protocol, entregándote reportes listos para auditorías externas".

---

## 3. ¿Cómo estructurar el Pitch del Piloto? (Estrategia "Riesgo Cero")

Un operador de data center nunca aceptará que controles sus equipos en la primera reunión. El secreto para cerrar el trato es la **Estrategia de Piloto Pasivo de 3 Meses**:

### El Discurso de Venta (Script de Acercamiento):
> *"No queremos controlar tu data center, ni modificar tus setpoints de climatización hoy. Queremos ofrecerte un **Piloto de Diagnóstico Gratuito por 3 meses**. 
>
> Instalaremos nuestro equipo Edge PC en modo **'Solo Lectura' (Passive Mode)**. Nos conectamos de forma aislada a los sensores y te entregaremos dos cosas sin costo:
> 1. Un mapa térmico 3D de tus racks para detectar 'puntos calientes' que causan ineficiencia.
> 2. Un reporte auditado de emisiones de carbono Scope 2 para tu área de sustentabilidad.
> 
> Al final de los 3 meses, te mostraremos en un informe financiero cuánto dinero exacto habrías ahorrado en electricidad si hubieras activado nuestro control autónomo."*

---

## 4. Canales de Acceso (¿Cómo llegar a ellos?)

Para conseguir la reunión con los directores, utiliza los siguientes canales:

1. **Networking de RMES Analytics (Alianza Estratégica):**
   * El CEO de RMES Analytics ya le vende software de optimización de activos a las grandes corporaciones y mineras (quienes a su vez son clientes o dueños de grandes data centers). Pídele una introducción en frío (*warm intro*) con los directores de infraestructura.
2. **Asociación Chilena de Empresas de Tecnologías de Información (ACTI) / Chiletec:**
   * Participa en los comités de Smart Cities, IoT y Sostenibilidad de estas asociaciones para hacer networking directo con los C-Levels.
3. **LinkedIn Outreach Directo:**
   * Mensajes cortos y ultra-personalizados al Director de Operaciones enfocados en: *PUE, eficiencia de refrigeración de alta densidad para IA y reporte Scope 2*.
