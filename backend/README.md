# Attendance App Backend

This is the backend for the Attendance App, a system for tracking attendance of kids.

## Project Structure

- `server.js`: The main entry point for the application. It sets up the Express server, middleware, and routes.
- `db.js`: Database connection configuration using PostgreSQL.
- `init.sql`: SQL script to initialize the database schema.
- `seed.js`: Script to seed the database with initial data directly using database queries.
- `postmanSeed.js`: Alternative script to seed the database using the API endpoints.
- `routes/`: Directory containing route handlers for different API endpoints.
  - `kids.js`: Routes for managing kids (CRUD operations).
  - `attendance.js`: Routes for managing attendance records (CRUD operations).

## Database Schema

The database consists of two main tables:

### Kids Table

Stores information about the kids:

- `id`: Primary key
- `name`: The name of the kid
- `photo`: URL or path to the kid's photo
- `created_at`: Timestamp when the record was created
- `updated_at`: Timestamp when the record was last updated

### Attendance Table

Stores attendance records:

- `id`: Primary key
- `kidId`: Foreign key referencing the kids table
- `name`: The name of the kid (denormalized for convenience)
- `week`: The week number
- `term`: The term number (default: 1)
- `present`: Boolean indicating if the kid was present
- `reason`: Reason for absence (if applicable)
- `photo`: URL or path to the kid's photo (denormalized for convenience)
- `created_at`: Timestamp when the record was created
- `updated_at`: Timestamp when the record was last updated

## API Endpoints

### Kids API

- `GET /kids`: Get all kids
- `GET /kids/:id`: Get a kid by ID
- `POST /kids`: Create a new kid
- `PUT /kids/:id`: Update a kid
- `DELETE /kids/:id`: Delete a kid

### Attendance API

- `GET /attendance`: Get all attendance records (optional query params: year, term)
- `GET /attendance/:id`: Get an attendance record by ID
- `POST /attendance`: Create a new attendance record
- `PATCH /attendance/:id`: Update an attendance record
- `DELETE /attendance/:id`: Delete an attendance record

## Setup and Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` and configure your environment variables.

3. Initialize the database:
   ```
   psql -U your_username -d your_database -f init.sql
   ```

4. Seed the database (choose one method):
   ```
   # Using direct database queries
   node seed.js
   
   # Using API endpoints (server must be running)
   node postmanSeed.js
   ```

5. Start the server:
   ```
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Database Configuration
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=attendance
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Server Configuration
PORT=4000
NODE_ENV=development

# API URL (for postmanSeed.js)
API_URL=http://localhost:4000
```

## File Descriptions

### server.js
The main entry point for the application. It sets up the Express server, middleware, and routes. It also includes error handling middleware and a 404 handler.

### db.js
Centralizes the database connection configuration using PostgreSQL. It uses environment variables with fallbacks for database credentials.

### init.sql
SQL script to initialize the database schema. It creates the kids and attendance tables with appropriate constraints.

### seed.js
Script to seed the database with initial data directly using database queries. It reads data from JSON files in the frontend directory.

### postmanSeed.js
Alternative script to seed the database using the API endpoints. It's useful for testing the API and ensuring that the endpoints work correctly.

### routes/kids.js
Contains routes for managing kids (CRUD operations). Each route includes input validation and error handling.

### routes/attendance.js
Contains routes for managing attendance records (CRUD operations). Each route includes input validation and error handling.