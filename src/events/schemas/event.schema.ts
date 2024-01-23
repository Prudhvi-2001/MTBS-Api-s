// events/schemas/event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import MongooseSchema from 'mongoose';
import {
  IS_ARRAY,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  isArray,
  isNotEmpty,
  IsBoolean,
  IsDateString,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Optional } from '@nestjs/common';
import { isatty } from 'tty';
export class Booking {
  @Prop({ required: true })
  user: string;

  @Prop({ type: [Number] })
  @IsArray()
  @IsNotEmpty()
  seats: number[];

  @Prop({ default: false })
  confirmed: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  @IsNotEmpty({ message: 'Event name should not be empty' })
  @MinLength(5, { message: 'Minimum 5 characters should be there' })
  @MaxLength(12, { message: 'Should not exceed more than 12 characters' })
  name: string;

  @Prop({ required: true })
  @IsDate({ message: 'It should be date Format' })
  @IsNotEmpty({ message: 'Should not be empty' })
  date: Date;

  @Prop({
    type: [Number],
    default: Array.from({ length: 100 }, (_, i) => i + 1),
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  availableSeats: number[];

  @Prop({ default: [] })
  @Optional()
  bookings: Booking[];
  @Optional()
  @Prop({ default: false })
  isDeleted: boolean;
}

export class EventDto {
  @IsString({ message: 'Must be a String' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsDateString({}, { message: 'Invalid date format' })
  @IsOptional()
  date: Date;

  @IsArray({ message: 'Available seats must be an array' })
  @IsNotEmpty({ message: 'Available seats should not be empty' })
  availableSeats: number[];
  @Optional()
  bookings: Booking[];
  @Optional()
  @IsBoolean({ message: 'isDeleted should be a boolean value' })
  isDeleted?: boolean;
}
export class UpdateEventDto {
  @IsString({ message: 'Must be a String' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsDateString({}, { message: 'Invalid date format' })
  date: Date;

  @IsArray({ message: 'Available seats must be an array' })
  @IsNotEmpty({ message: 'Available seats should not be empty' })
  availableSeats: number[];

  @IsArray({ message: 'Bookings must be an array' })
  bookings: Booking[];

  @IsBoolean({ message: 'isDeleted should be a boolean value' })
  isDeleted?: boolean;
}
export class BookingDto {
  @Prop({ required: true })
  name: string;
  @IsArray({ message: 'Type must be array' })
  @IsNotEmpty()
  seats: number[];
  @IsBoolean()
  confirmed: boolean;
  @IsDate()
  createdAt: Date;
}
export const EventSchema = SchemaFactory.createForClass(Event);
