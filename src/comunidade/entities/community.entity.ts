import { ApiProperty } from '@nestjs/swagger';

export class Community {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  imageUrl?: string;
}
