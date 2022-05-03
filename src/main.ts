import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorInterceptor } from './commons/interceptors/ExceptionInterceptor';
import { ConfigService } from './config/configuration';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('ejs');

  const port: number = new ConfigService().get('port');

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Documentação da API')
    .setDescription('Projeto Cartografia Social - UnB 2021.1')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new ErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port).then(() => {
    console.log(`Gateway running on port ${port}`);
  });
}
bootstrap();
