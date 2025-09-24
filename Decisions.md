# Decisions

## 1. Cómo diseñé la solución (estructura, modelo de datos, endpoints)
- Solución reutilizable, escalable y fácil de mantener, implementada en NestJS con microservicios.
- Arquitectura hexagonal (puertos y adaptadores) siguiendo buenas prácticas.
- Redis como base de datos por velocidad y simplicidad.
- Kafka como message broker por estabilidad, alto throughput y manejo de offset manual.
- API Gateway para centralizar y direccionar requests.
- Datos en Redis con claves jerárquicas separadas por dos puntos (:).
- Topics en Redis:
  - hourly: hash con horas y cantidad de mensajes. Referencia: ![hourly](docs/hourly_example.png)
  - daily: string con total de mensajes diarios. Referencia: ![daily](docs/daily_example.png)
  - messages: SET para messageId y evitar duplicados. Referencia: ![messages](docs/messages_example.png)
- Endpoints REST y microservicios con validaciones en campos críticos.

## 2. Cómo aseguré idempotencia y consistencia
- Idempotencia: SET en Redis con messageId para que cada mensaje se cuente solo una vez.
- Consistencia: Kafka con offset manual y confirmación en el microservicio para asegurar entrega completa.

## 3. Supuestos y mejoras futuras
- Supuestos: manejo de alto volumen de requests, unicidad de messageId, microservicios necesarios para procesamiento correcto.
- Mejoras: manejo centralizado de errores, respuestas de API con payload estructurado.

## 4. Uso de IA
- IA usada para explicaciones y guías de diseño, resolviendo dudas.
- Copilot usado para desarrollo rápido con sugerencias estructuradas.