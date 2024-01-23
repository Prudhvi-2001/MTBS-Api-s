// events/schemas/event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import MongooseSchema from'mongoose'
import { IS_ARRAY, IsArray, IsDate, IsNotEmpty, IsOptional, IsString, isArray, isNotEmpty } from 'class-validator';
export class Booking{
  @Prop()
  user:string;

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
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [Number], default: Array.from({ length: 100 }, (_, i) => i + 1),required:true})
  availableSeats: number[];


  @Prop({ default: [] })
  bookings: Booking[];

  @Prop({default:false})
  isDeleted:boolean
}

export class EventDto{
    @IsString({message:"Must be a String"})
    @IsNotEmpty()
    name:string;
    @IsOptional()
    date:Date;

    @IsArray()
    @IsNotEmpty()
    availableSeats:number[];

    bookings:Booking[]

    isDeleted?:boolean
}
export class UpdateEventDto{
  @IsString({message:"Must be a String"})
  @IsNotEmpty()
  name:string;
  @IsDate()
  date:Date;
  @IsArray()
  @IsNotEmpty()
  availableSeats:number[];
  @IsArray()
  bookings:Booking[]
  isDeleted?:boolean
}
function duplicateSeats(array:number[]){
  return array.length === new Set(array).size  //checking if the length of the array is equals to the length of the set is created
}

export class BookingDto{

  name:string;
  @IsArray({message:"Type must be array"})
  @IsNotEmpty()
  seats: number[];
  confirmed: boolean;
  createdAt: Date;
  
}
export const EventSchema = SchemaFactory.createForClass(Event);