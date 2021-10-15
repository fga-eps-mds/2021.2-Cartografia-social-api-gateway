import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { TEN_SECONDS } from '../commons/constans';
import { IdResponseModel } from '../responseModels/id';
import { AreaDto } from './dto/area.dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { CreatePointDto } from './dto/createPoint.dto';
import { MediaRelationDto } from './dto/media-relation.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { UpdatePointDto } from './dto/update-point.dto';

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

  @Get('point')
  public async getPoint(@Body('id') id: string): Promise<CreatePointDto> {
    const mapaResponse = await firstValueFrom<CreatePointDto>(
      this.mapaServiceClient.send('getPoint', id),
    );

    return mapaResponse;
  }

  @Put('point')
  public async updatePoint(
    @Body() updatePointDto: UpdatePointDto,
  ): Promise<IdResponseModel> {
    const mapaResponse = await firstValueFrom<IdResponseModel>(
      this.mapaServiceClient.send('updatePoint', updatePointDto),
    );

    return mapaResponse;
  }

  @Delete('point')
  public async deletePoint(@Body('id') id: string): Promise<boolean> {
    await firstValueFrom<CreatePointDto>(
      this.mapaServiceClient.send('deletePoint', id),
    );

    return true;
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

  @Put('area')
  public async updateArea(
    @Body() updateAreaDto: UpdateAreaDto,
  ): Promise<IdResponseModel> {
    const mapaResponse = await firstValueFrom<IdResponseModel>(
      this.mapaServiceClient
        .send('updateArea', updateAreaDto)
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

  @Post('addMediaToPoint')
  public async addMediaToPoint(
    @Body() mediaRelationDto: MediaRelationDto,
  ): Promise<boolean> {
    await firstValueFrom<MediaRelationDto>(
      this.mapaServiceClient
        .send('addMediaToPoint', mediaRelationDto)
        .pipe(timeout(TEN_SECONDS)),
    );
    return true;
  }

  @Delete('removeMediaFromPoint')
  public async removeMediaFromPoint(
    @Body() mediaRelationDto: MediaRelationDto,
  ): Promise<boolean> {
    await firstValueFrom<MediaRelationDto>(
      this.mapaServiceClient
        .send('removeMediaFromPoint', mediaRelationDto)
        .pipe(timeout(TEN_SECONDS)),
    );
    return true;
  }
}
