import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { throwError } from 'rxjs';
import { ErrorInterceptor } from '../../../src/commons/interceptors/ExceptionInterceptor';

const interceptor = new ErrorInterceptor();

const executionContext = {
  getArgs: jest.fn().mockReturnThis(),
  getArgByIndex: jest.fn().mockReturnThis(),
  switchToRpc: jest.fn().mockReturnThis(),
  switchToHttp: jest.fn().mockReturnThis(),
  switchToWs: jest.fn().mockReturnThis(),
  getType: jest.fn().mockReturnThis(),
  getHandler: jest.fn().mockReturnThis(),
  getClass: jest.fn().mockReturnThis(),
  getRequest: jest.fn().mockReturnThis(),
};

describe('ErrorInterceptor', () => {
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('shoud intercept BadRequestError', (done) => {
    const callHandler = {
      handle: jest.fn(() =>
        throwError(
          () => new HttpException({ message: 'error' }, HttpStatus.BAD_REQUEST),
        ),
      ),
    };

    interceptor.intercept(executionContext, callHandler).subscribe({
      next: (value) => {
        throw new TypeError(`unexpected value ${value}`);
      },
      error: (error) => {
        expect(error).toBeInstanceOf(BadRequestException);
        done();
      },
    });
  });

  it('shoud intercept NotFoundException', (done) => {
    const callHandler = {
      handle: jest.fn(() =>
        throwError(
          () => new HttpException({ message: 'error' }, HttpStatus.NOT_FOUND),
        ),
      ),
    };

    interceptor.intercept(executionContext, callHandler).subscribe({
      next: (value) => {
        throw new TypeError(`unexpected value ${value}`);
      },
      error: (error) => {
        expect(error).toBeInstanceOf(NotFoundException);
        done();
      },
    });
  });

  it('shoud intercept UnauthorizedException', (done) => {
    const callHandler = {
      handle: jest.fn(() =>
        throwError(
          () =>
            new HttpException({ message: 'error' }, HttpStatus.UNAUTHORIZED),
        ),
      ),
    };

    interceptor.intercept(executionContext, callHandler).subscribe({
      next: (value) => {
        throw new TypeError(`unexpected value ${value}`);
      },
      error: (error) => {
        expect(error).toBeInstanceOf(UnauthorizedException);
        done();
      },
    });
  });

  it('shoud intercept ConflictException', (done) => {
    const callHandler = {
      handle: jest.fn(() =>
        throwError(
          () => new HttpException({ message: 'error' }, HttpStatus.CONFLICT),
        ),
      ),
    };

    interceptor.intercept(executionContext, callHandler).subscribe({
      next: (value) => {
        throw new TypeError(`unexpected value ${value}`);
      },
      error: (error) => {
        expect(error).toBeInstanceOf(ConflictException);
        done();
      },
    });
  });

  it('shoud intercept ForbiddenExpection', (done) => {
    const callHandler = {
      handle: jest.fn(() =>
        throwError(
          () => new HttpException({ message: 'error' }, HttpStatus.FORBIDDEN),
        ),
      ),
    };

    interceptor.intercept(executionContext, callHandler).subscribe({
      next: (value) => {
        throw new TypeError(`unexpected value ${value}`);
      },
      error: (error) => {
        expect(error).toBeInstanceOf(ForbiddenException);
        done();
      },
    });
  });

  it('shoud intercept non described error', (done) => {
    const callHandler = {
      handle: jest.fn(() =>
        throwError(
          () =>
            new HttpException(
              { message: 'error' },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        ),
      ),
    };

    interceptor.intercept(executionContext, callHandler).subscribe({
      next: (value) => {
        throw new TypeError(`unexpected value ${value}`);
      },
      error: (error) => {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        done();
      },
    });
  });
});
