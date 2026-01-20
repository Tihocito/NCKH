import React from "react";
import { Alert, Badge, Card, Col, Row } from "react-bootstrap";
import { ShoppingCart, Utensils, Info } from "lucide-react";

function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

function PantryCard({ dish }) {
  const tags = safeArray(dish?.tags);
  const matched = safeArray(dish?.matched_ingredients);
  const missing = safeArray(dish?.missing_ingredients);
  const explanations = safeArray(dish?.explanations);

  return (
    <Card style={{ borderRadius: 14, border: "1px solid #e9ecef" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{dish?.name || "—"}</div>
            <div className="text-muted mt-1">
              Score: <b>{dish?.score ?? "—"}</b>
            </div>

            <div className="mt-2">
              {tags.slice(0, 8).map((t) => (
                <Badge key={t} bg="secondary" className="me-2 mb-2" style={{ borderRadius: 999 }}>
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <hr />

        <div className="mb-3">
          <div className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>
            Khớp được
          </div>
          <div style={{ fontSize: 14 }}>
            {matched.length ? matched.join(", ") : "—"}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>
            Thiếu
          </div>
          <div style={{ fontSize: 14 }}>
            {missing.length ? missing.join(", ") : "Không thiếu"}
          </div>
        </div>

        <div>
          <div className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>
            Giải thích
          </div>
          {explanations.length ? (
            <ul className="mb-0" style={{ fontSize: 14 }}>
              {explanations.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          ) : (
            <div style={{ fontSize: 14 }}>—</div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

function renderPantryMode(results) {
  const list = safeArray(results?.results);
  const shopping = safeArray(results?.shopping_list);

  return (
    <div>
      <div className="mb-3">
        <h3 style={{ color: "#28a745", fontWeight: "bold" }}>
          <Utensils className="me-2" size={20} />
          Kết quả gợi ý mâm cơm
        </h3>
        <div className="text-muted">
          Dựa trên nguyên liệu bạn có:{" "}
          <b>{safeArray(results?.input_ingredients).join(", ") || "—"}</b>
        </div>
      </div>

      {list.length === 0 ? (
        <Alert variant="warning" style={{ borderRadius: 12 }}>
          Không tìm thấy món phù hợp. Hãy thử:
          <ul className="mb-0 mt-2">
            <li>Nhập ít nguyên liệu hơn (VD: “thịt”, “rau”, “cá”).</li>
            <li>Kiểm tra chính tả / thêm dấu phẩy để tách đúng nguyên liệu.</li>
            <li>Bổ sung dataset món ăn trong <code>data/dishes.json</code>.</li>
          </ul>
        </Alert>
      ) : (
        <Row>
          {list.map((dish) => (
            <Col lg={6} className="mb-3" key={dish?.id || dish?.name}>
              <PantryCard dish={dish} />
            </Col>
          ))}
        </Row>
      )}

      {shopping.length > 0 && (
        <Card className="mt-3" style={{ borderRadius: 14, border: "1px solid #e9ecef" }}>
          <Card.Body>
            <h5 className="mb-2" style={{ fontWeight: 800 }}>
              <ShoppingCart className="me-2" size={18} />
              Danh sách đi chợ (tổng hợp phần thiếu)
            </h5>
            <div style={{ fontSize: 14 }}>{shopping.join(", ")}</div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

/**
 * PHẦN NÀY bạn cần chỉnh cho khớp cấu trúc "results" cũ của bạn (theo triệu chứng).
 * Mình để một renderer mặc định "an toàn" để không crash.
 */
function renderSymptomMode(results) {
  // Bạn có thể thay logic này bằng renderer cũ của bạn
  // Ví dụ: results.recommendations, results.analysis, results.warnings...
  const recs =
    safeArray(results?.recommendations) ||
    safeArray(results?.results) ||
    safeArray(results?.data);

  if (!recs.length) {
    return (
      <Alert variant="info" style={{ borderRadius: 12 }}>
        <Info className="me-2" size={16} />
        Không có dữ liệu kết quả để hiển thị (triệu chứng). Kiểm tra response từ backend.
      </Alert>
    );
  }

  return (
    <div>
      <h3 style={{ color: "#28a745", fontWeight: "bold" }}>
        <Info className="me-2" size={20} />
        Kết quả tư vấn theo triệu chứng
      </h3>

      <Row className="mt-3">
        {recs.map((r, idx) => (
          <Col lg={6} className="mb-3" key={r?.id || r?.name || idx}>
            <Card style={{ borderRadius: 14, border: "1px solid #e9ecef" }}>
              <Card.Body>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{r?.name || "Món ăn"}</div>
                {r?.match_score != null && (
                  <div className="text-muted mt-1">
                    Độ phù hợp: <b>{Math.round(r.match_score * 100)}%</b>
                  </div>
                )}
                {r?.reason && (
                  <>
                    <hr />
                    <div className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>
                      Lý do
                    </div>
                    <div style={{ fontSize: 14 }}>{r.reason}</div>
                  </>
                )}
                {safeArray(r?.effects).length > 0 && (
                  <>
                    <hr />
                    <div className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>
                      Công dụng
                    </div>
                    <div style={{ fontSize: 14 }}>{safeArray(r.effects).join(", ")}</div>
                  </>
                )}
                {safeArray(r?.safety_warnings).length > 0 && (
                  <Alert variant="warning" className="mt-3" style={{ borderRadius: 12 }}>
                    ⚠ {safeArray(r.safety_warnings)[0]}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default function ResultsDisplay({ results }) {
  if (!results) return null;

  // mode pantry mới
  if (results?.mode === "pantry") {
    return renderPantryMode(results);
  }

  // fallback cho mode cũ (triệu chứng)
  return renderSymptomMode(results);
}
