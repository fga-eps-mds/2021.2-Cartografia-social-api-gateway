import { ApiProperty } from '@nestjs/swagger';

export class Question {
  @ApiProperty()
  question: string;

  @ApiProperty()
  id: string;
}
