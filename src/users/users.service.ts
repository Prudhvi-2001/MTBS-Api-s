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

  // To Create the User
  async create(user: CreateUserDto): Promise<Object> {
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
      const newUser = new this.userModel({
        ...user,
        password: hashedPassword,
      });
      await newUser.save();

      return {
        user: newUser.username,
        message: 'User has been registered successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // To login the User and it will generate a token
  async login(username: string, password: string): Promise<Object> {
    try {
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
  }

  // To get the specific User
  async getUser(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  // To delete the user
  async deleteUser(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async updateUser(username: string, updateDto: updateUserDto): Promise<User | null> {
    try {
        if (updateDto.username) {
            throw new HttpException("Can't update the username", HttpStatus.BAD_REQUEST);
        }

        const updatedUser = await this.userModel.findOneAndUpdate({ username }, {
            $set: {
                email: updateDto.email || undefined,
                password: updateDto.password || undefined,
            },
        }, { new: true });

        if (!updatedUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return updatedUser;
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


  async updateBookings(
    id: string,
    seats: number[],
    movieName: string,
    showTime: Date,
    eventId: string,
  ): Promise<void> {
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
  }

  async getUserBookings(userId: string): Promise<any[]> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user.bookings || user.bookings.length === 0) {
        throw new BadRequestException('No bookings found for this user');
      }
      return user.bookings || [];
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async cancelBooking(id: string, movieId: string): Promise<any> {
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
  }
}
