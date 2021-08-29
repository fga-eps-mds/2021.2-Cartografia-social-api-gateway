import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from './config/configuration';
import { UsersController } from './users/users.controller';

type MicrosserviceConfig = {
  queueName: string;
  host: string;
};

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UsersController],
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
  ],
})
export class AppModule {}
