Live Deployment

Frontend (Vercel)
https://poll-rooms-gray.vercel.app/

Backend API (Render)
https://poll-backend-tq05.onrender.com

GitHub Repository
https://github.com/gayakwad21/poll-rooms

Key Features
1. Poll Creation

Users can create a poll with:
    One question
    Multiple answer options
    Custom expiry time
Minimum two valid options are required.
Poll data is stored permanently in MongoDB Atlas.

2. Shareable Public Links

Each poll generates a unique public URL.
The link works on:
    Mobile phones
    Laptops
    Different Wi-Fi networks
    Any location worldwide

3. Real-Time Voting

Built using Socket.IO for instant updates.
Votes update live across all open tabs and devices.
No page refresh required.
Includes:
Live vote counts
Percentage bars
Countdown timer until poll expiry


Fairness / Anti-Abuse Mechanisms

1. IP-Based Vote Restriction
Each vote records the voter’s IP address.
Duplicate votes from the same IP are blocked.
Prevents multiple voting from the same device or network.

2. Poll Expiry Enforcement
Every poll has an expiration timestamp.
Backend verifies expiry before accepting votes.
Expired polls return:
Poll has expired
Ensures time-bound and fair participation.


Edge Cases Handled

Empty poll question is rejected.
Poll must contain at least two valid options.
Invalid or non-existent poll ID returns a safeerror.
Duplicate voting from the same IP is blocked.
Expired polls cannot receive votes.
Frontend validation prevents invalid expiry values.
Real-time synchronization keeps vote counts consistent.
Application remains stable after refresh or redeploy.


Known Limitations

IP-based restriction may block multiple users on the same Wi-Fi.
Users could bypass restriction using VPN or network change.
No authentication system (kept simple for assignment scope).
Backend hosted on free Render tier, which may cause:
Initial cold-start delay.
Currently supports single-question polls only.


Tech Stack

Frontend

React (Vite)
Axios
Socket.IO Client
Responsive dark UI


Backend

Node.js
Express.js
Socket.IO
MongoDB Atlas (Mongoose)


Deployment

Frontend → Vercel
Backend → Render
Database → MongoDB Atlas


Project Structure

poll-rooms/
│
├── client/   # React frontend
├── server/   # Express + Socket.IO backend
└── README.md

How to Run Locally
1. Clone the repository
git clone https://github.com/gayakwad21/poll-rooms.git
cd poll-rooms

2. Setup Backend
cd server
npm install


Create a .env file:

MONGO_URI=mongodb+srv://shreyasgayakwad21_db_user:Shreyas21@cluster.uhqjkcc.mongodb.net/pollDB?retryWrites=true&w=majority


Run backend:

npm start

3. Setup Frontend
cd client
npm install
npm run dev


Frontend will run at:

http://localhost:5173


Learning Outcomes

Through this project, I gained practical experience in:
Building a complete MERN full-stack architecture
Implementing real-time communication with Socket.IO
Designing fair voting and anti-abuse logic
Handling edge cases and validation
Deploying production apps using:
    Render
    Vercel
    MongoDB Atlas
Debugging real-world deployment and routing issues


Future Improvements

User authentication using JWT
Support for multiple questions per poll
Rate limiting or CAPTCHA protection
Poll analytics dashboard
QR code sharing
Custom domain deployment

Author
Shreyas S
Final-Year Engineering Student — AI & ML

GitHub:
https://github.com/gayakwad21

License
This project was created for educational and evaluation purposes as part of a full-stack development assignment.