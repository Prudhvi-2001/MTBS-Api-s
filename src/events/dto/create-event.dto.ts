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
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { Booking } from '../schemas/event.schema';
export class EventDto {
    @IsString({ message: 'Must be a String' })
    @IsNotEmpty({ message: 'Name should not be empty' })
    @ApiProperty({
        description: 'The name of the Event',
        example: 'SALAAR',
      })

    name: string;
    @ApiProperty({
        description:"Date of Event",
        example:"2023-12-22T09:30:00Z"
    })
    @IsDateString({}, { message: 'Invalid date format' })
    @IsOptional()
    date: Date;
    @ApiProperty({
        description:"Available Seats -> Note Duplicates are not allowed",
        example:[1,2,3,4,5,6,7,8,9,10,11,12,12]
    })
    @IsArray({ message: 'Available seats must be an array' })
    @IsNotEmpty({ message: 'Available seats should not be empty' })
    availableSeats: number[];
    @Optional()
    @ApiProperty({
        description:"Number of Bookings",
        example:[]
    })
    bookings: Booking[];

    @Optional()
    isDeleted?: boolean;
  }