import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Put,
  Delete,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guards/user.guard';
import { updateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { ApiBearerAuth, ApiTags, ApiProperty, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { loginDto } from './dto/login.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //To create the user
// ApiEndpoint : http://localhost:3000/users/createUser
//Method:POST
// req.body ={
// "username":"Example",
// "email":"example@gmail.com",
// "password":"Example@200"
// }
  @Post('createUser')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Endpoint to register a new user with the provided details.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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
  @ApiOperation({
    summary: 'Login',
    description: 'Endpoint to authenticate a user and retrieve an access token.',
  })

  login(@Body() loginUser: loginDto) {
    return this.usersService.login(loginUser.username, loginUser.password);
  }

  //To check whether token is extracted by the headers and payload
  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Endpoint to retrieve details of the authenticated user.',
  })
 
  profile(@Request() req) {
    return req.user;
  }

  //To get the specific user
  @Get('getUser')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user details',
    description: 'Endpoint to retrieve details of a specific user.',
  })
 
  async getUser(@Req() req): Promise<User> {
    const userId = req.user.sub;
    return this.usersService.getUser(userId);
  }

  //To delete User
//ApiEndPoint: http://localhost:3000/users/deleterUser/
//Method:DELETE
  @UseGuards(AuthGuard)
  @Delete('deleteUser')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user',
    description: 'Endpoint to delete the authenticated user.',
  })
 
  async deleteUser(@Req() req): Promise<Object> {
    const id = req.user.sub;
    return await this.usersService.deleteUser(id);
  }

  //To update the User
  @UseGuards(AuthGuard)
  @Put('updateUser')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Endpoint to update details of the authenticated user.',
  })
 
  async updateProfile(@Req() req, @Body() updateUserDto: updateUserDto): Promise<User> {
    const userName = req.user.username;
    const userId = req.user.sub;
    console.log(userName);
    return this.usersService.updateUser(userId, userName, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('getBookings')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user bookings',
    description: 'Endpoint to retrieve bookings of the authenticated user.',
  })
  
  async getBooking(@Req() req): Promise<any[]> {
    const id = req.user.sub;
    console.log(id);
    return this.usersService.getUserBookings(id);
  }

  @UseGuards(AuthGuard)
  @Post ('cancelBookings')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel user bookings',
    description: 'Endpoint to cancel bookings of the authenticated user.',
  })
  async cancelBookings(@Req() req, @Query('movieId') movieId: string): Promise<any> {
    const userId = req.user.sub;
    return this.usersService.cancelBooking(userId, movieId);
  }
}
