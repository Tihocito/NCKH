# Sử dụng Python 3.9 slim để tối ưu kích thước image
FROM python:3.9-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt các dependencies hệ thống cần thiết cho OpenCV (cv2) và biên dịch
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy file requirements và cài đặt thư viện Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ mã nguồn backend
COPY . .

# Chạy ứng dụng, lắng nghe trên 0.0.0.0 để Docker có thể map port
CMD ["python", "main.py", "--web", "--host", "0.0.0.0"]