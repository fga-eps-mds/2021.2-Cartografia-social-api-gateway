import { MediaRelationDto } from './media-relation.dto';

export class AreaDto {
  id: string;
  title: string;
  description?: string;
  type = 'Polygon';
  coordinates: number[][][];
  medias: MediaRelationDto[];
  validated: boolean;
  member: string;
}
