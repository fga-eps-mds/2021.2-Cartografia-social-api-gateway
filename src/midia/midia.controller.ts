import { Body, Controller, Get, Inject, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from './dto/uploadFile.dto';

const TEN_SECONDS = 10000;

@ApiTags('midia')
@Controller('midia')
export class MidiaController {
  constructor(
    @Inject('MIDIA_SERVICE') private readonly midiaServiceClient: ClientProxy,
  ) { }

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

  @Post('uploadMidia')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadMidia(@UploadedFile() file: Express.Multer.File): Promise<string> {

    const fileTransferable = new UploadFileDto(file);

    const responseId: string = await firstValueFrom(
      this.midiaServiceClient
        .send('uploadMidia', fileTransferable)
        .pipe(timeout(TEN_SECONDS)),
    );

    return responseId;
  }
}
