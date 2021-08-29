import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: number = new ConfigService().get('port');

  await app.listen(port).then(() => {
    console.log(`Gateway running on port ${port}`);
  });
}
bootstrap();
