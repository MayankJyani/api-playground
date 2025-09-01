const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'profiles.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database schema
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create profiles table
      db.run(`CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        education TEXT,
        skills TEXT, -- JSON string array
        projects TEXT, -- JSON string array of objects
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Profiles table created successfully');
          seedDatabase();
          resolve();
        }
      });
    });
  });
};

// Seed database with sample data
const seedDatabase = () => {
  const sampleProfiles = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      education: 'Computer Science, MIT',
      skills: JSON.stringify(['JavaScript', 'Python', 'React', 'Node.js']),
      projects: JSON.stringify([
        {
          title: 'E-commerce Platform',
          description: 'Full-stack web application for online shopping',
          links: ['https://github.com/johndoe/ecommerce', 'https://shop-demo.com']
        },
        {
          title: 'Data Analysis Tool',
          description: 'Python tool for analyzing customer behavior',
          links: ['https://github.com/johndoe/data-analysis']
        }
      ])
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      education: 'Software Engineering, Stanford',
      skills: JSON.stringify(['Python', 'Machine Learning', 'TensorFlow', 'SQL']),
      projects: JSON.stringify([
        {
          title: 'ML Prediction Model',
          description: 'Machine learning model for stock price prediction',
          links: ['https://github.com/janesmith/ml-stocks']
        },
        {
          title: 'Web Scraper',
          description: 'Python web scraper for data collection',
          links: ['https://github.com/janesmith/webscraper']
        }
      ])
    },
    {
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      education: 'Information Systems, UC Berkeley',
      skills: JSON.stringify(['Java', 'Spring Boot', 'Docker', 'AWS']),
      projects: JSON.stringify([
        {
          title: 'Microservices Architecture',
          description: 'Scalable microservices system using Spring Boot',
          links: ['https://github.com/mikej/microservices']
        }
      ])
    }
  ];

  // Check if data already exists
  db.get("SELECT COUNT(*) as count FROM profiles", (err, row) => {
    if (err) {
      console.error('Error checking existing data:', err);
      return;
    }
    
    if (row.count === 0) {
      console.log('Seeding database with sample data...');
      const stmt = db.prepare(`INSERT INTO profiles (name, email, education, skills, projects) 
                              VALUES (?, ?, ?, ?, ?)`);
      
      sampleProfiles.forEach(profile => {
        stmt.run(profile.name, profile.email, profile.education, profile.skills, profile.projects);
      });
      
      stmt.finalize();
      console.log('Database seeded successfully');
    } else {
      console.log('Database already contains data, skipping seed');
    }
  });
};

module.exports = { db, initializeDatabase };
