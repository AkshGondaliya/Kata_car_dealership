# 🚗 Car Dealership Inventory System

A full-stack **Car Dealership Inventory System** built using the **MERN Stack** following **Test-Driven Development (TDD)** principles. The application allows users to browse vehicles, while administrators can manage the dealership inventory. It includes secure JWT authentication, role-based authorization, inventory management, and comprehensive backend testing.

---

## 📌 Features

### Authentication
- User Registration
- User Login
- Password hashing using bcrypt
- JWT-based Authentication
- Role-based Authorization (Admin / Customer)

### Vehicle Management
- Add Vehicle (Admin Only)
- View All Vehicles
- Search Vehicles
- Update Vehicle (Admin Only)
- Delete Vehicle (Admin Only)

### Inventory Management
- Purchase Vehicle (Authenticated Users)
- Restock Vehicle (Admin Only)

### Security
- JWT Authentication
- Password Hashing
- Protected Routes
- Admin Authorization Middleware
- Environment Variables

### Testing
- Test-Driven Development (TDD)
- Jest
- Supertest
- Integration Tests

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Jest
- Supertest

## Frontend

- React
- Vite
- Axios
- React Router DOM

---


# 📡 REST API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |

---

## Vehicles

| Method | Endpoint | Access |
|---------|----------|--------|
| GET | `/api/vehicles` | Public |
| GET | `/api/vehicles/search` | Authenticated User |
| POST | `/api/vehicles` | Admin |
| PUT | `/api/vehicles/:id` | Admin |
| DELETE | `/api/vehicles/:id` | Admin |

---

## Inventory

| Method | Endpoint | Access |
|---------|----------|--------|
| POST | `/api/vehicles/:id/purchase` | Authenticated User |
| POST | `/api/vehicles/:id/restock` | Admin |

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/AkshGondaliya/Kata_car_dealership.git

cd Kata_car_dealership
```

---

# Backend Setup

Go to backend folder

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/car_dealership

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=1d
```

Run backend

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run frontend

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🧪 Running Tests

Backend tests

```bash
cd backend

npm test
```

The project uses

- Jest
- Supertest

to perform integration testing of backend APIs following the Test-Driven Development (TDD) approach.

---

# 🔐 Authentication

After login the server returns a JWT Token.

Example

```
Authorization:

Bearer YOUR_JWT_TOKEN
```

This token must be included in the Authorization header while accessing protected routes.

---

# 👤 Roles

## Customer

- View Vehicles
- Search Vehicles
- Purchase Vehicle

## Admin

- Add Vehicle
- Update Vehicle
- Delete Vehicle
- Restock Vehicle

---

# 🧪 Test Report

The backend API was developed using **Test-Driven Development (TDD)**.

Implemented integration tests include:

- User Registration
- User Login
- Add Vehicle
- Update Vehicle
- Delete Vehicle
- Search Vehicle
- Purchase Vehicle
- Restock Vehicle

Tests are written using **Jest** and **Supertest**.

---

# 📷 Screenshots

login page:
> <img width="1254" height="876" alt="image" src="https://github.com/user-attachments/assets/f1794b86-05e5-4d19-8f36-51a9be7bc936" />


Dashboard(Admin)
<img width="1906" height="855" alt="image" src="https://github.com/user-attachments/assets/d76c2a45-124c-4ab8-9b71-b0e4bdcb6b46" />

<img width="1904" height="616" alt="image" src="https://github.com/user-attachments/assets/4c404a20-6eb3-4729-8da8-6ca1c4e7532a" />


DashBoard(User)
<img width="1869" height="865" alt="image" src="https://github.com/user-attachments/assets/1b663bc8-1400-4353-85e0-e672fac636a4" />


# 🤖 My AI Usage

### AI Tools Used

During the development of this project I used the following AI tools:

- ChatGPT
- OpenAI Codex (for selected frontend UI generation and code suggestions)

---

### How I Used AI

AI was used as a development assistant rather than a replacement for my own implementation.

Specifically, I used AI to:

- Discuss project architecture and folder organization.
- Brainstorm REST API endpoint design.
- Understand and apply Test-Driven Development (TDD).
- Generate initial boilerplate code for controllers, middleware, and tests.
- Learn best practices for JWT authentication and role-based authorization.
- Debug runtime errors and understand their causes.
- Improve API response structures and error handling.
- Receive guidance on Git commit strategy following the Red-Green-Refactor workflow.
- Generate UI component ideas for the frontend while integrating them manually into the existing React project.

All generated code was reviewed, modified, tested, and integrated manually.

---

### Reflection

Using AI significantly improved my development workflow by accelerating repetitive tasks and helping me understand best practices. Rather than copying solutions directly, I used AI as a learning and productivity tool to explore different implementation approaches, debug issues, and improve code quality.

AI allowed me to spend more time focusing on software design, testing, authentication, authorization, and overall application architecture. Every feature was manually integrated, verified using Postman and automated tests, and adjusted to meet the project requirements.

---

# 👨‍💻 Author

**Aksh Gondaliya**

GitHub:

https://github.com/AkshGondaliya

Project Repository:

https://github.com/AkshGondaliya/Kata_car_dealership

---
