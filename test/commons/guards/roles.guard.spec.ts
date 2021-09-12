import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { FirebaseAuth } from '../../../src/firebase/firebaseAuth';
import { RolesGuard } from '../../../src/commons/guards/roles.guard';

describe('RolesGuard', () => {
  let roleGuard: RolesGuard;

  const dynamicModule = (
    rolesValue?: string[],
    verifyTokenFn: any = jest.fn(() => true),
  ) => {
    return Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            get: () => rolesValue,
          },
        },
        {
          provide: FirebaseAuth,
          useValue: {
            verifyUserToken: verifyTokenFn,
          },
        },
      ],
    }).compile();
  };

  it('should be defined', async () => {
    const module = await dynamicModule();

    roleGuard = module.get<RolesGuard>(RolesGuard);
    expect(roleGuard).toBeDefined();
  });

  it('should return true when no roles assigned', async () => {
    const module = await dynamicModule(null);
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer giant_token_here',
          },
        }),
      }),
    });

    roleGuard = module.get<RolesGuard>(RolesGuard);

    expect(await roleGuard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should return true correct role is assigned', async () => {
    const module = await dynamicModule(['RESEARCHER'], () => true);

    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer giant_token_here',
          },
        }),
      }),
    });

    roleGuard = module.get<RolesGuard>(RolesGuard);

    expect(await roleGuard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should return false when no correct roles', async () => {
    const module = await dynamicModule(['RESEARCHER'], () => false);

    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer giant_token_here',
          },
        }),
      }),
    });

    roleGuard = module.get<RolesGuard>(RolesGuard);

    try {
      await roleGuard.canActivate(mockExecutionContext);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should throw error with firebase', async () => {
    const module = await dynamicModule(['RESEARCHER'], () => {
      throw new Error('Invalid token');
    });

    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer giant_token_here',
          },
        }),
      }),
    });

    roleGuard = module.get<RolesGuard>(RolesGuard);

    try {
      await roleGuard.canActivate(mockExecutionContext);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should throw error when no token is given', async () => {
    const module = await dynamicModule(['RESEARCHER']);

    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    });

    roleGuard = module.get<RolesGuard>(RolesGuard);

    try {
      await roleGuard.canActivate(mockExecutionContext);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });
});
