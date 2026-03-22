# MathPath — Interactive Math Learning Platform

MathPath is a full-stack web platform where students follow a structured pathway of math lessons, watch lecture videos, complete AI-generated quizzes, and track their progress on a global leaderboard.

## Project Idea

Students learning math independently often lack structure and feedback. MathPath solves this by combining:
- a guided sequence of lessons,
- embedded lecture videos,
- instant quiz-based assessment,
- personal progress tracking,
- global ranking for motivation.

## Core Features

- **Authentication**
  - User registration and login
  - JWT-based auth (access + refresh)
  - Protected API calls via Angular HTTP interceptor

- **Lesson Pathway**
  - Ordered math topics (e.g., Algebra → Functions → Derivatives)
  - Lecture cards with status and difficulty

- **Lecture Page**
  - Embedded YouTube lecture
  - AI-generated lesson summary cached in database

- **Quiz System**
  - AI-generated multiple-choice questions per lecture
  - Server-side scoring and result persistence
  - Question caching to avoid repeated AI calls

- **Leaderboard & Profile**
  - Global ranking by total score
  - User stats and attempt history

## Tech Stack

### Frontend
- **Angular 21**
- TypeScript
- Angular Router
- Angular Forms (`ngModel`)
- HttpClient + JWT Interceptor

### Backend
- **Django 5**
- Django REST Framework
- JWT Auth (`djangorestframework-simplejwt`)
- CORS (`django-cors-headers`)

### Database
- PostgreSQL 16

### Infrastructure
- Docker & Docker Compose
- Environment-based configuration (`.env`)

### AI Integration (server-side)
- OpenAI API or Google Gemini API
- Quiz generation and lecture summary generation
- Cached AI outputs in database

## Planned Domain Models

- `UserProfile` (extends user stats)
- `Lecture` (topic, video, summary, order)
- `Question` (lecture quiz question, options, answer)
- `QuizAttempt` (user result per lecture)

## Planned API Scope

- Auth: register, login, logout
- Lectures: list, detail, CRUD (admin)
- Questions: fetch/generated per lecture
- Quiz: submit answers, attempt history
- Leaderboard: global ranking

## Repository Structure

```text
.
├── backend/              # Django + DRF API
├── frontend/             # Angular application
├── docker-compose.yml    # Full-stack local orchestration
├── .env.example          # Environment template
├── requirements.md       # Course/project constraints
└── idea.md               # Product concept and architecture notes
```

## Local Run (Docker)

```bash
docker compose up --build
```

- Frontend: http://localhost:4200
- Backend API: http://localhost:8000

## Status

Initial project scaffolding is complete:
- Angular frontend initialized
- Django backend initialized with app modules
- Docker Compose stack prepared (frontend + backend + postgres)

---

This README describes the current project direction and implementation plan for the MathPath platform.
