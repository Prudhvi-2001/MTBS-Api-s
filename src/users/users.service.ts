import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import {User} from "./schemas/user.schema"
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService:JwtService
  ) {}
  //To Create the User

  async create(user: CreateUserDto): Promise<Object> {
    const existingUser = await this.userModel.findOne({ username: user.username }).exec();
    if(!user) return{ message:"Can't find user to register! Please give details"}
    if (existingUser) {
      throw new ForbiddenException("User Exist with User name !")
    }
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = await bcrypt.hash(user.password,salt)
        const newUser = new this.userModel({
          ...user,
          password:hashedPassword
        })
        await newUser.save()
    return {
      user:newUser.username,
      message:"User has been Registered Sucessfully!!",
      status:HttpStatus.CREATED
    }
  
  }
//To login the User and it will generate a token
  async login(username:string,password:string):Promise<any>{
      const user = await this.userModel.findOne({username}).exec()
      if (!user || !await bcrypt.compare(password, user.password)) {
        throw new UnauthorizedException('Please check your username and password')
        }
      const hexId = user._id.toHexString()
      const payload = { sub: hexId, username: user.username };
        return {
          access_token: await this.jwtService.signAsync(payload),
          statusCode:HttpStatus.CREATED,
        };
}
//To get the specific User
  getUser(id:string){
    return  this.userModel.findById(id);
  }
  //To delete the user
  deleteUser(id:string){
    return this.userModel.findByIdAndDelete(id)
  }
  //To Update the User
  async updateUser(id:string, updateUserDto:updateUserDto):Promise<Object>{
  return this.userModel.findByIdAndUpdate(id,updateUserDto)
}
}
