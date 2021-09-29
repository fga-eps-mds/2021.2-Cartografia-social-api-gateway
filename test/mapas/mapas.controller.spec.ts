import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { MapasController } from '../../src/mapas/mapas.controller';

describe('MapasController', () => {
  let controller: MapasController;

  const customModule = async (fn: any) => {
    return await Test.createTestingModule({
      providers: [
        {
          provide: 'MAPA_SERVICE',
          useValue: {
            send: fn,
          },
        },
      ],
      controllers: [MapasController],
    }).compile();
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MAPA_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
      controllers: [MapasController],
    }).compile();

    controller = module.get<MapasController>(MapasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Create a point ', async () => {
    const id = { id: '123' };
    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(id))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(
      await controller.createPoint({
        title: 'teste',
        description: 'teste',
        latitude: 0,
        longitude: 0,
      }),
    ).toBe(id);
  });

  it('Create a area ', async () => {
    const id = { id: '123' };
    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(id))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(
      await controller.createArea({
        title: 'teste',
        description: 'teste',
        coordinates: [
          { latitude: 0, longitude: 0 },
          { latitude: 1, longitude: 1 },
          { latitude: 2, longitude: 2 },
        ],
      }),
    ).toBe(id);
  });

  it('Get a area ', async () => {
    const response = {
      title: 'teste',
      description: 'teste',
      coordinates: [
        { latitude: 0, longitude: 0 },
        { latitude: 1, longitude: 1 },
        { latitude: 2, longitude: 2 },
      ],
      id: '123',
    };
    const id = { id: '123' };
    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(response))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(await controller.getArea(id.id)).toStrictEqual(response);
  });

  it('Delete a area ', async () => {
    const id = { id: '123' };
    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(true))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(await controller.deleteArea(id.id)).toBe(true);
  });
});
