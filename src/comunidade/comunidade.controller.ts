import { Body, Get, Inject, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { SendSurverAnswersDto } from './dto/sendSurverAsnwers.dto';
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
  ): Promise<string> {
    const responseId: string = await firstValueFrom(
      this.comunidadeServiceClient
        .send('sendAnswers', answers)
        .pipe(timeout(TEN_SECONDS)),
    );

    return responseId;
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
}
