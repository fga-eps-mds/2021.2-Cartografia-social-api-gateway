import {
  Query,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { Auth } from '../commons/decorators/auth.decorator';
import { CommunityDto } from 'src/comunidade/dto/community.dto';
import { TEN_SECONDS } from '../commons/constans';
import { IdResponseModel } from '../responseModels/id';
import { AreaDto } from './dto/area.dto';
import { CommunityMapDataDto } from './dto/communityMapData.dto';
import { CommunityOperationDto } from './dto/communityOperation.dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { CreatePointDto } from './dto/createPoint.dto';
import { MediaRelationDto } from './dto/media-relation.dto';
import { PointDto } from './dto/point.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { MediaRelationWithUrlDto } from './dto/media-relation-with-url.dto';

@ApiTags('maps')
@Controller('maps')
export class MapasController {
  constructor(
    @Inject('MAPA_SERVICE') private readonly mapaServiceClient: ClientProxy,
    @Inject('COMUNIDADE_SERVICE')
    private readonly comunidadeServiceClient: ClientProxy,
    @Inject('MIDIA_SERVICE') private readonly midiaServiceClient: ClientProxy,
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
  public async getPoint(@Query('id') id: string): Promise<PointDto> {
    const mapaResponse = await firstValueFrom<PointDto>(
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

  @Delete('point/:id')
  public async deletePoint(@Param('id') id: string): Promise<boolean> {
    await firstValueFrom<boolean>(
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
    return firstValueFrom<AreaDto>(
      this.mapaServiceClient.send('getArea', id).pipe(timeout(TEN_SECONDS)),
    );
  }

  @Delete('area/:id')
  public async deleteArea(@Param('id') id: string): Promise<boolean> {
    await firstValueFrom<boolean>(
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

  @Post('addMediaToArea')
  public async addMediaToArea(
    @Body() mediaRelationDto: MediaRelationDto,
  ): Promise<boolean> {
    await firstValueFrom<MediaRelationDto>(
      this.mapaServiceClient
        .send('addMediaToArea', mediaRelationDto)
        .pipe(timeout(TEN_SECONDS)),
    );
    return true;
  }

  @Delete('removeMediaFromArea')
  public async removeMediaFromArea(
    @Body() mediaRelationDto: MediaRelationDto,
  ): Promise<boolean> {
    await firstValueFrom<MediaRelationDto>(
      this.mapaServiceClient
        .send('removeMediaFromArea', mediaRelationDto)
        .pipe(timeout(TEN_SECONDS)),
    );
    return true;
  }

  @Post('addToCommunity')
  @Auth('RESEARCHER', 'COMMUNITY_MEMBER', 'ADMIN')
  public async addToCommunity(
    @Body() communityOperationDto: CommunityOperationDto,
  ): Promise<HttpStatus> {
    const userCommunity = await firstValueFrom<CommunityDto>(
      this.comunidadeServiceClient
        .send('getUserCommunity', communityOperationDto.userEmail)
        .pipe(timeout(TEN_SECONDS)),
    );

    await firstValueFrom<IdResponseModel>(
      this.mapaServiceClient
        .send('addToCommunity', {
          communityId: userCommunity.id,
          locationId: communityOperationDto.locationId,
        })
        .pipe(timeout(TEN_SECONDS)),
    );

    return HttpStatus.OK;
  }

  @Get('communityDataByUserEmail/:email')
  @Auth('RESEARCHER', 'COMMUNITY_MEMBER', 'ADMIN')
  public async getCommunityData(
    @Param('email') userEmail: string,
  ): Promise<CommunityMapDataDto> {
    const userCommunity = await firstValueFrom<CommunityDto>(
      this.comunidadeServiceClient
        .send('getUserCommunity', userEmail)
        .pipe(timeout(TEN_SECONDS)),
    );

    const communityMapData = await firstValueFrom<CommunityMapDataDto>(
      this.mapaServiceClient
        .send('getCommunityData', userCommunity.id)
        .pipe(timeout(TEN_SECONDS)),
    );

    return communityMapData;
  }

  @Get('exportPointToKml')
  public async exportPointToKml(@Param('id') id: string): Promise<boolean> {
    await firstValueFrom(
      this.mapaServiceClient
        .send('exportPointToKml', id)
        .pipe(timeout(TEN_SECONDS)),
    );
    return true;
  }

  @Get('exportAreaToKml')
  public async exportAreaToKml(@Param('id') id: string): Promise<boolean> {
    await firstValueFrom(
      this.mapaServiceClient
        .send('exportAreaToKml', id)
        .pipe(timeout(TEN_SECONDS)),
    );
    return true;
  }

  @Get('midiaFromPoint/:pointId')
  public async getMidiaFromPoint(
    @Param('pointId') pointId: string,
  ): Promise<MediaRelationWithUrlDto[]> {
    const midiasByPoint = await firstValueFrom<MediaRelationWithUrlDto[]>(
      this.mapaServiceClient.send('getMidiaFromPoint', pointId),
    );

    const response: MediaRelationWithUrlDto[] = [];

    for (const value of midiasByPoint) {
      const mediaUrl = await firstValueFrom(
        this.midiaServiceClient
          .send('getUrl', value.mediaId)
          .pipe(timeout(TEN_SECONDS)),
      );

      response.push({
        ...value,
        url: mediaUrl.secure_url,
      });
    }

    return response;
  }
}
