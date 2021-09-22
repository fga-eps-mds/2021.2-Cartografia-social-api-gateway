import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cellPhone: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  uid: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  imageUrl?: string;
}
