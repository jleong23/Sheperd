# Dreamers Attendance App

A web application for tracking attendance of kids, built with React (frontend) and Express/PostgreSQL (backend).

## Project Structure

The project is organized into two main directories:

- `frontend/`: Contains the React application built with Vite
- `backend/`: Contains the Express API server and PostgreSQL database configuration

## Backend

The backend is a RESTful API built with Express and PostgreSQL. It provides endpoints for managing kids and their attendance records.

### Key Features

- RESTful API with proper error handling
- PostgreSQL database with well-defined schema
- Organized route structure
- Environment variable configuration
- Database seeding scripts

For detailed information about the backend, see the [Backend README](./backend/README.md).

## Frontend

The frontend is a React application built with Vite. It provides a user interface for managing kids and their attendance records.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your environment variables.

4. Initialize the database:
   ```
   psql -U your_username -d your_database -f init.sql
   ```

5. Seed the database:
   ```
   node seed.js
   ```

6. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Recent Improvements

The backend has been significantly improved with the following changes:

1. **Database Configuration**:
   - Created a centralized `db.js` file for database connection
   - Added environment variable support for database credentials
   - Added connection pooling for better performance

2. **Code Organization**:
   - Separated routes into dedicated files
   - Added proper error handling and validation
   - Improved documentation with JSDoc comments

3. **Database Schema**:
   - Updated `init.sql` to include both kids and attendance tables
   - Added foreign key constraints for data integrity
   - Added timestamps for tracking record creation and updates

4. **API Endpoints**:
   - Implemented complete CRUD operations for kids and attendance
   - Added filtering capabilities for attendance records
   - Improved error responses

5. **Documentation**:
   - Added comprehensive README files
   - Documented API endpoints
   - Added environment variable examples

These improvements make the backend more maintainable, secure, and easier to understand for future development.
