import React, { useState } from 'react';
import { Form, Button, Card, Alert, ProgressBar, Row, Col, Badge } from 'react-bootstrap';
import { Camera, Upload, Image as ImageIcon, AlertCircle, CheckCircle2, X } from 'lucide-react';
import axios from 'axios';

const ImageAnalysis = ({ onResults, onError, onLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = (file) => {
    if (!file) return;

    // Kiểm tra loại file
    if (!allowedTypes.includes(file.type)) {
      onError('Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)');
      return;
    }

    // Kiểm tra kích thước
    if (file.size > maxSize) {
      onError('File ảnh không được vượt quá 5MB');
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);

    // Tạo preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      onError('Vui lòng chọn ảnh trước khi phân tích');
      return;
    }

    onLoading(true);
    onError(null);

    try {
      const formData = new FormData();
      formData.append('image_file', selectedFile);

      const response = await axios.post('http://localhost:5000/api/analyze_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      onResults(response.data);
      removeImage();
    } catch (error) {
      console.error('Error analyzing image:', error);
      onError(error.response?.data?.error || 'Có lỗi xảy ra khi phân tích ảnh');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h2 style={{ color: '#28a745', fontWeight: 'bold', fontSize: '2rem' }}>
          <Camera className="me-3" size={32} />
          Phân Tích Hình Ảnh
        </h2>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Upload hình ảnh thực phẩm, triệu chứng hoặc lưỡi để nhận tư vấn sức khỏe cá nhân hóa
        </p>
      </div>

      <Card className="shadow-lg" style={{ border: 'none', borderRadius: '15px', overflow: 'hidden' }}>
        <Card.Body style={{ padding: '3rem' }}>
          <Form onSubmit={handleSubmit}>
            {/* Khu vực upload ảnh */}
            <div
              className={`text-center mb-4 p-5 border-2 border-dashed rounded ${
                isDragOver ? 'border-success bg-success bg-opacity-10' : 'border-secondary'
              }`}
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !selectedFile && document.getElementById('image-file-input').click()}
            >
              {previewUrl ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                  >
                    <X size={16} />
                  </Button>
                  <div style={{ marginTop: '1rem' }}>
                    <Badge bg="success" className="me-2">
                      <CheckCircle2 size={12} className="me-1" />
                      Đã chọn
                    </Badge>
                    <small className="text-muted">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </div>
                </div>
              ) : (
                <div>
                  <ImageIcon
                    size={48}
                    className={`mb-3 ${isDragOver ? 'text-success' : 'text-secondary'}`}
                    style={{ transition: 'color 0.3s ease' }}
                  />
                  <h5 className={`${isDragOver ? 'text-success' : 'text-secondary'} mb-2`}>
                    {isDragOver ? 'Thả ảnh vào đây' : 'Kéo thả ảnh hoặc click để chọn'}
                  </h5>
                  <p className="text-muted mb-0">
                    Hỗ trợ JPEG, PNG, WebP (tối đa 5MB)
                  </p>
                </div>
              )}

              <Form.Control
                id="image-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Thông tin về loại ảnh được hỗ trợ */}
            <Alert variant="info" className="mb-4">
              <AlertCircle className="me-2" size={16} />
              <strong>Loại ảnh phù hợp:</strong>
              <Row className="mt-2">
                <Col md={6}>
                  <ul className="mb-0">
                    <li>Hình ảnh thực phẩm, món ăn</li>
                    <li>Triệu chứng trên da, niêm mạc</li>
                    <li>Hình ảnh lưỡi (để chẩn đoán)</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <ul className="mb-0">
                    <li>Kết quả xét nghiệm hình ảnh</li>
                    <li>Hình ảnh triệu chứng bệnh lý</li>
                    <li>Thực phẩm nghi ngờ dị ứng</li>
                  </ul>
                </Col>
              </Row>
            </Alert>

            {/* Progress bar khi upload */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">Đang upload và phân tích...</small>
                  <small className="text-muted">{uploadProgress}%</small>
                </div>
                <ProgressBar
                  now={uploadProgress}
                  variant="success"
                  style={{ height: '8px', borderRadius: '4px' }}
                />
              </div>
            )}

            {/* Nút submit */}
            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                disabled={!selectedFile || uploadProgress > 0}
                style={{
                  backgroundColor: '#28a745',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '15px 50px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(40, 167, 69, 0.3)'
                }}
                className="mb-3"
              >
                <Camera className="me-2" size={20} />
                Phân Tích Ảnh
              </Button>

              {!selectedFile && (
                <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                  Vui lòng chọn ảnh trước khi phân tích
                </p>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Hướng dẫn sử dụng */}
      <Card className="mt-4 shadow-sm" style={{ border: 'none', borderRadius: '10px' }}>
        <Card.Body style={{ padding: '2rem' }}>
          <h5 style={{ color: '#28a745', marginBottom: '1rem' }}>
            <AlertCircle className="me-2" size={20} />
            Hướng Dẫn Chụp Ảnh
          </h5>
          <Row>
            <Col md={6}>
              <h6 style={{ color: '#17a2b8' }}>Cho ảnh thực phẩm:</h6>
              <ul style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                <li>Chụp rõ ràng, đủ sáng</li>
                <li>Hiển thị toàn bộ món ăn</li>
                <li>Góc chụp tự nhiên</li>
              </ul>
            </Col>
            <Col md={6}>
              <h6 style={{ color: '#17a2b8' }}>Cho ảnh triệu chứng:</h6>
              <ul style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                <li>Đảm bảo quyền riêng tư</li>
                <li>Chụp cận cảnh, rõ nét</li>
                <li>Không che khuất vùng quan trọng</li>
              </ul>
            </Col>
          </Row>
          <Alert variant="warning" className="mt-3">
            <strong>Lưu ý:</strong> Phân tích hình ảnh chỉ mang tính hỗ trợ, không thay thế chẩn đoán y tế chuyên môn.
          </Alert>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ImageAnalysis;