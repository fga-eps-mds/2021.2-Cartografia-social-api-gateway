import { ApiProperty } from '@nestjs/swagger';

export class AdminUserRelation {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  communityId: string;
}
