# Admin Panel - Booking System Backend

## Overview
This is the backend API for a full-stack booking system developed as part of a Full Stack Developer Assessment Test. It provides all necessary API endpoints for user authentication, booking management, and admin operations.

## Live API
- **Backend API:** [https://mindsynccon-api.onrender.com](https://mindsynccon-api.onrender.com)

## Features

### Authentication System
- User registration with password hashing
- Login with JWT token generation
- JWT verification middleware for protected routes
- Role-based access control for admin functionality


## Technologies Used
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Database Structure

### Collections

#### Users Collection
```json
{
  "_id": "ObjectId",
  "username": "String (required)",
  "email": "String (required, unique)",
  "password": "String (hashed, required)",
  "role": "String (enum: 'user', 'admin', default: 'user')"
}
```

#### Items Collection
```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "description": "String (required)",
  "price": "Number (required)",
  "availability": "Boolean (default: true)",
  "image": "String (URL to image)"
}
```

#### Bookings Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: 'User', required)",
  "itemId": "ObjectId (ref: 'Item', required)",
  "startDate": "Date (required)",
  "endDate": "Date (required)",
  "totalPrice": "Number (required)",
  "status": "String (enum: 'pending', 'confirmed', 'cancelled', default: 'pending')",
  "createdAt": "Date",
}
```

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v14.x or higher)
- npm (v6.x or higher) or yarn (v1.22.x or higher)
- MongoDB (or access to MongoDB Atlas)

## Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Hisam-94/mindsynccon-backend.git
cd mindsynccon-backend
```

### 2. Install dependencies
```bash
npm install
# or with yarn
yarn install
```

### 3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindsynccon
JWT_SECRET=your_jwt_secret_here

```

### 4. Start the server
For development with nodemon:
```bash
npm run dev
# or with yarn
yarn dev
```

For production:
```bash
npm start
# or with yarn
yarn start
```
The API will be available at `http://localhost:5000`.

## API Testing
You can test the API endpoints using Postman or any other API testing tool. A Postman collection file is included in the repository for easy testing.

## Deployment on Render

1. Create a Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the following settings:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - `PORT`: Will be auto-assigned by Render
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
6. Deploy the service

## Security Features
- Password hashing using bcrypt
- JWT for secure authentication
- Protected routes using middleware
- Role-based access control for admin functionality
- Input validation to prevent injection attacks
- Rate limiting for API endpoints to prevent abuse

## Error Handling
The API includes comprehensive error handling:
- Validation errors with descriptive messages
- Authentication errors
- Resource not found errors
- Server errors with appropriate HTTP status codes


## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
- Project Maintainer: [Hisam-94](https://github.com/Hisam-94)
- Project Link: [https://github.com/Hisam-94/mindsynccon-backend](https://github.com/Hisam-94/mindsynccon-backend)