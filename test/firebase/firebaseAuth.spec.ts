import admin from 'firebase-admin';
import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseAuth } from '../../src/firebase/firebaseAuth';
import { ConfigService } from '@nestjs/config';

jest.mock('firebase-admin');

describe('FirebaseAuth', () => {
  const token =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.VFb0qJ1LRg_4ujbZoRMXnVkUgiuKq5KxWqNdbKq_G9Vvz-S1zZa9LPxtHWKa64zDl2ofkT8F6jBt_K4riU-fPg';
  const dynamicModule = () => {
    return Test.createTestingModule({
      providers: [
        FirebaseAuth,
        {
          provide: 'CONFIG',
          useClass: ConfigService,
        },
      ],
    }).compile();
  };

  beforeEach(() => {
    // Complete firebase-admin mocks
    admin.initializeApp = jest.fn().mockReturnValue({
      auth: () => ({
        verifyIdToken: jest.fn(
          () =>
            new Promise((resolve) => {
              resolve({
                uid: '123',
              });
            }),
        ),
        getUser: jest.fn(
          () =>
            new Promise((resolve) => {
              resolve({
                customClaims: {
                  RESEARCHER: true,
                },
              });
            }),
        ),
      }),
    });
  });

  it('should be defined', async () => {
    const module: TestingModule = await dynamicModule();
    const firebaseAuth = module.get<FirebaseAuth>(FirebaseAuth);

    expect(firebaseAuth).toBeDefined();
  });

  it('should verifyUserToken', async () => {
    const module: TestingModule = await dynamicModule();
    const firebaseAuth = module.get<FirebaseAuth>(FirebaseAuth);

    const result = await firebaseAuth.verifyUserToken(token, ['RESEARCHER']);

    expect(result).toBe(true);
  });

  it('should verifyUserToken with false value', async () => {
    const module: TestingModule = await dynamicModule();
    const firebaseAuth = module.get<FirebaseAuth>(FirebaseAuth);

    const result = await firebaseAuth.verifyUserToken(token, ['NOT VALID']);

    expect(result).toBe(false);
  });
});
