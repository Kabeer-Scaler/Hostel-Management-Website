# Hostel Management System (MERN Stack)

A full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js) to manage various aspects of a student hostel, including user authentication, room assignments, mess management, complaints, and attendance.

---

## ✨ Features

**Student Features:**

* **Authentication:** Register and log in locally (email/password) or via Google OAuth 2.0.
* **Dashboard:** View personal profile and assigned room details.
* **Mess Management:** Opt-in/out of mess services for the current month and select a mess plan.
* **Complaints:** File new complaints regarding hostel issues and view the status of past complaints.
* **Attendance:** Mark daily attendance and view attendance history.

**Admin Features:**

* **Authentication:** Log in as an admin user.
* **Dashboard:** Overview and links to management sections.
* **Room Management:** Create new hostel rooms (Double/Triple Sharing) and assign students to available rooms.
* **Complaint Management:** View all student complaints and update their status (Pending, In Progress, Resolved).
* **Mess Plan Management:** Create, Read, Update, and Delete mess plan options (e.g., Standard, Premium) available to students.
* **Attendance Overview:** View a complete log of all student attendance records.
* **Mess Summary:** View a summary of total mess fees collected for the current month, broken down by plan.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), React Router DOM, Axios, CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** bcryptjs (password hashing), JSON Web Tokens (JWT), Passport.js (Google OAuth 2.0 strategy)
* **Middleware:** CORS, Morgan

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

* **Node.js & npm:** Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended).
* **MongoDB:**
    * **Cloud (Recommended):** Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    * **Local:** Install MongoDB Community Server from the [official website](https://www.mongodb.com/try/download/community).
* **Git:** Download and install from [git-scm.com](https://git-scm.com/).
* **Google OAuth Credentials:** You'll need a Client ID and Client Secret from the [Google API Console](https://console.cloud.google.com/apis/credentials).

### Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Kabeer-Scaler/Hostel-Management.git](https://github.com/Kabeer-Scaler/Hostel-Management.git)
    cd Hostel-Management
    ```

2.  **Backend Setup:**
    * Navigate to the server directory:
        ```bash
        # (No server directory in your final structure, stay in root)
        ```
    * Install backend dependencies:
        ```bash
        npm install
        ```
    * Create a `.env` file in the root directory (`Hostel-Management/.env`).
    * Add the following environment variables to your `.env` file, replacing the placeholder values:
        ```env
        MONGO_URI
        JWT_SECRET
        GOOGLE_CLIENT_ID
        GOOGLE_CLIENT_SECRET
        FRONTEND_URL
        ```
        * `MONGO_URI`: Your connection string from MongoDB Atlas or local setup.
        * `JWT_SECRET`: A long, random, secret string for signing tokens.
        * `FRONTEND_URL`: The URL where your React app will run locally (used for OAuth redirects).

3.  **Frontend Setup:**
    * Navigate to the client directory:
        ```bash
        cd client
        ```
    * Install frontend dependencies:
        ```bash
        npm install
        ```
    * **Important:** Open `client/src/services/apiService.js`. Ensure the `API_URL` constant points to your local backend (usually `http://localhost:5000/api` if your backend runs on port 5000):
        ```javascript
        // client/src/services/apiService.js
        const API_URL = 'http://localhost:5000/api'; 
        ```
    * Navigate back to the root directory:
        ```bash
        cd .. 
        ```

### Running Locally

You need to run both the backend and frontend servers simultaneously in separate terminals.

1.  **Run Backend Server:**
    * Open a terminal in the root `Hostel-Management` directory.
    * Run:
        ```bash
        npm run dev 
        ```
        *(This assumes you have a `dev` script using `nodemon` in your root `package.json`. If not, use `npm start` or `node index.js`)*
    * The API server should start, usually on `http://localhost:5000`.

2.  **Run Frontend Server:**
    * Open a **second** terminal in the `client` directory (`Hostel-Management/client`).
    * Run:
        ```bash
        npm run dev
        ```
    * The React development server should start, usually on `http://localhost:5173`.
    * Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Environment Variables

Make sure the following variables are correctly set in your `.env` file (for local development) or in your hosting provider's environment settings (for deployment).

**Backend (`/.env`):**

* `MONGO_URI`: MongoDB connection string.
* `JWT_SECRET`: Secret key for signing JWTs.
* `GOOGLE_CLIENT_ID`: Google OAuth Client ID.
* `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret.
* `FRONTEND_URL`: Base URL of the deployed frontend (e.g., `https://your-app.vercel.app`) - **Crucial for OAuth redirects.**

**Frontend (`client/src/services/apiService.js`):**

* `API_URL`: Base URL of the deployed backend API (e.g., `https://your-api.onrender.com/api`). This is hardcoded in the file but must point to the correct backend location.

---

## 💡 Troubleshooting and Cache Fix (IMPORTANT)
Due to how single-page applications handle routing and how browsers aggressively cache files, you may encounter issues after deployment.

Fix for Google Sign-In and 404 Errors
If you experience a continuous 404 error, an infinite loop, or the Google Sign-In button fails to work correctly after a new deployment, your browser is likely loading an old version of the App.jsx file.

ACTION REQUIRED: Clear Your Browser Cache or Force a Hard Refresh.

Hard Refresh (Quick Fix): While on the deployed site (Vercel URL), press:

Windows/Linux: Ctrl + Shift + R

Mac: Cmd + Shift + R

Incognito/Private Mode: Always test the Google Sign-In flow in a Private or Incognito window, as this mode ignores cached files.

## 🌐 Deployment

This application is deployed in two parts:

1.  **Backend (API):** Hosted on **Render**.
    * **Live URL:** [https://hostel-management-website-jkl3.onrender.com](https://hostel-management-website-jkl3.onrender.com)
    * **Setup:** Deployed as a Node.js Web Service. Environment variables set in Render dashboard. Root directory set to **blank** (root of repo). Start command: `npm start`. MongoDB Atlas IP Access configured for `0.0.0.0/0`.

2.  **Frontend (Client):** Hosted on **Vercel**.
    * **Live URL:** `https://hostel-management-website-one.vercel.app` 
    * **Setup:** Deployed as a Vite project. Root directory set to `client`. `API_URL` in `apiService.js` points to the live Render URL.

**Google OAuth Configuration (Production):**

* **Authorized JavaScript origins:** (e.g., `https://hostel-management-website-one.vercel.app`).
* **Authorized redirect URIs:** (e.g., `https://hostel-management-website-jkl3.onrender.com/api/auth/google/callback`).

---

## API Endpoints Overview (Prefix: `/api`)

* `/auth`: Signup, Login (local & Google)
* `/users`: Get users, manage roles, get profile (`/me`)
* `/rooms`: Create/get rooms, assign students
* `/complaints`: Create/get complaints (student & admin), update status
* `/mess`: Opt-in/out, get options, manage options (admin), get summary
* `/attendance`: Mark attendance, get attendance (student & admin)

---
