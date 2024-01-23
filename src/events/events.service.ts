import {
  Injectable,
  Inject,
  NotFoundException,
  forwardRef,
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Booking,
  Event,
  EventDto,
  UpdateEventDto,
} from './schemas/event.schema';
import { UsersService } from '../users/users.service';
import { selectedDto } from './dto/selected.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CLIENT_RENEG_LIMIT } from 'tls';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  // To create the specific event with available seats and Bookings available
  create = async (
    event: EventDto,
    createBy: string,
  ): Promise<Object | null> => {
    try {
      if (!event || !event.name) {
        throw new BadRequestException("Event name Can't be null");
      }
      const existingEvent = await this.eventModel
        .findOne({ name: event.name })
        .exec();
      if (!event.availableSeats) {
        throw new NotFoundException("Can't find seats");
      }
      for (const seat of event.availableSeats) {
        if (seat > 100) {
          throw new BadRequestException(
            'Seat number cannot exceed 100!! You have a capacity of 100',
          );
        }
      }
      if (event.availableSeats.length === 0) {
        throw new NotFoundException("Seats Can't be empty");
      }
      if (existingEvent) {
        throw new ForbiddenException('Event is already exist');
      }
      const hasDuplicateSets =
        new Set(event.availableSeats).size !== event.availableSeats.length;
      if (hasDuplicateSets) {
        throw new BadRequestException(
          'Seat numbers repeated. Please provide valid seat numbers.',
        );
      }
      const newEvent = new this.eventModel(event);
      const eventNew = await newEvent.save();
      return {
        message: 'Event has been registered',
        Event: newEvent,
        createdBy: createBy,
        CreatedTime: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  findAll = async (): Promise<Event[]> => {
    try {
      return this.eventModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  // To find the available seats for booking
  findAvailableSeats = async (eventId: string): Promise<Object> => {
    try {
      const event = await this.eventModel.findById(eventId).exec();

      if (!event) {
        throw new NotFoundException("Oops!! Can't get the Event");
      }

      const bookedSeats = event.bookings.flatMap((booking) => booking.seats);
      const availableSeats = event.availableSeats.filter(
        (seat) => !bookedSeats.includes(seat),
      );

      return {
        availableSeats: {
          event: event.name,
          seats: {
            available: [availableSeats],
          },
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  // To book the seats
  bookSeats = async (
    eventId: string,
    userId: string,
    seats: number[],
  ): Promise<Object> => {
    try {
      // Check if seats are null
      if (!seats || seats.length === 0) {
        throw new BadRequestException("Seats can't be null to book");
      }

      const event = await this.eventModel.findById(eventId).exec();

      const hasDuplicates = new Set(seats).size !== seats.length;
      if (hasDuplicates) {
        throw new BadRequestException(
          "Repeated seat numbers aren't allowed to book",
        );
      }

      if (seats.length === 0) {
        throw new BadRequestException('Please mention seats!');
      }

      if (!Array.isArray(seats)) {
        throw new BadRequestException(
          'Invalid seats format. Please provide seat numbers.',
        );
      }

      if (!seats) {
        throw new NotFoundException("Can't find seats");
      }
      if (!event) {
        throw new NotFoundException("Oops! Can't find the Event");
      }

      const existingBooking = event.bookings.find(
        (booking) => booking.user.toString() === userId && !booking.confirmed,
      );

      if (existingBooking) {
        throw new BadRequestException(
          'User had a booking that has yet to be confirmed!',
        );
      }

      const availableSeats = event.availableSeats;
      const unavailableSeats: number[] = [];

      for (const selectedSeat of seats) {
        if (!availableSeats.includes(selectedSeat)) {
          unavailableSeats.push(selectedSeat);
        }
      }

      if (unavailableSeats.length > 0) {
        throw new BadRequestException(
          `Seats ${unavailableSeats.join(', ')} are not available`,
        );
      }

      const user = await this.usersService.getUser(userId);

      // Use updateOne instead of save
      await this.eventModel.updateOne(
        { _id: eventId },
        {
          $push: {
            bookings: {
              user: userId,
              seats,
              confirmed: false,
              createdAt: new Date(),
            },
          },
          $pull: {
            availableSeats: { $in: seats },
          },
        },
      );

      return {
        message: 'Please Confirm the booking!',
        bookingDetails: {
          user: user.username,
          event: event.name,
          seats: seats.join(', '),
          BookingConfirmation: false,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  // To confirm the ticket
  confirmBooking = async (
    eventId: string,
    userId: string,
    username: string,
  ): Promise<Object> => {
    try {
      const event = await this.eventModel.findById(eventId).exec();

      if (!event) {
        throw new NotFoundException("Oops! Can't find the Event");
      }
      // To find if the user has any unconfirmed booking
      const booking = event.bookings.find(
        (booking) => booking.user === userId && !booking.confirmed,
      );

      if (!booking) {
        const notbookedUser = await this.usersService.getUser(userId);
        throw new BadRequestException(
          `${notbookedUser.username}, You do not have any bookings to Confirm!`,
        );
      }

      booking.confirmed = true;
      event.markModified('bookings'); // to update the confirmation state in db
      await event.save(); // bookings will be updated in events

      const confirmedSeats = booking.seats.join(', ');
      this.usersService.updateBookings(
        userId,
        booking.seats,
        event.name,
        event.date,
        eventId,
      );
      console.log(booking.seats);
      return {
        message: 'Booking confirmed successfully!',
        bookingDetails: {
          user: username,
          event: event.name,
          showTime: event.date,
          seats: confirmedSeats,
          confirmationTime: new Date(),
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  // To cancel the unconfirmed tickets
  @Cron(CronExpression.EVERY_MINUTE) // to trigger the function every minute to find any unconfirmed bookings
  async cancelUnconfirmedBookings(): Promise<void> {
    try {
      const events = await this.eventModel.find().exec();

      for (const event of events) {
        const originalAvailableSeats = event.availableSeats.slice(); // copy of availableSeats
        const canceledSeats: number[] = [];

        event.bookings = event.bookings.filter((booking) => {
          const isConfirmed = booking.confirmed;
          const within10Minute =
            booking.createdAt > new Date(Date.now() - 1 * 60 * 1000);

          if (!isConfirmed && !within10Minute) {
            // Booking is not confirmed and older than 10 minutes
            canceledSeats.push(...booking.seats);
            return false; // Remove that particular booking
          }

          return true; // Keep the booking
        });

        const hasDuplicates =
          new Set(canceledSeats).size !== canceledSeats.length;

        if (!hasDuplicates) {
          event.availableSeats = [...event.availableSeats, ...canceledSeats]; // updating the available seats with cancelled seats.
        }

        await this.eventModel.updateOne(
          { _id: event._id },
          {
            $set: {
              bookings: event.bookings,
              availableSeats: event.availableSeats,
            },
          },
        );
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // To find the event by id
  findEvent = async (id: string): Promise<Event> => {
    try {
      const event = this.eventModel.findById(id);
      if ((await event).isDeleted === true) {
        throw new BadRequestException("Deleted Event Can't be retrieved..");
      }
      return event;
    } catch (error) {
      throw new NotFoundException('Event not found');
    }
  };

  // To update the event
  updateEvent = async (
    eventId: string,
    updatedEventDto: UpdateEventDto,
  ): Promise<Object> => {
    try {
      const event = this.eventModel.findById(eventId);
      if ((await event).isDeleted) {
        throw new BadRequestException("Deleted Event can't be UPdated");
      }
      await this.eventModel.findByIdAndUpdate(eventId, updatedEventDto);
      return {
        message: 'Event has been updated',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  // To delete the Event
  deleteEvent = async (eventId: string): Promise<Object> => {
    try {
      const event = await this.eventModel.findById(eventId);

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      event.isDeleted = true;

      await this.eventModel.updateOne(
        { _id: event._id },
        { $set: { isDeleted: true } },
      );

      return {
        message: 'Event has been soft-deleted',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new NotFoundException('Event not found');
    }
  };

  // To cancel the booking for a specific event by admin
  cancelBookingByAdmin = async (
    eventId: string,
    adminName: string,
  ): Promise<Object> => {
    try {
      const canceledSeats: number[] = [];
      const event = await this.eventModel.findById(eventId).exec();
      if (!event) throw new BadRequestException("OOps Can't find the event");
      event.bookings = event.bookings.filter((booking) => {
        const isConfirmed = booking.confirmed;
        const within10Minute =
          booking.createdAt > new Date(Date.now() - 10 * 60 * 1000);

        if (!isConfirmed && !within10Minute) {
          // Booking is not confirmed and older than 10 minutes
          canceledSeats.push(...booking.seats);
          return false; // Remove that particular booking
        }

        return true; // Keep the booking
      });
      event.availableSeats = [...event.availableSeats, ...canceledSeats];
      await event.save();
      return {
        unconfirmedBy: adminName,
        message: 'Unconfirmed bookings canceled successfully.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  getSpecificEvent = async (id: string): Promise<any> => {
    try {
      return this.eventModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Event not found');
    }
  };

  updateAvailableSeats = async (
    eventId: string,
    cancelledSeats: number[],
  ): Promise<void> => {
    try {
      const event = await this.eventModel.findById(eventId);

      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }

      // Ensure that the cancelled seats are unique
      const uniqueCancelledSeats = [...new Set(cancelledSeats)];

      // Update available seats by removing cancelled seats
      event.availableSeats = [...event.availableSeats, ...uniqueCancelledSeats];

      // Save the updated event usinng updateOne
      await this.eventModel.updateOne(
        { _id: event._id },
        { $set: { availableSeats: event.availableSeats } },
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
