import { MediaRelationDto } from './media-relation.dto';

export class PointDto {
  id: string;
  title: string;
  description?: string;
  type = 'Point';
  coordinates: number[];
  medias: MediaRelationDto[];
}
