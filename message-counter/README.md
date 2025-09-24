<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


# message-counter

## Descripción
Microservicio del sistema distribuido, implementado con NestJS y Node.js v20.19.2. Este servicio consume y produce eventos en Kafka para procesar mensajes y calcular conteos por hora/día, persistiendo y consultando datos en Redis. Sigue arquitectura hexagonal (ports and adapters) para desacoplar la lógica de negocio de las capas de infraestructura.

## Instalación
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno. Crea un archivo `.env` (o copia `.env.example` a `.env`) y define:
   - `NODE_ENV=development` (entorno de ejecución)
   - `KAFKA_BROKERS=localhost:9092` (uno o varios brokers, separados por comas)
   - `REDIS_HOST=localhost` (host de Redis)
   - `REDIS_PORT=6379` (puerto de Redis)
   - Opcional equivalente: `REDIS_URL=redis://localhost:6379` (si se define, tiene prioridad)
   Nota: en `docker-compose`, el servicio recibe `NODE_ENV=${ENVIRONMENT}`, `REDIS_HOST=redis`, `REDIS_PORT=6379` y `KAFKA_BROKERS=kafka:9092` dentro de la red del stack.
4. Ejecutar en modo desarrollo:
   - Con NestJS (microservicio Kafka):
     ```bash
     npm run start:dev
     ```
   - Con Docker:
     ```bash
     docker build -t message-counter .
     # Este servicio no expone HTTP; el mapeo de puertos no es necesario
     docker run --env-file .env --name message-counter message-counter
     ```

## Uso
Este servicio no expone endpoints HTTP REST; funciona como microservicio de mensajería (Kafka). Sus “endpoints” son patrones de mensajes/temas:
- Kafka topic `new-message`: recibe eventos de nuevos mensajes para procesamiento y conteo.
- Kafka topic `get-counts`: atiende solicitudes de conteos por rango horario y responde con los datos agregados.

## Arquitectura
Se utiliza arquitectura hexagonal (ports and adapters) para separar la lógica de negocio (casos de uso, puertos de dominio) de las implementaciones de infraestructura (Kafka controllers/adapters, Redis, etc.). Esto permite testear, mantener y sustituir tecnologías sin afectar el core.

Ejemplo simplificado de estructura:

```plaintext
src/
 ├── application/
 ├── domain/
 ├── infrastructure/
 │    ├── controllers/
 │    ├── adapters/
 │    └── config/
 └── main.ts
```

## Endpoints
- Microservices (Kafka):
  - `@MessagePattern('new-message')` → procesa mensajes entrantes y actualiza conteos en Redis.
  - `@MessagePattern('get-counts')` → devuelve conteos por hora para un rango `[from, to]` por `account_id`.

## Estructura de carpetas
```plaintext
message-counter/
 ├── .gitignore
 ├── .prettierrc
 ├── Dockerfile
 ├── eslint.config.mjs
 ├── nest-cli.json
 ├── package.json
 ├── README.md
 ├── tsconfig.build.json
 ├── tsconfig.json
 └── src/
      ├── app.module.ts
      ├── main.ts
      └── context/
           └── messages/
                ├── application/
                │    ├── dtos/
                │    │    ├── get-hourly-counts-range.dto.ts
                │    │    ├── post-daily-total.dto.ts
                │    │    └── process-message.dto.ts
                │    └── use-cases/
                │         ├── get-hourly-counts-range.use-case.ts
                │         ├── post-daily-total-use-case.ts
                │         └── process-message.use-case.ts
                ├── domain/
                │    ├── entities/
                │    │    └── message.entity.ts
                │    ├── exceptions/
                │    │    ├── duplicate-message.exception.ts
                │    │    └── message-processing.exception.ts
                │    ├── ports/
                │    │    ├── daily-publisher-external.port.ts
                │    │    └── redis.port.ts
                │    ├── repositories/
                │    │    └── counts.repository.ts
                │    └── value-objects/
                │         ├── account-id.vo.ts
                │         └── message-id.vo.ts
                ├── infrastructure/
                │    ├── adapter/
                │    │    └── daily-publisher-external.adapter.ts
                │    ├── config/
                │    │    └── services.ts
                │    ├── kafka/
                │    │    ├── kafka.controller.ts
                │    │    ├── kafka.event.dto.ts
                │    │    └── kafka.module.ts
                │    ├── redis/
                │    │    ├── redis.adapter.ts
                │    │    ├── redis.connection.ts
                │    │    └── redis.module.ts
                │    ├── repositories/
                │    │    └── redis-counts.repository.ts
                │    └── transports/
                │         └── transports.module.ts
                └── shared/
                     └── utils/
                          └── kafka-offset.utils.ts
```

## Autor
Nelson Gallego  
📧 nelsongg2001.dev@gmail.com  
🔗 https://www.linkedin.com/in/nelson-gallego-tec-dev/
