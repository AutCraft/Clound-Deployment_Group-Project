# Cloud Deployment Group Project

## 🔐 API-Based Authentication System (TypeScript + Express + JWT)

โครงการนี้เป็นส่วนหนึ่งของรายวิชา **Cloud Deployment**  
มหาวิทยาลัยเชียงใหม่ (Chiang Mai University)

ระบบนี้เป็น **API-Based Authentication** พัฒนาโดยใช้ **Node.js (TypeScript)**  
มีระบบ **CI/CD Pipeline** สำหรับการ **Deploy แบบอัตโนมัติ** ไปยัง GitHub Container Registry (GHCR)

---

## 🚀 Deployment Plan

**Objective:**  
พัฒนาและ Deploy ระบบ API สำหรับการยืนยันตัวตน (JWT Authentication) แบบอัตโนมัติ

**Pipeline Summary:**  
1. **Push/PR → Trigger GitHub Actions**  
2. **Install dependencies** (npm install)  
3. **Run Unit Tests (Jest)**  
4. **Build Docker Image**  
5. **Push Image ไปยัง GitHub Container Registry (GHCR)**  
6. *(Optional)* Deploy ขึ้น Server / Cloud ผ่าน SSH หรือ Container Hosting

**Tools Used:**  
- Repository: **GitHub**  
- CI/CD: **GitHub Actions**  
- Container Registry: **GitHub Container Registry (GHCR)**  
- Container: **Docker**  
- Language: **TypeScript (Node.js)**  

**Environment Variables:**
```env
PORT=3000
JWT_SECRET=<your-secret-key>
ACCESS_EXPIRES_SEC=3600
REFRESH_EXPIRES_SEC=604800
NODE_ENV=production
```

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
          │ GitHub Container │
          │ Registry (GHCR)  │
          └──────────────────┘
```

---

## ⚙️ Main Features

| Feature                   | Description                                      |
| ------------------------- | ------------------------------------------------ |
| 🔑 **User Registration**  | สมัครสมาชิกใหม่ผ่าน API                          |
| 🔐 **JWT Login**          | รับ Token เมื่อเข้าสู่ระบบสำเร็จ                 |
| 🚪 **JWT Logout**         | ทำการ Logout โดยการ Invalidate Token (Blacklist) |
| 👤 **Protected Endpoint** | เข้าถึงข้อมูลผู้ใช้โดยต้องมี Token               |
| 🧪 **Automated Testing**  | ตรวจสอบฟังก์ชันหลักผ่าน Jest                     |
| 🐳 **Containerization**   | สร้าง Docker Image พร้อม Deploy อัตโนมัติ        |
| ⚙️ **CI/CD Pipeline**     | ทำงานอัตโนมัติทุกครั้งที่ Push หรือ Pull Request |

---

## 📁 Project Structure

```
Clound-Deployment_Group-Project/
├── .github/
│   └── workflows/
│       └── docker-build-and-push.yml    # GitHub Actions CI/CD
├── src/
│   ├── Controller/
│   │   ├── AuthController.ts            # Authentication logic
│   │   └── jwt.ts                       # JWT utilities
│   ├── Database/
│   │   └── users.ts                     # In-memory user storage
│   ├── Entity/
│   │   └── User.ts                      # User entity definition
│   ├── Routes/
│   │   ├── AuthRoute.ts                 # Authentication routes
│   │   └── index.ts                     # Main router
│   ├── Test/
│   │   ├── login.spec.ts                # Login tests
│   │   ├── logout.spec.ts               # Logout tests
│   │   ├── profile.spec.ts              # Profile tests
│   │   └── register.spec.ts             # Registration tests
│   └── index.ts                         # Main application entry
├── .dockerignore                        # Docker ignore file
├── Dockerfile                           # Docker configuration
├── jest.config.cjs                      # Jest test configuration
├── package.json                         # Dependencies and scripts
├── README.md                            # Project documentation
└── tsconfig.json                        # TypeScript configuration
```

### 📂 Directory Descriptions

| Directory | Description |
|-----------|-------------|
| `.github/workflows/` | GitHub Actions CI/CD configuration |
| `src/Controller/` | Business logic and request handlers |
| `src/Database/` | Data persistence layer (in-memory storage) |
| `src/Entity/` | Data models and type definitions |
| `src/Routes/` | API route definitions and middleware |
| `src/Test/` | Unit and integration tests |

---

## 🧱 Functions Overview

| Function        | Endpoint           | Method | Description                       |
| --------------- | ------------------ | ------ | --------------------------------- |
| `register()`    | `/api/v1/auth/register` | POST   | สร้างบัญชีผู้ใช้ใหม่              |
| `login()`       | `/api/v1/auth/login`    | POST   | ตรวจสอบรหัสผ่านและออก JWT Token   |
| `refresh()`     | `/api/v1/auth/refresh`  | POST   | รีเฟรช Access Token ด้วย Refresh Token |
| `logout()`      | `/api/v1/auth/logout`   | POST   | ทำการ Logout โดยเพิ่ม Token ลงใน Blacklist |
| `me()`          | `/api/v1/auth/me`       | GET    | คืนข้อมูลผู้ใช้ที่เข้าสู่ระบบอยู่ |
| `health()`      | `/api/v1/health`        | GET    | ตรวจสอบสถานะของ API |
| `verifyToken()` | middleware           | -      | ตรวจสอบความถูกต้องของ JWT         |
| `runTests()`    | Jest command         | -      | รันชุดทดสอบอัตโนมัติใน CI/CD      |

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
| TC-007 | Logout with valid token        | 200 OK + “Logout success” |
| TC-008 | Access /me after logout        | 401 Unauthorized (Token invalid) |

**Test Tool:** Jest + Supertest
**CI/CD Integration:** ทดสอบอัตโนมัติผ่าน GitHub Actions ทุกครั้งที่ push

---

## 🐳 Docker & GitHub Container Registry

### 📦 Building Docker Image Locally

```bash
# Build the Docker image
docker build -t clound-deployment-auth .

# Run the container locally
docker run -p 3000:3000 -e JWT_SECRET=your-secret-key clound-deployment-auth
```

### 🚀 GitHub Container Registry (GHCR)

The project is automatically built and pushed to GitHub Container Registry on every push to `main` or `dev` branches.

**Registry URL:** `ghcr.io/your-username/clound-deployment_group-project`

**Available Tags:**
- `latest` - Latest stable version from main branch
- `dev` - Latest development version
- `main-<commit-sha>` - Specific commit from main branch
- `dev-<commit-sha>` - Specific commit from dev branch

### 🔧 Pull and Run from GHCR

```bash
# Pull the latest image
docker pull ghcr.io/your-username/clound-deployment_group-project:latest

# Run with environment variables
docker run -p 3000:3000 \
  -e JWT_SECRET=your-secret-key \
  -e PORT=3000 \
  ghcr.io/your-username/clound-deployment_group-project:latest
```

### 🛠️ Development Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

---

## 🪪 License

**Cloud Deployment — Chiang Mai University**

© 2025 — Chiang Mai University
