import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, ArrayMinSize, ArrayMaxSize } from 'class-validator';
export class selectedDto{
    @IsArray()
    @IsNotEmpty({ message: 'Seats should not be empty' })
    @ArrayMinSize(1, { message: 'At least one seat must be selected' })
    @ArrayMaxSize(10, { message: 'Cannot book more than 10 seats at once' })
    @IsNumber({}, { each: true, message: 'Each seat must be a number' })
    @ApiProperty({
        description:"Provide the seat numbers",
        example:[1,2,3]
    })
    seats: number[];
}