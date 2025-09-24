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



# daily-total-service

## Descripción
Microservicio del sistema distribuido, implementado con NestJS y Node.js v20.19.2. Consume eventos de Kafka sobre totales diarios y notifica a un servicio externo (mock) los cambios agregados. Sigue arquitectura hexagonal (ports and adapters) para desacoplar la lógica de negocio de las capas de infraestructura.

## Instalación
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno. Crea un archivo `.env` (o copia `.env.example` a `.env`) y define:
   - `NODE_ENV=development` (entorno de ejecución)
   - `KAFKA_BROKERS=localhost:9092` (uno o varios brokers, separados por comas)
   - `EXTERNAL_API_URL=http://localhost:3005/daily-total` (endpoint del servicio externo para notificaciones)
   - `PROCESSING_DELAY_MS=0` (opcional; delay artificial para observar offsets/lag)
   Nota: en `docker-compose`, el contenedor recibe `NODE_ENV=${ENVIRONMENT}`, `EXTERNAL_API_URL=${EXTERNAL_API_URL}`, `KAFKA_BROKERS=kafka:9092` y `PROCESSING_DELAY_MS=1000` por defecto.
4. Ejecutar en modo desarrollo:
   - Con NestJS (microservicio + HTTP de salud):
     ```bash
     npm run start:dev
     ```
   - Con Docker:
     ```bash
     docker build -t daily-total-service .
     docker run --env-file .env -p 3001:3001 --name daily-total-service daily-total-service
     ```

## Uso
Este servicio expone:
- Microservicios (Kafka):
  - Topic `daily-total-updated`: consume eventos de totales diarios y ejecuta el caso de uso `process-daily-total` con commit de offset manual.
- HTTP: expone un servidor en `:3001` (no define endpoints REST públicos en el código actual; se usa para salud/logs de arranque).

## Arquitectura
Se utilizó arquitectura hexagonal (ports and adapters) para separar la lógica de negocio (casos de uso y puertos de dominio) de las implementaciones (controlador Kafka, adaptador HTTP externo, etc.). Esto permite sustituir tecnologías sin afectar el core.

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
  - `@MessagePattern('daily-total-updated')` → procesa eventos y notifica a la API externa.
- HTTP: no hay endpoints REST declarados en este servicio.

## Estructura de carpetas
```plaintext
daily-total-service/
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
           └── daily-totals/
                ├── application/
                │    ├── dtos/
                │    │    └── daily-total-event.dto.ts
                │    └── use-cases/
                │         └── process-daily-total.use-case.ts
                ├── domain/
                │    └── ports/
                │         └── external-notifier.port.ts
                ├── infrastructure/
                │    ├── external-api/
                │    │    └── external-notifier.adapter.ts
                │    └── kafka/
                │         ├── kafka.controller.ts
                │         └── kafka.module.ts
                └── shared/
                     └── utils/
                          └── kafka-offset.utils.ts
```

## Autor
Nelson Gallego  
📧 nelsongg2001.dev@gmail.com  
🔗 https://www.linkedin.com/in/nelson-gallego-tec-dev/
