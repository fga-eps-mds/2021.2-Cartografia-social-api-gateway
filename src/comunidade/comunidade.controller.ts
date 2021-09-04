import { Body, Get, Inject, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SendSurverAnswersDto } from './dto/sendSurverAsnwers.dto';

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

  @Post('sendAnswers')
  public async sendSurveyAnswers(
    @Body() answers: SendSurverAnswersDto,
  ): Promise<string> {
    const responseId: string = await firstValueFrom(
      this.comunidadeServiceClient.send('sendAnswers', answers),
    );

    return responseId;
  }
}
