import { Inject, Controller, Body, Post, Get, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { Auth } from '../commons/decorators/auth.decorator';
import { IdResponseModel } from '../responseModels/id';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponse } from './responses/user.response';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.userServiceClient.connect();
  }

  @Post('createResearcher')
  @ApiConflictResponse()
  public async createResearcher(
    @Body() createResearcherDto: CreateUserDto,
  ): Promise<IdResponseModel> {
    return firstValueFrom(
      this.userServiceClient
        .send('createResearcher', createResearcherDto)
        .pipe(timeout(15000)),
    );
  }

  @Post('createCommunityMember')
  @Auth('RESEARCHER')
  @ApiConflictResponse()
  public async createCommunityMember(
    @Body() createCommunityMemberDto: CreateUserDto,
  ): Promise<IdResponseModel> {
    return firstValueFrom(
      this.userServiceClient
        .send('createCommunityMember', createCommunityMemberDto)
        .pipe(timeout(15000)),
    );
  }

  @Get('userByEmail')
  @Auth('RESEARCHER', 'COMMUNITY_MEMBER')
  public async getUserByEmail(
    @Query('email') userEmai: string,
  ): Promise<UserResponse> {
    return firstValueFrom(
      this.userServiceClient.send('getUserData', userEmai).pipe(timeout(5000)),
    );
  }
}
