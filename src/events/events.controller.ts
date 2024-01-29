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
import { Event } from './schemas/event.schema';
import { EventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from '../admin/guards/admin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { selectedDto } from './dto/selected.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponseObj } from 'src/swagger/swagger';
@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('createEvent')
  @SetMetadata('isAdmin', true)
  @UsePipes(ValidationPipe)
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Event',
    description: 'Needs admin token to create the token',
  })
  @ApiResponseObj.Event.createEvent
  @ApiResponseObj.Event.eventExist
  @ApiResponseObj.Admin.adminNotFound
  async createEvent(@Req() req, @Body() eventDto: EventDto): Promise<Object> {
    const createdBy: string = req.user.username;

    return this.eventsService.create(eventDto, createdBy);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all the Events',
  })
  @ApiResponseObj.Event.eventNotFound
  @ApiResponseObj.Event.fetchEvents
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @ApiResponseObj.Event.availableSeats
  @ApiResponseObj.Event.eventNotFound
  @Get('available-seats')
  @ApiOperation({
    summary: 'Available Seats',
  })
  findAvailableSeats(@Query('movieId') eventId: string): Promise<Object> {
    return this.eventsService.findAvailableSeats(eventId);
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('book-seats')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'To book seats',
    description: 'THis route need user token to book seats',
  })
  @ApiResponseObj.Event.bookSeats
  @ApiResponseObj.User.UserNotFound
  @ApiResponseObj.Event.eventNotFound
  async bookSeats(
    @Query('movieId') eventId: string,
    @Req() req,
    @Body() bookSeatsDto: selectedDto,
  ): Promise<Object> {
    const userId: string = req.user.sub;

    return await this.eventsService.bookSeats(
      eventId,
      userId,
      bookSeatsDto.seats,
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'confirm booking',
    description: 'Needs user token',
  })
  @ApiResponseObj.Event.confirmBooking
  @ApiResponseObj.Event.eventNotFound
  @ApiResponseObj.User.UserNotFound
  @Post('confirm-booking')
  async confirmBooking(
    @Query('movieId') eventId: string,
    @Req() req,
  ): Promise<Object> {
    const userId = req.user.sub;
    const username = req.user.username;

    return await this.eventsService.confirmBooking(eventId, userId, username);
  }

  @ApiResponseObj.Event.getEvent
  @ApiResponseObj.Event.eventNotFound
  @ApiResponseObj.Event.getDeletedEvent
  @Get('getEvent')
  @ApiOperation({
    summary: 'To get Specific Event',
    description:
      'Endpoint to authenticate a user and retrieve an access token.',
  })
  getEvent(@Query('movieId') movieId: string): Promise<Event> {
    return this.eventsService.findEvent(movieId);
  }

  @SetMetadata('isAdmin', true)
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Event',
    description: 'Needs admin token to access.',
  })
  @Put('updateEvent')
  @ApiResponseObj.Event.updateEvent
  @ApiResponseObj.Event.deletedupdate
  @ApiResponseObj.Event.eventNotFound
  @ApiResponseObj.Admin.adminNotFound
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Event',
    description: 'Needs admin token to access',
  })
  @ApiResponseObj.Event.deleteEvent
  @ApiResponseObj.Event.eventNotFound
  @ApiResponseObj.Admin.adminNotFound
  async deleteEvent(@Param('movieId') eventId: string): Promise<Object> {
    return this.eventsService.deleteEvent(eventId);
  }

  //To cancel the unconfirmed bookings by admin
  @SetMetadata('isAdmin', true)
  @UseGuards(AdminGuard)
  @Post('cancel-booking')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel unconfirmed booking by admin',
    description: 'Need admin token to access ',
  })
  @ApiResponseObj.Event.cancelUnconfirmedBookings
  @ApiResponseObj.Event.eventNotFound
  @ApiResponseObj.Admin.adminNotFound
  async cancelUnconfirmedAdmin(
    @Req() req,
    @Query('movieId') movieId: string,
    username: string,
  ): Promise<Object> {
    const userName = req.user.username;
    return this.eventsService.cancelBookingByAdmin(movieId, userName);
  }
}
