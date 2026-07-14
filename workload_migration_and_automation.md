# GreenOps DC: Guía de Orquestación de Cargas y Niveles de Autonomía

Este documento detalla la arquitectura operativa para la migración de cargas de trabajo (Workload Migration) tanto a nivel global (Inter-DC) como local (Intra-DC), y define cómo operan los controles en el Gemelo Digital en producción.

---

## 1. Parámetros en el Gemelo Digital: Demo vs. Producción

Es crucial aclarar al inversionista la diferencia entre los controles manuales de la demostración y la operación real:

* **En la Demostración (SaaS Sandbox):** Los deslizadores (*sliders*) de temperatura exterior, carga de TI y caudal son interactivos para permitir simulaciones hipotéticas (*what-if scenarios*). Permite responder a preguntas como: *"¿Qué pasa con la presión del termosifón si la temperatura exterior sube a 42°C?"*.
* **En Producción Real:** Estos deslizadores **no existen** para el operador, ya que representan la realidad física medida por sensores en tiempo real (RTDs de temperatura, caudalímetros, transductores de presión). 
  * Lo único modificable por el operador humano son los **Setpoints de Consigna** (ej: *"Temperatura máxima de chip permitida: 70°C"*) o el **Modo de Operación** (Manual, Semiautónomo o Autónomo).

---

## 2. Orquestación Inter-DC (Entre Data Centers)

Cuando una empresa opera múltiples nodos geográficos, el sistema implementa una **Orquestación de Cargas basada en Clima y Costos**:

```
                       ┌───────────────────────────────┐
                       │   Orquestador Central de IA   │
                       └───────────────┬───────────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                ▼                      ▼                      ▼
       [Data Center Santiago] [Data Center Patagonia] [Data Center Atacama]
       PUE: 1.25 (Ola de Calor)   PUE: 1.02 (Free Cooling)    PUE: 1.10 (Solar Activo)
       Costo: Alto ($176/MWh)     Costo: Medio ($120/MWh)     Costo: Bajo ($40/MWh)
                │                      │                      │
       [MIGRAR CARGAS DE IA] ────────> [EJECUTAR ENTRENAMIENTO]
```

### ¿Manual o Automático? (Niveles de Autonomía)
Para mitigar el riesgo, la plataforma debe ofrecer **tres políticas de automatización configurables** por el cliente:

1. **Modo Recomendación (Lazo Abierto - Humano en el Bucle):**
   * El sistema detecta una alerta de calor en Santiago que obligará a encender el chiller mecánico. Calcula que migrar el entrenamiento de la red neuronal a la Patagonia ahorrará $5,000 USD.
   * El sistema **no toma la decisión solo**; envía una notificación al Director de TI: *"GreenOps recomienda migrar Carga-04 a Nodo Patagonia. Ahorro estimado: $5,000 USD. ¿Aprobar?"* $\rightarrow$ Requiere clic manual.
2. **Modo Semiautónomo (Reglas Predefinidas):**
   * El operador pre-aprueba ciertas cargas. Por ejemplo, tareas de entrenamiento de IA no críticas (ej: procesamiento de lenguaje en lote para desarrollo) se migran automáticamente sin preguntar, pero las cargas críticas (ej: inferencia en vivo de clientes) se mantienen fijas en su nodo de origen.
3. **Modo Autónomo (Lazo Cerrado):**
   * El optimizador toma el control total de la orquestación mediante algoritmos basados en Kubernetes (K8s). Distribuye las cargas globalmente buscando el menor costo y menor PUE consolidado de la empresa segundo a segundo.

---

## 3. Orquestación Intra-DC (Migración entre Racks del mismo Data Center)

> [!IMPORTANT]
> **Sí, es indispensable incorporar la migración de carga interna.** En la realidad de un data center, la distribución del aire y del flujo de refrigerante nunca es 100% uniforme. Esto genera **Puntos Calientes (Hot Spots)** en racks específicos (comúnmente los más alejados de la Unidad de Distribución de Enfriamiento - CDU).

### Beneficios de la Migración Intra-DC:
1. **Prevención del Throttling (Estrangulamiento Térmico):** Si un rack lleno de GPUs Blackwell está procesando un entrenamiento masivo y sus placas frías están al límite térmico, el sistema puede migrar parte de esas máquinas virtuales a racks vecinos que estén operando más fríos.
2. **Extensión de la Vida Útil del Hardware:** Evita que ciertos chips de silicio operen constantemente a $75^\circ\text{C}$ mientras otros están ociosos a $45^\circ\text{C}$, homogenizando el desgaste.
3. **Optimización del Setpoint Global:** Al eliminar los puntos calientes locales, se puede subir la temperatura general del agua helada del edificio (ej: de $8^\circ\text{C}$ a $12^\circ\text{C}$), lo cual mejora el PUE de todo el data center inmediatamente.
