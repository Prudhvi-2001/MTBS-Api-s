import { ApiResponse } from '@nestjs/swagger';
import { BookingDto } from 'src/events/dto/booking.dto';
import { EventDto } from 'src/events/dto/create-event.dto';
import { UpdateEventDto } from 'src/events/dto/update-event.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { updateUserDto } from 'src/users/dto/update-user.dto';

export const ApiResponseObj = {
  User: {
    createUser: ApiResponse({
      type: CreateUserDto,
      description: 'User has been registered successfully!',
      status: 202,
    }),
    userExist: ApiResponse({
      description: 'User already exists with the given username!',
      status: 500,
    }),
    userLogin: ApiResponse({
      description: 'access_token',
      status: 201,
    }),
    UserNotFound: ApiResponse({
      status: 404,
      description: 'User not found',
    }),
    deleteUser: ApiResponse({
      status: 200,
      description: 'User has been soft-deleted',
    }),
    notFoundDeleted: ApiResponse({
      status: 404,
      description: 'Deleted User can not be retrieved',
    }),
    updateUser: ApiResponse({
      status: 202,
      description: 'User updated sucessfully',
      type: updateUserDto,
    }),
    deletedUpdate: ApiResponse({
      status: 403,
      description: 'You are trying to perform an operation on a deleted user.',
    }),
    noBookings: ApiResponse({
      status: 404,
      description: 'This user does not have any booking yet.',
    }),
    getUser: ApiResponse({
      status: 201,
      type: CreateUserDto,
    }),
    useerBookings: ApiResponse({
      status: 200,
      type: BookingDto,
    }),
    cancelBookings: ApiResponse({
      status: 201,
      description: 'The Booking is successfully Cancelled!',
    }),
  },
  Event: {
    createEvent: ApiResponse({
      status: 201,
      description: 'Event has been registered',
      type: EventDto,
    }),
    eventExist: ApiResponse({
      status: 403,
      description: 'Event is already exist',
    }),
    bookSeats: ApiResponse({
      status: 201,
      description: 'Please Confirm the booking!',
    }),
    confirmBooking: ApiResponse({
      status: 200,
      description: 'Booking confirmed successfully!',
    }),
    noBookingsexistTOConfirm: ApiResponse({
      status: 404,
      description: 'You do not have any bookings to Confirm!',
    }),
    deleteEvent: ApiResponse({
      status: 200,
      description: 'Event has been soft-deleted',
    }),
    deletedupdate: ApiResponse({
      status: 403,
      description: "Deleted Event can't be Updated",
    }),
    availableSeats: ApiResponse({
      description: 'List of Available Seats for this Event.',
    }),
    getEvent: ApiResponse({
      type: EventDto,
    }),
    getDeletedEvent: ApiResponse({
      description: "Deleted event can't be retrieved",
    }),
    updateEvent: ApiResponse({
      status: 204,
      description: 'The record has been successfully updated.',
      type: UpdateEventDto,
    }),
    cancelUnconfirmedBookings: ApiResponse({
      description: 'Unconfirmed bookings canceled successfully.',
    }),
    eventNotFound: ApiResponse({
      status: 404,
      description: 'Event not found',
    }),
    fetchEvents:ApiResponse({
      type:Event,
      description:"Fetched all the details of the event"
    })
  },

  Admin: {
    adminNotFound: ApiResponse({
      description: 'Admin not Found',
    }),
    adminLogin: ApiResponse({
      status: 202,
      description: 'access_token',
    }),
  },
};
