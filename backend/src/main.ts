import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// 1. IMPORTAR SWAGGER 👇
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 2. CONFIGURACIÓN DE SWAGGER 👇
  const config = new DocumentBuilder()
    .setTitle('Phoenix ERP API')
    .setDescription('Documentación de la API para el sistema Phoenix ERP')
    .setVersion('1.0')
    .addTag('companies', 'Gestión de Empresas') // Opcional: Tags para ordenar
    .addTag('branches', 'Gestión de Sucursales')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Aquí le decimos: "Monta la documentación en la ruta /api"
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
