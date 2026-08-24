# QuickBite Food Ordering System

**Course:** ITUE301: Advanced Web Development Frameworks  
**Institution:** Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT  
**Examination:** Open-Book Practical Examination (Set A) — AY 2026–27  
**Author / Candidate:** Kush Shah (D25CE145 - Batch A)  
**Tech Stack:** React 18 (Vite) + Express.js + MongoDB Atlas with Mongoose ODM + Tailwind CSS  

---

## Executive Summary & Scenario

QuickBite is an enterprise campus food ordering platform engineered to modernize campus dining for students, faculty, and restaurant partners. The architecture replaces manual phone-order workflows with a resilient, reactive web application backed by secure REST APIs, role-based JWT authentication, and structured MongoDB data entities.

---

## System Architecture & Implemented Tasks

| Task | Domain | Description | Status |
|---|---|---|---|
| **Task 1** | React Component Architecture | Reusable `RestaurantCard` accepting `name`, `cuisine`, `rating`, `isOpen` props with dynamic open/closed badges. Distinct page architecture (`HomePage`, `RestaurantsPage`, `OrderPage`). | Completed |
| **Task 2** | React Routing & State Management | React Router DOM v6 configuration (`/`, `/restaurants`, `/order`, `/admin`, `/login`). `ProtectedRoute` guard redirecting unauthenticated traffic to `/`. Lazy-loaded `AdminPanel` via `React.lazy` + `Suspense`. Reactive form state via `useState`. | Completed |
| **Task 3** | Express REST API & Middleware | 5 REST endpoints under `/api/v1/`. Custom global `requestLogger` (`[METHOD] [PATH] [TIMESTAMP]`), `authGuard` Bearer JWT middleware, centralized structured JSON `errorHandler`. | Completed |
| **Task 4** | REST API Consumption in React | Real-time `GET /api/v1/restaurants` consumption with `useEffect`. 3 strict UI states (`restaurants`, `loading`, `error`). Client-side instantaneous search filtering without redundant network requests. | Completed |
| **Task 5** | MongoDB + Mongoose Schemas | Strict Mongoose models for `Customer`, `Restaurant`, and `Order` with schema-level validation, references, and population (`.populate('customerId', 'name email').populate('restaurantId', 'name cuisine')`). | Completed |

---

## REST API Specification (`/api/v1/`)

| Method | Endpoint | Access | Purpose & Response Status |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Public | Authenticates customer credentials and issues signed JWT token (`200 OK` / `401 Unauthorized`). |
| `POST` | `/api/v1/auth/register` | Public | Registers a new customer account (`201 Created` / `400 Bad Request`). |
| `GET` | `/api/v1/restaurants` | Public | Returns array of all restaurants with optional query filtering (`200 OK`). |
| `POST` | `/api/v1/orders` | Protected (`authGuard`) | Validates payload, saves new order to MongoDB, and returns populated order (`201 Created` / `400 Bad Request`). |
| `GET` | `/api/v1/orders` | Protected (`authGuard`) | Retrieves populated customer order history (`200 OK`). |
| `PATCH` | `/api/v1/orders/:id/status` | Protected (`authGuard`) | Modifies order lifecycle status (`pending`, `preparing`, `out-for-delivery`, `delivered`, `cancelled`) (`200 OK` / `400 Bad Request`). |

---

## Project Structure

```
PracticalExam/
├── README.md
├── .gitignore
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── Customer.js
│   │   ├── Restaurant.js
│   │   └── Order.js
│   ├── middleware/
│   │   ├── requestLogger.js
│   │   ├── authGuard.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   └── orderRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   └── orderController.js
│   ├── seeds/
│   │   └── seedData.js
│   └── tests/
│       └── testApi.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── RestaurantCard.jsx
        │   ├── ProtectedRoute.jsx
        │   └── LoadingSpinner.jsx
        └── pages/
            ├── HomePage.jsx
            ├── RestaurantsPage.jsx
            ├── OrderPage.jsx
            ├── LoginPage.jsx
            └── AdminPanel.jsx
```

---

## Setup & Execution Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB Atlas cluster connection string

---

### Step 1: Backend Setup & Seeding

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.akh5nsc.mongodb.net/quickbite_db?retryWrites=true&w=majority
   JWT_SECRET=quickbite_super_secure_jwt_secret_key_2026_exam_token
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```
4. Seed the database with sample customers, restaurants, and initial orders:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm start
   # Server runs at http://localhost:5000
   ```

---

### Step 2: Frontend Setup & Execution

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Launch Vite development server:
   ```bash
   npm run dev
   # Application opens at http://localhost:5173
   ```

---

### Step 3: Automated API Verification

To run automated integration tests verifying all 5 tasks against the live backend:
```bash
cd backend
npm run test:api
```

---

## Demo Credentials for Viva / Evaluation

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Customer** | `kush@charusat.edu.in` | `password123` | Can place orders, view order history, filter restaurants. |
| **Admin** | `admin@quickbite.com` | `adminpassword123` | Full access to Admin Panel, status updates, gross revenue tracking. |

---

## Key Technical Decisions & Justifications

1. **Mongoose References & Population:** Used normalized schemas linking `Order.customerId` → `Customer` and `Order.restaurantId` → `Restaurant` with `.populate()` to ensure data integrity without duplicating restaurant or customer records.
2. **Global Custom requestLogger:** Implemented a non-blocking logging middleware logging `[METHOD] [PATH] [TIMESTAMP]` for every request, improving auditability and traceability.
3. **Centralized Error Handling:** All asynchronous controller errors pass to `errorHandler.js` via `next(error)`, ensuring consistent JSON payloads (`{ success: false, error: { ... } }`) and eliminating stack trace leakage.
4. **React.lazy + Suspense for Admin:** Reduces initial bundle size by splitting the administrative dashboard into a separate chunk loaded on-demand.
