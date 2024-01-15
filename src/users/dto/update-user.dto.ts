import { IsEmail, IsInt, IsNotEmpty, IsString, MATCHES, Matches, MaxLength, MinLength, max, maxLength, min, minLength } from 'class-validator';

export class updateUserDto {
    @IsString({message:"Must be a String"})
    @MinLength(5,{message:"Should be greater than 5 Characters"})
    @Matches(/^[a-zA-Z0-9\s]+$/,{
      message:"Username should not consists of Special Characters"
    })
    username:string;

    @IsEmail({},{message:"Not valid Email"})
    @IsNotEmpty()
    email:string;
    
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
      })
      @MinLength(6,{message:"Password should be more than 6 characters"})
      @MaxLength(12,{message:"Should not be more than 12 characters"})
    password:string;
}

export class updateUserBooing extends updateUserDto{
  bookings:number[]
}
