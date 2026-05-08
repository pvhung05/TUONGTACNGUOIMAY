# 🤟 SignLearn — Nền tảng học Ngôn ngữ Ký hiệu bằng AI

> **Môn học:** Tương tác Người – Máy (HMI)  
> **Mô tả:** Nền tảng web full-stack giúp người dùng học ngôn ngữ ký hiệu (Sign Language) thông qua bài học có cấu trúc, dịch cử chỉ theo thời gian thực bằng AI, từ điển video, và hệ thống gamification (điểm, streak, leaderboard).

---

## 📑 Mục lục

- [Tổng quan kiến trúc](#-tổng-quan-kiến-trúc)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Các tính năng chính](#-các-tính-năng-chính)
- [Chi tiết từng thành phần](#-chi-tiết-từng-thành-phần)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Luồng dữ liệu](#-luồng-dữ-liệu)
- [Hướng dẫn cài đặt & chạy](#-hướng-dẫn-cài-đặt--chạy)
- [Deployment](#-deployment)
- [Lỗi thường gặp](#-lỗi-thường-gặp)

---

## 🏗️ Tổng quan kiến trúc

Project sử dụng kiến trúc **3-tier** với 3 service chạy đồng thời:

```
┌───────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│               Next.js 16 + React 19 + TailwindCSS               │
│          MediaPipe Holistic (xử lý video phía client)            │
│                      Port: 3000                                  │
└──────────────┬───────────────────────────┬────────────────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────────┐  ┌─────────────────────────────────────┐
│   Node.js Backend        │  │   FastAPI (Python) Backend          │
│   Express 5 + MongoDB    │  │   TensorFlow + NumPy                │
│                          │  │                                     │
│   • Authentication       │  │   • Sign-to-Text (LSTM model)       │
│   • User management      │  │   • Text-to-Sign (Sign-MT API)      │
│   • Lessons & Progress   │  │   • Dataset collection              │
│   • Dashboard & Stats    │  │   • Model training pipeline         │
│   • Leaderboard          │  │                                     │
│   • Translator (CRUD)    │  │   Port: 8001                        │
│   • Video dictionary     │  └─────────────────────────────────────┘
│                          │
│   Port: 8000             │
└──────────────────────────┘
```

---

## ⚙️ Công nghệ sử dụng

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **Next.js** | 16.0.8 | Framework React (App Router, SSR) |
| **React** | 19.2.1 | UI Library |
| **TypeScript** | ^5 | Type safety |
| **TailwindCSS** | ^3.4 | Styling |
| **Shadcn/ui** (Radix UI) | — | Component library (Button, Card, Tabs, ...) |
| **MediaPipe Holistic** | ^0.5 | Trích xuất keypoints tay/mặt/pose từ webcam |
| **MediaPipe Tasks Vision** | ^0.10 | Hand landmark detection |
| **Zod** | ^3.23 | Schema validation |
| **React Hook Form** | ^7.54 | Form management |
| **Axios** | ^1.7 | HTTP client |
| **@hey-api/openapi-ts** | ^0.83 | Auto-gen TypeScript client từ OpenAPI schema |

### Backend — Node.js
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **Express** | ^5.2 | Web framework |
| **Mongoose** | ^8.0 | MongoDB ODM |
| **bcrypt** | ^5.1 | Mã hóa password |
| **jsonwebtoken** | ^9.0 | JWT authentication |
| **Cloudinary** | ^2.9 | Lưu trữ & phục vụ video |
| **Pino** | ^10.3 | Structured logging |

### Backend — FastAPI (Python)
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **FastAPI** | ^0.115 | Async Python web framework |
| **TensorFlow** | 2.18.x | LSTM model inference & training |
| **NumPy** | ^2.0 | Xử lý mảng keypoints |
| **Pydantic** | v2 | Request/Response validation |
| **Alembic** | ^1.14 | Database migration (PostgreSQL) |
| **uv** | — | Python package manager (siêu nhanh) |

### Infra & DevOps
| Công nghệ | Mục đích |
|---|---|
| **Docker Compose** | Orchestration (backend, frontend, PostgreSQL) |
| **Vercel** | Production deployment (cả FE lẫn BE) |
| **GitHub Actions** | CI/CD pipeline |
| **Pre-commit hooks** | Code quality (Ruff, ESLint) |
| **MkDocs Material** | Project documentation site |

---

## 📂 Cấu trúc thư mục

```
TUONGTACNGUOIMAY/
│
├── 📦 package.json              ← Root scripts (dev, setup, train)
├── 🐳 docker-compose.yml        ← Docker: backend + frontend + PostgreSQL
├── ⚙️ Makefile                   ← Shortcut commands
├── 📝 CHANGELOG.md               ← Lịch sử phiên bản
├── 📄 mkdocs.yml                 ← Cấu hình documentation site
│
├── 🌐 nextjs-frontend/          ← FRONTEND (Next.js 16)
│   ├── app/                      ← App Router pages
│   │   ├── page.tsx              ← Landing page
│   │   ├── layout.tsx            ← Root layout (fonts, metadata)
│   │   ├── login/                ← Trang đăng nhập
│   │   ├── register/             ← Trang đăng ký
│   │   ├── dashboard/            ← Dashboard cá nhân
│   │   ├── learn/                ← Bài học & luyện tập
│   │   │   ├── lesson/           ← Chi tiết bài học
│   │   │   └── practice/         ← Luyện tập
│   │   ├── translator/           ← Dịch ngôn ngữ ký hiệu
│   │   │   ├── signtotext/       ← Camera → Text (AI)
│   │   │   └── texttosign/       ← Text → Video ký hiệu
│   │   ├── dictionary/           ← Từ điển video
│   │   ├── leaderboard/          ← Bảng xếp hạng
│   │   ├── docs/                 ← Trang hướng dẫn
│   │   └── openapi-client/       ← Auto-generated API client
│   │
│   ├── components/               ← React components
│   │   ├── ui/                   ← Shadcn/ui primitives
│   │   ├── shared/               ← Header, Footer
│   │   ├── sign-translator/      ← Sign↔Text feature components
│   │   │   ├── sign-to-text/     ← Camera recognition UI
│   │   │   ├── text-to-sign/     ← Text translation UI
│   │   │   ├── learn/            ← Interactive learn components
│   │   │   └── ui/               ← Shared translator UI pieces
│   │   ├── signlearno/           ← Theme & icon definitions
│   │   ├── Header.tsx            ← Navigation header
│   │   ├── Footer.tsx            ← Page footer
│   │   ├── ChatbotBubble.tsx     ← AI chatbot widget
│   │   └── ThemeToggle.tsx       ← Dark/Light mode switch
│   │
│   ├── lib/                      ← Utilities & business logic
│   │   ├── api/                  ← API client (sign-translation)
│   │   ├── mediapipe/            ← Keypoint extraction & canvas drawing
│   │   ├── types/                ← TypeScript type definitions
│   │   ├── constants/            ← Holistic constants, demo sequences
│   │   └── utils/                ← cn(), string/date helpers
│   │
│   ├── middleware.ts             ← Route protection (JWT cookie check)
│   └── ARCHITECTURE.md           ← Frontend architecture diagram
│
├── 🟢 nodejs-backend/           ← BACKEND #1 (Node.js + Express)
│   ├── src/
│   │   ├── config/database.js    ← MongoDB connection
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js ← JWT verification
│   │   │   └── errorHandler.js  ← Global error handler
│   │   ├── modules/
│   │   │   ├── auth/             ← User model, register/login logic
│   │   │   ├── learn/            ← Lesson, LearningHistory models
│   │   │   ├── dashboard/        ← Dashboard aggregation
│   │   │   ├── leaderboard/      ← Score ranking
│   │   │   ├── translator/       ← Translator word CRUD
│   │   │   └── videos/           ← Cloudinary video lookup
│   │   ├── routes/               ← Express route definitions
│   │   ├── utils/                ← JWT helpers, streak calculation
│   │   ├── scripts/seedData.js   ← Seed sample data
│   │   ├── app.js                ← Express app configuration
│   │   └── server.js             ← Server entry point
│   ├── API_GUIDE.md              ← API documentation (Vietnamese)
│   └── .env                      ← Environment config
│
├── 🐍 fastapi_backend/          ← BACKEND #2 (FastAPI + TensorFlow)
│   ├── app/
│   │   ├── main.py               ← FastAPI app, CORS, router mount
│   │   ├── config.py             ← Settings (DB, CORS, Sign-MT URL)
│   │   ├── schemas.py            ← Pydantic request/response models
│   │   ├── routes/
│   │   │   └── action_detection.py ← ML API endpoints
│   │   ├── services/
│   │   │   ├── action_detection_predictor.py ← LSTM model inference
│   │   │   └── text_to_sign_translator.py    ← Sign-MT integration
│   │   └── ml_models/
│   │       └── action_detection/  ← Trained .h5 model files
│   │
│   ├── training/
│   │   └── action_detection/     ← Training pipeline
│   │       ├── train_action_detection_model.py  ← Train LSTM
│   │       ├── collect_action_detection_data.py ← Data collection
│   │       ├── ingest_action_detection_videos.py ← Video ingestion
│   │       └── common.py          ← Shared constants & utils
│   │
│   ├── alembic_migrations/       ← DB migration scripts
│   ├── pyproject.toml            ← Python dependencies (uv)
│   └── Dockerfile                ← Container config
│
├── 📚 docs/                      ← MkDocs documentation source
│   ├── get-started.md
│   ├── deployment.md
│   ├── technology-selection.md
│   └── additional-settings.md
│
├── 🔧 scripts/                   ← Build & dev automation scripts
│   ├── setup.mjs                 ← Initial project setup
│   ├── dev-backend.mjs           ← Start FastAPI dev server
│   ├── sync-backend.mjs          ← Run `uv sync` in fastapi_backend
│   └── run-backend-python.mjs    ← Execute Python training scripts
│
└── 📄 local-shared-data/         ← Shared OpenAPI schema (auto-generated)
    └── openapi.json
```

---

## 🎯 Các tính năng chính

### 1. 🔐 Authentication & User Management
- Đăng ký / Đăng nhập bằng email + password
- Hỗ trợ Google OAuth
- JWT token (7 ngày hết hạn), lưu trong cookie
- Route protection qua Next.js middleware

### 2. 📚 Structured Learning (Bài học có cấu trúc)
- Danh sách bài học (`lesson`) và bài luyện tập (`practice`)
- Chi tiết bài học với nội dung hướng dẫn
- Theo dõi lịch sử học & hoàn thành bài

### 3. 🤖 Sign-to-Text — Dịch cử chỉ → Văn bản (AI)
- Sử dụng **webcam** thu hình người dùng
- **MediaPipe Holistic** trích xuất 1662 keypoints (tay, mặt, pose) ngay trên browser
- Gửi sequence 30 frames → FastAPI backend
- **LSTM model (TensorFlow)** dự đoán hành động (hello, thanks, iloveyou, ...)
- Trả về label + confidence score theo thời gian thực

### 4. 📝 Text-to-Sign — Dịch văn bản → Video ký hiệu
- Nhập câu tiếng Anh bất kỳ
- Backend gọi **Sign-MT** (Google Cloud Functions) tạo video ngôn ngữ ký hiệu
- Hiển thị video trực tiếp trên giao diện

### 5. 📖 Dictionary — Từ điển video
- Tra cứu video ký hiệu cho bảng chữ cái (A–Z)
- Tra cứu video ký hiệu cho số (1–20)
- Video được lưu trữ trên **Cloudinary**

### 6. 📊 Dashboard — Bảng điều khiển cá nhân
- Tổng điểm tích lũy
- Streak (số ngày học liên tiếp)
- Thống kê số bài học đã hoàn thành (3 ngày gần nhất)

### 7. 🏆 Leaderboard — Bảng xếp hạng
- Top 10 người dùng theo điểm
- Xem thứ hạng cá nhân

### 8. 🧠 ML Training Pipeline
- Thu thập dữ liệu training từ giao diện web (retrain dataset)
- Ingest video → keypoints
- Train LSTM model mới (`train:action-detection`, `train:pilot-word10`)
- Model output: `.h5` + `.labels.json` + `.training-metadata.json`

### 9. 💬 Chatbot Bubble
- Widget chatbot tích hợp sẵn trên mọi trang

### 10. 🌙 Dark/Light Theme
- Toggle chế độ sáng/tối
- Custom cursor animation (`SignlearnoCursor`)

---

## 🔌 API Endpoints

### Node.js Backend (`:8000`)

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|--------|
| `POST` | `/api/auth/register` | ❌ | Đăng ký tài khoản |
| `POST` | `/api/auth/login` | ❌ | Đăng nhập |
| `GET` | `/api/auth/profile` | ✅ | Lấy thông tin profile |
| `GET` | `/api/learn/lessons` | ❌ | Danh sách bài học (query: `type`) |
| `GET` | `/api/learn/lessons/:id` | ❌ | Chi tiết bài học |
| `POST` | `/api/learn/complete` | ✅ | Hoàn thành bài học |
| `GET` | `/api/learn/history` | ✅ | Lịch sử học |
| `GET` | `/api/dashboard` | ✅ | Dashboard data |
| `GET` | `/api/leaderboard/top10` | ❌ | Top 10 users |
| `GET` | `/api/leaderboard/rank` | ✅ | Rank cá nhân |
| `POST` | `/api/translator/words` | ❌ | Thêm từ mới |
| `GET` | `/api/translator/words` | ❌ | Danh sách từ (pagination) |
| `GET` | `/api/translator/search` | ❌ | Tìm kiếm từ |
| `GET` | `/api/videos/numbers` | ❌ | Video số 1–20 |
| `GET` | `/api/videos/alphabet/:letter` | ❌ | Video chữ cái |

### FastAPI Backend (`:8001`)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `POST` | `/v1/action-detection/sign-to-text` | Nhận keypoints → dự đoán action |
| `GET` | `/v1/action-detection/model-info` | Thông tin model đang chạy |
| `POST` | `/v1/action-detection/text-to-sign` | Văn bản → video ký hiệu |
| `POST` | `/v1/action-detection/dataset` | Lưu sequence training data |
| `GET` | `/health` | Health check |

---

## 🗄️ Database Schema

### MongoDB (Node.js Backend)

```
┌─────────────┐    ┌─────────────────┐    ┌──────────────┐
│    User      │    │ LearningHistory │    │   Lesson     │
├─────────────┤    ├─────────────────┤    ├──────────────┤
│ username    │←──┐│ userId (ref)    │    │ title        │
│ email       │   ││ lessonId (ref)  │───→│ content      │
│ password    │   │└─────────────────┘    │ type (enum)  │
│ score       │   │                       │ scoreReward  │
│ streak      │   │                       │ order        │
│ lastLearned │   │                       └──────────────┘
└─────────────┘   │
                  │  ┌──────────────┐
                  │  │  Translator  │
                  │  ├──────────────┤
                  │  │ text (unique)│
                  │  │ videoUrl     │
                  │  └──────────────┘
```

### PostgreSQL (FastAPI Backend)
- Dùng cho action detection metadata (qua Alembic migrations)
- OpenAPI schema tự động generate từ FastAPI

---

## 🔄 Luồng dữ liệu

### Sign-to-Text Flow (Nhận diện cử chỉ)

```
Webcam → MediaPipe Holistic (browser)
    ↓
Trích xuất 1662 keypoints/frame × 30 frames
    ↓
POST /v1/action-detection/sign-to-text
    ↓
FastAPI → ActionDetectionPredictor
    ↓
TensorFlow LSTM Model (.h5)
    ↓
Response: { label, confidence, scores }
    ↓
Hiển thị kết quả trên UI
```

### Text-to-Sign Flow (Dịch văn bản → ký hiệu)

```
User nhập text → POST /v1/action-detection/text-to-sign
    ↓
FastAPI → TextToSignTranslator
    ↓
Build URL → Sign-MT Cloud Function (Google)
    ↓
Response: { video_url, pose_url }
    ↓
Render video trên browser
```

---

## 🚀 Hướng dẫn cài đặt & chạy

### Yêu cầu

| Thành phần | Ghi chú |
|---|---|
| **Node.js** (v18+) | Cho frontend và script gốc |
| **Python 3.11 hoặc 3.12** | **Không dùng Python 3.13** — TensorFlow chưa có wheel |
| **[uv](https://docs.astral.sh/uv/)** | Quản lý venv cho FastAPI (`pip install uv`) |
| **MongoDB** | Local hoặc MongoDB Atlas (cloud) |

### Cài đặt & chạy

```bash
# 1. Di chuyển vào thư mục project
cd TUONGTACNGUOIMAY

# 2. Cài dependencies (Node.js root + frontend)
npm install

# 3. Cài dependencies Python (FastAPI backend)
npm run setup:backend

# 4. Cài dependencies Node.js backend
cd nodejs-backend && npm install && cd ..

# 5. Chạy toàn bộ (frontend + FastAPI)
npm run dev

# 6. Chạy Node.js backend (terminal riêng)
cd nodejs-backend && npm run dev

# 7. (Optional) Seed dữ liệu mẫu
cd nodejs-backend && npm run seed
```

### Truy cập

| Service | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **Node.js API** | http://localhost:8000 |
| **FastAPI (ML)** | http://localhost:8001 |
| **FastAPI Docs (Swagger)** | http://localhost:8001/docs |

### Training Model

```bash
# Train model với dữ liệu mặc định (hello, thanks, iloveyou)
npm run train:action-detection

# Train model 10 từ (yes, no, help, good, bad, family, work, go, drink, school)
npm run train:pilot-word10

# Ingest video → keypoints
npm run train:ingest-pilot-videos
```

---

## 🚢 Deployment

### Docker (Development)

```bash
# Chạy toàn bộ stack qua Docker
docker compose up

# Chỉ chạy database
npm run dev:db

# Chạy migration
make docker-migrate-db
```

### Production (Vercel)

Project đã cấu hình sẵn GitHub Actions cho deployment lên Vercel:
- `prod-frontend-deploy.yml` — Deploy frontend khi push `main`
- `prod-backend-deploy.yml` — Deploy FastAPI backend khi push `main`

Cần cấu hình Secrets trên GitHub:
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_FRONTEND`, `VERCEL_PROJECT_ID_BACKEND`

---

## 🐛 Lỗi thường gặp

| Lỗi | Giải pháp |
|---|---|
| `tensorflow` không cài được trên Python 3.13 | Cài Python 3.12, xóa `.venv`, chạy lại `npm run setup:backend` |
| `uv` không nhận lệnh | `pip install uv` hoặc `winget install astral-sh.uv` |
| Xung đột numpy/TensorFlow | Giữ `uv.lock`, chạy `uv sync` trong `fastapi_backend` |
| MongoDB connection error | Kiểm tra `MONGO_URL` trong `nodejs-backend/.env` |
| CORS error | Kiểm tra `CORS_ORIGINS` trong `fastapi_backend/.env` và `CORS_ORIGIN` trong `nodejs-backend/.env` |
| Frontend không gọi được API | Kiểm tra file `.env.local` trong `nextjs-frontend` |

---

## 📄 License

MIT License — xem [LICENSE.txt](LICENSE.txt)

---

<p align="center">
  <b>SignLearn</b> — Learn Sign Language with Real-Time AI 🤟
</p>
