import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { TEN_SECONDS } from '../commons/constans';
import { IdResponseModel } from '../responseModels/id';
import { AreaDto } from './dto/area.dto';
import { CreateAreaDto } from './dto/create-area.dto';
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

  @Post('area')
  public async createArea(
    @Body() createAreaDto: CreateAreaDto,
  ): Promise<IdResponseModel> {
    const mapaResponse = await firstValueFrom<IdResponseModel>(
      this.mapaServiceClient
        .send('createArea', createAreaDto)
        .pipe(timeout(TEN_SECONDS)),
    );

    return mapaResponse;
  }

  @Get('area/:id')
  public async getArea(@Param('id') id: string): Promise<AreaDto> {
    return await firstValueFrom<AreaDto>(
      this.mapaServiceClient.send('getArea', id).pipe(timeout(TEN_SECONDS)),
    );
  }

  @Delete('area/:id')
  public async deleteArea(@Param('id') id: string): Promise<boolean> {
    await firstValueFrom<AreaDto>(
      this.mapaServiceClient.send('deleteArea', id).pipe(timeout(TEN_SECONDS)),
    );
    return true;
  }
}
