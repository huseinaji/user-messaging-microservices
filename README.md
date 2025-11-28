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
- Auto generate admin user for the first time app running
- Automatic calculation of:
  - **Western Zodiac**
  - **Chinese Horoscope** (based on Chinese New Year table)
  every time birthday fulfilled
---

### 🛠 Admin Controls
Only admin users can:
- **Deactivate accounts**
- **Reactivate accounts**
- **View user status**

---

### 💬 Messaging (RabbitMQ Microservices)
- Text chat between User A ↔ User B
- Messages stored in MongoDB
- RabbitMQ triggers notification events when messages are received
- IsRead Feature that change to true if messages are viewed by recipient (the default value is false)
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
| View Messages | GET | `/api/viewMessages/:recipientId` |
| Send Message | POST | `/api/sendMessage` |
| Delete Account | POST | `/api/deleteAccount` |
| (Admin) Deactivate Account | POST | `/api/deactivateAccount/:id` |
| (Admin) Activate Account | POST | `/api/activateAccount/:id` |
| (Admin) Get All User | POST | `/api/user/` |

---

## ⚙️ Setup

### 1. Install Dependencies
```sh
npm install

## Work Progress
