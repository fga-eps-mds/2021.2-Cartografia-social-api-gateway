import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('mapas')
export class MapasController {
  constructor(
    @Inject('MAPA_SERVICE') private readonly mapaServiceClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.mapaServiceClient.connect();
  }

  @Get()
  public async getMapaByToken(): Promise<string> {
    const mapaResponse: string = await firstValueFrom(
      this.mapaServiceClient.send('findOneMapa', 30),
    );

    return mapaResponse;
  }
}
