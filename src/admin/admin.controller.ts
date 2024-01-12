import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { adminDto } from './dto/admin.dto';

@Controller('admin')
export class AdminController {
    constructor(private adminService:AdminService){}
    
    @Post("login")
    async login(@Body() adminDto:adminDto ):Promise<Object> {

    return this.adminService.loginAdmin(adminDto.username,adminDto.password);
    
    }
}
