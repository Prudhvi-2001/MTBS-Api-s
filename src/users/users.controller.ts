import { Controller, Get, Query,Post, Body, Req,Patch, Param,Put, Delete ,Request, UseGuards, UsePipes, ValidationPipe, HttpStatus, HttpCode, BadRequestException, NotFoundException} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guards/user.guard';
import { updateUserDto } from './dto/update-user.dto';
import {User} from "./schemas/user.schema"
import { promises } from 'dns';
import { errorMonitor } from 'events';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
 

  //To create the user 

  // ApiEndpoint : http://localhost:3000/users/createUser
  //Method:POST
  // req.body ={
  //   "username":"Example",
  //   "email":"example@gmail.com",
  //   "password":"Example@200"
  // }
  @Post("createUser")
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    try{
      return this.usersService.create(createUserDto)
    }
    catch(error){
      if(error instanceof BadRequestException){
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }
  //To login the user
  //Api EndPoint : https://localhost:3000/users/login
  //Method:POST
  //req.body={
    //"username":"Example",
    //"password":"Example@200"
//}
//response:token
  
  @Post('login')
  login(@Body() loginUser:CreateUserDto){
    try{
      return this.usersService.login(loginUser.username,loginUser.password)
    }
    catch(error){
      if(error instanceof NotFoundException){
        throw new NotFoundException(error.message)
      }
      else if(error instanceof BadRequestException){
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }
//To check whether token is extracted by the headers and payload
//ApiEndPoint:http://localhost:3000/users/profile
//Method: GET
  @Get("profile")
  @UseGuards(AuthGuard)
  profile(@Request() req){
    return req.user
  }

  //To get the specific user
//  ApiEndpoint: http://localhost:3000/users/:id
  @Get('getUser')
  @UseGuards(AuthGuard)
  async getUser(@Req() req):Promise<User>{ 
    const userId = req.user.sub;
    try{     
      return this.usersService.getUser(userId);
    }
    catch(error){
      if(error instanceof NotFoundException){
        throw new NotFoundException(error.message)
      }
      else if(error instanceof BadRequestException){
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }
  //To delete User 
  //ApiEndPoint: http://localhost:3000/users/deleterUser/:id
  //Method:DELETE
  @UseGuards(AuthGuard)
  @Delete("deleteUser")
  async deleteUser(@Req() req):Promise<Object>{
    const id =req.user.sub
    try{
      return await this.usersService.deleteUser(id)
 
    }
    catch(error){
      if(error instanceof NotFoundException){
        throw new NotFoundException(error.message)
      }
      else if(error instanceof BadRequestException){
        throw new BadRequestException(error.message)
      }
      throw error
    }
    
  }
//To update the User
//ApiEndPoint:http://localhost:3000/users/:id/updateUser
//Method:PUT
  @UseGuards(AuthGuard)
  @Put('updateUser')
  async updateProfile(@Req() req, @Body() updateUserDto: updateUserDto):Promise<User> {
    try{
    const userName= req.user.username
    console.log(userName);
    return this.usersService.updateUser(userName, updateUserDto);

    }
    
    catch(error){
      if(error instanceof NotFoundException){
        throw new NotFoundException(error.message)
      }
      else if(error instanceof BadRequestException){
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }

  @UseGuards(AuthGuard)
  @Get('getBookings')
  async getBooking(@Req() req):Promise<any[]>{
    try{
    const id = req.user.sub
    return this.usersService.getUserBookings(id);
    }
    
    catch(error){
      if(error instanceof NotFoundException){
        throw new NotFoundException(error.message)
      }
      else if(error instanceof BadRequestException){
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }
  @UseGuards(AuthGuard)
  @Get('cancelBookings')
  async cancelBookings(@Req() req , @Query("movieId") movieId:string):Promise<any>{
    try{
      const userId = req.user.sub
    return this.usersService.cancelBooking(userId,movieId);
    }
    
    catch(error){
      if(error instanceof NotFoundException){
        throw new NotFoundException(error.message)
      }
      else if(error instanceof BadRequestException){
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }
  
}


//Addtional things need to added - > 1. If any user cancel the bookings it should be reflected in avaible seats
// 2. While booking the tickets if the event show is behind we should not allow user to book
