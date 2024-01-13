
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
<p>1.1 Register a User</p>
<ul>
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


<p>1.2 Login</p>
<ul>
<li>Endpoint : /users/login</li>
<li>Method: POST</li>
<li> Request Body :</li>



```bash
{
  "username":"username",
  "password":"password"
}
```
<li>Response</li>

```bash
{
  "message":"User has been Registered Successfully",
  "status":201
}
```

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
  "satus":201
}
```
<p>1.3 Get Profile</p>
<ul>
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


<p>1.4 Update Profile</p>
<ul>
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


<p>1.5 Delete Profile</p>
<ul>
<li>Endpoint : /users/deleteUser?id={Id of user}</li>
<li>Method: DELETE</li>
<p>Note : Id should be passed as Params</p>




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
 
 
```bash
{

    "message": "User has Deleted!!"
}
```

</ul>
