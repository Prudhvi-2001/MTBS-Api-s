import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Movie Ticket Booking System')
  .setDescription("The Movie ticket Booking System is a web application inspired by services like BookMyShow, designed to facilitate the seam booking of movie tickets.In this application Backend Api's have been implemented for users to discover movies, select preferred seats and confirm the booking. Those Api's were built by using NestJs Framework.")
  .setVersion('1.0')
  .addTag('MTBS')
  .addBearerAuth()  // Add this line to enable the "Authorize" button

  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
