# ITUE301: Advanced Web Development Frameworks — Practical Examination (Set A)
## QuickBite Food Ordering System (Zomato Design Architecture)

**Department:** Information Technology & Computer Engineering  
**Institution:** Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT  
**Candidate:** Kush Shah (D25CE145 - Batch A)  
**Date:** 24 / 08 / 2026  
**Tech Stack:** React 18 + Express.js + Node.js + MongoDB Atlas with Mongoose  
**GitHub Repository:** [https://github.com/kush1310/itue301-exam-d25ce145-A](https://github.com/kush1310/itue301-exam-d25ce145-A)

---

## 1. System Overview & Architecture

QuickBite is an enterprise-grade campus food ordering web application designed following the **Zomato Design System** (`DESIGN.md`). It integrates Three.js 3D WebGL animations with a secure, role-based MERN architecture.

### Role Portals
1. **Customer Portal (`/` & `/order`):** Search eateries, inspect live menus, calculate order totals, and place food orders.
2. **Restaurant Owner Hub (`/owner`):** Dedicated portal for each canteen owner to view canteen statistics, manage menus, toggle Open/Closed status in real time, and manage incoming orders.
3. **Administrator Portal (`/admin`):** Lazy-loaded executive dashboard with cross-platform revenue oversight and global status transitions.

---

## 2. Demo User Accounts & Credentials

| Role / Portal | Associated Canteen | Email | Password |
|---|---|---|---|
| **Customer** | N/A | `kush@charusat.edu.in` | `password123` |
| **Restaurant Owner** | The Rustic Oven Bistro | `owner.bistro@quickbite.com` | `bistro123` |
| **Restaurant Owner** | Spice Symphony Tandoor | `owner.spice@quickbite.com` | `spice123` |
| **Restaurant Owner** | Zen Dragon Express | `owner.zen@quickbite.com` | `zen123` |
| **Restaurant Owner** | Taco Fiesta Grill | `owner.taco@quickbite.com` | `taco123` |
| **Restaurant Owner** | Campus Brew & Bakery | `owner.brew@quickbite.com` | `brew123` |
| **Restaurant Owner** | The Midnight Kitchen | `owner.midnight@quickbite.com` | `midnight123` |
| **Administrator** | CHARUSAT System Admin | `admin@quickbite.com` | `adminpassword123` |

---

## 3. Project Directory Structure

```text
D:\B.Tech_Codes\Sem-5\AWF\PracticalExam\
├── DESIGN.md                         # Official Zomato Design System specifications
├── README.md                         # Comprehensive project documentation
├── backend/
│   ├── config/database.js            # Async Mongoose connection with exponential backoff
│   ├── controllers/
│   │   ├── authController.js         # JWT token issuance, multi-role validation
│   │   ├── restaurantController.js   # Catalog, canteen controls, menu CRUD
│   │   └── orderController.js        # Order creation, canteen order isolation
│   ├── middleware/
│   │   ├── adminGuard.js             # RBAC role validator (Admin / Restaurant Owner)
│   │   ├── authGuard.js              # Bearer JWT validator
│   │   ├── errorHandler.js           # Centralized JSON error handler
│   │   └── requestLogger.js          # Global [METHOD] [PATH] [TIMESTAMP] logger
│   ├── models/
│   │   ├── Customer.js               # Customer schema with bcrypt & restaurantId ref
│   │   ├── Order.js                  # Order schema with refs and status enum
│   │   └── Restaurant.js             # Restaurant schema with menu and rating constraints
│   ├── routes/
│   │   ├── authRoutes.js             # /api/v1/auth
│   │   ├── orderRoutes.js            # /api/v1/orders
│   │   └── restaurantRoutes.js       # /api/v1/restaurants
│   ├── seeds/seedData.js             # Database seeder with 6 canteens and 6 owners
│   ├── tests/
│   │   ├── testApi.js                # API integration test suite
│   │   └── rigorousTestSuite.js      # 34-test Enterprise QA & Security suite
│   ├── .env.example
│   ├── package.json
│   └── server.js                     # Express app mounted at port 5000
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Footer.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Navbar.jsx            # Sticky Zomato header with role badge
    │   │   ├── ProtectedRoute.jsx    # Role-aware route guard
    │   │   ├── RestaurantCard.jsx    # Task 1 reusable card with Rating Chip
    │   │   └── ThreeHeroCanvas.jsx   # Three.js 3D floating particle canvas
    │   ├── context/
    │   │   └── AuthContext.jsx       # Multi-role authentication provider
    │   ├── pages/
    │   │   ├── AdminPanel.jsx        # Task 2 lazy-loaded admin oversight
    │   │   ├── HomePage.jsx          # Landing page with 3D canvas
    │   │   ├── LoginPage.jsx         # 3-role RBAC login tabs
    │   │   ├── OrderPage.jsx         # Task 2 protected order form
    │   │   ├── OwnerPortal.jsx       # Dedicated Restaurant Owner Hub
    │   │   └── RestaurantsPage.jsx   # Task 4 catalog with Filter Pills
    │   ├── App.jsx                   # React Router v6 routing
    │   ├── index.css                 # Zomato base layers
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js            # Zomato color tokens
    └── vite.config.js
```

---

## 4. REST API Endpoint Specification

### Authentication (`/api/v1/auth`)
- `POST /login` — Authenticates user and returns JWT Bearer token.
- `POST /register` — Registers a new customer or owner account.
- `GET /me` — Retrieves current authenticated profile.

### Restaurant Catalog & Canteen Controls (`/api/v1/restaurants`)
- `GET /` — Public catalog with query filters (`cuisine`, `isOpen`, `search`).
- `GET /my-restaurant` — Retrieves assigned restaurant for logged-in owner.
- `PATCH /:id/toggle-status` — Real-time Open/Closed operational toggle.
- `POST /:id/menu` — Adds a new item to the restaurant's menu.
- `DELETE /:id/menu/:itemId` — Removes a menu item from the restaurant.
- `GET /:id` — Public single restaurant query by ID.

### Order Processing (`/api/v1/orders`)
- `POST /` — Creates a new order in MongoDB (HTTP 201 Created).
- `GET /` — Retrieves populated orders (Customers see own orders, Owners see canteen orders, Admins see all).
- `PATCH /:id/status` — Transitions order lifecycle status (`pending` → `preparing` → `out-for-delivery` → `delivered` / `cancelled`).

---

## 5. Verification & Test Execution

Run the complete QA & Security test suite:
```bash
cd backend
npm run test:rigorous
```
**Test Results:** 34 / 34 Tests Passed (100.0% Success Rate).
