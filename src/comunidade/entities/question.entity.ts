import { ApiProperty } from '@nestjs/swagger';

export class Question {
  @ApiProperty()
  question: string;

  @ApiProperty()
  formName: string;

  @ApiProperty()
  fieldType: string;

  @ApiProperty()
  orderInForm: number;

  @ApiProperty()
  validationRegex?: string;

  @ApiProperty()
  placeholder?: string;

  @ApiProperty()
  errorMessage?: string;

  @ApiProperty()
  optional: boolean;

  @ApiProperty()
  id: string;
}
