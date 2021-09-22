import { ApiProperty } from '@nestjs/swagger';

export class UserRelation {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  userId: string;

  @ApiProperty()
  communityId: string;
}
