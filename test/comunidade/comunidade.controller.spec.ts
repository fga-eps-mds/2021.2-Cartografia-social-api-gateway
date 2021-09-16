import { Test } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { Answer } from '../../src/comunidade/entities/asnwer.entity';
import { ComunidadeController } from '../../src/comunidade/comunidade.controller';

describe('ComunidadeController', () => {
  let controller: ComunidadeController;
  const customModule = async (fn: any) => {
    return await Test.createTestingModule({
      providers: [
        {
          provide: 'COMUNIDADE_SERVICE',
          useValue: {
            send: fn,
          },
        },
      ],
      controllers: [ComunidadeController],
    }).compile();
  };

  beforeEach(async () => {
    const module = await customModule(jest.fn());

    controller = module.get<ComunidadeController>(ComunidadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return value from questionsToCreateCommunity', async () => {
    const data = [
      {
        question: 'Nome',
        id: '123',
      },
    ];

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(data))),
    );

    controller = module.get<ComunidadeController>(ComunidadeController);

    expect(await controller.getQuestionsToCreateCommunity()).toBe(data);
  });

  it('should return value from questionsToGetHelp', async () => {
    const data = [
      {
        question: 'Question',
        id: '321',
      },
    ];

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(data))),
    );

    controller = module.get<ComunidadeController>(ComunidadeController);

    expect(await controller.getQuestionsToGetHelp()).toBe(data);
  });

  it('should return value from sendAnswers', async () => {
    const id = '123';
    const answer = new Answer();
    answer.questionId = '123';
    answer.response = 'José';

    const answers = [answer];

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(id))),
    );

    controller = module.get<ComunidadeController>(ComunidadeController);

    expect(await controller.sendSurveyAnswers({ answers: answers })).toBe(id);
  });
});
