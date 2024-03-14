# CS35L-Save-My-Seat

<img src="frontend/build/assets/OIG4.png" alt="Save My Seat Logo" width="270"/>

## Overview

Save My Seat aims to streamline the process of getting seats in classes, many of which are in high demand and reach full capacity quickly. Our goal is to create a user-friendly, interactive platform that facilitates the exchange of classes from student to student through various features, which takes out a lot of the complexity of trying to enroll in a full class. These features include an auctioning feature that allows users to post courses on a billboard, all other app users can see and bid on these courses. The app also has a system to filter and display relevant courses based on the users’ department, and provides a convenient overview of their schedule in calendar format.

### Features
1. 
2. 
3. 

## Running the Application:

### Step 1: Clone Repository

`git clone https://github.com/HuangEric22/CS35L-Save-My-Seat.git`

`cd CS35L-Save-My-Seat`

### Step 2: Set up backend

Create a .env file in the **root**. Add port 400. Add mongodb uri to the .env file which can be created at [MongoDB](https://www.mongodb.com/). Add a secret passcode, which can be any string. The .env should look like the following:
```
PORT=4000
MONGO="YOUR_MONGO_DB_URI_HERE"
SECRET="YOUR_SECRET_PASSCODE_HERE"
```

Then run:

`cd backend` 

`npm install` 

`npm start` 

You should receive the message "Connected \n Server Started".


### Step 3: Set up frontend 

`cd frontend` 

`npm install`

`npm start` 

You can view the app in your browser at http://localhost:3000.


