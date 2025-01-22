import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('SaveEat API')
    .setDescription('API for SaveEat app to reduce food waste')
    .setVersion('1.0')
    .addBearerAuth() // If you're using JWT Authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // The Swagger UI will be available at /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
