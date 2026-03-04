# AutoCare

AutoCare is a small project I built which allows you to manage all of your vehicles as well as log maintenance for each one of them.

## Demo / Layout

**Demo video:** [Youtube](https://youtu.be/SGp1hFjrPHE)

**Layout**
<img width="1506" height="766" alt="Screenshot 2026-03-04 at 8 43 05 am" src="https://github.com/user-attachments/assets/e9eb2c6e-2cc3-4922-a413-823984bb8f9c" />


## Features

* **Vehicle management:** Add/Remove vehicles
* **Service Logging:** Add/Edit/Remove services for any of your vehicles
* **Overdue Services tracker:** Never miss a service.


## Tech Stack

#### Frontend:
* React (UI)
* Vite (Dev Server & Build)
* Tailwind CSS (CSS Framework)

#### Backend:
* Node.js + Express (REST API)
* PostgreSQL + Sequelize (Database/ORM)

## Getting Started

**Requirements:**

The project runs locally only for now. To run it on your machine you will need:
* [Node.js](https://nodejs.org/en/download)
* [PostgreSQL](https://www.postgresql.org/download/) 

**Installation:**

Clone this repository and install required dependencies.
```
git clone <YOUR_REPO_URL>
cd <YOUR_REPO_NAME>`
```

Install client dependencies.
```
cd client
npm install
```

Install server dependencies.
```
cd ../server
npm install
```

**Run Locally**

You will need to start both the backend server and frontend client in order for the app to work

1) **Start the backend**
   
   From the project root:
   ```
   cd server
   ```
   Start the server
   ```
   npm run start
   ```
   
3) **Start the frontend**
   
   Open a new terminal, then from the project root:
   ```
   cd client
   npm run dev
   ```

