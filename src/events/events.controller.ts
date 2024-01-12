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
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event, EventDto } from './schemas/event.schema';
import { AuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @Post("createEvent")
  @SetMetadata("isAdmin",true)
  @UsePipes(ValidationPipe)
  @UseGuards(AdminGuard)
  async createEvent(@Req() req,@Body() eventDto:EventDto):Promise<Object>{
    console.log(req.user);
    return this.eventsService.create(eventDto)
  }
  @Get()
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

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
  @Get(":eventId")
  getEvent(@Param("eventId") eventId:string):Promise<Event>{
    return this.eventsService.findEvent(eventId)
  }
}



