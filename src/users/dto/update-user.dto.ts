import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class updateUserDto {
  @IsString({ message: 'Must be a String' })
  @MinLength(5, { message: 'Should be greater than 5 Characters' })
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'Username should not consist of Special Characters',
  })
  username: string;
  
  @IsEmail({}, { message: 'Not a valid Email' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @ApiProperty({
    description: 'The email address of the user.',
    format: 'Email',
    example: 'prudhvi@gmail.com',
  })
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one special character',
  })
  @MinLength(6, { message: 'Password should be more than 6 characters' })
  @MaxLength(12, { message: 'Should not be more than 12 characters' })
  @ApiProperty({
    description: 'The password of the user should consists of special Characters, numbers and UpperCase. ',
    minLength: 6,
    maxLength: 12,
    example: 'Prudhvi@2001',
  })
  password: string;

  @IsBoolean({ message: 'isDeleted should be a boolean value' })
  isDeleted?: boolean;
}

export class UpdateUserBooking extends updateUserDto {
  bookings: number[];
}
