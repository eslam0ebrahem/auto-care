# AutoCare

AutoCare is a small project I built which allows you to manage all of your vehicles as well as log maintenance for each one of them.

## Demo / Layout

**Demo video:** [Youtube](https://youtu.be/SGp1hFjrPHE)

**Layout**
<img width="1506" height="766" alt="Screenshot 2026-03-04 at 8 43 05 am" src="https://github.com/user-attachments/assets/e9eb2c6e-2cc3-4922-a413-823984bb8f9c" />


## Features

* **Vehicle management:** Add/Delete vehicles
* **Service Logging:** Add/Edit/Delete services for any of your vehicles
* **Overdue Services tracker:** Never miss a service.


## Tech Stack

#### Frontend:
* React (UI)
* Vite (Dev Server & Build)
* Tailwind CSS (CSS Framework)

#### Backend:
* Node.js + Express (REST API)
* PostgreSQL + Sequelize (Database/ORM)

---

## Getting Started

### Requirements
* [Node.js](https://nodejs.org/en/download) (v18+ recommended)
* [PostgreSQL](https://www.postgresql.org/download/)

### Quick Start (First-Time Setup)

1. **Clone the repository:**
   ```bash
   git clone <YOUR_REPO_URL>
   cd auto-care
   ```

2. **Install all dependencies (Root, Server, and Client):**
   ```bash
   npm run install:all
   ```

3. **Database & Environment Setup:**
   - Create a PostgreSQL database named `auto_care`:
     ```bash
     npm run db:create
     # OR manually via psql:
     # createdb auto_care
     ```
   - Set up environment variables if needed:
     - `server/.env`: Copy from `server/.env.example`. Defaults: `DB_NAME=auto_care`, `DB_USER` uses your current system username or `postgres`, `PORT=3005`.
     - `client/.env`: Copy from `client/.env.example`. Defaults: `VITE_API_URL=http://127.0.0.1:3005`.

4. **Run both Frontend and Backend concurrently:**
   ```bash
   npm run dev
   ```

   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://127.0.0.1:3005](http://127.0.0.1:3005)

---

### Manual / Separate Terminal Run (Optional)

**Backend:**
```bash
cd server
npm run start
```

**Frontend:**
```bash
cd client
npm run dev
```
