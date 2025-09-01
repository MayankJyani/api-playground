const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { db, initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8080', 
    'https://apiplaygrounds.netlify.app',
    /\.netlify\.app$/,
    /\.onrender\.com$/
  ],
  credentials: true
}));
app.use(express.json());

// Root endpoint for debugging
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Playground Backend is running!',
    endpoints: {
      health: '/health',
      profiles: '/profiles',
      search: '/search/projects?q=query'
    },
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Get all profiles with optional skill filtering
app.get('/profiles', (req, res) => {
  const { skill } = req.query;
  
  let query = 'SELECT * FROM profiles';
  let params = [];
  
  if (skill) {
    query += ' WHERE skills LIKE ?';
    params.push(`%${skill}%`);
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Parse JSON fields
    const profiles = rows.map(row => ({
      ...row,
      skills: JSON.parse(row.skills || '[]'),
      projects: JSON.parse(row.projects || '[]')
    }));
    
    res.json(profiles);
  });
});

// Get profile by ID
app.get('/profiles/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM profiles WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    
    // Parse JSON fields
    const profile = {
      ...row,
      skills: JSON.parse(row.skills || '[]'),
      projects: JSON.parse(row.projects || '[]')
    };
    
    res.json(profile);
  });
});

// Create new profile
app.post('/profiles', (req, res) => {
  const { name, email, education, skills, projects } = req.body;
  
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }
  
  const skillsJson = JSON.stringify(skills || []);
  const projectsJson = JSON.stringify(projects || []);
  
  const query = `INSERT INTO profiles (name, email, education, skills, projects) 
                 VALUES (?, ?, ?, ?, ?)`;
  
  db.run(query, [name, email, education, skillsJson, projectsJson], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    
    res.status(201).json({ 
      id: this.lastID,
      message: 'Profile created successfully'
    });
  });
});

// Update profile
app.put('/profiles/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, education, skills, projects } = req.body;
  
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }
  
  const skillsJson = JSON.stringify(skills || []);
  const projectsJson = JSON.stringify(projects || []);
  
  const query = `UPDATE profiles 
                 SET name = ?, email = ?, education = ?, skills = ?, projects = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`;
  
  db.run(query, [name, email, education, skillsJson, projectsJson, id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    
    res.json({ message: 'Profile updated successfully' });
  });
});

// Delete profile
app.delete('/profiles/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM profiles WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    
    res.json({ message: 'Profile deleted successfully' });
  });
});

// Search projects endpoint
app.get('/search/projects', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    res.status(400).json({ error: 'Query parameter "q" is required' });
    return;
  }
  
  db.all('SELECT * FROM profiles WHERE projects LIKE ?', [`%${q}%`], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Filter and extract matching projects
    const matchingProjects = [];
    
    rows.forEach(row => {
      const projects = JSON.parse(row.projects || '[]');
      const filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(q.toLowerCase()) ||
        project.description.toLowerCase().includes(q.toLowerCase())
      );
      
      filteredProjects.forEach(project => {
        matchingProjects.push({
          ...project,
          profileId: row.id,
          profileName: row.name
        });
      });
    });
    
    res.json(matchingProjects);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API endpoints: http://localhost:${PORT}/profiles`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

module.exports = app;
