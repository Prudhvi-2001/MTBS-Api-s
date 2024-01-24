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




export const EventSchema = SchemaFactory.createForClass(Event);
