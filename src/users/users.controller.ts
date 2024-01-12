import { Controller, Get, Post, Body, Patch, Param, Delete ,Request, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guards/user.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("createUser")
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }
  @Post('login')
  login(@Body() loginUser:CreateUserDto){
    return this.usersService.login(loginUser.username,loginUser.password)
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  profile(@Request() req){
    return req.user
  }

  @Get("allUsers")
  listUsers(){
    return this.usersService.findAllUsers();
  }

}
