import { Controller, Get, Post, Body, Patch, Param, Delete ,Request, UseGuards, UsePipes, ValidationPipe, HttpStatus} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guards/user.guard';
import { UpdateUserDto } from './dto/update-user.dto';
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
//To get specific user 
//ApiEndPoint:http://localhost:3000/users/:id
//Method: GET
  @Get("profile")
  @UseGuards(AuthGuard)
  profile(@Request() req){
    return req.user
  }
//To get all Users
//ApiEndPoint:http://localhost:3000/users
//Method:GET
  @Get("allUsers")
  listUsers(){
    return this.usersService.findAllUsers();
  }
  //To delete User 
  //ApiEndPoint: http://localhost:3000/users/deleterUser/:id
  //Method:DELETE

  @Get("deleteUser/:id")
  async deleteUser(@Param('id') id:string):Promise<Object>{
    this.usersService.deleteUser(id)
    return {
      message:"User has Deleted!!",
      status:HttpStatus.FORBIDDEN
    }
  }

  @Post(":id/updateUser")
  async updateUser(@Body()  @Param("id") id:string, updateUserDto:UpdateUserDto):Promise<User>{
    return this.usersService.updateUser(id,updateUserDto)
  }
}
