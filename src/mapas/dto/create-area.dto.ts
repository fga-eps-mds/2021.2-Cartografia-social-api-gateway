import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Coordinates } from './area.dto';

export class CreateAreaDto {
  title: string;
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(3, {
    message: 'O array de coordenadas deve conter no mínimo 3 elementos',
  })
  @Type(() => Coordinates)
  coordinates: Coordinates[];
}
