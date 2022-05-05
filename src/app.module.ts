import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from './config/configuration';
import { UsersController } from './users/users.controller';
import { ComunidadeController } from './comunidade/comunidade.controller';
import { GatewayController } from './gateway/gateway.controller';
import { MapasController } from './mapas/mapas.controller';
import { MidiaController } from './midia/midia.controller';
import { FirebaseAuth } from './firebase/firebaseAuth';

type MicrosserviceConfig = {
  queueName: string;
  host: string;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.firebase.env'],
      isGlobal: true,
    }),
  ],
  controllers: [
    UsersController,
    ComunidadeController,
    MapasController,
    MidiaController,
    GatewayController,
  ],
  providers: [
    ConfigService,
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions: MicrosserviceConfig =
          configService.get('userService');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [userServiceOptions.host],
            queue: userServiceOptions.queueName,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'COMUNIDADE_SERVICE',
      useFactory: (configService: ConfigService) => {
        const comunidadeServiceOptions: MicrosserviceConfig =
          configService.get('comunidadeService');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [comunidadeServiceOptions.host],
            queue: comunidadeServiceOptions.queueName,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'MAPA_SERVICE',
      useFactory: (configService: ConfigService) => {
        const mapaServiceOptions: MicrosserviceConfig =
          configService.get('mapaService');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [mapaServiceOptions.host],
            queue: mapaServiceOptions.queueName,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'MIDIA_SERVICE',
      useFactory: (configService: ConfigService) => {
        const midiaServiceOptions: MicrosserviceConfig =
          configService.get('midiaService');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [midiaServiceOptions.host],
            queue: midiaServiceOptions.queueName,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'CONFIG',
      useClass: ConfigService,
    },
    {
      provide: FirebaseAuth,
      useClass: FirebaseAuth,
    },
  ],
})
export class AppModule {}
