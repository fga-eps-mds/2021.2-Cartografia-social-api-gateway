import { Test } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { UsersController } from '../../src/users/users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  const customModule = async (fn: any) => {
    return await Test.createTestingModule({
      providers: [
        {
          provide: 'USER_SERVICE',
          useValue: {
            send: fn,
          },
        },
      ],
      controllers: [UsersController],
    }).compile();
  };

  it('should be defined', async () => {
    const module = await customModule(jest.fn());

    controller = module.get<UsersController>(UsersController);

    expect(controller).toBeDefined();
  });

  it('should return a created user', async () => {
    const id = { id: '123' };

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(id))),
    );

    controller = module.get<UsersController>(UsersController);

    expect(
      await controller.createResearcher({
        email: 'ebmm01@gmail.com',
        name: 'Elias',
        cellPhone: '61992789682',
        password: '12345678',
      }),
    ).toBe(id);
  });
});
