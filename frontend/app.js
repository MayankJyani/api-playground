// API Configuration
const API_BASE_URL = 'https://api-playground-backend-production.up.railway.app';

// DOM Elements
const profilesContainer = document.getElementById('profilesContainer');
const projectsContainer = document.getElementById('projectsContainer');
const statusMessage = document.getElementById('statusMessage');
const addProfileForm = document.getElementById('addProfileForm');

// Utility Functions
function showStatus(message, type = 'success') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

function showLoading(container, message = 'Loading...') {
    container.innerHTML = `<div class="loading">${message}</div>`;
}

// API Functions
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showStatus(`Error: ${error.message}`, 'error');
        throw error;
    }
}

// Profile Functions
async function loadAllProfiles() {
    showLoading(profilesContainer, 'Loading profiles...');
    projectsContainer.innerHTML = ''; // Clear projects when loading profiles
    
    try {
        const profiles = await fetchAPI('/profiles');
        displayProfiles(profiles);
    } catch (error) {
        profilesContainer.innerHTML = '<p class="error">Failed to load profiles</p>';
    }
}

async function searchBySkill() {
    const skill = document.getElementById('skillSearch').value.trim();
    
    if (!skill) {
        showStatus('Please enter a skill to search for', 'error');
        return;
    }
    
    showLoading(profilesContainer, 'Searching profiles...');
    projectsContainer.innerHTML = ''; // Clear projects
    
    try {
        const profiles = await fetchAPI(`/profiles?skill=${encodeURIComponent(skill)}`);
        displayProfiles(profiles);
        
        if (profiles.length === 0) {
            showStatus(`No profiles found with skill: ${skill}`, 'error');
        } else {
            showStatus(`Found ${profiles.length} profile(s) with skill: ${skill}`);
        }
    } catch (error) {
        profilesContainer.innerHTML = '<p class="error">Failed to search profiles</p>';
    }
}

async function searchProjects() {
    const query = document.getElementById('projectSearch').value.trim();
    
    if (!query) {
        showStatus('Please enter a search term for projects', 'error');
        return;
    }
    
    showLoading(projectsContainer, 'Searching projects...');
    profilesContainer.innerHTML = ''; // Clear profiles
    
    try {
        const projects = await fetchAPI(`/search/projects?q=${encodeURIComponent(query)}`);
        displayProjects(projects);
        
        if (projects.length === 0) {
            showStatus(`No projects found matching: ${query}`, 'error');
        } else {
            showStatus(`Found ${projects.length} project(s) matching: ${query}`);
        }
    } catch (error) {
        projectsContainer.innerHTML = '<p class="error">Failed to search projects</p>';
    }
}

// Display Functions
function displayProfiles(profiles) {
    if (profiles.length === 0) {
        profilesContainer.innerHTML = '<p class="loading">No profiles found</p>';
        return;
    }
    
    profilesContainer.innerHTML = profiles.map(profile => `
        <div class="profile-card">
            <h3>${escapeHtml(profile.name)}</h3>
            <div class="email">${escapeHtml(profile.email)}</div>
            ${profile.education ? `<p><strong>Education:</strong> ${escapeHtml(profile.education)}</p>` : ''}
            
            <div class="skills">
                ${profile.skills.map(skill => 
                    `<span class="skill-tag">${escapeHtml(skill)}</span>`
                ).join('')}
            </div>
            
            ${profile.projects.length > 0 ? `
                <div class="projects">
                    <strong>Projects:</strong>
                    ${profile.projects.map(project => `
                        <div class="project">
                            <h4>${escapeHtml(project.title)}</h4>
                            <p>${escapeHtml(project.description)}</p>
                            ${project.links && project.links.length > 0 ? `
                                <div class="project-links">
                                    ${project.links.map(link => 
                                        `<a href="${escapeHtml(link)}" target="_blank" rel="noopener">${getDomainFromUrl(link)}</a>`
                                    ).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function displayProjects(projects) {
    if (projects.length === 0) {
        projectsContainer.innerHTML = '<p class="loading">No projects found</p>';
        return;
    }
    
    projectsContainer.innerHTML = projects.map(project => `
        <div class="project-card">
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <p><strong>By:</strong> ${escapeHtml(project.profileName)}</p>
            ${project.links && project.links.length > 0 ? `
                <div class="project-links">
                    ${project.links.map(link => 
                        `<a href="${escapeHtml(link)}" target="_blank" rel="noopener">${getDomainFromUrl(link)}</a>`
                    ).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Form Handling
addProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(addProfileForm);
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const education = document.getElementById('education').value.trim();
    const skillsInput = document.getElementById('skills').value.trim();
    const projectTitle = document.getElementById('projectTitle').value.trim();
    const projectDescription = document.getElementById('projectDescription').value.trim();
    const projectLinksInput = document.getElementById('projectLinks').value.trim();
    
    if (!name || !email) {
        showStatus('Name and email are required', 'error');
        return;
    }
    
    // Parse skills
    const skills = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(s => s) : [];
    
    // Parse project
    const projects = [];
    if (projectTitle && projectDescription) {
        const links = projectLinksInput ? 
            projectLinksInput.split(',').map(l => l.trim()).filter(l => l) : [];
        
        projects.push({
            title: projectTitle,
            description: projectDescription,
            links: links
        });
    }
    
    const profileData = {
        name,
        email,
        education: education || null,
        skills,
        projects
    };
    
    try {
        const result = await fetchAPI('/profiles', {
            method: 'POST',
            body: JSON.stringify(profileData)
        });
        
        showStatus('Profile created successfully!');
        addProfileForm.reset();
        loadAllProfiles(); // Refresh the profiles list
    } catch (error) {
        // Error already shown by fetchAPI
    }
});

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getDomainFromUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return url;
    }
}

// Check API health and load initial data
async function initializeApp() {
    try {
        const health = await fetchAPI('/health');
        console.log('API Health:', health);
        loadAllProfiles();
    } catch (error) {
        showStatus('Failed to connect to API. Make sure the backend server is running.', 'error');
        profilesContainer.innerHTML = '<p class="error">Backend API is not available</p>';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
