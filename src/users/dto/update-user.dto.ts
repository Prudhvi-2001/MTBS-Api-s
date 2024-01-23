import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class updateUserDto {
    @Optional()
    username:string;
    @IsEmail({}, { message: "Not a valid email" })
    @IsNotEmpty()
    email: string;

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
    })
    @MinLength(6, { message: "Password should be more than 6 characters" })
    @MaxLength(12, { message: "Should not be more than 12 characters" })
    password: string;
}

export class UpdateUserBooking extends updateUserDto {
    bookings: number[];
}
