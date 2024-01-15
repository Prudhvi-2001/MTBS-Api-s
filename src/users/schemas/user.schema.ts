// users/schemas/user.schema.ts
import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class User {

  @Prop({ required: true }) 
  username: string;

  @Prop({required:true})
  email:string
  
  @Prop({ required: true })
  password: string;
  @Optional()
  @Prop({ type: [{ movieName: String, seatsBooked: [Number], showTime: Date }] })
  bookings: Array<{ movieName: string; seatsBooked: number[]; showTime: Date ,}>;
}

export const UserSchema = SchemaFactory.createForClass(User);
