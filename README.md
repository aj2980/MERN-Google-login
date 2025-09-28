
# 🛒 Simple Shopping Cart: Minimal MERN Project

A minimal MERN project simulating a basic e-commerce shopping cart and checkout flow. This project focuses on demonstrating fundamental React-Express integration, state management, and client-side data persistence.

---

## 🚀 Project Goal

Build a minimal, functional e-commerce site where:
* Users can view a list of products.
* Users can add products to a local shopping cart.
* Users can manage cart quantities (increment/decrement).
* Checkout is simulated by sending the final cart data to the backend.

---

## 📌 Assumptions & Design Choices

* **Product Data:** The product list is currently hardcoded within the backend for simplicity.
* **Database:** MongoDB database is used for this assignment.
* **Payment:** The checkout process is simulated. External payment gateway (like Stripe) is integrated.
* **Cart Persistence:** The shopping cart data is stored entirely in the client-side state and persisted using `localStorage`.

---

## 📂 Project Structure

```

MERN-Google-login/
│── backend/
│   ├── index.js     \# Main server starter file
│   ├── routes/      \# Express routes (e.g., /products, /checkout)
│   └── models/      \# Placeholder for MongoDB Schemas
|   └── Controllers/
│── frontend/
│   └── src/         \# All React components and application code
│── server.test.js   \# Jest + Supertest integration tests for backend
└── package.json

````

---

## ⚙️ Setup and Running Instructions

### 1. Clone Repository

```bash
git clone [https://github.com/aj2980/MERN-Google-login.git]
cd shopping-cart
````

### 2\. Install Dependencies

Install dependencies for both the backend (Node/Express) and frontend (React).

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3\. Run Backend Server (API)

The backend Express server will run on `http://localhost:3000`.

```bash
cd backend
npm start
```

### 4\. Run Frontend Application (Client)

The React application will run on `http://localhost:5173`.

```bash
cd frontend
npm run dev
```

-----

## 🧪 Running Tests

Tests use **Jest** and **Supertest** to ensure API endpoints function correctly.

Run all backend tests:

```bash
cd..  //(root folder , make sure backend server is not running)
npm test
```
<img width="607" height="247" alt="image" src="https://github.com/user-attachments/assets/81f238ae-07d8-4e36-ab16-967e81d97e6e" />
