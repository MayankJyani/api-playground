# API Playground Backend

A RESTful API for managing candidate profiles with skill filtering and project search capabilities.

## Features

- ✅ CRUD operations for user profiles
- ✅ Skill-based filtering
- ✅ Project search functionality  
- ✅ Health check endpoint
- ✅ SQLite database with automatic seeding
- ✅ CORS enabled for frontend integration

## API Endpoints

### Health Check
- `GET /health` - Returns 200 OK with API status

### Profiles
- `GET /profiles` - Get all profiles
- `GET /profiles?skill=python` - Filter profiles by skill
- `GET /profiles/:id` - Get specific profile by ID
- `POST /profiles` - Create new profile
- `PUT /profiles/:id` - Update existing profile
- `DELETE /profiles/:id` - Delete profile

### Projects
- `GET /search/projects?q=web` - Search projects by title/description

## Profile Schema

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "education": "Computer Science, MIT",
  "skills": ["JavaScript", "Python", "React", "Node.js"],
  "projects": [
    {
      "title": "E-commerce Platform",
      "description": "Full-stack web application for online shopping",
      "links": ["https://github.com/johndoe/ecommerce", "https://shop-demo.com"]
    }
  ],
  "created_at": "2025-01-01T12:00:00.000Z",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000` by default.

## Environment Variables

Create a `.env` file with:
```
PORT=3000
NODE_ENV=development
```

## Database

The application uses SQLite for simplicity. The database file (`profiles.db`) will be created automatically when the server starts. Sample data is seeded on first run.

## Dependencies

- **express**: Web framework
- **sqlite3**: Database driver
- **cors**: Cross-origin resource sharing
- **helmet**: Security middleware
- **dotenv**: Environment configuration
- **nodemon**: Development auto-reload (dev dependency)
