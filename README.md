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

## 📁 Project Structure
Complaint-Care/ ├── frontend/ # React frontend application │ ├── src/ │ │ ├── components/ │ │ │ ├── admin/ # Admin dashboard components │ │ │ ├── agent/ # Agent panel components │ │ │ ├── user/ # User interface components │ │ │ └── common/ # Shared components │ │ ├── pages/ # Page components │ │ └── utils/ # Utility functions │ ├── public/ # Static assets │ └── package.json ├── backend/ # Express backend application │ ├── models/ # Database models │ ├── routes/ # API routes │ ├── middleware/ # Custom middleware │ ├── config/ # Configuration files │ ├── index.js # Server entry point │ └── package.json └── README.md
