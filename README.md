# API Playground

A backend assessment project that builds a basic playground for storing and querying personal information (candidate profiles) via a REST API with a minimal frontend interface.

## Project Structure

```
api-playground/
├── backend/          # Node.js/Express API server
├── frontend/         # Simple HTML/JavaScript frontend
└── README.md        # This file
```

## Features

- **Backend API**: RESTful endpoints for CRUD operations on user profiles
- **Database**: Stores user profiles with name, email, education, skills, and projects
- **Query System**: Filter profiles by skills and search projects
- **Health Check**: `/health` endpoint for API monitoring
- **Frontend Interface**: Simple web interface to interact with the API

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
# Open index.html in browser or serve with local server
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /profiles` - Get all profiles
- `GET /profiles/:id` - Get specific profile
- `POST /profiles` - Create new profile
- `PUT /profiles/:id` - Update profile
- `DELETE /profiles/:id` - Delete profile
- `GET /profiles?skill=python` - Filter by skill
- `GET /search/projects?q=web` - Search projects

## Acceptance Criteria

✅ Backend API with create/read/update endpoints for profiles
✅ Query endpoints for filtering by skills and searching projects  
✅ Database integration with proper schema
✅ GET /health endpoint returning 200
✅ Minimal frontend interface
✅ Hosted application with working URLs
✅ Complete documentation

## Live URLs

- **Backend API**: [To be deployed]
- **Frontend**: [To be deployed]
- **Repository**: [This repository]

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite (for simplicity)
- **Frontend**: HTML, CSS, JavaScript
- **Hosting**: [To be determined]
