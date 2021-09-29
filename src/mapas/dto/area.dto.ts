export class AreaDto {
  id: string;
  title: string;
  description?: string;
  coordinates: Coordinates[];
}

export class Coordinates {
  latitude: number;
  longitude: number;
}
