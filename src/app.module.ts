import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import {databaseUrl} from './users/constants/constants'
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
     MongooseModule.forRoot(databaseUrl.URL),
    UsersModule, 
    EventsModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath:".env",
      isGlobal:true
    }),
    AdminModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
