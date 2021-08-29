import { Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.userServiceClient.connect();
  }

  @Get()
  public async getUserByToken(): Promise<string> {
    const userResponse: string = await firstValueFrom(
      this.userServiceClient.send('findOneUser', 30).pipe(timeout(5000)),
    );

    return userResponse;
  }
}
