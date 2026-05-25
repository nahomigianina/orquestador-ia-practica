# Práctica Unidad 4: El Servidor como Orquestador de IA

---

## PARTE 1: Investigación y Preparación (Teoría)

### 1. Diferencia técnica: API de Base de Datos vs. API de IA (Gemini)
* **API de Base de Datos:** Las peticiones suelen ser deterministas, estructuradas (operaciones CRUD) y de respuesta inmediata en milisegundos. El servidor actúa validando formatos rígidos antes de guardar o consultar registros exactos.
* **API de IA (como Gemini):** Las peticiones manejan datos no estructurados (lenguaje natural, imágenes, audio). El tiempo de respuesta es variable y considerablemente más alto (latencia por procesamiento del modelo). La lógica del servidor cambia de validar formatos exactos a orquestar flujos: "sanitizar" prompts, manejar respuestas en streaming (por partes), controlar la temperatura del modelo y gestionar el contexto conversacional.

### 2. Seguridad: Vulnerabilidad de exponer API Keys en el Frontend
Si una API Key de Gemini se coloca en el código del Frontend (HTML/JavaScript del navegador), cualquier usuario puede abrir la consola de desarrollador (F12) o inspeccionar el tráfico de red para robarla. 
* **Consecuencias:** Uso no autorizado que puede inflar facturas de costos, agotamiento de las cuotas del servicio, y bloqueo de acceso para la aplicación legítima.
* **El rol del Backend:** El Servidor actúa como un "escudo intermedio". El frontend le envía la información al backend, y el backend (cuyo código es privado y corre en un entorno seguro) adjunta de forma oculta la API Key guardada en variables de entorno para comunicarse con Google de manera segura.

### 3. Herramientas: ¿Qué es Google AI Studio y para qué sirve?
**Google AI Studio** es un entorno de desarrollo basado en web que permite a los desarrolladores prototipar y experimentar rápidamente con los modelos de la familia Gemini.
* **¿Para qué sirve?:** Sirve para diseñar y probar prompts (instrucciones de sistema), ajustar parámetros como la temperatura o límites de seguridad, y verificar las respuestas del modelo sin escribir código inicialmente. Una vez que el prompt funciona como se desea, AI Studio permite exportar directamente el código equivalente en lenguajes como JavaScript (Node.js), Python, o cURL para integrarlo de golpe en nuestro backend.


## Análisis Cloud (Unidad 5)

### 1. Tipos de Servicio (5.2)
* **PaaS (Plataforma como Servicio):** Utilizada mediante **Vercel**. Actúa como el entorno de producción que administra de manera automática la infraestructura subyacente (servidores, redes, sistemas operativos), permitiéndonos desplegar el backend serverless y el frontend sin gestionar configuraciones de servidor básicas.
* **SaaS (Software como Servicio) / API:** Correspondiente al consumo de la **API de Gemini (Google AI Studio)**. Consumimos un software completamente funcional y optimizado a través de endpoints, abstrayendo por completo el entrenamiento del modelo de lenguaje.

### 2. Estándares e Interoperabilidad (5.4)
La comunicación bidireccional entre el cliente, nuestro servidor orquestador y la API de Google se realiza bajo el estándar **JSON (JavaScript Object Notation)**. Es el formato ideal de interoperabilidad debido a su ligereza, legibilidad tanto para humanos como para máquinas, y su estructura nativa de clave-valor que permite un intercambio estructurado de objetos a través del protocolo HTTP.

### 3. Seguridad en la Nube (5.6)
Las credenciales de acceso (**API Keys**) actúan como firmas de acceso críticas y de cobro potencial. Si se suben a repositorios públicos como GitHub, se exponen a filtraciones y vulnerabilidades. Para evitarlo, se implementan **Variables de Entorno (.env)**, aislando los datos sensibles del código fuente. En producción (PaaS), estas variables se inyectan cifradas directamente desde el panel de administración del entorno de despliegue, manteniéndose ocultas y seguras.