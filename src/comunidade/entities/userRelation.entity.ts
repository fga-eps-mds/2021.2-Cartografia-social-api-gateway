import { ApiProperty } from '@nestjs/swagger';

export class UserRelation {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  communityId: string;
}
