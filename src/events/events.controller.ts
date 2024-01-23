import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
  NotFoundException,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  ParseArrayPipe,
  SetMetadata,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event, EventDto, UpdateEventDto } from './schemas/event.schema';
import { AuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from '../admin/guards/admin.guard';
import { monitorEventLoopDelay } from 'perf_hooks';
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  //To create the new Event
  //ApiEndPoint:http://localhost:3000/events/createEvent
  //method:POST
  //req.body ={
  // "name":"movie",
  // "date":"11/01/2023",
  //  availableSeats:[1,2,3,4,5,6,7,8,9,10...]
  //  bookings:[]
  //}
  //req.headers.authorization = token (need to be there to access the routes)

  @Post('createEvent')
  @SetMetadata('isAdmin', true)
  @UsePipes(ValidationPipe)
  @UseGuards(AdminGuard)
  async createEvent(@Req() req, @Body() eventDto: EventDto): Promise<Object> {
    const createdBy: string = req.user.username;

    return this.eventsService.create(eventDto, createdBy);
  }
  //To find all the events
  //ApiEndPoint : http://localhost:3000/events
  //Method : GET

  @Get()
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }
  // To list available seats to book for specific Event
  // ApiEndpoint : http://localhost:3000/events/:id/availableSeats
  // Method      : GET
  // params      : id - is required

  @Get('available-seats')
  findAvailableSeats(@Query('movieId') eventId: string): Promise<Object> {
    return this.eventsService.findAvailableSeats(eventId);
  }
  //To book the seats for specific event
  //ApiEndPoint :http://localhost:3000/:eventId/book-seats
  //Method       : POST
  //params       : eventId - is required
  //req.headers.authorization :token(must be there to book the seats)
  //req.body={ "seats":[12,13,14]}
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('book-seats')
  async bookSeats(
    @Query('movieId') eventId: string,
    @Req() req,
    @Body('seats') seats: number[],
  ): Promise<Object> {
    const userId: string = req.user.sub;

    return await this.eventsService.bookSeats(eventId, userId, seats);
  }

  //To confirm the booking after the user has reserved
  //ApiEndPoint : http://localhost:3000/:eventId/confirm-booking
  //Method       : POST
  //Params       : eventId - is required
  //req.headers.authorization : token(to identify who is trying to make a request)
  //No body params are needed here as we just need to send the event id and auth token

  @UseGuards(AuthGuard)
  @Post('confirm-booking')
  async confirmBooking(
    @Query('movieId') eventId: string,
    @Req() req,
  ): Promise<Object> {
    const userId = req.user.sub;
    const username = req.user.username;

    return await this.eventsService.confirmBooking(eventId, userId, username);
  }
  //to get the specific event
  //API Endpoint : http://localhost:3000/events/:id
  //Method        : GET
  //Params        : id - is required

  @Get('getEvent')
  getEvent(@Query('movieId') movieId: string): Promise<Event> {
    return this.eventsService.findEvent(movieId);
  }

  //To update the event
  //API End Point : http://localhost:3000/events/:eventId/updateEvent
  //Method         : PUT
  //Params         : eventId - is required , data - is required
  //req.body.data contains updated information about the event
  @SetMetadata('isAdmin', true)
  @UseGuards(AdminGuard)
  @Put('updateEvent')
  async UpdateEvent(
    @Req() req,
    @Body() updateEventDto: UpdateEventDto,
    @Query('movieId') eventId: string,
  ): Promise<Object> {
    return this.eventsService.updateEvent(eventId, updateEventDto);
  }

  //to delete the event with admin authorization
  //API EndPoint : http://localhost:3000/events/:eventId/delete
  //Method        : DELETE
  //Params        : eventId - is required

  @SetMetadata('isAdmin', true)
  @UseGuards(AdminGuard)
  @Delete('deleteEvent')
  async deleteEvent(@Param('movieId') eventId: string): Promise<Object> {
    return this.eventsService.deleteEvent(eventId);
  }

  //To cancel the unconfirmed bookings by admin
  @SetMetadata('isAdmin', true)
  @UseGuards(AdminGuard)
  @Post('cancel-booking')
  async cancelUnconfirmedAdmin(
    @Req() req,
    @Query('movieId') movieId: string,
    username: string,
  ): Promise<Object> {
    const userName = req.user.username;

    return this.eventsService.cancelBookingByAdmin(movieId, userName);
  }
}
