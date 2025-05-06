# 🗳️ Voting App Backend

This is a **backend-only Voting Application** built using **Node.js** and **Express.js**, designed to manage secure voting operations. It uses **JWT** for authentication and **bcrypt** for password hashing, ensuring user data and access are protected.

> ⚠️ This project does not include a frontend. Use **Postman** or another API client to test the endpoints.

---

## 🔐 Features

- Secure authentication using **JWT**
- Password encryption using **bcrypt**
- Role-based access: `admin` and `voter`
- Admin-only candidate management
- One-vote-per-user rule
- Real-time vote count retrieval

---

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB
- bcrypt
- jsonwebtoken (JWT)

---

## 🔗 Routes Overview

### 📁 Main Routes in `server.js`
```js
app.use('/user', userRoutes);
app.use('/candidate', jwtMiddleware, candidateRoutes);
```

---

### 👤 `/user` Routes

| Method | Endpoint           | Access       | Description                      |
|--------|--------------------|--------------|----------------------------------|
| POST   | `/signup`          | Public       | Register as admin or voter       |
| POST   | `/login`           | Public       | Log in using Aadhar and password |
| GET    | `/profile`         | Auth (JWT)   | View own profile                 |
| PUT    | `/profile/password`| Auth (JWT)   | Change own password              |

---

### 🗳️ `/candidate` Routes

| Method | Endpoint                      | Access       | Description                         |
|--------|-------------------------------|--------------|-------------------------------------|
| POST   | `/`                            | Admin only   | Add a new candidate                 |
| PUT    | `/:candidateId`               | Admin only   | Update candidate info               |
| DELETE | `/:candidateId`               | Admin only   | Delete a candidate                  |
| POST   | `/vote/:candidateId`          | Voter only   | Vote for a candidate (only once)    |
| GET    | `/vote/count`                 | Public       | Get vote count for all candidates   |

> 🛡️ All `/candidate` routes require JWT auth. Role-based permissions must be handled in middleware or route logic.

---

## 📥 Sample JSON Data

### ➕ Create a User
```json
{
  "name": "admin",
  "age": 20,
  "email": "admin@email.com",
  "mobile": "1254789637",
  "address": "123 admin street",
  "aadharCardNum": 999999999999,
  "password": "admin",
  "role": "admin"  // Can be either "admin" or "voter"
}
```

### 🔐 Login
```json
{
  "aadharCardNum": 258520258764,
  "password": "xyz"
}
```

> On successful login, you'll receive a **JWT token**. This must be included in the **Authorization header** of subsequent requests as a **Bearer token**.

### ➕ Add a Candidate (Admin Only)
```json
{
  "name": "Modi",
  "party": "BJP",
  "age": 70
}
```

---

## 🧪 Testing with Postman

1. **Sign up or login** to get your JWT token.
2. For protected routes, add the token under **Authorization**:
   ```
   Bearer <your_token_here>
   ```
3. Test different role-based behaviors:
   - Admin can manage candidates but **cannot vote**
   - Voter can **only vote once**

---

## 🚧 Notes

- Admin must be created manually through `/user/signup` with `"role": "admin"`.
- A user can **only vote once**, and admin **cannot vote at all**.
- Sensitive data like `.env` files should be **ignored using `.gitignore`**.
