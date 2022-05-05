import { ApiProperty } from '@nestjs/swagger';

export class Community {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  affiliation?: string;

  @ApiProperty()
  association?: string;

  @ApiProperty()
  county?: string;

  @ApiProperty()
  state?: string;

  @ApiProperty()
  institution?: string;
}
