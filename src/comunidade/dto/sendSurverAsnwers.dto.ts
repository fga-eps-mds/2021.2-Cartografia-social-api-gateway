import { ApiProperty } from '@nestjs/swagger';
import { Answer } from '../entities/asnwer.entity';

export class SendSurverAnswersDto {
  @ApiProperty({ type: [Answer] })
  answers: Answer[];
}
