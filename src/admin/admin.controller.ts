import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { adminDto } from './dto/admin.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseObj } from 'src/swagger/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @ApiOperation({
    summary: 'Admin Login',
    description: 'Get the admin token',
  })
  @ApiResponseObj.Admin.adminLogin
  @Post('login')
  async login(@Body() adminDto: adminDto): Promise<Object> {
    return this.adminService.loginAdmin(adminDto.username, adminDto.password);
  }
}
