import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false, // Permite propiedades no definidas en el DTO
      forbidNonWhitelisted: false, // No rechaza propiedades no definidas
    }),
  );

  // Configurar prefijo global para todos los endpoints
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 8080);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch((err) => console.error('Bootstrap error:', err));
