import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Vamos mudar a porta para 3000 para não conflitar com nosso outro serviço
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Payment service is running on: hjttp://localhost:3000`);
}
bootstrap();
