# Task Management System

A full-stack Task Management System built using Node.js, Express.js, MongoDB Atlas, JWT Authentication, and a simple frontend using HTML, CSS, and JavaScript.

---

# Features

## Authentication & Authorization
- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcryptjs
- Role-Based Access Control (User/Admin)
- Protected Routes

---

## Task Management
- Create Task
- Get All Tasks
- Get Single Task
- Update Task
- Delete Task

---

## Backend Features
- RESTful APIs
- API Versioning (`/api/v1`)
- MongoDB Atlas Integration
- Mongoose Models & Validation
- Error Handling
- Environment Variables

---

## Frontend Features
- Simple Responsive UI
- Task Creation
- Task Listing
- API Integration

---

# Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs

## Frontend
- HTML
- CSS
- JavaScript

## Tools
- Git
- GitHub
- Postman
- VS Code

---

# Demo Video

Watch the complete project demo here:

[Click Here to Watch Demo Video]https://drive.google.com/file/d/1MauVvsbk3R-T39145uAFXrUIQMrG4zkS/view?usp=sharing

---

# Project Structure

```bash
task-management-system-main/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── task.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   └── Task.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── task.routes.js
│   │   │
│   │   ├── config/
│   │   └── utils/
│   │
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── package.json
│   └── package-lock.json
│
├── README.md
├── package.json
└── package-lock.json
```

---

# Setup Instructions

# STEP 1 — Clone Repository

```bash
git clone https://github.com/ParidhiGoel26/task-manager-app.git
```

---

# STEP 2 — Navigate to Project Folder

```bash
cd task-management-system-main
```

---

# STEP 3 — Install Root Dependencies

```bash
npm install
```

---

# Backend Setup

# STEP 4 — Navigate to Backend Folder

```bash
cd backend
```

---

# STEP 5 — Install Backend Dependencies

```bash
npm install
```

---

# STEP 6 — Create .env File

Create a `.env` file inside backend folder and add:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRE=7d

BCRYPT_ROUNDS=10
```

---

# MongoDB Atlas Setup

## STEP 7 — Create MongoDB Atlas Account

Visit:

```bash
https://www.mongodb.com/cloud/atlas
```

Create a free account.

---

## STEP 8 — Create Free Cluster

- Select FREE cluster
- Choose cloud provider and region
- Create cluster

---

## STEP 9 — Create Database User

- Go to Database Access
- Click Add New Database User
- Create username & password

---

## STEP 10 — Add IP Address

- Go to Network Access
- Click Add IP Address
- Select:

```bash
Allow Access From Anywhere
```

---

## STEP 11 — Get MongoDB Connection String

- Click Connect
- Select Drivers
- Copy MongoDB URI

Example:

```bash
mongodb+srv://username:password@cluster.mongodb.net/task-manager
```

Paste inside:

```env
MONGO_URI=
``` 

---

# STEP 12 — Start Backend Server

Inside backend folder:

```bash
node server.js
```

Server runs at:

```bash
http://localhost:5000
```

---

# Frontend Setup

# STEP 13 — Open New Terminal

Navigate to frontend folder:

```bash
cd frontend
```

---

# STEP 14 — Install Frontend Dependencies

```bash
npm install
```

---

# STEP 15 — Run Frontend

Open:

```bash
index.html
```

OR use VS Code Live Server extension.

---

# API Endpoints

# Authentication Routes

## Register User

```http
POST /api/v1/auth/register
```

### Request Body

```json
{
  "name": "Paridhi",
  "email": "paridhi@gmail.com",
  "password": "Paridhi123",
  "role": "user"
}
```

---

## Login User

```http
POST /api/v1/auth/login
```

### Request Body

```json
{
  "email": "paridhi@gmail.com",
  "password": "Paridhi123"
}
```

---

## Get Current User

```http
GET /api/v1/auth/me
```

### Headers

```http
Authorization: Bearer YOUR_TOKEN
```

---

# Task Routes

## Create Task

```http
POST /api/v1/tasks
```

### Headers

```http
Authorization: Bearer YOUR_TOKEN
```

### Request Body

```json
{
  "title": "Complete Backend Project",
  "description": "Finish APIs",
  "priority": "high",
  "status": "pending"
}
```

---

## Get All Tasks

```http
GET /api/v1/tasks
```

---

## Get Single Task

```http
GET /api/v1/tasks/:id
```

---

## Update Task

```http
PUT /api/v1/tasks/:id
```

---

## Delete Task

```http
DELETE /api/v1/tasks/:id
```

---

# Database Schema

# User Schema

```js
{
  name: String,
  email: String,
  password: String,
  role: String
}
```

---

# Task Schema

```js
{
  title: String,
  description: String,
  status: String,
  priority: String,
  dueDate: Date,
  user: ObjectId
}
```

---

# Postman Testing

The following APIs were tested using Postman:

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- CRUD Operations

---

# Security Features

- Password Hashing using bcryptjs
- JWT Authentication
- Protected APIs
- Role-Based Access Control
- Environment Variables

---

# Future Improvements

- Swagger API Documentation
- Pagination
- Search & Filter
- Task Categories
- Docker Deployment
- Email Verification
- Password Reset

---

# Author

## Paridhi Goel

GitHub:
https://github.com/ParidhiGoel26

---

# License

This project is licensed under the MIT License.
