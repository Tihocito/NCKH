# Health Food Expert System - Hệ Chuyên Gia Mờ Tư Vấn Món Ăn Sức Khỏe

## 📋 Giới Thiệu

Hệ thống hỗ trợ quyết định dinh dưỡng sử dụng Hệ chuyên gia mờ để đề xuất món ăn phù hợp dựa trên triệu chứng sức khỏe. Đề tài nghiên cứu khoa học kết hợp Trí tuệ nhân tạo, Logic mờ và tri thức Đông y - Tây y.

**Đề tài:** Nghiên cứu mô hình hệ chuyên gia mờ phòng và chữa bệnh bằng món ăn hàng ngày  
**Trường:** Đại học Thăng Long  
**Giảng viên hướng dẫn:** PGS.TS Nguyễn Hoàng Phương  
**Sinh viên thực hiện:** Bùi Đức Mạnh - MSV: A48799  
**Năm:** 2024-2025

## ✨ Tính Năng Chính

### 🧠 Hệ Thống Thông Minh
- **Tư vấn đa chế độ**:
  - **Theo triệu chứng**: Nhập triệu chứng (đau đầu, mệt mỏi...) để nhận thực đơn chữa bệnh.
  - **Từ tủ lạnh**: Nhập nguyên liệu có sẵn để nhận gợi ý món ăn ngon.
- **Logic mờ & Hệ chuyên gia**: Xử lý thông tin mơ hồ để đưa ra quyết định chính xác.
- **Kết hợp Đông-Tây y**: Tích hợp tri thức dinh dưỡng hiện đại và y lý Đông y.

### 🍽️ Trải Nghiệm Người Dùng Nâng Cao
- **Thực đơn đa dạng**: Cung cấp tới **15 Option thực đơn** khác nhau cho mỗi lần tư vấn.
- **Tính toán dinh dưỡng**: Hiển thị **tổng lượng Calo** cho từng mâm cơm gợi ý.
- **Đi chợ thông minh**: Tự động tạo **Danh sách đi chợ (Shopping List)** từ thực đơn đã chọn.
- **Lịch sử tư vấn**: Lưu lại các lần tra cứu để xem lại sau.

### 🛡️ An Toàn & Đáng Tin Cậy
- **Kiểm tra an toàn**: Cảnh báo dị ứng, tương tác thuốc, và chống chỉ định.
- **Giải thích minh bạch**: Cung cấp lý do chi tiết tại sao món ăn được đề xuất.

### 📊 Cơ Sở Tri Thức Phong Phú
- **100+ món ăn Việt Nam**: Được gán nhãn đa chiều
- **Ontology triệu chứng**: Cấu trúc hóa tri thức y học
- **Luật suy diễn mờ**: 50+ luật mờ cho các tình huống phổ biến

### 🚀 Lộ Trình Nâng Cấp (2025)
- [x] Giao diện React hiện đại & Tách biệt chức năng
- [x] Tính năng Shopping List & Calorie Counter
- [ ] Tích hợp AI Chatbot (LLM)
- [ ] Phân Tích Hình Ảnh Nâng Cao
- [ ] Mobile App (React Native)

## 🏗️ Kiến Trúc Hệ Thống
health_food_expert_system/
├── backend/               # Mã nguồn Backend (Python)
│   ├── data/              # Dữ liệu và tri thức
│   │   ├── knowledge_base.json
│   │   ├── fuzzy_rules.json
│   │   └── ...
│   ├── src/               # Mã nguồn xử lý chính
│   │   ├── core/
│   │   └── services/
│   ├── utils/             # Tiện ích
│   ├── tests/             # Kiểm thử
│   ├── main.py            # File chạy chính
│   └── requirements.txt   # Thư viện Python
├── frontend/              # Mã nguồn Frontend (ReactJS)
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md

## 🚀 Cài Đặt & Chạy

### Yêu Cầu Hệ Thống
- Python 3.8+
- Node.js 14+

### Cài Đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd health_food_expert_system
```

2. **Cài đặt Backend**
```bash
cd backend
pip install -r requirements.txt
python main.py --web
# Server chạy tại: http://localhost:5000
```

3. **Cài đặt Frontend**
```bash
cd frontend
npm install
npm start
```