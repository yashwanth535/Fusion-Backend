# Flavour Fusion Backend

This is the backend service for the Flavour Fusion application.

## Features
- User authentication (register, login)
- Recipe management (CRUD operations)
- JWT-based authorization
- MongoDB integration
- Error handling middleware

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm (v6 or higher)
- MongoDB instance (local or cloud)

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```env
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     PORT=5000
     ```
4. Start the server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000` by default.

## Project Structure
```
backend/
  config/         # Configuration files (DB, API keys)
  controller/     # Route controllers
  middlewares/    # Express middlewares
  models/         # Mongoose models
  routes/         # API route definitions
  server.js       # Entry point
```

## API Endpoints
- `/api/auth` - Authentication routes
- `/api/recipes` - Recipe management routes

## Deployment
This backend can be deployed on any Node.js-compatible hosting (e.g., Vercel, Heroku).

## Frontend
The deployed frontend is available at: [https://fusion.yashwanth.site/](https://fusion.yashwanth.site/)

## License
MIT 