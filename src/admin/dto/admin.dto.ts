import { ApiProperty } from "@nestjs/swagger";
export class adminDto{
adminId:number;

@ApiProperty({
    description:"Admin Username",
    example:"admin"
})
username:string;

@ApiProperty({
    description:"Admin Password",
    example:"password"
})
password:string;
isAdmin:boolean
}