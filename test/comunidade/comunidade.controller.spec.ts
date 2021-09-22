import { Test } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { Answer } from '../../src/comunidade/entities/asnwer.entity';
import { ComunidadeController } from '../../src/comunidade/comunidade.controller';
import { Community } from '../../src/comunidade/entities/community.entity';

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

    expect(
      await controller.sendSurveyAnswers({ answers: answers }),
    ).toStrictEqual({
      id,
    });
  });

  it('should create a community', async () => {
    const id = '123';

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(id))),
    );

    controller = module.get<ComunidadeController>(ComunidadeController);

    expect(
      await controller.createCommunity({
        name: 'Por do sol',
        description: 'Comunidade pôr do sol',
      }),
    ).toStrictEqual({
      id,
    });
  });

  it('should update a community', async () => {
    const id = '123';

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(id))),
    );

    controller = module.get<ComunidadeController>(ComunidadeController);

    expect(
      await controller.updateCommunity({
        id: '123',
        name: 'Por do sol',
        description: 'Comunidade pôr do sol',
      }),
    ).toStrictEqual({
      id,
    });
  });

  it('should delete a community', async () => {
    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(true))),
    );

    controller = module.get<ComunidadeController>(ComunidadeController);

    expect(await controller.deleteCommunity('123')).toBeTruthy();
  });

  it('should get a community', async () => {
    const id = '123';

    const community = new Community();

    community.id = '123';
    community.name = 'Por do sol';
    community.description = 'Comunidade pôr do sol';

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(community))),
    );

    controller = module.get<ComunidadeController>(ComunidadeController);

    expect(await controller.getCommunity(id)).toStrictEqual(community);
  });
});
