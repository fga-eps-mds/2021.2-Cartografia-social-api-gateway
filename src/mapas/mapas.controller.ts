import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { IdResponseModel } from 'src/responseModels/id';
import { CreatePointDto } from './dto/createPoint.dto';

@ApiTags('maps')
@Controller('maps')
export class MapasController {
  constructor(
    @Inject('MAPA_SERVICE') private readonly mapaServiceClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.mapaServiceClient.connect();
  }

  @Post('point')
  public async createPoint(
    @Body() createPointDto: CreatePointDto,
  ): Promise<IdResponseModel> {
    const mapaResponse = await firstValueFrom<IdResponseModel>(
      this.mapaServiceClient.send('createPoint', createPointDto),
    );

    return mapaResponse;
  }
}
