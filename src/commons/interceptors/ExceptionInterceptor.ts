import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
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
