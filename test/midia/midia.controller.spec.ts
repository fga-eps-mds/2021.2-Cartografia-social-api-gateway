import { Test, TestingModule } from '@nestjs/testing';
import { MidiaController } from '../../src/midia/midia.controller';

describe('MidiaController', () => {
  let controller: MidiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MIDIA_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
      controllers: [MidiaController],
    }).compile();

    controller = module.get<MidiaController>(MidiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
