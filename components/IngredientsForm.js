import React, { useMemo, useState } from "react";
import { Card, Button, Form, Row, Col, Badge, Alert, Spinner } from "react-bootstrap";
import { Utensils, ShoppingCart } from "lucide-react";

const API_URL = "/api/pantry/recommend";

function parseIngredients(text) {
  if (!text) return [];
  return text
    .replaceAll(";", ",")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function IngredientsForm({ onResults, onError, onLoading }) {
  const [text, setText] = useState("");
  const [k, setK] = useState(12);

  const chips = useMemo(() => parseIngredients(text), [text]);

  const submit = async (e) => {
    e.preventDefault();
    const ingredients = parseIngredients(text);

    if (ingredients.length === 0) {
      onError?.("Vui lòng nhập ít nhất 1 nguyên liệu (VD: trứng, cà chua, rau muống).");
      return;
    }

    try {
      onLoading?.(true);
      onError?.(null);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, k: Number(k) || 12 }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "API error");
      }

      const data = await res.json();
      onResults?.(data);
    } catch (err) {
      onError?.(err.message || "Có lỗi khi gọi API gợi ý mâm cơm.");
    } finally {
      onLoading?.(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h2 style={{ color: "#28a745", fontWeight: "bold" }}>
          <Utensils className="me-2" size={22} />
          Gợi ý mâm cơm từ nguyên liệu có sẵn
        </h2>
        <p className="text-muted mb-0">
          Hệ thống sẽ gợi ý danh sách món đa dạng và giải thích vì sao phù hợp.
        </p>
      </div>

      <Card style={{ borderRadius: 14, border: "1px solid #e9ecef" }}>
        <Card.Body>
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>Nguyên liệu bạn đang có (phân tách bằng dấu phẩy)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="VD: trứng, cà chua, hành lá, thịt ba chỉ, rau muống..."
                style={{ borderRadius: 12 }}
              />
              <div className="mt-2">
                {chips.slice(0, 18).map((c) => (
                  <Badge key={c} bg="success" className="me-2 mb-2" style={{ borderRadius: 999 }}>
                    {c}
                  </Badge>
                ))}
              </div>
            </Form.Group>

            <Row className="align-items-end">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Số gợi ý</Form.Label>
                  <Form.Control
                    type="number"
                    min={3}
                    max={30}
                    value={k}
                    onChange={(e) => setK(e.target.value)}
                    style={{ borderRadius: 12 }}
                  />
                </Form.Group>
              </Col>

              <Col md={9} className="text-md-end mt-3 mt-md-0">
                <Button type="submit" variant="success" size="lg" style={{ borderRadius: 12 }}>
                  Gợi ý món
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Alert variant="light" className="mt-3" style={{ borderRadius: 12 }}>
        <ShoppingCart className="me-2" size={16} />
        Tip: nhập “thịt”, “cá”, “rau” nếu bạn không nhớ chính xác tên nguyên liệu.
      </Alert>
    </div>
  );
}
