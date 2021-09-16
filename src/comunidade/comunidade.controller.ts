import {
  Body,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { IdResponseModel } from 'src/responseModels/id';
import { CreateCommunityDto } from './dto/createCommunity.dto';
import { SendSurverAnswersDto } from './dto/sendSurverAsnwers.dto';
import { UpdateCommunityDto } from './dto/updateCommunity.dto';
import { Community } from './entities/community.entity';
import { Question } from './entities/question.entity';

const TEN_SECONDS = 10000;

@ApiTags('Comunidades')
@Controller('community')
export class ComunidadeController {
  constructor(
    @Inject('COMUNIDADE_SERVICE')
    private readonly comunidadeServiceClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.comunidadeServiceClient.connect();
  }

  @Post('sendAnswers')
  public async sendSurveyAnswers(
    @Body() answers: SendSurverAnswersDto,
  ): Promise<IdResponseModel> {
    const id: string = await firstValueFrom(
      this.comunidadeServiceClient
        .send('sendAnswers', answers)
        .pipe(timeout(TEN_SECONDS)),
    );

    return { id };
  }

  @Get('questionsToCreateCommunity')
  public async getQuestionsToCreateCommunity(): Promise<Question[]> {
    const result = await firstValueFrom<Question[]>(
      this.comunidadeServiceClient
        .send('getQuestionsToCreateCommunity', '')
        .pipe(timeout(TEN_SECONDS)),
    );

    return result;
  }

  @Post()
  public async createCommunity(
    @Body() createCommunityDto: CreateCommunityDto,
  ): Promise<IdResponseModel> {
    const id: string = await firstValueFrom(
      this.comunidadeServiceClient
        .send('createCommunity', createCommunityDto)
        .pipe(timeout(TEN_SECONDS)),
    );

    return { id };
  }

  @Put()
  @HttpCode(204)
  public async updateCommunity(
    @Body() updateCommunityDto: UpdateCommunityDto,
  ): Promise<IdResponseModel> {
    const id: string = await firstValueFrom(
      this.comunidadeServiceClient
        .send('updateCommunity', updateCommunityDto)
        .pipe(timeout(TEN_SECONDS)),
    );

    return { id };
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteCommunity(@Param('id') id: string): Promise<Community> {
    return firstValueFrom<Community>(
      this.comunidadeServiceClient
        .send('deleteCommunity', id)
        .pipe(timeout(TEN_SECONDS)),
    );
  }

  @Get(':id')
  public async getCommunity(@Param('id') id: string): Promise<Community> {
    return firstValueFrom<Community>(
      this.comunidadeServiceClient
        .send('getCommunity', id)
        .pipe(timeout(TEN_SECONDS)),
    );
  }
}
