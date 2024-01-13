
<h1>Movie Ticket Booking System</h1>
<p>The Movie ticket Booking System is a web application inspired by services like BookMyShow, designed to facilitate the seam booking of movie tickets.In this application Backend Api's have been implemented for users to discover movies, select preferred seats and confirm the booking. Those Api's were built by using NestJs Framework.</p>

## How to Get Started ?
<p>1. Clone the Repositry</p>
<p>2. Install dependencies</p>

```bash 
$ npm install
```

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
  <li>Movies Can only booked by authorized user by using the JWT Token</li>
</ul>

<h3>Modules</h3>
<h5>1. Users Module</h5>
<p>Manages user profiles, providing users the ability to view and update their information and can book movies</p>
<h5>2. Events Module</h5>
<p>Handles movie events, including creation, seat availability, and booking confirmation</p>
<h5>3. Admin Module</h5>
<p>Handles to create and manage the bookings of movies</p>

<h3>API Routes</h3>
<h4>1. Users</h4>
<ul>
<p>1.1 Register a User</p>

<li>Endpoint : /users/createUser</li>
<li>Method: POST</li>
<li>Body :</li>


```bash
{
  "username":"username",
  "email":"email",
  "password":"password"
}
```
<p> Note - Validators are used in user schema make sure to provide valid username, password and email. </p>
<img
  src="readme-Img\1.1.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
/>



<img
  src="readme-Img\1.2.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
 ```
<li>Response</li>

```bash
{
  "message":"User has been Registered Successfully",
  "status":201
}
```
</ul>


<ul>
<p>1.2 Login</p>

<li>Endpoint : /users/login</li>
<li>Method: POST</li>
<li> Request Body :</li>



```bash
{
  "username":"username",
  "password":"password"
}


<img
  src="readme-Img\1.3.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
  />

<img
  src="readme-Img\1.4.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />

```bash
{
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWExMWUwMTQ2YjhlNzdiYjM4MWNkYTUiLCJ1c2VybmFtZSI6IkV4YW1wbGUiLCJpYXQiOjE3MDUxMzIzMTUsImV4cCI6MTcwNTEzNTkxNX0.zkKolr8vcRxrxHm8dRAxCdWAkIbezhHx_ok45hoMIBI",
  "status":201
}
```

</ul>


<ul>
<p>1.3 Get Profile</p>

<li>Endpoint : /users/getUser?id={Id of User}</li>
<li>Method: GET</li>
<p>Note : Id should be passed as Params</p>


<img
  src="readme-Img\1.5.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />

</ul>

<ul>
<p>1.4 Update Profile</p>

<li>Endpoint : /users/updateUser?id={Id of user}</li>
<li>Method: PUT</li>
<p>Note : Id should be passed as Params</p>




<img
  src="readme-Img\1.6.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
</ul>

<ul>
<p>1.5 Delete Profile</p>

<li>Endpoint : /users/deleteUser?id={Id of user}</li>
<li>Method: DELETE</li>
<p>Note : Id should be passed as Params</p>
<li>Response</li>

```bash
{

    "message": "User has Deleted!!"
}
```

<img
  src="readme-Img\1.7.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
 </ul>

<h4>2. Event Module</h4>

<h5>2.1 Register a Movie</h5>
<ul>
<li>Endpoint : /events/createEvent</li>
<li>Method: POST</li>
<li>Headers: Token(Admin)</li>
<li>Body :</li>

```bash
{
  "name":"Jurassic Park",
  "date":"2024-01-13T09:30:00Z",
  "availableSeats":[1,2,3,4,5,6,7,8,9,10,
                   11,12,13,14,15,16,17,
                    18,19,20,25,55,87...],
  "Booking":[]
}
```

<p>Note : Only Admin would be able to create Movie. Pass the admin token in authorization headers</p>

<li>How to admin token?</li>

<img
  src="readme-Img\1.8.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />

<li>What if token isn't provided?</li>

<img
  src="readme-Img\1.9.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />

 <ul>
 <h4>Validations while registering the Event</h4>
 <li>What if request data isn't proper?</li>
 <img
  src="readme-Img\2.0.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
 <li>What if availableSeats field is empty and duplicate seats are there? </li>

 <img
  src="readme-Img\2.1.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
 <img
  src="readme-Img\2.2.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />

 <li>Final Response</li>

```bash 
 {
    "message": "Event has been registered",
    "statusCode": 201,
    "createdBy": "admin",
    "createdAt": "Sat Jan 13 2024"
}

 ```

 <img
  src="readme-Img\2.3.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
 </ul>
 </ul>

 <h5>2.2 Listing available seats for particular Movie</h5>
<ul>
<li>Endpoint : /events/available-seats?movieId={Id of specific movie}</li>
<li>Method: GET</li>
<img
  src="readme-Img\3.0.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
 <li>Response</li>

```bash
 {
  "seatsAvailable":
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,55,87],
  "status":200
  
  }


```
</ul>

<h5>2.3 Listing a particular Movie</h5>
<ul>
<li>Endpoint : /events/getEvent?movieId={Id of specific movie}</li>
<li>Method: GET</li>


```bash
{
     "_id":"65a2502676c6c5720eacf3c1",
     "name":"Jurassic Park",
     "date":"2024-01-13T09:30:00.000Z",
     "availableSeats":[1,2,3,4,5,6,7,8,9,10,16,17,18,19,20,25,55,87],
     "bookings":[
      {
        "user":"65a2576773457a7bd5c16298",
        "seats":[11,12,13,14,15],
        "confirmed":true,
        "createdAt":"2024-01-13T09:34:18.231Z"}],
        "__v":53
        }
```
<img
  src="readme-Img\3.1.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
 <li>Response</li>

