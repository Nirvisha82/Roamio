# Roamio - Travel Companion Platform

<p align="center">
  <img src="https://img.shields.io/badge/Go-1.18+-00ADD8.svg" alt="Go Version">
  <img src="https://img.shields.io/badge/Gin-Framework-00ADD8.svg" alt="Gin Framework">
  <img src="https://img.shields.io/badge/GORM-ORM-red.svg" alt="GORM">
  <img src="https://img.shields.io/badge/SQLite-Database-003B57.svg" alt="SQLite">
</p>

Roamio is your ultimate travel companion platform that makes exploring the world effortless, personalized, and inspiring. Built with Go and Gin framework, it provides tools for creating travel itineraries, connecting with fellow travelers, and discovering authentic travel experiences.

## 🚀 Features

- **📋 Itinerary Management**: Create, share, and discover detailed travel itineraries
- **👥 Social Travel Network**: Follow users and states, build travel communities
- **💬 Interactive Comments**: Engage with travel posts and share experiences
- **📊 Travel Analytics**: Top states and users by followers
- **🔐 User Authentication**: Secure registration and login system
- **📱 Profile Management**: Customizable user profiles with photo uploads
- **🌍 State-based Discovery**: Explore destinations by US states

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Language** | Go 1.18+ |
| **Framework** | Gin Web Framework |
| **ORM** | GORM |
| **Database** | SQLite |
| **Documentation** | Swagger/OpenAPI |
| **Port** | 8080 |


## 🔧 Installation & Setup

### Prerequisites

- Go 1.18 or higher
- SQLite3
- Python 3.x (for data generation scripts)

### Step 1: Clone Repository

```bash
git clone https://github.com/Nirvisha82/Roamio.git
cd roamio
```

### Step 2: Install Go Dependencies

```bash
go mod download
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# Frontend Configuration
FRONTEND_PORT=3000

# Database Configuration
DB_PATH=roamioDB.db

# API Configuration
API_BASE_URL=http://localhost:8080
```

### Step 4: Initialize Database

The database will be automatically created when you first run the application.

### Step 5: Run Application

```bash
go run main.go
```

The application will be accessible at `http://localhost:8080`

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Gin Router    │    │   Handlers      │
│   (Port 3000)   │────▶│   (Port 8080)   │────▶│   Layer         │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SQLite DB     │    │   GORM ORM      │    │   Services      │
│                 │◀───│                 │◀───│   Layer         │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 API Endpoints

### Itineraries
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/itineraries` | Get all itineraries |
| `POST` | `/itineraries` | Create new itinerary |
| `GET` | `/itineraries/user/:userID` | Get user's itineraries |
| `GET` | `/itineraries/state/:statecode` | Get state itineraries |
| `GET` | `/itineraries/post/:postID` | Get specific itinerary |
| `GET` | `/itineraries/top-states` | Get top states by followers |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Get all users |
| `POST` | `/users/register` | User registration |
| `POST` | `/users/login` | User authentication |
| `POST` | `/users/follow` | Follow user/state |
| `GET` | `/users/followers/:type/:target_id` | Get followers |
| `GET` | `/users/followings/:user_id` | Get followings |
| `POST` | `/users/unfollow` | Unfollow user/state |
| `POST` | `/users/follow/check` | Check follow status |
| `POST` | `/users/profile-pic` | Update profile picture |
| `GET` | `/users/:username/profile-pic` | Get profile picture |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/comments` | Create comment |
| `GET` | `/comments` | Get all comments |
| `GET` | `/comments/:postID` | Get post comments |


### Feed
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/feed/:user_name` | Get personalized feed |


## 📊 Data Generation

The project includes Python scripts for generating test data:

### Generate Users
```bash
python scripts/create_users.py
```

### Generate Itineraries
```bash
python scripts/create_itineraries.py
```

### Generate Comments
```bash
python scripts/comment_itineraries.py
```

### Generate Follow Relationships
```bash
python scripts/follow_users.py
```

## 📚 API Documentation

Access Swagger documentation at:
```
http://localhost:8080/swagger/index.html
```

## 🔧 Configuration

### CORS Settings
```go
AllowOrigins: []string{"http://localhost:3000"}
AllowMethods: []string{"GET", "POST", "OPTIONS"}
AllowHeaders: []string{"Content-Type", "Authorization"}
```

### Database Models
- **Users**: Profile management and authentication
- **Itineraries**: Travel plans and destinations
- **Comments**: User interactions and feedback
- **Follows**: Social network relationships
- **States**: US state information


## 🌐 Features Overview

### Travel Itineraries
- Create detailed travel plans
- Include budget, duration, and group size
- Add highlights and suggestions
- Upload travel photos

### Social Features
- Follow other travelers
- Follow specific US states
- Comment on travel posts
- Build travel communities

### Discovery
- Explore itineraries by state
- Find top destinations by popularity
- Discover trending travelers
- Personalized feed recommendations

## 👥 Contributors

- **[Nirvisha Soni](https://github.com/Nirvisha82)**
- **[Neel Malwatkar](https://github.com/neelmalwatkar)**

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

<p align="center">
  Made with ❤️ for travelers by travelers
</p>
