import { Global, Module, forwardRef } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schemas/event.schema';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { authenticationConstants } from 'src/users/constants/constants';
@Global()
@Module({
  imports: [
    forwardRef(() => UsersModule), // Use forwardRef to resolve circular dependency
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
    JwtModule.register({
      secret: authenticationConstants.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    ScheduleModule.forRoot(),
    
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports:[EventsService]
})
export class EventsModule {}
