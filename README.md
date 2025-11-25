# Backend Technical Test — NestJS, MongoDB, RabbitMQ (Microservices)

This repository implements a backend system built with **NestJS**, **MongoDB**, and **RabbitMQ**, showcasing microservices, authentication, profile management, and real-time message notifications.  
It is designed as part of a technical test to demonstrate clean architecture, OOP principles, schema planning in NoSQL, and inter-service communication.

---

## 🚀 Features

### 🔐 Authentication
- User registration (`/api/register`)
- Login using JWT (`/api/login`)
- JWT payload includes `sub`, `username`, and `role`
- Password hashing using bcrypt
- API Gateway JWT Guard

---

### 👤 User Profile
- Create Profile (`/api/createProfile`)
- Get Profile (`/api/getProfile`)
- Update Profile (`/api/updateProfile`)
  - Restricted fields cannot be modified by users: `isActive`, `role`, `deletedAt`
- Automatic calculation of:
  - **Western Zodiac**
  - **Chinese Horoscope** (based on Chinese New Year table)

---

### 🛠 Admin Controls
Only admin users can:
- **Deactivate accounts** (soft delete)
- **Reactivate accounts**
- View user status

User schema includes:
- `createdAt`
- `updatedAt`
- `deletedAt`
- `isActive`

---

### 💬 Messaging (RabbitMQ Microservices)
- Text chat between User A ↔ User B
- Messages stored in MongoDB
- RabbitMQ triggers notification events when messages are received
- Messaging runs in its own microservice
- Endpoints:
  - View Messages (`/api/viewMessages`)
  - Send Message (`/api/sendMessage`)

---

## 🧱 Architecture Overview
- **NestJS Monorepo (Microservices)**
  - API Gateway
  - Auth Service
  - User Service
  - Messaging Worker Service (RabbitMQ)
- **MongoDB** with Mongoose schemas
- Clean DTO structure and validation layer
- Scalable microservice communication

---

## 🛠 Tech Stack
- NestJS (Monorepo Microservices)
- MongoDB + Mongoose
- RabbitMQ
- JWT Authentication
- TypeScript
- bcrypt
- class-validator / class-transformer

---

## 📂 Endpoints

| Feature | Method | URL |
|--------|--------|-----|
| Register | POST | `/api/register` |
| Login | POST | `/api/login` |
| Create Profile | POST | `/api/createProfile` |
| Get Profile | GET | `/api/getProfile` |
| Update Profile | PATCH | `/api/updateProfile` |
| View Messages | GET | `/api/viewMessages` |
| Send Message | POST | `/api/sendMessage` |
| (Admin) Deactivate | PATCH | `/api/admin/deactivate/:id` |
| (Admin) Activate | PATCH | `/api/admin/activate/:id` |

---

## ⚙️ Setup

### 1. Install Dependencies
```sh
npm install
