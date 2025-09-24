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

# api-gateway

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Descripción
Microservicio del sistema distribuido, implementado con NestJS y Node.js v20.19.2. Expone endpoints REST con el prefijo global `/api` y sigue arquitectura hexagonal (ports and adapters) para desacoplar la lógica de negocio de las capas de infraestructura.

## Instalación
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno. Crea un archivo `.env` (o copia `.env.example` a `.env`) y define:
  - `NODE_ENV=development` (entorno de ejecución)
  - `PORT=8080` (puerto HTTP del servicio)
  - `KAFKA_BROKERS=localhost:9092` (uno o varios brokers, separados por comas)
  Nota: si usas `docker-compose`, el contenedor recibe `PORT` desde `PORT_API_GATEWAY` y `KAFKA_BROKERS` suele ser `kafka:9092` dentro de la red del stack.
4. Ejecutar en modo desarrollo:
   - Con NestJS:
     ```bash
     npm run start:dev
     ```
   - Con Docker:
     ```bash
     docker build -t api-gateway .
     docker run --env-file .env -p 8080:8080 --name api-gateway api-gateway
     ```
     Nota: el servicio escucha en `PORT` (por defecto 8080). Ajusta el mapeo de puertos si cambias el valor.

## Uso
Los endpoints se exponen automáticamente bajo el prefijo `/api`. Barrido de rutas disponibles en este servicio:
- `/api/counts`
- `/api/webhook/message`

## Arquitectura
Se utiliza arquitectura hexagonal (ports and adapters) para separar la lógica de negocio (casos de uso y puertos de dominio) de las implementaciones de infraestructura (controladores HTTP, adaptadores Kafka, etc.). Esto facilita el testeo, la mantenibilidad y el reemplazo de tecnologías sin afectar el core de negocio.

Ejemplo de estructura (simplificada):

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
- GET: `/api/counts`
- POST: `/api/webhook/message`

## Estructura de carpetas
```plaintext
api-gateway/
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
      ├── config/
      │    └── services.ts
      ├── context/
      │    ├── counts/
      │    │    ├── application/
      │    │    │    ├── dtos/
      │    │    │    │    └── get-counts.dto.ts
      │    │    │    └── use-cases/
      │    │    │         └── get-counts.use-case.ts
      │    │    ├── domain/
      │    │    │    └── ports/
      │    │    │         ├── counts-service.port.ts
      │    │    │         └── tokens.ts
      │    │    └── infrastructure/
      │    │         ├── http-api/
      │    │         │    ├── counts.controller.ts
      │    │         │    └── counts.module.ts
      │    │         └── kafka/
      │    │              └── kafka-counts.service.ts
      │    └── webhook/
      │         ├── application/
      │         │    ├── dtos/
      │         │    │    └── webhook-request.dto.ts
      │         │    └── use-cases/
      │         │         └── process-webhook.use-case.ts
      │         ├── domain/
      │         │    └── ports/
      │         │         ├── tokens.ts
      │         │         └── webhook-processor.port.ts
      │         └── infrastructure/
      │              ├── http-api/
      │              │    ├── webhook.controller.ts
      │              │    └── webhook.module.ts
      │              └── kafka/
      │                   └── kafka-webhook-processor.ts
      └── transports/
           └── transports.module.ts
```

## Autor
Nelson Gallego  
📧 nelsongg2001.dev@gmail.com  
🔗 https://www.linkedin.com/in/nelson-gallego-tec-dev/
