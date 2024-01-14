import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { authenticationConstants } from 'src/users/constants/constants';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,private jwtService:JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>  {
    const isAdmin = this.reflector.get<boolean>('isAdmin', context.getHandler());
    if (!isAdmin) {
      return false;
    }
    console.log(isAdmin);
    const request = context.switchToHttp().getRequest(); //to get the request object
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.jwtService.verifyAsync(
    token,
        {
          secret:authenticationConstants.SECRET_KEY
        }
      );
    request['user'] = payload;
    const adminCheck = payload
    const user = adminCheck
    return user && user.isAdmin;
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader
      return token;
    }
    return null; // Return null if the Authorization header is not present
  }

  
}
