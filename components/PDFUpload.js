import React, { useState } from 'react';
import { Form, Button, Card, Alert, ProgressBar, Row, Col } from 'react-bootstrap';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const PDFUpload = ({ onResults, onError, onLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) {
        onError('File không được vượt quá 10MB');
        return;
      }
      setSelectedFile(file);
      setUploadProgress(0);
    } else {
      onError('Vui lòng chọn file PDF hợp lệ');
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      onError('Vui lòng chọn file PDF trước khi upload');
      return;
    }

    onLoading(true);
    onError(null);

    try {
      const formData = new FormData();
      formData.append('pdf_file', selectedFile);

      const response = await axios.post('http://localhost:5000/api/analyze_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      onResults(response.data);
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      onError(error.response?.data?.error || 'Có lỗi xảy ra khi upload file PDF');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h2 style={{ color: '#28a745', fontWeight: 'bold', fontSize: '2rem' }}>
          <FileText className="me-3" size={32} />
          Phân Tích Hồ Sơ PDF
        </h2>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Upload hồ sơ y tế, kết quả xét nghiệm hoặc báo cáo sức khỏe để nhận tư vấn món ăn phù hợp
        </p>
      </div>

      <Card className="shadow-lg" style={{ border: 'none', borderRadius: '15px', overflow: 'hidden' }}>
        <Card.Body style={{ padding: '3rem' }}>
          <Form onSubmit={handleSubmit}>
            {/* Khu vực upload */}
            <div
              className={`text-center mb-4 p-5 border-2 border-dashed rounded ${
                isDragOver ? 'border-success bg-success bg-opacity-10' : 'border-secondary'
              }`}
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('pdf-file-input').click()}
            >
              <Upload
                size={48}
                className={`mb-3 ${isDragOver ? 'text-success' : 'text-secondary'}`}
                style={{ transition: 'color 0.3s ease' }}
              />

              {selectedFile ? (
                <div>
                  <CheckCircle2 size={24} className="text-success mb-2" />
                  <h5 className="text-success mb-2">File đã chọn</h5>
                  <p className="text-muted mb-2">{selectedFile.name}</p>
                  <small className="text-muted">
                    Kích thước: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </small>
                </div>
              ) : (
                <div>
                  <h5 className={`${isDragOver ? 'text-success' : 'text-secondary'} mb-2`}>
                    {isDragOver ? 'Thả file vào đây' : 'Kéo thả file PDF hoặc click để chọn'}
                  </h5>
                  <p className="text-muted mb-0">
                    Hỗ trợ file PDF (tối đa 10MB)
                  </p>
                </div>
              )}

              <Form.Control
                id="pdf-file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Thông tin về loại file được hỗ trợ */}
            <Alert variant="info" className="mb-4">
              <AlertCircle className="me-2" size={16} />
              <strong>Loại hồ sơ phù hợp:</strong>
              <ul className="mb-0 mt-2">
                <li>Kết quả xét nghiệm máu, nước tiểu</li>
                <li>Báo cáo siêu âm, X-quang</li>
                <li>Hồ sơ bệnh án, đơn thuốc</li>
                <li>Báo cáo sức khỏe định kỳ</li>
              </ul>
            </Alert>

            {/* Progress bar khi upload */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">Đang upload...</small>
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
                <Upload className="me-2" size={20} />
                Phân Tích Hồ Sơ
              </Button>

              {!selectedFile && (
                <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                  Vui lòng chọn file PDF trước khi phân tích
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
            Hướng Dẫn Sử Dụng
          </h5>
          <Row>
            <Col md={6}>
              <h6 style={{ color: '#17a2b8' }}>Bước 1: Chuẩn bị hồ sơ</h6>
              <ul style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                <li>Đảm bảo file PDF rõ ràng, dễ đọc</li>
                <li>Kích thước file không quá 10MB</li>
                <li>Nội dung bằng tiếng Việt hoặc tiếng Anh</li>
              </ul>
            </Col>
            <Col md={6}>
              <h6 style={{ color: '#17a2b8' }}>Bước 2: Upload và phân tích</h6>
              <ul style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                <li>Kéo thả file hoặc click để chọn</li>
                <li>Đợi quá trình upload hoàn tất</li>
                <li>Hệ thống sẽ phân tích và đưa ra gợi ý</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PDFUpload;