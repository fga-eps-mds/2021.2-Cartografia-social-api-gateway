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
        if (error?.status) {
          switch (error.status) {
            case HttpStatus.BAD_REQUEST:
              throw new BadRequestException(error.exception);
              break;
            case HttpStatus.UNAUTHORIZED:
              throw new UnauthorizedException(error.message);
              break;
            case HttpStatus.FORBIDDEN:
              throw new ForbiddenException(error.message);
              break;
            case HttpStatus.NOT_FOUND:
              throw new NotFoundException(error.message);
              break;
            case HttpStatus.CONFLICT:
              throw new ConflictException(error.message);
              break;
            default:
              throw new InternalServerErrorException(error.exception);
          }
        } else {
          throw error;
        }
      }),
    );
  }
}
