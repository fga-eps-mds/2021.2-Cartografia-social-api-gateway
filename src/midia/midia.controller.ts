import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('midias')
export class MidiaController {
  constructor(
    @Inject('MIDIA_SERVICE') private readonly midiaServiceClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.midiaServiceClient.connect();
  }

  @Get()
  public async getMidiaByToken(): Promise<string> {
    const midiaResponse: string = await firstValueFrom(
      this.midiaServiceClient.send('findOneMidia', 30),
    );

    return midiaResponse;
  }
}
