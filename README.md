
<h1>Movie Ticket Booking System</h1>
## Description
<p>The Movie ticket Booking System is a web application inspired by services like BookMyShow, designed to facilitate the seam booking of movie tickets.In this application Backend Api's have been implemented for users to discover movies, select preferred seats and confirm the booking. Those Api's were built by using NestJs Framework.</p>

## How to Get Started ?
<p>1. Clone the Repositry</p>
<p>2. Install dependencies :```bash npm install ```</p>

## How to run Application ?

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
<h3>Features</h3>
<ul>
  <li>User Registration and Authentication : Users can register for an account and log in securely.</li>
  <li>Movie Booking : Book seats for selected movies and confirm reservations</li>
  <li>Seat Selection: Select Preferred seats from the available Seats</li>
  <li>Admin Functionality: Admin have Capability to create new movies and manage bookings
  </li>
  <li>Cancellation Policy: Unconfirmed bookings are automatically canceled after 10 minutes, ensuring the seat availability to other users</li>
  <li>Movies Can only booked by authorized used by using the JWT Token</li>
</ul>

<h3>Modules</h3>
<h5>1. Users Module</h5>
<p>Manages user profiles, providing users the ability to view and update their information and can book movies</p>
<h5>2. Events Module</h5>
<p>Handles movie events, including creation, seat availability, and booking confirmation</p>
<h5>3. Admin Module</h5>
<p>Handles to create and manage the bookings of movies</p>

<h3></h3>
