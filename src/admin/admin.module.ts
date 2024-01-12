import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { authenticationConstants } from 'src/users/constants/constants';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    imports:[JwtModule.register({
        secret:authenticationConstants.SECRET_KEY,
        signOptions:{expiresIn:'1h'}
    })],
    controllers:[AdminController],
    providers:[AdminService],
    exports:[AdminModule]

})
export class AdminModule {}
