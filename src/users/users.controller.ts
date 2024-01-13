import { Controller, Get, Query,Post, Body, Req,Patch, Param,Put, Delete ,Request, UseGuards, UsePipes, ValidationPipe, HttpStatus} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guards/user.guard';
import { updateUserDto } from './dto/update-user.dto';
import {User} from "./schemas/user.schema"
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
    return this.usersService.create(createUserDto)
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
    return this.usersService.login(loginUser.username,loginUser.password)
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
  async getUser(@Query("id") id:string):Promise<User>{
    return this.usersService.getUser(id);
  }
  //To delete User 
  //ApiEndPoint: http://localhost:3000/users/deleterUser/:id
  //Method:DELETE

  @Delete("deleteUser")
  async deleteUser(@Query('id') id:string):Promise<Object>{
    this.usersService.deleteUser(id)
    return {
      message:"User has Deleted!!",
    }
  }
//To update the User
//ApiEndPoint:http://localhost:3000/users/:id/updateUser
//Method:PUT
  @UseGuards(AuthGuard)
  @Put('updateUser')
  async updateProfile(@Req() req, @Body() updateUserDto: updateUserDto) {
    const userId = req.user.sub
    return this.usersService.updateUser(userId, updateUserDto);
  }
}
