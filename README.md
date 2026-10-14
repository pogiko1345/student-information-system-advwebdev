# Student Information System

A responsive MERN Student Information System with JWT authentication, student CRUD, search, pagination, dashboard, and profile management. Built for the CTADWEBL Advanced Web Programming project.

## Responsibilities and branches

| Branch | Member | Module |
| --- | --- | --- |
| `yap` | Yap | Registration, login, logout, JWT, authentication middleware, protected routes |
| `ramiro` | Ramiro | Student model, protected CRUD API, list, detail, and forms |
| `hobayan` | Hobayan | Responsive navigation, search, filters, pagination, states |
| `alimboyao` | Alimboyao | Dashboard, profile, consolidated Chapter 1 documentation |

The `main` branch merges these modules and contains the complete integrated app. API conventions are in [docs/API.md](docs/API.md). Chapter 1 is in [docs/CHAPTER_1.md](docs/CHAPTER_1.md).

## Requirements

Node.js 20 or newer, npm, and MongoDB 7 or newer. A local MongoDB server or MongoDB Atlas database can be used. Use only demonstration student data.

## Install and run

1. Run `npm install` in the project root, then `npm run install:all`.
2. Copy `backend/.env.example` to `backend/.env`, then set `MONGODB_URI` and a random `JWT_SECRET` of at least 32 characters.
3. Optionally copy `frontend/.env.example` to `frontend/.env` if the API is not at `http://localhost:5000/api`.
4. Run `npm run dev`.
5. Open `http://localhost:5173` and register an account.

The backend runs at `http://localhost:5000`. Run `npm test` for backend tests and a frontend production build. Do not commit `.env` files or real student information.

For Vercel, deploy the `backend` and `frontend` directories as separate projects and set their production environment variables. See [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md). The browser must call the deployed backend URL; `localhost:5000` works only for local development.

## Security and limits

Passwords are hashed with bcrypt. API routes require an eight-hour JWT. Registration and login are rate limited, and input is validated on the server. Tokens are stored for the browser session and cleared on logout. All signed-in users can manage records; role-based authorization is outside this project's scope. Use HTTPS and a strong secret when deploying.

## Submission material

The submission-ready [Chapter 1 PDF](docs/Chapter_1.pdf) uses Letter paper with 1-inch top/right/bottom and 1.5-inch left margins. Capture source-code screenshots of auth middleware/routes, Student model/routes, student search/pagination, dashboard aggregation, and profile routes. Capture system screenshots of registration, login, dashboard, student list/search, form, detail, profile, and mobile navigation. A presentation should cover the problem, objectives, architecture, demo, security, testing, responsibilities, and limitations.
