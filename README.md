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
✅ Complete documentation
⏳ Hosted application with working URLs

## Local Development

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. API will be available at: `http://localhost:3000`
5. Test health endpoint: `curl http://localhost:3000/health`

### Frontend Setup
1. Navigate to frontend directory: `cd frontend`
2. Open `index.html` in your web browser
3. Or serve with a local HTTP server for better CORS handling

## API Testing

### Health Check
```bash
curl http://localhost:3000/health
# Expected: {"status":"OK","message":"API is healthy","timestamp":"..."}
```

### Get All Profiles
```bash
curl http://localhost:3000/profiles
```

### Filter by Skill
```bash
curl "http://localhost:3000/profiles?skill=Python"
```

### Search Projects
```bash
curl "http://localhost:3000/search/projects?q=web"
```

### Create New Profile
```bash
curl -X POST http://localhost:3000/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "education": "Data Science, Berkeley",
    "skills": ["Python", "R", "Machine Learning"],
    "projects": [{
      "title": "Customer Analytics",
      "description": "ML model for customer segmentation",
      "links": ["https://github.com/alice/analytics"]
    }]
  }'
```

## Deployment Options

The backend includes configuration files for easy deployment:

### Render.com
- Use `backend/render.yaml` configuration
- Automatic deployment from Git repository

### Vercel
- Use `backend/vercel.json` configuration  
- Serverless deployment

### Heroku
- Standard Node.js deployment
- Set `NODE_ENV=production`

## Live URLs

- **Repository**: [This Git repository]
- **Backend API**: [Deploy using provided config files]
- **Frontend**: [Deploy frontend folder to static hosting]

## Technology Stack

- **Backend**: Node.js, Express.js, SQLite
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: SQLite with JSON fields
- **Security**: Helmet.js, CORS enabled
- **Deployment**: Render/Vercel ready
