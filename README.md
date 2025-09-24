# Message Counter

## Descripción
El ecosistema actual está conformado por microservicios que intercambian eventos en tiempo real. Dentro de este entorno se requiere un servicio que procese los mensajes entrantes, los agrupe y contabilice en intervalos de tiempo definidos. Este servicio debe exponer la información resultante para que pueda ser consumida tanto por sistemas internos como externos, facilitando el análisis, la integración y la toma de decisiones dentro del ecosistema.

Está implementado con **NestJS**, **Node.js v20.19.2**, **Docker**, **Kafka**, **Redis**, y otras tecnologías descritas en los README de cada servicio y en el `docker-compose`. El sistema expone endpoints HTTP y “endpoints” de microservicios (topics/patrones de mensajes). Sigue arquitectura hexagonal (ports and adapters) para desacoplar la lógica de negocio de la infraestructura.

## Instalación
1. Clonar el repositorio.
2. Copiar el archivo `.env.example` a `.env`, configurando las siguientes variables de entorno:

	```
	ENVIRONMENT=development
	PORT_API_GATEWAY=8080
	EXTERNAL_API_URL=http://external-api:3005/daily-total
	```

	Este archivo `.env` debe crearse en la raíz del proyecto. Las variables usadas por `docker-compose` pueden ajustarse si hay problemas de conexión (por ejemplo puertos, hosts de Kafka/Redis, etc.).

3. Levantar el proyecto con Docker Compose:
	```bash
	docker-compose up --build
	```

	⚠️ Nota: Durante el inicio puede aparecer un error como el siguiente (mientras Kafka y los microservicios establecen conexión):

	```
	kafka-message-counter-daily-total-service-dev  | [Nest] 29  - 09/24/2025, 11:12:28 AM   ERROR [ServerKafka] ERROR [Connection] Response GroupCoordinator(key: 10, version: 2) {"timestamp":"2025-09-24T11:12:28.430Z","logger":"kafkajs","broker":"kafka:9092","clientId":"daily-total-service-server","error":"The group coordinator is not available","correlationId":4,"size":55}
	```

	Este error es esperado inicialmente y se resuelve cuando Kafka y los consumidores/productores quedan listos.

## Uso
Resumen del flujo:
- El API Gateway expone endpoints HTTP para recibir webhooks y consultar conteos.
- Los eventos se publican/consumen vía Kafka por los microservicios.
- Los conteos por hora se almacenan/leen desde Redis y se publican totales diarios para consumo externo.

Endpoints HTTP (API Gateway):
- GET `/api/counts`
- POST `/api/webhook/message`

Detalles de endpoints (API Gateway):
- GET `http://localhost:8080/api/counts`
	- Body (JSON):
		```json
		{
			"account_id": "acc_54321",
			"from": "2025-09-19T00:00:00Z",
			"to": "2025-09-19T23:59:00Z"
		}
		```
	- Validaciones: `account_id`, `from` y `to` son cadenas no vacías.

- POST `http://localhost:8080/api/webhook/message`
	- Body (JSON):
		```json
		{
			"message_id": "msg_1234ASDdF",
			"account_id": "acc_12345",
			"created_at": "2025-09-29T21:13:17Z",
			"metadata": {
				"channel": "whatsapp",
				"source": "inbound",
				"tags": ["camp:septiembre", "mx"]
			}
		}
		```
	- Validaciones: `message_id` y `account_id` son cadenas no vacías; `created_at` debe ser fecha en formato ISO8601. Se aceptan propiedades extra (metadata u otros) que serán reenviadas a Kafka.

Nota de validación global: el servicio utiliza `ValidationPipe` de NestJS para transformar y validar los DTOs de entrada.

Microservicios (Kafka topics/patrones):
- `new-message`: eventos de nuevos mensajes (producidos por API Gateway, consumidos por Message Counter).
- `get-counts`: solicitudes de conteos por rango (producidas por API Gateway, respondidas por Message Counter).
- `daily-total-updated`: eventos de totales diarios (producidos por Message Counter, consumidos por Daily Total Service).

La información detallada está en los README individuales de cada servicio.

## Arquitectura
Se utilizó arquitectura hexagonal (ports and adapters) para separar la lógica de negocio (casos de uso y puertos) de las implementaciones (controladores HTTP, adaptadores Kafka, Redis, APIs externas). Esto mejora mantenibilidad, pruebas y reemplazo de tecnologías.

Diagrama de flujo (texto):

```
[ Cliente ] 
	 ↓
[ API Gateway ] → procesa la solicitud → [ Message Counter ]
	 ↓                                ↘ guarda en base de datos
	responde                          ↘ emite notificación → [ Daily Total Service ]
```

## Estructura de carpetas
- `api-gateway/`: Servicio HTTP (NestJS) que recibe webhooks y expone conteos vía `/api`. Publica/consulta datos a través de Kafka.
- `message-counter/`: Microservicio (NestJS) Kafka-only. Procesa `new-message`, responde `get-counts`, persiste y consulta Redis y publica `daily-total-updated`.
- `daily-total-service/`: Microservicio (NestJS) que consume `daily-total-updated` y notifica a un servicio externo (mock) por HTTP.
- `loadtest/`: Scripts y configuración para generar carga/pruebas.
- `docker-compose.yml`: Orquestación local de los servicios (Kafka, Zookeeper, Redis y microservicios).

## Monitoreo y herramientas extra
- Algunos servicios en el `docker-compose` están comentados porque sirven para monitoreo u otros propósitos adicionales.
- Kafka UI (opcional): http://localhost:8090
- Redis Commander (opcional): http://localhost:8083

## Pruebas de carga
Una vez que todos los servicios estén arriba con Docker Compose, puedes ejecutar la prueba de carga desde la carpeta `loadtest`:

```bash
cd loadtest
docker compose up --build
# o
docker-compose up --build
```

También tienes scripts de ayuda:
- Limpiar el entorno de load test (elimina contenedores/volúmenes del compose de `loadtest`):
	```bash
	bash loadtest/clean_loadtest.sh
	```
- Levantar el proceso de load test:
	```bash
	bash loadtest/run_loadtest.sh
	```

## Autor
Nelson Gallego  
📧 nelsongg2001.dev@gmail.com  
🔗 https://www.linkedin.com/in/nelson-gallego-tec-dev/

