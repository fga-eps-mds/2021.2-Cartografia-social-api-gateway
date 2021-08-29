import { Test, TestingModule } from '@nestjs/testing';
import { ComunidadeController } from '../../src/comunidade/comunidade.controller';

describe('ComunidadeController', () => {
  let controller: ComunidadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComunidadeController],
    }).compile();

    controller = module.get<ComunidadeController>(ComunidadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
