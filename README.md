# CS35L-Save-My-Seat

Running the Application:

Step 1: Clone Repository
git clone https://github.com/HuangEric22/CS35L-Save-My-Seat.git
cd CS35L-Save-My-Seat

Step 2: Set up backend
Create a .env file. Add port 400. Add mongodb uri to the .env file (which can be created at https://www.mongodb.com/). Add a secret passcode, which can be any string. The .env should look like the following:
PORT=4000
MONGO="YOUR_MONGO_DB_URI_HERE"
SECRET='YOUR_SECRET_PASSCODE_HERE"

Then run:
cd backend
npm install 
npm start

You should receive the message "Connected \n Server Started".

Step2: Set up frontend 
cd frontend
npm install
npm start
You can view the app in your browser at http://localhost:3000.


