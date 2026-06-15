# 📈 AeroTrade: Premium Stock Trading Simulation Terminal

AeroTrade is a feature-rich, high-performance web application designed to simulate stock market trading in real-time. Built with a MERN stack, the application includes advanced charting, real-time news aggregation, automated portfolio tracking, and an administrative portal for platform control.

---

## 🌟 Key Features

### 💻 Trader Dashboard
* **Real-time Price Fluctuations**: Stock prices update dynamically with animated flash indicators showing gain/loss direction.
* **Interactive Canvas Sparklines**: Custom-built HTML5 canvas sparkline charts rendering 24-hour historical stock performance.
* **Live Market Indices**: Real-time calculated indices (S&P 500, NASDAQ, Dow Jones) based on active asset pools.
* **Analytics & Gauges**: Custom price range gauges showing the current price relative to daily highs and lows.
* **Sector Allocation SVG Charts**: Visual representation of portfolio sectors or general market sector distributions.
* **Watchlist Sliding Drawer**: Save and bookmark favorite assets with quick toggle star pins.
* **Real-time News Ticker**: Aggregated RSS news feeds scrolling across the terminal, with clickable popup details.
* **Trading Modal**: Interactive BUY/SELL execution orders with live cash validation and quantity checks.

### 🛡️ Admin Portal
* **Stock Management (CRUD)**: Create, edit, update, or delete stock assets directly from the UI.
* **Platform-wide Transaction Log**: View all transactions made by every user on the platform.

---

## 🛠️ Architecture & Tech Stack

* **Frontend**: React (Vite), HTML5 Canvas API, Vanilla CSS, Custom SVG, React Hooks.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Mongoose).
* **Real-time Feeds**: Yahoo Finance API integration, Google News RSS.

---

## 🚀 Getting Started

### 📋 Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [Git](https://git-scm.com/)

---

### 🔧 Installation & Setup

Follow these steps to run both the frontend client and backend API server locally:

#### 1. Clone the repository:
```bash
git clone https://github.com/yashashivini-arcot/AeroTrade.git
cd AeroTrade
```

#### 2. Configure Environment Variables:
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
# Optional: MONGODB_URI=mongodb://localhost:27017/stock_trading_platform
```
> [!NOTE]
> If no `MONGODB_URI` is specified or if a local MongoDB server isn't running, the backend will **automatically spin up an In-Memory MongoDB Server fallback** and auto-seed it with 17 default stocks!

---

#### 3. Backend Setup:
Open a terminal in the project root:
```bash
cd backend
npm install
npm run dev
```
The backend server will launch on [http://localhost:5000](http://localhost:5000).

---

#### 4. Frontend Setup:
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
The client server will start on [http://localhost:5173/](http://localhost:5173/).

---

## 📊 Database Seeding (Optional)
If you are running a local persistent MongoDB database and wish to seed it manually, you can run the seed script:
```bash
cd backend
npm run seed
```

---

## 🐞 Recent Fixes
* **Selection State Persistence**: Refactored the selected stock state to prevent the selection from resetting to the top stock on automatic background quote refreshes.
* **Linter Warnings resolved**: Cleaned up function declaration scopes and exception handling parameters to keep the build clean.
