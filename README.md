<div align="center">

# 🚀 StreamForge Backend

### Production-Ready Social Media Backend API built with **Node.js**, **Express.js**, and **MongoDB**

<p align="center">
A scalable backend powering a modern social media platform with secure authentication, media management, subscriptions, playlists, tweets, comments, likes, and production-grade REST APIs.
</p>

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</p>

<p align="center">

![REST API](https://img.shields.io/badge/REST_API-02569B?style=for-the-badge)
![MVC Architecture](https://img.shields.io/badge/MVC-Architecture-blue?style=for-the-badge)
![Cookie Authentication](https://img.shields.io/badge/Cookie-Based_Authentication-success?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Actively_Developing-success?style=for-the-badge)

</p>

</div>

---

# 📖 Overview

**StreamForge Backend** is a production-oriented backend application designed to power a modern social media platform. It provides secure authentication, scalable RESTful APIs, media management, user interactions, subscriptions, playlists, tweets, comments, likes, and dashboard analytics while following industry-standard backend architecture.

The project emphasizes **clean code**, **modular design**, **security**, and **scalability**, making it suitable for learning production backend development and serving as a strong portfolio project.

---

# ✨ Key Highlights

- 🔐 JWT Authentication & Authorization
- 🍪 Secure Cookie-Based Authentication
- 🔄 Refresh Token Management
- 📹 Video Upload & Management
- ☁️ Cloudinary Media Storage
- 📁 Multer File Upload Handling
- 👤 User Profile Management
- ❤️ Like System
- 💬 Comment System
- 📝 Tweet Module
- 📂 Playlist Management
- 📺 Subscription System
- 📊 Dashboard APIs
- 📜 Watch History
- ⚡ MongoDB Aggregation Pipelines
- 🛡️ Centralized Error Handling
- 📦 Standardized API Responses
- 🚀 Scalable MVC Architecture

---

# 🎯 Project Goals

This project focuses on implementing backend engineering best practices including:

- Designing scalable REST APIs
- Secure authentication & authorization
- Media upload workflow
- Database relationship modeling
- MongoDB aggregation pipelines
- Modular MVC architecture
- Reusable middleware
- Production-grade error handling
- Clean and maintainable codebase

---

# 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT, Refresh Tokens |
| File Upload | Multer |
| Cloud Storage | Cloudinary |
| API Style | REST API |
| Architecture | MVC |
| Security | Cookies, Password Hashing, Middleware |
| Language | JavaScript (ES6+) |

---

# 📑 Table of Contents

- [Overview](#-overview)
- [Key Highlights](#-key-highlights)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [API Modules](#-api-modules)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [API Response Format](#-api-response-format)
- [Security Features](#-security-features)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)

---

> **Status:** 🚧 Actively Developing  
> New features and improvements are continuously being added to StreamForge Backend.

---

# ✨ Features

## 🔐 Authentication & User Management

Build secure and reliable authentication workflows with JWT-based authorization and refresh token support.

### Features

- User Registration
- User Login & Logout
- JWT Access Token Authentication
- Refresh Token Rotation
- Cookie-Based Authentication
- Change Password
- Get Current User
- Update Account Details
- Update Avatar
- Update Cover Image
- Channel Profile API
- Watch History Management

---

## 🎥 Video Management

A complete video management module supporting media uploads and user-owned content.

### Features

- Publish Videos
- Update Video Details
- Delete Videos
- Publish / Unpublish Videos
- Fetch Single Video
- Fetch All Videos
- Owner-specific Video Access
- Video Thumbnail Upload
- Cloudinary Integration
- Video Metadata Storage

---

## ❤️ Like System

Supports interactions across multiple content types.

### Features

- Like / Unlike Videos
- Like / Unlike Comments
- Like / Unlike Tweets
- Optimized MongoDB Queries

---

## 💬 Comment System

Manage user discussions on videos.

### Features

- Add Comment
- Edit Comment
- Delete Comment
- Fetch Video Comments
- Pagination Support

---

## 📝 Tweet Module

Lightweight social posting functionality.

### Features

- Create Tweet
- Update Tweet
- Delete Tweet
- Fetch Tweets

---

## 📂 Playlist Management

Organize videos into reusable collections.

### Features

- Create Playlist
- Update Playlist
- Delete Playlist
- Add Videos
- Remove Videos
- Fetch Playlist Details

---

## 📺 Subscription System

Follow creators and manage subscriber relationships.

### Features

- Subscribe to Channels
- Unsubscribe
- Get Subscriber List
- Get Subscribed Channels
- Channel Statistics

---

## 📊 Dashboard APIs

Backend analytics for creators.

### Features

- Total Videos
- Total Views
- Total Subscribers
- Total Likes
- Dashboard Aggregation APIs

---

## ☁️ Cloud Storage

Integrated media management using Cloudinary.

### Features

- Avatar Upload
- Cover Image Upload
- Video Upload
- Thumbnail Upload
- Automatic Cleanup
- Public ID Management

---

## ⚡ Backend Engineering

Designed with scalability and maintainability in mind.

### Features

- RESTful API Design
- MVC Architecture
- Reusable Middleware
- Async Error Handling
- Standardized API Responses
- Centralized Error Handling
- Environment Configuration
- MongoDB Aggregation Pipelines
- Modular Code Structure

---

# 🏗 Project Architecture

The project follows the **Model–View–Controller (MVC)** architecture to maintain separation of concerns and improve scalability.

```
                Client
                   │
                   ▼
              Express Routes
                   │
                   ▼
             Authentication
             & Middlewares
                   │
                   ▼
              Controllers
                   │
                   ▼
               Business Logic
                   │
                   ▼
               Mongoose Models
                   │
                   ▼
                MongoDB Atlas
```

### Architecture Benefits

- Clear separation of responsibilities
- Easier debugging
- Better scalability
- Maintainable codebase
- Reusable business logic
- Modular API development

---

# 📂 Project Structure

```text
streamforge-backend/
│
├── public/
│   └── temp/
│
├── src/
│   ├── controllers/
│   │   ├── comment.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── healthcheck.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.controller.js
│   │   ├── subscription.controller.js
│   │   ├── tweet.controller.js
│   │   ├── user.controller.js
│   │   └── video.controller.js
│   │
│   ├── db/
│   │   └── index.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   │
│   ├── models/
│   ├── routes/
│   ├── utils/
│   │
│   ├── app.js
│   ├── constants.js
│   └── index.js
│
├── .env
├── .env.sample
├── package.json
└── README.md
```

---

# 📡 API Modules

| Module | Description |
|----------|-------------|
| 👤 Users | Authentication, profile management, watch history |
| 🎥 Videos | Upload, update, publish, delete, fetch videos |
| ❤️ Likes | Video, comment and tweet likes |
| 💬 Comments | CRUD operations for comments |
| 📝 Tweets | Social posting functionality |
| 📂 Playlists | Video playlist management |
| 📺 Subscriptions | Subscribe and manage channels |
| 📊 Dashboard | Analytics and aggregation APIs |
| ❤️ Healthcheck | Server health monitoring |

---

# 🔄 Authentication Flow

```
User
 │
 │ Login
 ▼
Server
 │
 ├── Verify Credentials
 │
 ├── Generate Access Token
 │
 ├── Generate Refresh Token
 │
 ├── Store Refresh Token
 │
 └── Send Secure Cookies
          │
          ▼
Authenticated Requests
          │
          ▼
 JWT Verification Middleware
          │
          ▼
 Protected Routes
```

---

# 🧩 Middleware

## Authentication Middleware

Responsible for

- JWT Verification
- User Authentication
- Protected Routes
- Request Authorization

---

## Multer Middleware

Responsible for

- Avatar Upload
- Cover Image Upload
- Video Upload
- Thumbnail Upload
- Temporary File Storage
- Multipart Form Handling

---

# 🚀 Installation

## Prerequisites

Ensure the following tools are installed on your system:

- Node.js (v18 or later recommended)
- npm
- MongoDB Atlas account (or local MongoDB instance)
- Cloudinary account

---

## Clone the Repository

```bash
git clone https://github.com/Arpit11-svg/streamforge-backend.git

cd streamforge-backend
```

---

## Install Dependencies

```bash
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note:** Never commit your `.env` file. Use `.env.sample` as the reference configuration.

---

# ▶️ Running the Project

### Development

```bash
npm run dev
```

---

### Production

```bash
npm start
```

---

The backend server will start at:

```
http://localhost:8000
```

---

# 📜 Available Scripts

| Script | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server using Nodemon |
| `npm start` | Start production server |

---

# 🌐 API Design Principles

The project follows RESTful API conventions.

Example endpoints:

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/users/register` | Register a new user |
| POST | `/api/v1/users/login` | Login |
| POST | `/api/v1/videos` | Upload a video |
| GET | `/api/v1/videos` | Fetch all videos |
| POST | `/api/v1/playlists` | Create playlist |
| POST | `/api/v1/comments/:videoId` | Add comment |
| POST | `/api/v1/likes/toggle/video/:videoId` | Toggle video like |

> More endpoints will be added as the project evolves.

---

# 📦 Standard API Response

Successful responses follow a consistent format.

```json
{
    "statusCode": 200,
    "data": {},
    "message": "Request completed successfully",
    "success": true
}
```

---

# ❌ Error Response

Errors are standardized across the application.

```json
{
    "statusCode": 400,
    "message": "Invalid request",
    "success": false,
    "errors": []
}
```

---

# 🛡️ Security Features

StreamForge Backend follows backend security best practices.

### Authentication

- JWT Access Tokens
- Refresh Tokens
- Cookie-Based Authentication
- Protected Routes

### Password Security

- Password Hashing using bcrypt
- Password Verification
- Secure Password Updates

### API Security

- Authentication Middleware
- Authorization Checks
- Input Validation
- Error Sanitization

### Media Security

- Cloudinary Storage
- Temporary File Cleanup
- Secure Upload Workflow

---

# ⚡ Performance Features

- MongoDB Aggregation Pipelines
- Optimized Database Queries
- Reusable Middleware
- Modular Codebase
- Efficient Async Handling
- Scalable Controller Design

---

# 📈 Future Roadmap


## Planned Features

- [ ] Notifications
- [ ] Search APIs
- [ ] Recommendation System
- [ ] Video View Analytics
- [ ] Admin Dashboard
- [ ] Docker Support
- [ ] CI/CD Pipeline
- [ ] Unit Testing
- [ ] API Documentation (Swagger/OpenAPI)
- [ ] Rate Limiting
- [ ] Redis Caching
- [ ] WebSocket Support
- [ ] Logging & Monitoring

---

# 🤝 Contributing

Contributions are welcome!

If you'd like to improve StreamForge Backend:

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

Please ensure your code follows the project's coding style and best practices.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Arpit Choudhary**

GitHub: https://github.com/Arpit11-svg

---

<div align="center">

### ⭐ If you found this project helpful, consider giving it a Star!

It motivates further development and helps others discover the project.

**Happy Coding! 🚀**

</div>