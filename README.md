# DriveEase — MERN Car Rental Platform

A student-friendly full-stack car rental project built with MongoDB, Express, React and Node.js.

## Features
- Responsive React interface with home page, car catalogue, car details and booking form
- Search and filter cars by name/category/transmission
- Register and log in with JWT authentication and hashed passwords
- Create bookings with pickup/return dates and server-side price calculation
- Prevent overlapping confirmed bookings for the same car
- View and cancel your own bookings
- Admin dashboard: add/edit/delete cars and view/update bookings
- Seed sample cars automatically when the database is empty
- API validation, central error handling, environment variables and CORS configuration

> This is an educational project starter, not a production-ready commercial rental system. It does not process real payments or verify driving licences.

## Requirements
- Node.js 18+ (recommended current LTS)
- npm
- MongoDB Atlas account, or a local MongoDB server
- Git (recommended)

## 1. Configure the backend
Open a terminal in `server/` and run:

```bash
npm install
```

Copy `.env.example` to `.env` and set your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/driveease?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@driveease.local
```

In MongoDB Atlas, create a database user and allow your development IP address in Network Access. Keep `.env` private; never commit it.

## 2. Start the API
From `server/`:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. On first successful database connection, sample cars are inserted if the cars collection is empty.

## 3. Configure and start React
Open a second terminal in `client/`:

```bash
npm install
```

Copy `.env.example` to `.env` (or create it) and use:

```env
VITE_API_URL=http://localhost:5000/api
```

Then:

```bash
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

## Admin access
Register using the email configured as `ADMIN_EMAIL` in `server/.env`. That account receives the `admin` role automatically. For a classroom demo, you can set it to an email you control and register with it. Use a strong password.

## API overview
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/cars` | List/search cars |
| GET | `/api/cars/:id` | Get one car |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/bookings/mine` | My bookings (auth) |
| POST | `/api/bookings` | Create booking (auth) |
| PATCH | `/api/bookings/:id/cancel` | Cancel own booking (auth) |
| GET | `/api/admin/bookings` | List all bookings (admin) |
| PATCH | `/api/admin/bookings/:id/status` | Update booking status (admin) |
| POST | `/api/admin/cars` | Add car (admin) |
| PUT | `/api/admin/cars/:id` | Update car (admin) |
| DELETE | `/api/admin/cars/:id` | Delete car (admin) |

## Project structure
```text
driveease-mern/
  client/
    src/
      components/
      pages/
      services/
      App.jsx
      main.jsx
      styles.css
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      seed/
      app.js
      server.js
```

## Important notes
- The backend is the source of truth for booking totals and overlap checks.
- Passwords are hashed with bcryptjs. JWT secret and MongoDB URI stay in backend environment variables.
- The frontend includes loading, empty and error states for key data views.
- Test the complete flow: register → log in → choose a car → book dates → view/cancel booking.
- Before submission, add screenshots, your GitHub repository URL, live URL and any limitations to this README.
