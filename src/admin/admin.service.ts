import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
    constructor(private jwtService:JwtService){}

    private readonly admin ={
        adminId:12345,
        username:"admin",
        password:"password",
        isAdmin:true
    }
    
    async loginAdmin(username:string,password:string){
      if (password !== this.admin.password || username !== this.admin.username) {
        throw new UnauthorizedException("Invalid Credentials")
      }
     
      const payload = { sub: this.admin.adminId, username: username,isAdmin:this.admin.isAdmin };
        return {
          access_token: await this.jwtService.signAsync(payload),
          statusCode:HttpStatus.CREATED
        };
    }
}
