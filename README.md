# 🛠️ Complaint Care - Complaint Registration Web Application

![JavaScript](https://img.shields.io/badge/JavaScript-87%25-yellow?style=flat-square&logo=javascript)
![CSS](https://img.shields.io/badge/CSS-12.7%25-blue?style=flat-square&logo=css3)
![HTML](https://img.shields.io/badge/HTML-0.3%25-orange?style=flat-square&logo=html5)

A comprehensive complaint management system that allows users to register complaints, track their status, and enables administrators and agents to efficiently manage and resolve issues.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 👥 User Management
- User registration and authentication
- Profile management
- Role-based access control (Admin, Agent, User)

### 📝 Complaint Management
- Submit new complaints with detailed information
- Track complaint status in real-time
- Upload supporting documents/images
- View complaint history

### 👨‍💼 Admin Dashboard
- Comprehensive dashboard with statistics
- Manage users and agents
- Assign complaints to agents
- View all complaints and their status
- Generate reports and analytics

### 🔧 Agent Panel
- View assigned complaints
- Update complaint status
- Add resolution comments
- Manage workload efficiently

### 🔐 Authentication & Security
- Secure user authentication
- Google OAuth integration
- Microsoft OAuth integration
- Session management with Passport.js

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI Library
- **React Router DOM 6.11.2** - Routing
- **Bootstrap 5.2.3** - CSS Framework
- **React Bootstrap 2.7.4** - Bootstrap Components for React
- **Axios 1.4.0** - HTTP Client
- **MDB React UI Kit** - Material Design Components

### Backend
- **Node.js** - Runtime Environment
- **Express 4.18.2** - Web Framework
- **MongoDB** - Database
- **Mongoose 7.1.1** - ODM
- **Passport.js** - Authentication
- **bcrypt** - Password Hashing
- **CORS** - Cross-Origin Resource Sharing


## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/JeelMungra28/Complaint-Care.git
cd Complaint-Care

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Add your MongoDB URI, session secret, OAuth credentials, etc.

# Start the backend server
npm start

# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start

💻 Usage
Start the Backend Server (Port 8000)

bash
cd backend && npm start
Start the Frontend Application (Port 3000)

bash
cd frontend && npm start
Access the Application

Frontend: http://localhost:3000
Backend API: http://localhost:8000
Default User Roles
Admin: Full system access and management
Agent: Complaint resolution and status updates
User: Submit and track complaints
🌐 API Endpoints
Authentication
POST /auth/login - User login
POST /auth/register - User registration
GET /auth/google - Google OAuth
GET /auth/microsoft - Microsoft OAuth
Users
GET /OrdinaryUsers - Get all ordinary users
PUT /user/:id - Update user details
DELETE /OrdinaryUsers/:id - Delete user
Agents
GET /agentUsers - Get all agents
GET /AgentUsers/:id - Get specific agent
Complaints
GET /status - Get all complaints
POST /assignedComplaints - Assign complaint to agent
PUT /complaint/:id - Update complaint status
📱 Key Features
User Dashboard
Submit new complaints
Track complaint status
View complaint history
Update profile information
Agent Dashboard
View assigned complaints
Update complaint status
Add resolution notes
Manage workload
Admin Dashboard
System overview and statistics
User and agent management
Complaint assignment and tracking
Reports and analytics
🤝 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License
This project is licensed under the ISC License - see the LICENSE file for details.

👨‍💻 Author
Jeel Mungra

GitHub: @JeelMungra28
🙏 Acknowledgments
React community for excellent documentation
Bootstrap team for the responsive framework
MongoDB for reliable database solution
All contributors who helped improve this project


