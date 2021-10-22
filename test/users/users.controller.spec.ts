import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { FirebaseAuth } from '../../src/firebase/firebaseAuth';
import { UsersController } from '../../src/users/users.controller';
import admin from 'firebase-admin';
import { UserResponse } from '../../src/users/responses/user.response';
import { IdResponseModel } from '../../src/responseModels/id';
import { randomUUID } from 'crypto';

jest.mock('firebase-admin');

describe('UsersController', () => {
  let controller: UsersController;
  const password = randomUUID();

  const customModule = async (fn: any) => {
    return Test.createTestingModule({
      providers: [
        Reflector,
        {
          provide: 'USER_SERVICE',
          useValue: {
            send: fn,
          },
        },
        {
          provide: FirebaseAuth,
          useClass: FirebaseAuth,
        },
        {
          provide: 'CONFIG',
          useClass: ConfigService,
        },
      ],
      controllers: [UsersController],
    }).compile();
  };

  beforeEach(() => {
    // Complete firebase-admin mocks
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
  });

  it('should be defined', async () => {
    const module = await customModule(jest.fn());

    controller = module.get<UsersController>(UsersController);

    expect(controller).toBeDefined();
  });

  it('should create a researcher', async () => {
    const id = new IdResponseModel();
    id.id = '123';

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(id))),
    );

    controller = module.get<UsersController>(UsersController);

    expect(
      await controller.createResearcher({
        email: 'email@gmail.com',
        name: 'Example',
        cellPhone: '61992989898',
        password: password,
      }),
    ).toBe(id);
  });

  it('should create a community member', async () => {
    const id = new IdResponseModel();
    id.id = '123';

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(id))),
    );

    controller = module.get<UsersController>(UsersController);

    expect(
      await controller.createCommunityMember({
        email: 'email@gmail.com',
        name: 'Example',
        cellPhone: '61992989898',
        password: password,
      }),
    ).toBe(id);
  });

  it('should get user data', async () => {
    const userResponse: UserResponse = new UserResponse();

    userResponse.email = 'email@gmail.com';
    userResponse.name = 'Example';
    userResponse.cellPhone = '61992989898';
    userResponse.type = 'RESEARCHER';
    userResponse.uid = '123';
    userResponse.id = '123';
    userResponse.imageUrl = '';

    const module = await customModule(
      jest.fn(() => new Observable((sub) => sub.next(userResponse))),
    );

    controller = module.get<UsersController>(UsersController);

    const userData = await controller.getUserByEmail('teste@email.com');

    expect(userData).toStrictEqual(userResponse);
    expect(userData).toBeInstanceOf(UserResponse);
  });
});
