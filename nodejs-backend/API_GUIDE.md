# Sign Language Learning Platform - Backend API

Hệ thống backend hoàn chỉnh cho ứng dụng học ngôn ngữ ký hiệu với Node.js, Express.js, MongoDB, JWT authentication.

## 📋 Yêu cầu

- Node.js v14+
- MongoDB (local hoặc cloud)
- npm hoặc yarn

## 🚀 Cài đặt

### 1. Clone repository và cài dependencies

```bash
cd nodejs-backend
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc với nội dung:

```
PORT=8000
MONGO_URL=mongodb://localhost:27017/sign-language-learning
SECRET_KEY=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
LOG_LEVEL=debug
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Chú ý:** 
- Thay `your_super_secret_jwt_key_change_this_in_production` bằng một key bí mật an toàn
- Nếu dùng MongoDB Atlas (cloud), thay `MONGO_URL` bằng connection string của bạn

### 3. Seed dữ liệu mẫu (Optional)

```bash
npm run seed
```

Lệnh này sẽ:
- Xóa toàn bộ dữ liệu cũ
- Tạo 4 users mẫu
- Tạo 6 lessons mẫu
- Tạo 10 translator words mẫu

### 4. Chạy development server

```bash
npm run dev
```

Server sẽ chạy trên `http://localhost:8000` và tự reload khi file thay đổi.

Hoặc chạy production:

```bash
npm start
```

## 📁 Cấu trúc project

```
src/
├── config/
│   └── database.js           # MongoDB connection
├── logger.js                 # Pino logger config
├── middlewares/
│   ├── authMiddleware.js     # JWT authentication
│   └── errorHandler.js       # Global error handler
├── modules/
│   ├── auth/                 # Authentication module
│   │   ├── User.js          # User model
│   │   ├── authService.js   # Business logic
│   │   └── authController.js # Request handlers
│   ├── learn/               # Learn module
│   │   ├── Lesson.js
│   │   ├── LearningHistory.js
│   │   ├── learnService.js
│   │   └── learnController.js
│   ├── dashboard/           # Dashboard module
│   │   ├── dashboardService.js
│   │   └── dashboardController.js
│   ├── leaderboard/         # Leaderboard module
│   │   ├── leaderboardService.js
│   │   └── leaderboardController.js
│   └── translator/          # Translator module
│       ├── Translator.js
│       ├── translatorService.js
│       └── translatorController.js
├── routes/
│   ├── auth.js              # Auth routes
│   ├── learn.js             # Learn routes
│   ├── dashboard.js         # Dashboard routes
│   ├── leaderboard.js       # Leaderboard routes
│   └── translator.js        # Translator routes
├── utils/
│   ├── jwt.js               # JWT helpers
│   └── streak.js            # Streak calculation
├── scripts/
│   └── seedData.js          # Seed data script
├── app.js                   # Express app configuration
└── server.js                # Server entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy profile (requires token)

### Learn
- `GET /api/learn/lessons` - Lấy tất cả lessons/practices (query: type)
- `GET /api/learn/lessons/:lessonId` - Lấy chi tiết lesson
- `POST /api/learn/complete` - Hoàn thành lesson (requires token)
- `GET /api/learn/history` - Lấy learning history (requires token)

### Dashboard
- `GET /api/dashboard` - Lấy dashboard data (requires token)

### Leaderboard
- `GET /api/leaderboard/top10` - Lấy top 10 users
- `GET /api/leaderboard/rank` - Lấy rank của user hiện tại (requires token)
- `GET /api/videos/numbers` - Lấy danh sách video số từ Cloudinary (1-20)
- `GET /api/videos/alphabet/:letter` - Lấy video theo chữ cái a-z từ Cloudinary

### Translator
- `POST /api/translator/words` - Thêm từ mới
- `GET /api/translator/words` - Lấy danh sách từ (pagination: page, limit)
- `GET /api/translator/search?search=hello` - Tìm kiếm từ
- `GET /api/translator/words/:wordId` - Lấy chi tiết từ

## 📝 Ví dụ API Calls

### 1. Đăng ký

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "123456"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "newuser",
      "email": "newuser@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Đăng nhập

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "123456"
  }'
```

### 3. Lấy Dashboard (requires token)

```bash
curl -X GET http://localhost:8000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Hoàn thành bài học

```bash
curl -X POST http://localhost:8000/api/learn/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "lessonId": "lesson_id"
  }'
```

### 5. Tìm kiếm từ

```bash
curl -X GET "http://localhost:8000/api/translator/search?search=hello"
```

## 🛠️ Công nghệ sử dụng

| Package | Version | Mục đích |
|---------|---------|---------|
| express | ^5.2.1 | Web framework |
| mongoose | ^8.0.0 | MongoDB ODM |
| bcrypt | ^5.1.0 | Password hashing |
| jsonwebtoken | ^9.0.0 | JWT authentication |
| dotenv | ^17.4.0 | Environment variables |
| pino | ^10.3.1 | Logging |
| nodemon | ^3.1.14 | Development auto-reload |

## 📊 Database Schema

### User
- `username` (String, unique) - Tên người dùng
- `email` (String, unique) - Email
- `password` (String, hashed) - Mật khẩu
- `score` (Number) - Tổng điểm
- `streak` (Number) - Số ngày học liên tiếp
- `lastLearnedDate` (Date) - Ngày học cuối cùng

### Lesson
- `title` (String) - Tiêu đề
- `content` (String) - Nội dung
- `type` (Enum: lesson | practice) - Loại
- `scoreReward` (Number) - Điểm thưởng
- `order` (Number) - Thứ tự

### LearningHistory
- `userId` (ObjectId) - User reference
- `lessonId` (ObjectId) - Lesson reference
- `date` (Date) - Ngày học

### Translator
- `text` (String, unique) - Từ
- `videoUrl` (String) - Link video

## 🔐 Authentication

Để sử dụng endpoints được bảo vệ, cần gửi JWT token trong header:

```
Authorization: Bearer <your_token>
```

Token sẽ hết hạn sau 7 ngày.

## 📌 Ghi chú

- Tất cả passwords được mã hóa bằng bcrypt trước khi lưu
- Streak được tính dựa trên lịch sử học liên tiếp
- Dashboard tính số bài học cho 3 ngày gần nhất
- Leaderboard xếp hạng theo điểm giảm dần
- Tìm kiếm translator không phân biệt hoa/thường
- Tất cả responses theo format: `{ success, message, data }`

## 🚨 Error Handling

- 400: Bad Request - Validation error
- 401: Unauthorized - Token không hợp lệ hoặc hết hạn
- 404: Not Found - Resource không tồn tại
- 500: Internal Server Error - Lỗi server

## 💡 Mở rộng project

Để thêm module mới:
1. Tạo folder trong `src/modules/[module-name]`
2. Tạo Model.js
3. Tạo [module]Service.js
4. Tạo [module]Controller.js
5. Tạo route file trong `src/routes/[module].js`
6. Import route vào app.js

## 📧 Support

Nếu có vấn đề, hãy kiểm tra:
- MongoDB connection string
- Environment variables
- Port availability
- Seed data (run npm run seed)

---

**Bắt đầu phát triển API của bạn! 🎉**
