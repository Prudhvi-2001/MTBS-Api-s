import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { authenticationConstants } from './constants/constants';

@Module({
  imports:[MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
          JwtModule.register({
            secret:authenticationConstants.SECRET_KEY,
            signOptions:{expiresIn:'1hr'}
          })
],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
