# 🎓 NRIIT Project - Vercel Ready

National Research Institute of Information Technology (NRIIT) - Complete Management System

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)

---

## 📖 Project Overview

NRIIT is a comprehensive management system built with:
- **Frontend**: Static HTML pages (no build process needed)
- **Backend**: Serverless APIs (Vercel Functions)
- **Database**: Oracle DB (configurable)
- **Storage**: Vercel Blob (for file uploads)

---

## 🗂️ Project Structure

```
nriit-project/
│
├── public/                      # 🌐 Frontend (Static Website)
│   ├── index.html              # Home page
│   ├── about.html              # About us
│   ├── courses.html            # Course listing
│   ├── admissions.html         # Admissions info
│   ├── contact.html            # Contact page
│   ├── news.html               # News page
│   ├── events.html             # Events page
│   ├── auth/                   # Authentication pages
│   │   ├── login.html
│   │   ├── register.html
│   │   └── forgot-password.html
│   ├── student/                # Student portal
│   │   ├── dashboard.html
│   │   ├── profile.html
│   │   ├── results.html
│   │   ├── attendance.html
│   │   └── fees.html
│   └── admin/                  # Admin panel
│       ├── dashboard.html
│       ├── manage-students.html
│       ├── manage-faculty.html
│       ├── manage-news.html
│       └── reports.html
│
├── api/                         # ⚡ Vercel Serverless Backend
│   ├── auth.js                  # Login/Register/Auth APIs
│   ├── student.js              # Student data APIs
│   ├── admin.js                # Admin management APIs
│   ├── news.js                 # News CRUD operations
│   ├── attendance.js           # Attendance system
│   ├── fees.js                 # Fees management
│   └── upload.js               # Vercel Blob file uploads
│
├── assets/                      # 🎨 Shared CSS/JS/Images
│   ├── css/
│   │   └── style.css           # Global styles
│   ├── js/
│   │   ├── app.js              # App utilities
│   │   ├── api.js              # API calls
│   │   └── auth.js             # Auth helpers
│   └── images/                 # Images directory
│
├── package.json                 # 📦 Dependencies
├── vercel.json                  # 🚀 Vercel configuration
└── README.md                    # 📘 This file
```

---

## ✨ Features

### 🔐 Authentication
- User login/register
- JWT token-based authentication
- Password reset functionality
- Role-based access (Student, Faculty, Admin)

### 👨‍🎓 Student Portal
- Dashboard with quick stats
- Profile management
- View results and grades
- Track attendance
- Pay fees online

### 👨‍💼 Admin Panel
- Manage students and faculty
- Publish news and events
- Generate reports
- System analytics

### 📦 Storage Features
- Vercel Blob integration (1GB free)
- Upload profile photos
- Store documents
- Upload news images

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Setup

1. **Clone/Download the project**
   ```bash
   cd nriit-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Oracle DB and Vercel Blob credentials

4. **Run locally**
   ```bash
   npm run dev
   ```

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Oracle Database
ORACLE_USER=your_user
ORACLE_PASSWORD=your_password
ORACLE_CONNECTIONSTRING=your_connection_string

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# JWT
JWT_SECRET=your_jwt_secret_key

# App
PORT=3000
NODE_ENV=development
```

---

## 🌐 Deployment (Vercel)

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Add environment variables
5. Deploy!

### Step 3: Set Domain
- Add your custom domain in Vercel dashboard

---

## 📡 API Documentation

### Authentication
- `POST /api/auth` - Login, Register, Password Reset

### Student APIs
- `GET /api/student` - Get dashboard data
- `GET /api/student?action=profile` - Get profile
- `POST /api/student?action=updateProfile` - Update profile
- `GET /api/attendance` - Get attendance
- `GET /api/fees` - Get fees info
- `POST /api/fees?action=pay` - Pay fees

### Admin APIs
- `GET /api/admin` - Dashboard stats
- `GET /api/admin?action=students` - List students
- `GET /api/admin?action=faculty` - List faculty
- `POST /api/admin?action=addFaculty` - Add faculty
- `GET /api/admin?action=report&type=attendance` - Generate reports

### News APIs
- `GET /api/news` - Get all news
- `POST /api/news?action=create` - Create news post
- `POST /api/news?action=delete` - Delete news

### Upload
- `POST /api/upload` - Upload file to Vercel Blob

---

## 🔒 Security

- ✅ JWT authentication
- ✅ Password hashing (bcryptjs)
- ✅ CORS protection
- ✅ Input validation
- ✅ Rate limiting (recommended)
- ✅ HTTPS in production

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(100),
    email VARCHAR2(100) UNIQUE,
    password VARCHAR2(255),
    phone VARCHAR2(20),
    role VARCHAR2(20),
    created_date DATE
);
```

### Students Table
```sql
CREATE TABLE students (
    id NUMBER PRIMARY KEY,
    user_id NUMBER,
    roll_number VARCHAR2(20),
    course VARCHAR2(100),
    gpa DECIMAL(3,2),
    attendance DECIMAL(5,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure and submit pull requests.

---

## 📝 License

This project is proprietary and confidential.

---

## 📞 Support

For issues or questions:
- Email: support@nriit.edu
- Website: https://nriit.edu

---

**Happy Coding! 🚀**
