import { Inject, Controller, Body, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { IdResponseModel } from 'src/responseModels/id';
import { CreateUserDto } from './dto/createUser.dto';

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
  public async createResearcher(
    @Body() createResearcherDto: CreateUserDto,
  ): Promise<IdResponseModel> {
    return firstValueFrom(
      this.userServiceClient
        .send('createResearcher', createResearcherDto)
        .pipe(timeout(5000)),
    );
  }
}
