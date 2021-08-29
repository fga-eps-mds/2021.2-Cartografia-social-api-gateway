import { Get, Inject } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('comunidades')
export class ComunidadeController {
  constructor(
    @Inject('COMUNIDADE_SERVICE')
    private readonly comunidadeServiceClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.comunidadeServiceClient.connect();
  }

  @Get()
  public async getComunidadeByToken(): Promise<string> {
    const comunidadeResponse: string = await firstValueFrom(
      this.comunidadeServiceClient.send('findOneComunidade', 30),
    );

    return comunidadeResponse;
  }
}
