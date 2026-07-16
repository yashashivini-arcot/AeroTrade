<![CDATA[<div align="center">

# 🪷 ShopEZ Swadeshi

### *Empowering Indian Artisans, One Click at a Time*

A full-stack e-commerce platform celebrating **Made-in-India** heritage crafts — handlooms, Ayurveda, tribal art, and more — built with the **MERN stack**.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

</div>

---

## 💡 Why ShopEZ Swadeshi?

India is home to **thousands of GI-tagged crafts** — Chanderi silk, Dhokra brass, Pashmina shawls, Blue Pottery — yet most artisans struggle to reach customers online. ShopEZ Swadeshi bridges that gap with a modern digital storefront that tells the **story behind every product**: who made it, where, and what centuries-old technique was used.

> Think of it as an **artisan-first Amazon** — where every listing comes with a heritage backstory, sustainability badge, and MSME certification tag.

---

## ✨ Features

### 🛍️ Shopping Experience
- **120+ curated products** across 8 categories — Handloom, Handicrafts, Fashion, Jewellery, Home Decor, Ayurveda, Kitchen, and Books
- **Heritage storytelling** — every product includes its craft history, materials, artisan details, and state of origin
- **Smart filters** — search, sort by price/rating, filter by category, sustainability, and MSME tags
- **Pagination** — smooth browsing across large catalogs

### 🛒 Cart & Wishlist
- Add/remove items, update quantities
- Persistent wishlist with heart-toggle on product cards
- Real-time cart total calculations

### 👤 Authentication & Roles
- JWT-based sign-up / sign-in with bcrypt-hashed passwords
- Role-based access: **User** vs **Admin**
- Protected routes with auth middleware

### 🔑 Admin Dashboard
- View all registered users
- Manage products and categories (CRUD)
- Order management and status tracking

### 🎨 Premium UI
- Dark-theme design with **glassmorphism** cards
- **Warli & Kolam** decorative SVG art (Indian heritage motifs)
- Smooth micro-animations and hover effects
- Fully responsive — works on mobile, tablet, and desktop
- Toast notifications for real-time feedback

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 (Vite 8), Vanilla CSS, React Router v7, Axios |
| **Backend** | Node.js, Express.js, JWT, bcryptjs |
| **Database** | MongoDB (Mongoose 8) + MongoMemoryServer fallback |
| **Icons** | React Icons |
| **Dev Tools** | Nodemon, ESLint |

---

## 📁 Project Structure

```
ShopEZ-Swadeshi/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection (+ in-memory fallback)
│   ├── controllers/
│   │   ├── adminController.js     # Admin: user management
│   │   ├── authController.js      # Sign-up, sign-in, profile
│   │   ├── cartController.js      # Cart CRUD operations
│   │   ├── categoryController.js  # Category management
│   │   ├── orderController.js     # Order placement & tracking
│   │   ├── productController.js   # Product listing, search, filters
│   │   └── wishlistController.js  # Wishlist toggle
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT auth + admin guard
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Wishlist.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── wishlistRoutes.js
│   ├── scripts/
│   │   └── seed.js                # Seeds 120+ products, 8 categories, users
│   ├── server.js                  # Express entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with base URL
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx         # Responsive nav with cart badge
│   │   │   ├── ProductCard.jsx    # Card with wishlist, add-to-cart
│   │   │   └── Toast.jsx          # Notification banners
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state provider
│   │   │   ├── CartContext.jsx    # Cart state provider
│   │   │   └── WishlistContext.jsx
│   │   ├── App.jsx                # All pages & routing (single-file)
│   │   ├── index.css              # Global styles & design system
│   │   └── main.jsx               # React entry point
│   └── package.json
│
├── Internship_Submission/         # Phase-wise project documentation
│   ├── Brainstorming & Ideation Phase/
│   ├── Project Design Phase/
│   ├── Project Planning Phase/
│   ├── Requirement Analysis/
│   └── FSD_Documentation.docx
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [Git](https://git-scm.com/)
- MongoDB *(optional — the app auto-uses an in-memory DB if MongoDB isn't available)*

### 1️⃣ Clone the repo

```bash
git clone https://github.com/yashashivini-arcot/AeroTrade.git
cd AeroTrade
```

### 2️⃣ Set up environment variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
# Optional — leave blank for automatic in-memory DB:
# MONGO_URI=mongodb://localhost:27017/shopez_swadeshi
```

> [!TIP]
> **No MongoDB installed?** No problem! If `MONGO_URI` is missing or unreachable, the backend automatically spins up an **in-memory MongoDB server** so everything works out of the box.

### 3️⃣ Start the backend

```bash
cd backend
npm install
npm run dev
```

The API server starts at **http://localhost:5000** ✅

### 4️⃣ Start the frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app launches at **http://localhost:5173** 🚀

### 5️⃣ Seed the database

Populate the database with 120+ products, 8 categories, and default accounts:

```bash
cd backend
npm run seed
```

| Account | Email | Password |
|---------|-------|----------|
| **Admin** | `admin@trading.com` | `admin123` |
| **User** | `user@trading.com` | `password123` |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & get JWT token |
| `GET` | `/api/auth/profile` | Get logged-in user profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products (w/ filters) |
| `GET` | `/api/products/:id` | Get single product details |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | List all categories |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cart` | Get user's cart |
| `POST` | `/api/cart` | Add item to cart |
| `PUT` | `/api/cart/:id` | Update item quantity |
| `DELETE` | `/api/cart/:id` | Remove item from cart |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/wishlist` | Get user's wishlist |
| `POST` | `/api/wishlist` | Toggle wishlist item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Place an order |
| `GET` | `/api/orders` | Get user's orders |

### Admin *(requires admin role)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/users` | List all registered users |

---

## 📸 Product Categories

| Category | Products | Highlights |
|----------|----------|------------|
| 🧵 **Handloom** | Chanderi, Kanjivaram, Ikat, Khadi, Pashmina | GI-tagged textiles from 12+ states |
| 🏺 **Handicrafts** | Dhokra, Madhubani, Warli, Blue Pottery | 4000-year-old lost-wax casting |
| 👗 **Fashion** | Sarees, Kurtas, Lehengas, Bandhgala | Chikankari, Kalamkari, Phulkari |
| 💍 **Jewellery** | Kundan, Meenakari, Temple Gold, Silver Filigree | Handset Polki diamonds |
| 🏡 **Home Decor** | Jute Rugs, Walnut Carvings, Brass Diyas | Artisan-signed pieces |
| 🌿 **Ayurveda** | Kumkumadi, Ashwagandha, Chyawanprash | Classical Ayurvedic formulations |
| ☕ **Kitchen** | Iron Kadai, Brass Mortar, Teak Masala Box | Cast-iron & Panchaloha cookware |
| 📚 **Books** | Heritage, Craft Traditions, Literature | Indian culture reference |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. Create a feature branch — `git checkout -b feature/amazing-feature`
3. Commit your changes — `git commit -m "Add amazing feature"`
4. Push to the branch — `git push origin feature/amazing-feature`
5. Open a **Pull Request**

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- **Unsplash** — All product images sourced from [Unsplash](https://unsplash.com/license) (free license)
- **Indian Artisan Communities** — Inspiration from the GI-tagged crafts of India
- **KVIC, Craft Councils of India** — For preserving heritage weaving and craft traditions

---

<div align="center">

**Made with ❤️ for India's artisans**

*"The best way to find yourself is to lose yourself in the service of others." — Mahatma Gandhi*

</div>
]]>
