import { ApiProperty } from '@nestjs/swagger';

export class Answer {
  @ApiProperty()
  questionId: string;

  @ApiProperty()
  response: string;
}
