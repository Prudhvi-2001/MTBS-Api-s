// events/guards/admin.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { isAdmin } from 'src/users/constants/constants';
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isAdmin = this.reflector.get<boolean>('isAdmin', context.getHandler());

    if (!isAdmin) {
      return false;
    }
    console.log(isAdmin);
    const request = context.switchToHttp().getRequest(); //to get the request object
    const req={
     user:{
        isAdmin:true //Manually assigning the IsAdmin Option we could do it by passing the token and getting the payload 
     }
    }
    const user = req.user
    console.log(user);
    return user && user.isAdmin;
  }
}
