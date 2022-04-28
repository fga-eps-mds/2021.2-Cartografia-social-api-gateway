import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

export class CreateAreaDto {
  title: string;
  description?: string;
  validated: boolean;
  color: 'yellow',
  member: string;
  
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(3, {
    message: 'O array de coordenadas deve conter no mínimo 3 elementos',
  })
  @Type(() => Coordinates)
  coordinates: Coordinates[];
}

export class Coordinates {
  latitude: number;
  longitude: number;
}
