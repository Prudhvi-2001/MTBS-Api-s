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
import {
  ApiBearerAuth,
  ApiTags,
  ApiProperty,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { loginDto } from './dto/login.dto';
import { ApiResponseObj } from 'src/swagger/swagger';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('createUser')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Endpoint to register a new user with the provided details.',
  })
  @ApiResponseObj.User.createUser
  @ApiResponseObj.User.userExist
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description:
      'Endpoint to authenticate a user and retrieve an access token.',
  })
  @ApiResponseObj.User.userLogin
  @ApiResponseObj.User.UserNotFound
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
  @ApiResponseObj.User.UserNotFound
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
  @ApiResponseObj.User.getUser
  @ApiResponseObj.User.UserNotFound
  async getUser(@Req() req): Promise<User> {
    const userId = req.user.sub;
    return this.usersService.getUser(userId);
  }

  @UseGuards(AuthGuard)
  @Delete('deleteUser')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user',
    description: 'Endpoint to delete the authenticated user.',
  })
  @ApiResponseObj.User.deleteUser
  @ApiResponseObj.User.UserNotFound
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
  @ApiResponseObj.User.updateUser
  @ApiResponseObj.User.deletedUpdate
  @ApiResponseObj.User.UserNotFound
  async updateProfile(
    @Req() req,
    @Body() updateUserDto: updateUserDto,
  ): Promise<User> {
    const userName = req.user.username;
    const userId = req.user.sub;
    console.log(userName);
    return this.usersService.updateUser(userId, userName, updateUserDto);
  }
  @ApiResponseObj.User.useerBookings
  @ApiResponseObj.User.noBookings
  @ApiResponseObj.User.UserNotFound
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
  @Post('cancelBookings')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel user bookings',
    description: 'Endpoint to cancel bookings of the authenticated user.',
  })
  @ApiResponseObj.User.cancelBookings
  @ApiResponseObj.User.UserNotFound
  @ApiResponseObj.User.noBookings
  async cancelBookings(
    @Req() req,
    @Query('movieId') movieId: string,
  ): Promise<any> {
    const userId = req.user.sub;
    return this.usersService.cancelBooking(userId, movieId);
  }
}
