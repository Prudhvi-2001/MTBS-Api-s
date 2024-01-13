import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AdminService {
    constructor(private jwtService:JwtService){}

    private readonly admin ={
        adminId:12345,
        username:"admin",
        password:"password",
        isAdmin:true
    }
    
    async loginAdmin(username:string,password:string):Promise<Object>{
      //create the hashed password for admin.password
      const hashedPassword=await bcrypt.hash(this.admin.password,12)
      if (username !== this.admin.username || !await bcrypt.compare(password,hashedPassword)) {
        throw new UnauthorizedException('Please check your username and password')
        }
      const payload = { sub: this.admin.adminId, username: username,isAdmin:this.admin.isAdmin };
        return {
          access_token: await this.jwtService.signAsync(payload),
          statusCode:HttpStatus.CREATED
        };
    }
}
