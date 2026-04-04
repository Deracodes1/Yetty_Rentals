import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './global/transform.interceptor';
import { AllExceptionsFilter } from './global/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enabling global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  const config = new DocumentBuilder()
    .setTitle('Yetty Rental APi')
    .setDescription(
      'THE OFFICIAL DOCUMENTATION FOR YETTY RENTALS: This api powers the equipment rentals/management service.',
    )
    .setVersion('1.0')
    .addTag(
      'Available Endpoints with expected response formats, expected DTOs and Schema structures',
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});

//helper for adding name to my migration file when generating
//npm run migration:generate -- src/db/migrations/TestMigration
// note: replace TestMigration with the name i want to name the file
