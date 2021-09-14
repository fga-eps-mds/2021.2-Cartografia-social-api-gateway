import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseAuth } from '../../firebase/firebaseAuth';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private firebaseAuth: FirebaseAuth,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();

    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const userHasRolePermission = await this.firebaseAuth.verifyUserToken(
          token,
          roles,
        );

        if (userHasRolePermission) return true;

        throw new UnauthorizedException(
          'Usuário não possui as permissões necessarias',
        );
      } catch {
        throw new UnauthorizedException(
          'Usuário não possui as permissões necessarias',
        );
      }
    }
    throw new ForbiddenException('Token não informado');
  }
}
