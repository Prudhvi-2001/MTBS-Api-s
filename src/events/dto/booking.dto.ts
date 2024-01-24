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
import { ApiProperty } from '@nestjs/swagger';
export class BookingDto {
    @ApiProperty({
        description: 'The name of Event',
      })
    @Prop({ required: true })
    name: string;
    @IsArray({ message: 'Type must be array' })
    @IsNotEmpty()
    @ApiProperty({
        description:"Booked seats"
    })
    seats: number[];
    @IsBoolean()
    @ApiProperty({
        description:"To check whether the user confirms the booking"
    })
    confirmed: boolean;
    @IsDate()
    @ApiProperty({
        description:"To check when the user has confirmed"
    })
    createdAt: Date;
  }