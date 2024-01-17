import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import {User} from "./schemas/user.schema"
import * as bcrypt from 'bcryptjs';
import { EventsService } from 'src/events/events.service';
import { Mode } from 'fs';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private eventsService: EventsService, 
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
  async login(username:string,password:string):Promise<Object>{
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
  async updateUser(id:string, updateUserDto:updateUserDto):Promise<User>{
  return this.userModel.findByIdAndUpdate(id,updateUserDto)
  
}

async updateBookings(id: string, seats: number[] ,movieName:string,showTime: Date,eventId:string ): Promise<void> {
        const user = await this.userModel.findById(id).exec();

        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        user.bookings = [
          ...user.bookings,
          {
            movieName: movieName,
            seatsBooked:seats,
            showTime: showTime, 
            movieId:eventId
          },
        ];
        await user.save();
      }

    async getUserBookings(userId: string): Promise<any[]> {
        const user = await this.userModel.findById(userId).exec();
        if(!user.bookings || user.bookings.length ===0){
          throw new BadRequestException("No bookings found for this user")

        }
        if (!user) {
          throw new NotFoundException('User not found');
        }
        for (let i=0 ; i<user.bookings.length ;i++){
          console.log(user.bookings[i].seatsBooked);
        }
        return user.bookings || [];
      }
      async cancelBooking(id:string ,eventId:string){
        const user = this.userModel.findById(id)
        const event = await this.eventsService.findEvent(id)
        console.log(event);
        const bookings = (await user).bookings[2].movieId
        // const event = this.eventService.findEvent(id)
        console.log(bookings);

      }
    
    }

