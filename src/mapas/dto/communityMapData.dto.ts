import { AreaDto } from './area.dto';
import { PointDto } from './point.dto';

export class CommunityMapDataDto {
  points: PointDto[] = [];
  areas: AreaDto[] = [];
}
