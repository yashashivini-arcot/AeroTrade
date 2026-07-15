# 🛒 ShopEZ: E-Commerce Platform (MERN Stack Template)

> [!NOTE]
> **Project Status**: Prepared and ready for development. The AeroTrade codebase has been cleaned up, and this repository is ready to develop ShopEZ.

ShopEZ is a clean, modern, and high-performance e-commerce platform starter template. Built with the MERN stack (MongoDB, Express, React, Node), it provides a robust boilerplate featuring a premium design, responsive layouts, fully integrated JWT authentication (Sign In/Sign Up), and a MongoDB database connection with an In-Memory fallback server.

---

## 🌟 Key Features (Template)

### 💻 Customer & Admin Dashboard
* **Premium Dark Theme**: Sleek dark-mode color scheme with glassmorphism cards and smooth micro-animations.
* **JWT User Authentication**: Hashed passwords with bcryptjs and secure session tokens on signup, login, and profile fetching.
* **Interactive Product Catalog**: Responsive grid displaying premium product listings with clean hover scale effects.
* **Admin Control Center**: Built-in interface allowing administrator accounts to securely fetch and view the list of registered users.
* **Toast Notification Banners**: Dynamic toast messages for real-time authentication feedback and notifications.

---

## 🛠️ Architecture & Tech Stack

* **Frontend**: React (Vite), Vanilla CSS, React Hooks.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Mongoose), with MongoMemoryServer fallback.

---

## 🚀 Getting Started

### 📋 Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [Git](https://git-scm.com/)

---

### 🔧 Installation & Setup

Follow these steps to run both the frontend client and backend API server locally:

#### 1. Configure Environment Variables:
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
# Optional: MONGO_URI=mongodb://localhost:27017/shopez_database
```
> [!NOTE]
> If no `MONGO_URI` is specified or if a local MongoDB server isn't running, the backend will **automatically spin up an In-Memory MongoDB Server fallback** so the server starts successfully out-of-the-box!

---

#### 2. Backend Setup:
Open a terminal in the `backend` directory:
```bash
cd backend
npm install
npm run dev
```
The backend server will launch on [http://localhost:5000](http://localhost:5000).

---

#### 3. Frontend Setup:
Open a second terminal window in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The client server will start on [http://localhost:5173/](http://localhost:5173/).

---

#### 4. Database Seeding:
Seed default Admin and User credentials:
```bash
cd backend
npm run seed
```
**Admin Credentials:** `admin@trading.com` / `admin123`
**User Credentials:** `user@trading.com` / `password123`
