import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('midias')
export class MidiaController {
  constructor(
    @Inject('MIDIA_SERVICE') private readonly midiaServiceClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.midiaServiceClient.connect();
  }
}
