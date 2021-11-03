import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './error-logger/errorHandler';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  // app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(PORT, () =>
    console.log(`Server listening at http://localhost:${PORT}`),
  );
}
bootstrap();
