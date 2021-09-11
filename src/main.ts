import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorInterceptor } from './commons/interceptors/ExceptionInterceptor';
import { ConfigService } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: number = new ConfigService().get('port');

  const config = new DocumentBuilder()
    .setTitle('Documentação da API')
    .setDescription('Projeto Cartografia Social - UnB 2021.1')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new ErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));

  await app.listen(port).then(() => {
    console.log(`Gateway running on port ${port}`);
  });
}
bootstrap();
