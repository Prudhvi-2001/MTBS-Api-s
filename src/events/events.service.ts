// events/events.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException, HttpStatus, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, Event, EventDto, UpdateEventDto } from './schemas/event.schema';
import { UsersService } from '../users/users.service';
import { selectedDto } from './dto/selected.dto';
import { User } from 'src/users/schemas/user.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    private readonly usersService: UsersService,
  ) {}
  //To create the specific event with avialbe seats and Bookings available
  async create(event:EventDto,createBy:string): Promise<Object> {
    const existingEvent = await this.eventModel.findOne({ name:event.name }).exec();
    if(!event.availableSeats){ throw new NotFoundException("Can't find seats"); } 
    if(event.availableSeats.length === 0) { throw new NotFoundException("Seats Can't be empty"); } 
    if (existingEvent) {
      throw new ForbiddenException("Event is already exist")
    }
    const hasDuplicateSets = new Set(event.availableSeats).size !== event.availableSeats.length
    if(hasDuplicateSets){
      throw new BadRequestException("Duplicate seats found. Please provide valid seat numbers.");
    }
    const newEvent = new this.eventModel(event)
    newEvent.save()
    return {
      message:"Event has been registered",
      statusCode:HttpStatus.CREATED,
      createdBy:createBy,
      createdAt: new Date().toDateString()
    }
  }
  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }
  //To find the availabe seats for booking
  async findAvailableSeats(eventId: string): Promise<Object> {
    const event = await this.eventModel.findById(eventId).exec();

    if (!event) {
      throw new NotFoundException("Oops!! Can't get the Event");
    }

    const bookedSeats = event.bookings.flatMap((booking) => booking.seats);
    const availableSeats = event.availableSeats.filter((seat) => !bookedSeats.includes(seat));

    return {
      seatsAvailable:availableSeats,
      status:HttpStatus.OK
    };
  }
//To book the seats
  async bookSeats(eventId: string, userId: string, seats: number[]): Promise<Object> {
    const event = await this.eventModel.findById(eventId).exec();
    const hasDuplicates = new Set(seats).size !== seats.length;
    if (hasDuplicates) {
      throw new BadRequestException("Duplicate seat numbers are not allowed");
    }
    if(seats.length === 0) {throw new BadRequestException("Please mention seats!");}
    console.log(seats.length);
    if (!Array.isArray(seats)) {
      throw new BadRequestException("Invalid seats format. Please provide seat numbers.");
    }
    if(!seats) { throw new NotFoundException("Can't find seats"); }
    if (!event) {
      throw new NotFoundException("Oops! Can't find the Event");
    }
    const existingBooking = event.bookings.find(
      (booking) => booking.user.toString() === userId && !booking.confirmed,
    );
    
    if (existingBooking) {
      throw new BadRequestException('User had booking which yet to be confirmed !');
    }

    const availableSeats = event.availableSeats;
    const unavailableSeats: number[] = [];

    for (const selectedSeat of seats) {
      if (!availableSeats.includes(selectedSeat)) {
        unavailableSeats.push(selectedSeat);
      }
    }

    if (unavailableSeats.length > 0) {
      throw new BadRequestException(`Seats ${unavailableSeats.join(', ')} are not available`);
    }
    console.log(userId);
    const user = await this.usersService.getUser(userId);
    event.bookings.push({
      user: userId,
      seats,
      confirmed: false,
      createdAt: new Date(),
    });

    event.availableSeats = availableSeats.filter((seat) => !seats.includes(seat));

    await event.save();

    return {
      msg:`${user.username} , You have reserved seats  ${seats.join(', ')} ! Please confirm.`,
      status:HttpStatus.ACCEPTED
    }
  }

 //To confirm the ticket
  async confirmBooking(eventId: string, userId: string): Promise<Object> {
    const event = await this.eventModel.findById(eventId).exec();

    if (!event) {
      throw new NotFoundException("Oops! Can't find the Event");
    }
    //  To find if the user has any unconfirmed booking
    const booking = event.bookings.find(
      (booking) => booking.user === userId && !booking.confirmed,
    );
    
    if (!booking) {
      const notbookedUser = await this.usersService.getUser(userId);
      throw new BadRequestException(`${notbookedUser.username} , You do not have any bookings to Confirm!`);
    }

    booking.confirmed = true;
    event.markModified('bookings'); //to update the confirmation state in db
    await event.save(); //bookings will be updated in events

    const confirmedSeats = booking.seats.join(', ');
   
    return {
      message:`Hurray !! , Booking confirmed! Seats booked: ${confirmedSeats}`,
      bookingConfirmation:booking.confirmed,
      status:HttpStatus.NO_CONTENT
    };
    
  }

//To cancel the unconfirmed tickets
@Cron(CronExpression.EVERY_MINUTE) // to trigger the function every minute to find any unconfirmed bookings
  async cancelUnconfirmedBookings(): Promise<void> {
    const events = await this.eventModel.find().exec();
    for (const event of events) {
      const originalAvailableSeats = event.availableSeats.slice(); // copy of availableSeats

      const canceledSeats: number[] = [];

      event.bookings = event.bookings.filter(
        (booking) => {
          const isConfirmed = booking.confirmed;
          const within10Minute = booking.createdAt > new Date(Date.now() - 1 * 60 * 1000);

          if (!isConfirmed && ! within10Minute) {
            // Booking is not confirmed and older than 10 minutes
            canceledSeats.push(...booking.seats);
            return false; // Remove that particular booking
          }
         
          return true; // Keep the booking
        },
      );
      const hasDuplicates = new Set(canceledSeats).size !== canceledSeats.length
      if(!hasDuplicates){
        event.availableSeats = [...event.availableSeats, ...canceledSeats]; //updating the available seats with cancelled seats.
      }
   
      event.markModified('bookings'); //to update the confirmation state in db
      await event.save();
    }
  }
  //To find the event by id 
  async findEvent(id:string):Promise<Event>{
    return this.eventModel.findById(id)
  }
  //To update the event
  async updateEvent(eventId:string, updatedEventDto:UpdateEventDto):Promise<Object>{
    await this.eventModel.findByIdAndUpdate(eventId,updatedEventDto)
    return {
      message:"Event has been updated",
      statusCode:HttpStatus.CREATED
    }


  }

  //  To delete the Event
  async deleteEvent(eventId:string):Promise<Object>{
    await this.eventModel.findByIdAndDelete(eventId)
    return {
      message:"Event has been deleted",
      statusCode:HttpStatus.CREATED
    }


  }
  
}