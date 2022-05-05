import {
  Body,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Query,
  StreamableFile,
  Response,
  Render,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { IdResponseModel } from '../responseModels/id';
import { CreateCommunityDto } from './dto/createCommunity.dto';
import { SendSurverAnswersDto } from './dto/sendSurverAsnwers.dto';
import { UpdateCommunityDto } from './dto/updateCommunity.dto';
import { Community } from './entities/community.entity';
import { Question } from './entities/question.entity';
import { UserRelation } from './entities/userRelation.entity';
import { CommunityUserDto } from './dto/communityUser.dto';
import { TEN_SECONDS } from '../commons/constans';
import { UserResponse } from 'src/users/responses/user.response';
import { Auth } from '../commons/decorators/auth.decorator';
import { Readable } from 'stream';

@ApiTags('Comunidades')
@Controller('community')
export class ComunidadeController {
  constructor(
    @Inject('COMUNIDADE_SERVICE')
    private readonly comunidadeServiceClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.comunidadeServiceClient.connect();
  }

  @Get('/cadastrarComunidade')
  @Render('register_community')
  public async cadastrarComunidade() {
    return;
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
    return firstValueFrom<Question[]>(
      this.comunidadeServiceClient
        .send('getQuestionsToCreateCommunity', '')
        .pipe(timeout(TEN_SECONDS)),
    );
  }

  @Get('questionsToGetHelp')
  public async getQuestionsToGetHelp(): Promise<Question[]> {
    return firstValueFrom<Question[]>(
      this.comunidadeServiceClient
        .send('getQuestionsToGetHelp', '')
        .pipe(timeout(TEN_SECONDS)),
    );
  }
  @Post('addUser')
  public async addUser(
    @Body() communityUser: CommunityUserDto,
  ): Promise<UserRelation> {
    return firstValueFrom(
      this.comunidadeServiceClient
        .send('addUser', communityUser)
        .pipe(timeout(TEN_SECONDS)),
    );
  }

  @Get('getUsers')
  public async getUsers(
    @Query('communityId') communityId: string,
  ): Promise<UserRelation[]> {
    return firstValueFrom<UserRelation[]>(
      this.comunidadeServiceClient
        .send('getUsers', communityId)
        .pipe(timeout(TEN_SECONDS)),
    );
  }

  @Get('getCommunityUser')
  public async getCommunityUser(
    @Query('communityId') communityId: string,
    @Query('userId') userId: string,
  ): Promise<UserRelation> {
    return firstValueFrom(
      this.comunidadeServiceClient
        .send('getCommunityUser', { userId, communityId })
        .pipe(timeout(TEN_SECONDS)),
    );
  }

  @Get('getUserCommunity')
  public async getUserCommunity(
    @Query('userEmail') userEmail: string,
  ): Promise<UserRelation> {
    return firstValueFrom(
      this.comunidadeServiceClient
        .send('getUserCommunity', userEmail)
        .pipe(timeout(TEN_SECONDS)),
    );
  }

  @Delete('removeUser')
  @HttpCode(204)
  public async removeUser(
    @Body() communityUser: CommunityUserDto,
  ): Promise<IdResponseModel> {
    const id: string = await firstValueFrom(
      this.comunidadeServiceClient
        .send('removeUser', communityUser)
        .pipe(timeout(TEN_SECONDS)),
    );

    return { id };
  }

  @Post('addAdminUser')
  public async addAdminUser(
    @Body() communityAdminUser: CommunityUserDto,
  ): Promise<UserRelation> {
    return firstValueFrom(
      this.comunidadeServiceClient
        .send('addAdminUser', communityAdminUser)
        .pipe(timeout(TEN_SECONDS)),
    );
  }

  @Delete('removeAdminUser')
  @HttpCode(204)
  public async removeAdminUser(
    @Body() communityAdminUser: CommunityUserDto,
  ): Promise<IdResponseModel> {
    const id: string = await firstValueFrom(
      this.comunidadeServiceClient
        .send('removeAdminUser', communityAdminUser)
        .pipe(timeout(TEN_SECONDS)),
    );

    return { id };
  }

  @Get('getAdminUsers')
  public async getAdminUsers(
    @Query('communityId') communityId: string,
  ): Promise<UserRelation[]> {
    return firstValueFrom<UserRelation[]>(
      this.comunidadeServiceClient
        .send('getAdminUsers', communityId)
        .pipe(timeout(TEN_SECONDS)),
    );
  }

  @Get('getCommunityAdminUser')
  public async getCommunityAdminUser(
    @Query('communityId') communityId: string,
    @Query('userId') userId: string,
  ): Promise<UserRelation> {
    return firstValueFrom(
      this.comunidadeServiceClient
        .send('getCommunityAdminUser', { userId, communityId })
        .pipe(timeout(TEN_SECONDS)),
    );
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
  public async deleteCommunity(@Param('id') id: string): Promise<boolean> {
    return firstValueFrom<boolean>(
      this.comunidadeServiceClient
        .send('deleteCommunity', id)
        .pipe(timeout(TEN_SECONDS)),
    );
  }

  @Get('listCommunities')
  public async listCommunities(): Promise<Community[]> {
    return firstValueFrom<Community[]>(
      this.comunidadeServiceClient
        .send('listCommunities', '')
        .pipe(timeout(TEN_SECONDS)),
    );
  }

  @Get('listUsers')
  public async listUsers(): Promise<UserResponse[]> {
    return firstValueFrom<UserResponse[]>(
      this.comunidadeServiceClient
        .send('listUsers', '')
        .pipe(timeout(TEN_SECONDS)),
    );
  }

  @Get('getUsersWithoutACommunity')
  public async getUsersWithoutACommunity(): Promise<UserResponse[]> {
    return firstValueFrom<UserResponse[]>(
      this.comunidadeServiceClient
        .send('getUsersWithouACommunity', '')
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

  @Get('exportCommunityAreaToKml/:communityId')
  // @Auth('RESEARCHER', 'ADMIN')
  public async exportCommunityAreaToKml(
    @Param('communityId') communityId: string,
    @Response({ passthrough: true }) res,
  ) {
    const community = await firstValueFrom(
      this.comunidadeServiceClient
        .send('getCommunity', communityId)
        .pipe(timeout(TEN_SECONDS)),
    );

    const document = await firstValueFrom(
      this.comunidadeServiceClient
        .send('exportCommunityAreaToKml', communityId)
        .pipe(timeout(TEN_SECONDS)),
    );

    let communityFileName = `${community.name}.area.kml`;
    communityFileName = communityFileName.replace(/\s/g, '_');

    res.set({
      'Content-Disposition': 'attachment; filename=' + communityFileName,
    });

    const buff = Buffer.from(document, 'utf-8');
    const stream = Readable.from(buff);
    return new StreamableFile(stream);
  }

  @Get('exportCommunityPointsToKml/:communityId')
  @Auth('RESEARCHER', 'ADMIN')
  public async exportCommunityPointsToKml(
    @Param('communityId') communityId: string,
    @Response({ passthrough: true }) res,
  ) {
    const community = await firstValueFrom(
      this.comunidadeServiceClient
        .send('getCommunity', communityId)
        .pipe(timeout(TEN_SECONDS)),
    );

    const document = await firstValueFrom(
      this.comunidadeServiceClient
        .send('exportCommunityPointsToKml', communityId)
        .pipe(timeout(TEN_SECONDS)),
    );

    let communityFileName = `${community.name}.points.kml`;
    communityFileName = communityFileName.replace(/\s/g, '_');

    res.set({
      'Content-Disposition': 'attachment; filename=' + communityFileName,
    });

    const buff = Buffer.from(document, 'utf-8');
    const stream = Readable.from(buff);
    return new StreamableFile(stream);
  }

  @Get('exportCommunityKML/:userEmail')
  public async exportCommunityKML(@Param('userEmail') userEmail: string) {
    return firstValueFrom(
      this.comunidadeServiceClient
        .send('exportCommunityKML', userEmail)
        .pipe(timeout(TEN_SECONDS)),
    );
  }
  @Get('sendCreationEmail/:userEmail')
  public async sendCreationEmail(@Param('userEmail') userEmail: string) {
    return firstValueFrom(
      this.comunidadeServiceClient
        .send('sendCreationEmail', userEmail)
        .pipe(timeout(TEN_SECONDS)),
    );
  }
}
