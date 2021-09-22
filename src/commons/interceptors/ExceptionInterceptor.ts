import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const errorMessage: string =
          (Array.isArray(error?.response?.message)
            ? error?.response?.message?.[0]
            : error?.response?.message) || error.message;

        if (error?.status) {
          switch (error.status) {
            case HttpStatus.BAD_REQUEST:
              throw new BadRequestException(errorMessage);
            case HttpStatus.UNAUTHORIZED:
              throw new UnauthorizedException(errorMessage);
            case HttpStatus.FORBIDDEN:
              throw new ForbiddenException(errorMessage);
            case HttpStatus.NOT_FOUND:
              throw new NotFoundException(errorMessage);
            case HttpStatus.CONFLICT:
              throw new ConflictException(errorMessage);
            default:
              throw new InternalServerErrorException(errorMessage);
          }
        } else {
          throw error;
        }
      }),
    );
  }
}
