import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Navbar, Nav, Form, InputGroup, Badge } from 'react-bootstrap';
import { Heart, Upload, FileText, Camera, ChefHat, User, Stethoscope, ShieldAlert, Pill, CloudUpload, Activity, Utensils } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import SymptomForm from './components/SymptomForm';
import ResultsDisplay from './components/ResultsDisplay';
import PDFUpload from './components/PDFUpload';
import ImageAnalysis from './components/ImageAnalysis';
import IngredientsForm from './components/IngredientsForm';

function App() {
  const [activeTab, setActiveTab] = useState('symptoms');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResults = (data) => {
    setResults(data);
    setError(null);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
    setResults(null);
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <div className="App" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        color: 'white',
        padding: '2rem 0',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <Container>
          <div className="text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              <Heart size={48} className="me-3" />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Hệ Chuyên Gia Tư Vấn Món Ăn Sức Khỏe
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0' }}>
              Ứng dụng AI và Logic Mờ trong tư vấn dinh dưỡng cá nhân hóa
            </p>
          </div>
        </Container>
      </div>

      <Container style={{ maxWidth: '1200px' }}>
        {/* Navigation Tabs */}
        <div className="mb-4">
          <Nav variant="tabs" className="justify-content-center" style={{ border: 'none', background: 'white', borderRadius: '10px', padding: '10px' }}>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'symptoms'}
                onClick={() => setActiveTab('symptoms')}
                style={{
                  border: 'none',
                  color: activeTab === 'symptoms' ? '#28a745' : '#6c757d',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '15px 30px'
                }}
              >
                <Stethoscope className="me-2" size={20} />
                Tư Vấn Theo Triệu Chứng
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'ingredients'}
                onClick={() => setActiveTab('ingredients')}
                style={{
                  border: 'none',
                  color: activeTab === 'ingredients' ? '#28a745' : '#6c757d',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '15px 30px'
                }}
              >
                <Utensils className="me-2" size={20} />
                Gợi Ý Mâm Cơm
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'pdf'}
                onClick={() => setActiveTab('pdf')}
                style={{
                  border: 'none',
                  color: activeTab === 'pdf' ? '#28a745' : '#6c757d',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '15px 30px'
                }}
              >
                <Upload className="me-2" size={20} />
                Upload Hồ Sơ PDF
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'image'}
                onClick={() => setActiveTab('image')}
                style={{
                  border: 'none',
                  color: activeTab === 'image' ? '#28a745' : '#6c757d',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '15px 30px'
                }}
              >
                <Camera className="me-2" size={20} />
                Phân Tích Hình Ảnh
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
              <Nav.Link
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
                style={{
                  border: 'none',
                  color: activeTab === 'dashboard' ? '#28a745' : '#6c757d',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '15px 30px'
                }}
              >
                <Activity className="me-2" size={20} />
                Dashboard Sức Khỏe
              </Nav.Link>
            </Nav.Item> */}
          </Nav>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-4" style={{ borderRadius: '10px', fontSize: '1.1rem' }}>
            <Alert.Heading style={{ fontSize: '1.3rem' }}>
              <i className="fas fa-exclamation-triangle me-2"></i>
              Có lỗi xảy ra!
            </Alert.Heading>
            <p className="mb-0">{error}</p>
          </Alert>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center mb-4">
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
              <p className="mt-3" style={{ fontSize: '1.2rem', color: '#28a745', fontWeight: 'bold' }}>
                Đang phân tích và tư vấn...
              </p>
              <p style={{ color: '#6c757d' }}>
                Hệ thống đang sử dụng AI để đưa ra gợi ý món ăn phù hợp nhất cho bạn
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Row>
          <Col lg={12}>
            <Card className="shadow-lg" style={{ border: 'none', borderRadius: '15px', overflow: 'hidden' }}>
              <Card.Body style={{ padding: '3rem' }}>
                {activeTab === 'symptoms' && (
                  <SymptomForm
                    onResults={handleResults}
                    onError={handleError}
                    onLoading={handleLoading}
                  />
                )}

                {activeTab === 'ingredients' && (
                  <IngredientsForm
                    onResults={handleResults}
                    onError={handleError}
                    onLoading={handleLoading}
                  />
                )}

                {activeTab === 'pdf' && (
                  <PDFUpload
                    onResults={handleResults}
                    onError={handleError}
                    onLoading={handleLoading}
                  />
                )}

                {activeTab === 'image' && (
                  <ImageAnalysis
                    onResults={handleResults}
                    onError={handleError}
                    onLoading={handleLoading}
                  />
                )}

                {/* {activeTab === 'dashboard' && (
                  <div className="text-center p-5">
                    <h3>Dashboard Sức Khỏe Cá Nhân</h3>
                    <p className="text-muted">Tính năng đang được phát triển...</p>
                  </div>
                )} */}
              </Card.Body>
            </Card>

            {/* Results Display */}
            {results && (
              <Card className="mt-4 shadow-lg" style={{ border: 'none', borderRadius: '15px', overflow: 'hidden' }}>
                <Card.Body style={{ padding: '3rem' }}>
                  <ResultsDisplay results={results} />
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Footer */}
        <footer className="mt-5 text-center" style={{ color: '#6c757d', padding: '2rem 0' }}>
          <p style={{ fontSize: '1.1rem' }}>
            <Heart className="me-2" size={16} />
            Hệ thống được phát triển với công nghệ AI tiên tiến để hỗ trợ sức khỏe cộng đồng
          </p>
          <small>
            Lưu ý: Thông tin này chỉ mang tính chất tham khảo, không thay thế tư vấn y tế chuyên môn
          </small>
        </footer>
      </Container>
    </div>
  );
}

export default App;
