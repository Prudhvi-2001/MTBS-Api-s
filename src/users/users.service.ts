import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private eventsService: EventsService,
  ) {}

  create = async (user: CreateUserDto): Promise<Object> => {
    try {
      const existingUser = await this.userModel
        .findOne({ username: user.username })
        .exec();
      if (existingUser) {
        throw new ForbiddenException(
          'User already exists with the given username!',
        );
      }

      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const newUser = new this.userModel({ ...user, password: hashedPassword });
      await newUser.save();

      return {
        user: newUser.username,
        message: 'User has been registered successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  login = async (username: string, password: string): Promise<Object> => {
    try {
      if (username === '' && password === '') {
        throw new BadRequestException("username and password can't be null");
      }

      const user = await this.userModel.findOne({ username }).exec();
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const hexId = user._id.toHexString();
      const payload = { sub: hexId, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  getUser = async (id: string): Promise<User> => {
    try {
      const user = await this.userModel.findById(id);
      if (user.isDeleted === true) {
        throw new NotFoundException('Deleted data is not retrieved');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  };

  deleteUser = async (id: string) => {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userModel.updateOne(
        { _id: id },
        { $set: { isDeleted: true } },
      );

      return {
        message: 'User has been soft-deleted',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  };

  updateUser = async (
    userId: string,
    username: string,
    updateDto: updateUserDto,
  ): Promise<User | null> => {
    try {
      if (updateDto.username) {
        throw new HttpException(
          "Can't update the username",
          HttpStatus.BAD_REQUEST,
        );
      }
      // Null checks for updating the user
      if (updateDto.email === '' && updateDto.password === '') {
        throw new BadRequestException("Email and Password can't be null");
      }
      const user = await this.userModel.findById(userId);
      if (user.isDeleted === true) {
        throw new BadRequestException("Deleted data can't be updated.");
      }
      console.log(user.isDeleted);
      const updatedUser = await this.userModel.findOneAndUpdate(
        { username },
        {
          $set: {
            email: updateDto.email || undefined,
            password: updateDto.password || undefined,
          },
        },
        { new: true },
      );

      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return updatedUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  updateBookings = async (
    id: string,
    seats: number[],
    movieName: string,
    showTime: Date,
    eventId: string,
  ): Promise<void> => {
    try {
      const user = await this.userModel.findById(id).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.bookings = [
        ...user.bookings,
        {
          movieName: movieName,
          seatsBooked: seats,
          showTime: showTime,
          movieId: eventId,
        },
      ];
      await user.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  getUserBookings = async (userId: string): Promise<any[]> => {
    try {
      const user = await this.userModel.findById(userId).exec();
      console.log('User:', user);
  
      if (!user) {
        console.log('User not found');
        throw new NotFoundException('User not found');
      }
  
      if (user.bookings.length === 0) {
        console.log('No bookings found for this user');
        throw new BadRequestException('No bookings found for this user');
      }
  
      return user.bookings || [];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error; // Rethrow the error
    }
  };
  
  cancelBooking = async (id: string, movieId: string): Promise<any> => {
    try {
      const user = await this.userModel.findById(id);
      const event = await this.eventsService.getSpecificEvent;

      if (!event) {
        throw new BadRequestException('Event not found');
      }

      const bookingIndex = user.bookings.findIndex(
        (booking) => booking.movieId === movieId,
      );

      if (bookingIndex !== -1) {
        const cancelledSeats = user.bookings[bookingIndex].seatsBooked;

        user.bookings.splice(bookingIndex, 1);

        await this.eventsService.updateAvailableSeats(movieId, cancelledSeats);

        await user.save();

        return {
          success: true,
          message: 'Booking canceled successfully',
        };
      } else {
        throw new BadRequestException(
          'No bookings found for the specified movie',
        );
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
