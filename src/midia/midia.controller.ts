import {
  Query,
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from './dto/uploadFile.dto';
import { TEN_SECONDS } from '../commons/constans';

@ApiTags('midia')
@Controller('midia')
export class MidiaController {
  constructor(
    @Inject('MIDIA_SERVICE') private readonly midiaServiceClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.midiaServiceClient.connect();
  }

  @Post('getUrl')
  public async getMidiaUrl(@Query('id') id: string): Promise<string> {
    const midiaUrl: string = await firstValueFrom(
      this.midiaServiceClient.send('getUrl', id).pipe(timeout(TEN_SECONDS)),
    );

    return midiaUrl;
  }

  @Post('uploadMidia')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadMidia(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    const fileTransferable = new UploadFileDto(file);

    const responseId: string = await firstValueFrom(
      this.midiaServiceClient
        .send('uploadMidia', fileTransferable)
        .pipe(timeout(TEN_SECONDS)),
    );

    return responseId;
  }

  @Delete('removeMidia')
  public async removeMidia(@Body() id: string): Promise<string> {
    const response: string = await firstValueFrom(
      this.midiaServiceClient
        .send('removeMidia', id)
        .pipe(timeout(TEN_SECONDS)),
    );

    return response;
  }
}
