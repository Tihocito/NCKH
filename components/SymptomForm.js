import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, InputGroup, Badge, Alert, Modal, ListGroup } from 'react-bootstrap';
import { User, Stethoscope, ShieldAlert, Pill, Send, Plus, History, Trash2 } from 'lucide-react';
import axios from 'axios';

const SymptomForm = ({ onResults, onError, onLoading }) => {
  const [formData, setFormData] = useState({
    symptoms: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    allergies: '',
    medications: '',
    medical_conditions: '',
    dietary_restrictions: '',
    activity_level: 'moderate'
  });

  const [quickSymptoms, setQuickSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  
  // States mới cho tính năng nâng cấp
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  const commonSymptoms = [
    'Đau đầu', 'Mệt mỏi', 'Buồn nôn', 'Đau bụng', 'Tiêu chảy',
    'Táo bón', 'Chóng mặt', 'Mất ngủ', 'Đau khớp', 'Đau cơ',
    'Ho', 'Sốt', 'Đau họng', 'Chảy nước mũi', 'Đau ngực', 'Khó tiêu',
    'Khó thở', 'Đau lưng', 'Đau vai', 'Đau tay', 'Đau chân',
    'Đầy bụng', 'Nổi mụn', 'Rụng tóc', 'Tăng cân', 'Giảm cân', 'Chán ăn',
    'Ợ hơi', 'Ợ chua', 'Đắng miệng', 'Nhạt miệng', 'Tê bì chân tay',
    'Hoa mắt', 'Ù tai', 'Hồi hộp', 'Đổ mồ hôi trộm', 'Nóng trong người'
  ];

  // Load lịch sử từ localStorage khi khởi động
  useEffect(() => {
    const savedHistory = localStorage.getItem('meal_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addQuickSymptom = (symptom) => {
    if (!quickSymptoms.includes(symptom)) {
      setQuickSymptoms(prev => [...prev, symptom]);
    }
  };

  const removeQuickSymptom = (symptom) => {
    setQuickSymptoms(prev => prev.filter(s => s !== symptom));
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !quickSymptoms.includes(customSymptom.trim())) {
      setQuickSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  // Logic lịch sử
  const saveToHistory = (requestData, resultData) => {
    const newItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      mode: 'symptoms',
      input: requestData.symptoms,
      result: resultData
    };
    
    const updatedHistory = [newItem, ...history].slice(0, 20); // Giữ 20 mục gần nhất
    setHistory(updatedHistory);
    localStorage.setItem('meal_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
      setHistory([]);
      localStorage.removeItem('meal_history');
    }
  };

  const loadHistoryItem = (item) => {
    onResults(item.result);
    setShowHistory(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onLoading(true);
    onError(null);

    try {
      // Chuẩn bị dữ liệu chung
      // Quan trọng: Chuyển đổi chuỗi dị ứng thành mảng để backend lọc chính xác hơn
      const processedAllergies = formData.allergies 
        ? formData.allergies.split(',').map(a => a.trim()).filter(a => a) 
        : [];

      let requestData = {
        ...formData,
        allergies: processedAllergies, // Gửi mảng thay vì chuỗi
        mode: 'symptoms'
      };

      // Logic cũ cho triệu chứng
      const allSymptoms = [...quickSymptoms];
      if (formData.symptoms.trim()) {
        allSymptoms.push(...formData.symptoms.split(',').map(s => s.trim()).filter(s => s));
      }

      if (allSymptoms.length === 0) {
        onError('Vui lòng nhập ít nhất một triệu chứng');
        onLoading(false);
        return;
      }
      requestData.symptoms = allSymptoms.join(', ');

      const response = await axios.post('http://localhost:5000/api/recommend', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Lưu lịch sử
      saveToHistory(requestData, response.data);

      onResults({ ...response.data, mode: 'symptoms' });
    } catch (error) {
      console.error('Error submitting form:', error);
      onError(error.response?.data?.error || 'Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="flex-grow-1 text-center">
        <h2 style={{ color: '#28a745', fontWeight: 'bold', fontSize: '2rem' }}>
          <Stethoscope className="me-3" size={32} />
          Tư Vấn Dinh Dưỡng Theo Triệu Chứng
        </h2>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Nhập triệu chứng để nhận thực đơn phù hợp
        </p>
        </div>
        <Button variant="outline-secondary" onClick={() => setShowHistory(true)} title="Lịch sử tư vấn">
          <History size={24} />
        </Button>
      </div>

        <Form onSubmit={handleSubmit}>
        {/* Giao diện nhập Triệu chứng */}
        <Card className="mb-4" style={{ border: '2px solid #28a745', borderRadius: '10px' }}>
          <Card.Header style={{ backgroundColor: '#28a745', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <Stethoscope className="me-2" size={20} />
            Triệu Chứng Của Bạn
          </Card.Header>
          <Card.Body style={{ padding: '2rem' }}>
            {/* Triệu chứng nhanh */}
            <div className="mb-4">
              <h5 style={{ color: '#28a745', marginBottom: '1rem' }}>Chọn triệu chứng phổ biến:</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {commonSymptoms.map((symptom, index) => (
                  <Button
                    key={index}
                    variant={quickSymptoms.includes(symptom) ? "success" : "outline-success"}
                    size="sm"
                    onClick={() => quickSymptoms.includes(symptom) ? removeQuickSymptom(symptom) : addQuickSymptom(symptom)}
                    style={{ borderRadius: '20px', fontSize: '0.9rem' }}
                  >
                    {symptom}
                  </Button>
                ))}
              </div>
            </div>

            {/* Triệu chứng tùy chỉnh */}
            <div className="mb-3">
              <Form.Label style={{ fontWeight: 'bold', color: '#28a745' }}>
                Hoặc mô tả triệu chứng của bạn:
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ: đau đầu nhẹ, buồn nôn sau ăn..."
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSymptom())}
                  style={{ borderRadius: '5px 0 0 5px' }}
                />
                <Button
                  variant="success"
                  onClick={addCustomSymptom}
                  disabled={!customSymptom.trim()}
                  style={{ borderRadius: '0 5px 5px 0' }}
                >
                  <Plus size={16} />
                </Button>
              </InputGroup>
            </div>

            {/* Hiển thị triệu chứng đã chọn */}
            {quickSymptoms.length > 0 && (
              <div className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: '#28a745' }}>
                  Triệu chứng đã chọn:
                </Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {quickSymptoms.map((symptom, index) => (
                    <Badge
                      key={index}
                      bg="success"
                      className="p-2"
                      style={{ cursor: 'pointer', borderRadius: '15px' }}
                      onClick={() => removeQuickSymptom(symptom)}
                    >
                      {symptom} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Mô tả chi tiết */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold', color: '#28a745' }}>
                Mô tả chi tiết thêm (tùy chọn):
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="Mô tả thêm về triệu chứng, mức độ đau, thời gian xuất hiện..."
                style={{ borderRadius: '5px' }}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Thông tin cá nhân */}
        <Card className="mb-4" style={{ border: '2px solid #17a2b8', borderRadius: '10px' }}>
          <Card.Header style={{ backgroundColor: '#17a2b8', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <User className="me-2" size={20} />
            Thông Tin Cá Nhân
          </Card.Header>
          <Card.Body style={{ padding: '2rem' }}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Tuổi:</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 25"
                    min="1"
                    max="120"
                    style={{ borderRadius: '5px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Giới tính:</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={{ borderRadius: '5px' }}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Cân nặng (kg):</Form.Label>
                  <Form.Control
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 65"
                    min="1"
                    max="300"
                    step="0.1"
                    style={{ borderRadius: '5px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Chiều cao (cm):</Form.Label>
                  <Form.Control
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 170"
                    min="50"
                    max="250"
                    style={{ borderRadius: '5px' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Mức độ hoạt động:</Form.Label>
              <Form.Select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleInputChange}
                style={{ borderRadius: '5px' }}
              >
                <option value="sedentary">Ít vận động (ngồi văn phòng)</option>
                <option value="light">Vận động nhẹ (đi bộ thường xuyên)</option>
                <option value="moderate">Vận động vừa phải (tập gym 3-4 lần/tuần)</option>
                <option value="active">Vận động nhiều (tập gym hàng ngày)</option>
                <option value="very_active">Vận động rất nhiều (vận động viên)</option>
              </Form.Select>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Thông tin y tế */}
        <Card className="mb-4" style={{ border: '2px solid #dc3545', borderRadius: '10px' }}>
          <Card.Header style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <Pill className="me-2" size={20} />
            Thông Tin Y Tế (Quan Trọng)
          </Card.Header>
          <Card.Body style={{ padding: '2rem' }}>
            <Alert variant="warning" className="mb-3">
              <strong>Lưu ý:</strong> Thông tin này giúp hệ thống đưa ra tư vấn an toàn và phù hợp nhất
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>
                <ShieldAlert className="me-2" size={16} />
                Dị ứng thực phẩm (nếu có):
              </Form.Label>
              <Form.Control
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="Ví dụ: gà, hải sản, đậu phộng..."
                style={{ borderRadius: '5px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>
                <Pill className="me-2" size={16} />
                Thuốc đang dùng (nếu có):
              </Form.Label>
              <Form.Control
                type="text"
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
                placeholder="Ví dụ: thuốc huyết áp, thuốc tiểu đường..."
                style={{ borderRadius: '5px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>
                <Stethoscope className="me-2" size={16} />
                Tình trạng bệnh lý (nếu có):
              </Form.Label>
              <Form.Control
                type="text"
                name="medical_conditions"
                value={formData.medical_conditions}
                onChange={handleInputChange}
                placeholder="Ví dụ: tiểu đường, cao huyết áp, bệnh thận..."
                style={{ borderRadius: '5px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>
                <User className="me-2" size={16} />
                Chế độ ăn kiêng đặc biệt (nếu có):
              </Form.Label>
              <Form.Control
                type="text"
                name="dietary_restrictions"
                value={formData.dietary_restrictions}
                onChange={handleInputChange}
                placeholder="Ví dụ: ăn chay, ketogenic, low-carb..."
                style={{ borderRadius: '5px' }}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="submit"
            size="lg"
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
            <Send className="me-2" size={20} /> Nhận Tư Vấn Theo Triệu Chứng
          </Button>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            Hệ thống sẽ phân tích và đưa ra gợi ý món ăn phù hợp nhất cho bạn
          </p>
        </div>
      </Form>

      {/* Modal Lịch sử */}
      <Modal show={showHistory} onHide={() => setShowHistory(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><History className="me-2"/> Lịch Sử Tư Vấn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {history.length === 0 ? (
            <p className="text-center text-muted">Chưa có lịch sử tư vấn nào.</p>
          ) : (
            <ListGroup>
              {history.map((item) => (
                <ListGroup.Item key={item.id} action onClick={() => loadHistoryItem(item)} className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">
                      {new Date(item.timestamp).toLocaleString('vi-VN')} 
                      <Badge bg={item.mode === 'symptoms' ? 'success' : 'warning'} className="ms-2">
                        {item.mode === 'symptoms' ? 'Triệu chứng' : 'Nguyên liệu'}
                      </Badge>
                    </div>
                    <small className="text-muted">
                      {Array.isArray(item.input) ? item.input.join(', ') : item.input}
                    </small>
                  </div>
                  <Badge bg="primary" pill>{item.result?.recommendations?.length || 0} món</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={clearHistory} disabled={history.length === 0}>
            <Trash2 size={16} className="me-2"/> Xóa Lịch Sử
          </Button>
          <Button variant="secondary" onClick={() => setShowHistory(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SymptomForm;