```bash
 {
  "seatsAvailable":
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,55,87],
  "status":200
  
  }


```

</ul>

<h5>2.4 Reserving a seats for particular Movie</h5>
<ul>
<li>Endpoint : /events/book-seats?movieId={Id of specific movie}</li>
<li>Method: POST</li>
<li>Headers: Token(User)</li>
<li>Body :</li>

```bash 
{
  seats:[1,2,3,4]
}
``` 
<ul>
<h4>Validations while reserving seats</h4>
<li>What if request body is empty ?</li>
<img
  src="readme-Img\2.4.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
 <li>What is request body has duplicate seats?</li>
 <img
  src="readme-Img\2.5.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
 <p>If you're picking a seat which is already reserved for another. It throws Exception So,
 In this way no two users can book the same seat</p>

 ```bash
 {
    "message": "Seats 11, 12, 13, 14, 15 are not available",
    "error": "Bad Request",
    "statusCode": 400
}
 ```




 <img
  src="readme-Img\2.9.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
 <li>Final Response</li>

 ```bash
 {
  "msg":"sampleUser , You have reserved seats 11,12,13,14,15 ! Please confirm",
  status:202
 }
 ```

 <img
  src="readme-Img\2.6.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />

</ul>
</ul>

<h5>2.5 Confirming seats for particular Movie</h5>
<ul>
<li>Endpoint : /events/confirm-seats?movieId={Id of specific movie}</li>
<li>Method: POST</li>
<li>Headers: Token(User)</li>

<ul>
<li>What if user do not have unconfirmed bookings?</li>
<img
  src="readme-Img\2.8.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
<li>Response</li>

```bash 
{
    "message": "Hurray !! , Booking confirmed! Seats booked: 11, 12, 13, 14, 15",
    "bookingConfirmation": true,
    "status": 204
}
```
<img
  src="readme-Img\2.7.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
</ul>
</ul>

<h5>2.6 Unconfirmed will get cancelled in 10min</h5>
<ul>
<p>Task Scheduler is used to trigger the function in specified time to check the unconfirm seats in database.</p>
<p>Seat 18 has been reserved by the user. If the user do not confirm the seat within 10 minutes. It will be cancelled.</p>

<img
  src="readme-Img\3.2.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />

 <p>Check seat 18 is availabe or not in available seats</p>

 <img
  src="readme-Img\3.3.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
<p>You cans see seat 18 is not availble</p>
<li>Response</li>

```bash
{
  "seatsAvailable":[1,2,3,4,5,6,7,8,9,10,16,17,19,20,25,55,87],
  "status":200
  
}

```
<p>Check after 10min whether the seat is added to available seats</p>
<img
  src="readme-Img\3.3.jpg"
  width="80%"
  height="80%"
  style="
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  "
 />
 <p>You can see seat 18 is again added to the available seats since it was not confirmed ny the user</p>
 <li>Response</li>

 ```bash
 {
  "seatsAvailable":[1,2,3,4,5,6,7,8,9,10,16,17,19,20,25,55,87,18],
  "status":200
  
}
 ```

<h5>Similarly, Admin would be able to modify, delete the specific event </h5>
<ul>
<h4>Delete Event</h4>
<li>Endpoint : /events/deleteEvent?movieId={Id of specific movie}</li>
<li>Method: DELETE</li>
<li>Headers: Token(Admin)</li>
<li>Response</li>

```bash
{
    "message": "Event has been deleted",
    "statusCode": 201
}
```
</ul>

<ul>
<h4>Update Event</h4>
<li>Endpoint : /events/updateEvent?movieId={Id of specific movie}</li>
<li>Method: PUT</li>
<li>Headers: Token(Admin)</li>
<li>Body</li>

```bash
{
 "availableSeats":[1,2,3,4,5,6,7,8,9,10,
                   11,12,13,14,15,16,17,
                   18,19,20,25,55,87,89,90]
}
```
<li>Response</li>

```bash
{
    "message": "Event has been updated",
    "statusCode": 201
}

```
</ul>
<h3>API's Overview</h3>
<ul>
<li>To register user</li>

```bash
http://localhost:3000/users/createUser
```
<li>Login User</li>

```bash
http://localhost:3000/users/login
```
<li>Get User's profile </li>

```bash 
http://localhost:3000/users/getUser?id=65a11e0146b8e77bb381cda5

```
<li>Update User</li>

```bash
http://localhost:3000/users/updateUser?id=65a11e0146b8e77bb381cda5

```
<li>Delete User</li>

```bash
http://localhost:3000/users/deleteUser?id=65a11e0146b8e77bb381cda5

```

<li>Create an event (only admin can do it)</li>

```bash
http://localhost:3000/events/createEvent

```
<li>List available seats for specific event</li>

```bash
http://localhost:3000/events/available-seats?movieId=65a2502676c6c5720eacf3c1

```
<li>Get Details for specific event</li>

```bash
http://localhost:3000/events/getEvent?movieId=65a2502676c6c5720eacf3c1

```
<li>Book seats for specific event</li>

```bash
http://localhost:3000/events/book-seats?movieId=65a2502676c6c5720eacf3c1

```

<li>confirm the seats </li>

```bash
http://localhost:3000/events/confirm-booking?movieId=65a2502676c6c5720eacf3c1

```
<li>Modify the event (Only Amdin)</li>

```bash
http://localhost:3000/events/updateEvent?movieId=65a2502676c6c5720eacf3c1

```

<li>Delete the Event(Only Admin)</li>

```bash
http://localhost:3000/events/deleteEvent?movieId=65a2502676c6c5720eacf3c1

```
</ul>