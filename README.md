# 🚗 AutoCare

> A modern, full-stack vehicle maintenance and service tracking application designed to help vehicle owners and enthusiasts keep their garage in peak condition.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue?logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow?logo=vitest)](https://vitest.dev/)

---

## 📸 Demo & Layout

- 🎥 **Video Walkthrough:** [Watch on YouTube](https://youtu.be/SGp1hFjrPHE)

<div align="center">
  <img width="100%" alt="AutoCare Dashboard Screenshot" src="https://github.com/user-attachments/assets/e9eb2c6e-2cc3-4922-a413-823984bb8f9c" />
</div>

---

## ✨ Features

- 🚘 **Vehicle Garage Management:** Add, view, edit, and remove vehicles with license plates, makes, models, and manufacture years.
- 🔧 **Comprehensive Service Logging:** Log service events with date, odometer mileage, cost in GBP, service category, and optional technician notes.
- ⏱️ **Smart Service Intervals & Reminders:** Automatically computes overdue status and upcoming due dates across regular intervals (Oil Change, Tyre Rotation, Inspection, Brakes, Gearbox, Timing Belt).
- 📊 **Dynamic Dashboard:** Real-time summary statistics for total vehicles, logged service count, and vehicles with overdue maintenance.
- 📥 **Export & Print Ready:** Export any service record to CSV with a single click, or generate print-friendly PDF receipts with automated `@media print` layout sanitization.
- 🔐 **Secure Authentication:** User accounts with bcrypt-hashed passwords and JSON Web Token (JWT) session security.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Date Utilities:** [date-fns](https://date-fns.org/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Sequelize 6](https://sequelize.org/)
- **Security:** `bcryptjs` (password hashing) + `jsonwebtoken` (JWT authentication)
- **Testing:** [Vitest](https://vitest.dev/) + [Supertest](https://github.com/ladjs/supertest)

---

## 📁 Project Structure

```text
auto-care/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── apiService/         # Typed API clients (Auth, Vehicles, Services)
│   │   ├── components/         # Modular UI components
│   │   │   ├── Dashboard/      # Summary stats & recent activity feed
│   │   │   ├── MyVehicles/     # Vehicle catalog and gallery
│   │   │   ├── VehicleDetails/ # Vehicle history & service logs
│   │   │   ├── LogService/     # Reactive service logging & editing form
│   │   │   ├── AddVehicle/     # Vehicle creation and editing modal
│   │   │   ├── LoginModal/     # Authentication modal
│   │   │   ├── ServiceReminder/# Dynamic service due status indicator
│   │   │   └── ExportPrintButton/# CSV download & print helper
│   │   ├── serviceInterval.js  # Maintenance intervals & calculation engine
│   │   ├── App.jsx             # Root layout & route configuration
│   │   └── index.css           # Tailwind v4 import & print stylesheets
│   └── vite.config.js
│
├── server/                     # Backend Express REST API
│   ├── config.ts               # Centralized configuration & environment loader
│   ├── app.ts                  # Express app setup, CORS, and middleware
│   ├── index.ts                # Database sync and server listener
│   ├── controllers/            # Request handlers (auth, vehicle, service)
│   ├── middleware/             # Typed JWT authentication middleware
│   ├── models/                 # Sequelize data models (User, Vehicle, Service)
│   ├── routers/                # Express API route declarations
│   ├── scripts/                # Database automation scripts (createDb.js)
│   └── tests/                  # Integration test suite (Vitest + Supertest)
│
├── package.json                # Monorepo orchestrator scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download) (v18.0.0 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/download/) (v14+ running locally or in Docker)

---

### Step-by-Step Installation

#### 1. Clone the repository
```bash
git clone https://github.com/eslam0ebrahem/auto-care.git
cd auto-care
```

#### 2. Install dependencies across all workspaces
```bash
npm run install:all
```
*This installs root dependencies, server dependencies, and client packages in one step.*

#### 3. Configure Environment Variables

**Server Configuration:**
Create `server/.env` (or copy from `server/.env.example`):
```bash
cp server/.env.example server/.env
```
Ensure your database credentials and secret key are set:
```env
PORT=3005
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key
DB_NAME=auto_care
DB_USER=postgres
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
```

**Client Configuration:**
Create `client/.env` (or copy from `client/.env.example`):
```bash
cp client/.env.example client/.env
```
```env
VITE_API_URL=http://127.0.0.1:3005
```

#### 4. Initialize Database
Create the `auto_care` PostgreSQL database automatically:
```bash
npm run db:create
```

#### 5. Launch Development Environment
Run both the backend API and frontend dev server concurrently:
```bash
npm run dev
```

- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://127.0.0.1:3005](http://127.0.0.1:3005)

---

## 📜 Available Scripts

Run these commands from the root directory:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs both backend (`tsx watch`) and frontend (`vite`) concurrently. |
| `npm run install:all` | Installs dependencies for root, server, and client. |
| `npm run db:create` | Creates the PostgreSQL database if it does not already exist. |
| `npm run test` | Runs the automated backend test suite using Vitest. |
| `npm run lint` | Lints frontend codebase using ESLint with React Hooks checks. |
| `npm run build` | Compiles server TypeScript and creates a production Vite bundle. |
| `npm run server:start` | Starts the compiled production backend server. |

---

## 🔌 API Reference Overview

All vehicle and service endpoints require the `Authorization: Bearer <TOKEN>` header.

### Authentication (`/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Login with credentials and receive a JWT |
| `GET` | `/auth/me` | Fetch authenticated user profile |

### Vehicles (`/vehicles`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/vehicles` | List all vehicles owned by the authenticated user |
| `POST` | `/vehicles` | Add a new vehicle (`make`, `model`, `year`, `licensePlate`) |
| `GET` | `/vehicles/:id` | Get details and service history for a specific vehicle |
| `PATCH` | `/vehicles/:id` | Update vehicle details |
| `DELETE` | `/vehicles/:id` | Delete vehicle and cascade delete related services |

### Services (`/services`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/services` | List all services for the user's vehicles |
| `POST` | `/services` | Log a new service (`vehicleId`, `serviceType`, `date`, `mileage`, `cost`, `notes`) |
| `PATCH` | `/services/:id` | Update an existing service record |
| `DELETE` | `/services/:id` | Remove a service record |

---

## 🧪 Testing

The backend test suite is powered by **Vitest** and **Supertest** running against the exported Express application:

```bash
npm run test
```

---

## 📄 License

This project is licensed under the **ISC License**. Feel free to use and adapt it for your own automotive projects!
