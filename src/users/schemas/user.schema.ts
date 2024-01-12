// users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class User {

  @Prop({ required: true }) 
  username: string;

  @Prop({required:true})
  email:string
  
  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
