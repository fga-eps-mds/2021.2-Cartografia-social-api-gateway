import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { FirebaseAuth } from '../../src/firebase/firebaseAuth';
import { AreaDto } from '../../src/mapas/dto/area.dto';
import { PointDto } from '../../src/mapas/dto/point.dto';
import { MapasController } from '../../src/mapas/mapas.controller';
import admin from 'firebase-admin';
import { RolesGuard } from '../../src/commons/guards/roles.guard';
import { CanActivate } from '@nestjs/common';
import { ConfigService } from '../../src/config/configuration';

jest.mock('firebase-admin');

describe('MapasController', () => {
  let controller: MapasController;

  const customModule = async (fn: any, communityFn = jest.fn()) => {
    return await Test.createTestingModule({
      providers: [
        {
          provide: 'MAPA_SERVICE',
          useValue: {
            send: fn,
          },
        },
        {
          provide: FirebaseAuth,
          useClass: FirebaseAuth,
        },
        {
          provide: 'COMUNIDADE_SERVICE',
          useValue: {
            send: communityFn,
          },
        },
        {
          provide: 'CONFIG',
          useClass: ConfigService,
        },
      ],
      controllers: [MapasController],
    }).compile();
  };

  beforeEach(async () => {
    const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

    admin.initializeApp = jest.fn().mockReturnValue({
      auth: () => ({
        verifyIdToken: jest.fn(() =>
          Promise.resolve({
            uid: '123',
          }),
        ),
        getUser: jest.fn(() =>
          Promise.resolve({
            customClaims: {
              RESEARCHER: true,
            },
          }),
        ),
      }),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MAPA_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: 'COMUNIDADE_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
      controllers: [MapasController],
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

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

  it('Get a point ', async () => {
    const response = <PointDto>{
      title: 'string',
      description: 'string',
      coordinates: [123, 321],
      id: '123',
    };
    const id = { id: '123' };

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(response))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(await controller.getPoint(id.id)).toStrictEqual(response);
  });

  it('should update a Point', async () => {
    const id = '123';

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(id))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(
      await controller.updatePoint({
        id: id,
        title: 'setor leste',
        description: 'setor leste',
      }),
    ).toStrictEqual(id);
  });

  it('Delete a point ', async () => {
    const id = { id: '123' };
    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(true))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(await controller.deletePoint(id.id)).toBe(true);
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
    const response = <AreaDto>{
      id: '123',
      title: 'teste',
      description: 'teste',
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
      ],
      medias: [],
    };
    const id = { id: '123' };
    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(response))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(await controller.getArea(id.id)).toStrictEqual(response);
  });

  it('should update a area', async () => {
    const id = '123';

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(id))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(
      await controller.updateArea({
        id: id,
        title: 'teste',
        description: 'teste',
      }),
    ).toStrictEqual(id);
  });

  it('Delete a area ', async () => {
    const id = { id: '123' };
    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(true))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(await controller.deleteArea(id.id)).toBe(true);
  });

  it('should add midia to a point ', async () => {
    const midiaRelation = { locationId: '123', mediaId: '321' };
    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(true))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(await controller.addMediaToPoint(midiaRelation)).toBe(true);
  });

  it('should remove midia from a point ', async () => {
    const midiaRelation = { locationId: '123', mediaId: '321' };
    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(true))),
    );

    controller = module.get<MapasController>(MapasController);

    expect(await controller.removeMediaFromPoint(midiaRelation)).toBe(true);
  });
});
