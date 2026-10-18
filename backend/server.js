const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const noteRoutes = require('./routes/notes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Cho phép Frontend gọi API cross-origin
app.use(express.json()); // Cho phép đọc dữ liệu JSON từ req.body

// Kết nối MongoDB (thay connection string nếu dùng MongoDB Atlas)
mongoose.connect('mongodb://127.0.0.1:27017/note_db')
  .then(() => console.log('✅ Đã kết nối thành công với MongoDB'))
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// Route chính
app.use('/api', noteRoutes);

// Khởi chạy Server
app.listen(PORT, () => {
  console.log(`🚀 Server Backend đang chạy tại: http://localhost:${PORT}`);
});