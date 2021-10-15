import { MediaRelationDto } from './media-relation.dto';

export class PointDto {
  title: string;
  description?: string;
  type = 'Point';
  coordinates: number[];
  medias: MediaRelationDto[];
}
