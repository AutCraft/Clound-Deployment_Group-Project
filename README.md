# Clound Deployment  Group Project

## 🔐 API-Based Authentication System (TypeScript + Express + JWT)

โครงการนี้เป็นส่วนหนึ่งของรายวิชา **Cloud Deployment**  
มหาวิทยาลัยเชียงใหม่ (Chiang Mai University)

ระบบนี้เป็น **API-Based Authentication** พัฒนาโดยใช้ **Node.js (TypeScript)**  
มีระบบ **CI/CD Pipeline** สำหรับการ **Deploy แบบอัตโนมัติ** ไปยัง Container Registry

---

## 🚀 Deployment Plan

**Objective:**  
พัฒนาและ Deploy ระบบ API สำหรับการยืนยันตัวตน (JWT Authentication) แบบอัตโนมัติ

**Pipeline Summary:**  
1. **Push/PR → Trigger GitHub Actions**  
2. **Install dependencies** (npm install)  
3. **Run Unit Tests**  
4. **Build Docker Image**  
5. **Push Image ไปยัง GitHub Container Registry (GHCR)**  
6. *(Optional)* Deploy ขึ้น Server / Cloud ผ่าน SSH หรือ Container Hosting

**Tools Used:**  
- Repository: **GitHub**  
- CI/CD: **GitHub Actions**  
- Container: **Docker**  
- Language: **TypeScript (Node.js)**  

**Environment Variables:**
```

PORT=3000
JWT_SECRET=<your-secret-key>

````

---

## 🧩 Deployment Flow

```text
          ┌──────────────────┐
          │  Developer Push  │
          └───────┬──────────┘
                  │
                  ▼
          ┌──────────────────┐
          │ GitHub Actions CI │
          ├──────────────────┤
          │ npm install       │
          │ npm test (Jest)   │
          │ docker build      │
          │ docker push       │
          └───────┬──────────┘
                  │
                  ▼
          ┌──────────────────┐
          │ Container Registry│
          │ (GHCR / DockerHub)│
          └──────────────────┘
````

---

## ⚙️ Main Features

| Feature                   | Description                                      |
| ------------------------- | ------------------------------------------------ |
| 🔑 **User Registration**  | สมัครสมาชิกใหม่ผ่าน API                          |
| 🔐 **JWT Login**          | รับ Token เมื่อเข้าสู่ระบบสำเร็จ                 |
| 👤 **Protected Endpoint** | เข้าถึงข้อมูลผู้ใช้โดยต้องมี Token               |
| 🧪 **Automated Testing**  | ตรวจสอบฟังก์ชันหลักผ่าน Jest                     |
| 🐳 **Containerization**   | สร้าง Docker Image พร้อม Deploy อัตโนมัติ        |
| ⚙️ **CI/CD Pipeline**     | ทำงานอัตโนมัติทุกครั้งที่ Push หรือ Pull Request |

---

## 🧱 Functions Overview

| Function        | Endpoint     | Method | Description                       |
| --------------- | ------------ | ------ | --------------------------------- |
| `register()`    | `/register`  | POST   | สร้างบัญชีผู้ใช้ใหม่              |
| `login()`       | `/login`     | POST   | ตรวจสอบรหัสผ่านและออก JWT Token   |
| `getProfile()`  | `/me`        | GET    | คืนข้อมูลผู้ใช้ที่เข้าสู่ระบบอยู่ |
| `verifyToken()` | middleware   | -      | ตรวจสอบความถูกต้องของ JWT         |
| `runTests()`    | Jest command | -      | รันชุดทดสอบอัตโนมัติใน CI/CD      |

---

## 🧪 Test Specification

| TC ID  | Test Scenario                  | Expected Result    |
| ------ | ------------------------------ | ------------------ |
| TC-001 | Register new user              | 200 OK + username  |
| TC-002 | Register duplicate user        | 409 Conflict       |
| TC-003 | Login with correct credentials | 200 OK + JWT token |
| TC-004 | Login with wrong password      | 401 Unauthorized   |
| TC-005 | Access `/me` without token     | 401 Unauthorized   |
| TC-006 | Access `/me` with valid token  | 200 OK + user info |

**Test Tool:** Jest + Supertest
**CI/CD Integration:** ทดสอบอัตโนมัติผ่าน GitHub Actions ทุกครั้งที่ push

---

## 🪪 License

**Cloud Deployment — Chiang Mai University**

This project was developed for **educational purposes only**
under the course **Cloud Deployment (CMU)**.
All materials may be reused for learning and non-commercial projects.

© 2025 — Faculty of Science, Chiang Mai University
