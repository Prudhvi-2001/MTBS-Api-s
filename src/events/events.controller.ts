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
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event, EventDto, UpdateEventDto } from './schemas/event.schema';
import { AuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from '../admin/guards/admin.guard';
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
  
  @Post("createEvent")
  @SetMetadata("isAdmin",true)
  @UsePipes(ValidationPipe)
  @UseGuards(AdminGuard)
  async createEvent(@Req() req,@Body() eventDto:EventDto):Promise<Object>{
    const createdBy:string = req.user.username
    return this.eventsService.create(eventDto,createdBy)
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

  @Get(':eventId/available-seats')
  findAvailableSeats(@Param('eventId') eventId: string): Promise<Object> {
    try{ return this.eventsService.findAvailableSeats(eventId);}
    catch(error){
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;

    }
   
  }
//To book the seats for specific event
//ApiEndPoint :http://localhost:3000/:eventId/book-seats
//Method       : POST
//params       : eventId - is required
//req.headers.authorization :token(must be there to book the seats)
//req.body={ "seats":[12,13,14]}

  @UseGuards(AuthGuard)
  @Post(':eventId/book-seats')
  async bookSeats(
    @Param('eventId') eventId: string,
    @Req() req,
    @Body('seats') seats: number[],
  ): Promise<Object> {
    const userId:string = req.user.sub
    console.log(userId);
    try {
     return  await this.eventsService.bookSeats(eventId, userId, seats);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
  
  //To confirm the booking after the user has reserved
  //ApiEndPoint : http://localhost:3000/:eventId/confirm-booking
  //Method       : POST
  //Params       : eventId - is required
  //req.headers.authorization : token(to identify who is trying to make a request)
  //No body params are needed here as we just need to send the event id and auth token


  @UseGuards(AuthGuard)
  @Post(':eventId/confirm-booking')
  async confirmBooking(@Param('eventId') eventId: string, @Req() req): Promise<Object> {
    const userId = req.user.sub;
     
    try {
      return await  this.eventsService.confirmBooking(eventId, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
    
  }
  //to get the specific event
  //API Endpoint : http://localhost:3000/events/:id
  //Method        : GET
  //Params        : id - is required

  @Get(":eventId")
  getEvent(@Param("eventId") eventId:string):Promise<Event>{
    return this.eventsService.findEvent(eventId)
  }


  //To update the event
  //API End Point : http://localhost:3000/events/:eventId/updateEvent
  //Method         : PUT
  //Params         : eventId - is required , data - is required
  //req.body.data contains updated information about the event
   
   @UseGuards(AdminGuard)
   @Put(":eventId/updateEvent")
  async UpdateEvent(@Body() @Param("eventId") eventId:string, updateEventDto:UpdateEventDto):Promise<Object>{
    return this.eventsService.updateEvent(eventId ,updateEventDto)
  }

  //to delete the event with admin authorization
  //API EndPoint : http://localhost:3000/events/:eventId/delete
  //Method        : DELETE
  //Params        : eventId - is required

  
  @UseGuards(AdminGuard)
  @Delete(":eventId/deleteEvent")
  async deleteEvent(@Param("eventId") eventId:string):Promise<Object>{
    return this.eventsService.deleteEvent(eventId)
  }



}



