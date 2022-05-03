import {
  Inject,
  Controller,
  Body,
  Post,
  Get,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { Auth } from '../commons/decorators/auth.decorator';
import { IdResponseModel } from '../responseModels/id';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponse } from './responses/user.response';
import { UserEmailDto } from './dto/userEmail.dto';

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

  @Post('createUser')
  @ApiConflictResponse()
  public async createUser(
    @Body() CreateUserDto: CreateUserDto,
  ): Promise<IdResponseModel> {
    return firstValueFrom(
      this.userServiceClient
        .send('createUser', CreateUserDto)
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
  public async getUserByEmail(
    @Query('email') userEmai: string,
  ): Promise<UserResponse> {
    return firstValueFrom(
      this.userServiceClient.send('getUserData', userEmai).pipe(timeout(5000)),
    );
  }

  @Get('selecionarUsuarios')
  @Render('validate_user')
  async selecionarUsuarios() {
    const response = await firstValueFrom(
      this.userServiceClient
        .send('getNonValidatedUsersData', '')
        .pipe(timeout(5000)),
    );
    return { users: response };
  }

  @Get('')
  async root(@Res() res) {
    return res.redirect('/selecionarUsuarios');
  }

  @Post('validateUser')
  async validateUser(
    @Body() UserEmail: UserEmailDto,
  ): Promise<IdResponseModel> {
    return firstValueFrom(
      this.userServiceClient
        .send('validateUser', UserEmail)
        .pipe(timeout(15000)),
    );
  }

  @Post('removeUser')
  async removeUser(@Body() UserEmail: UserEmailDto): Promise<IdResponseModel> {
    return firstValueFrom(
      this.userServiceClient.send('removeUser', UserEmail).pipe(timeout(15000)),
    );
  }
}
