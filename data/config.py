import os
from pathlib import Path

# Đường dẫn thư mục
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
SRC_DIR = BASE_DIR / "src"
MODELS_DIR = SRC_DIR / "models"
STATIC_DIR = BASE_DIR / "static"
UPLOAD_DIR = STATIC_DIR / "uploads"

# Tạo thư mục nếu chưa tồn tại
for directory in [DATA_DIR, MODELS_DIR, STATIC_DIR, UPLOAD_DIR]:
    directory.mkdir(exist_ok=True, parents=True)

# Cấu hình file dữ liệu
KNOWLEDGE_BASE = DATA_DIR / "knowledge_base.json"
FUZZY_RULES = DATA_DIR / "fuzzy_rules.json"
SAFETY_RULES = DATA_DIR / "safety_rules.json"
SYMPTOMS_ONTOLOGY = DATA_DIR / "symptoms_ontology.json"
TONGUE_ANALYSIS = DATA_DIR / "tongue_image_samples.json"
MEDICAL_TERMS = DATA_DIR / "medical_terms.json"
MEAL_PLANS = DATA_DIR / "meal_plans.json"

# Cấu hình model
TONGUE_MODEL_PATH = MODELS_DIR / "tongue_classifier.h5"
SYMPTOM_NER_MODEL_PATH = MODELS_DIR / "symptom_ner_model"

# Cấu hình hệ thống
SYSTEM_CONFIG = {
    "max_recommendations": 10,
    "diversity_factor": 0.3,
    "min_match_score": 0.1,
    "safety_threshold": 0.7,
    "cache_enabled": True,
    "debug_mode": False,
    "log_level": "INFO"
}

# Cấu hình Fuzzy System
FUZZY_CONFIG = {
    "defuzz_method": "centroid",
    "and_method": "min",
    "or_method": "max",
    "implication_method": "min",
    "aggregation_method": "max"
}

# Cấu hình Image Processing
IMAGE_CONFIG = {
    "tongue_image_size": (128, 128),
    "face_detection_confidence": 0.5,
    "color_space": "HSV",
    "feature_extraction": True,
    "save_processed_images": False
}

# Cấu hình PDF Processing
PDF_CONFIG = {
    "extract_tables": True,
    "ocr_enabled": False,
    "language": "vie",
    "medical_term_recognition": True
}

# Cấu hình Web API
API_CONFIG = {
    "host": "0.0.0.0",
    "port": 5000,
    "debug": True,
    "cors_enabled": True,
    "rate_limit": "100/hour",
    "upload_max_size": 16 * 1024 * 1024  # 16MB
}

# Cấu hình logging
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        },
        "detailed": {
            "format": "%(asctime)s [%(levelname)s] %(name)s:%(lineno)d: %(message)s"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "level": "INFO"
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": BASE_DIR / "logs" / "system.log",
            "formatter": "detailed",
            "level": "DEBUG"
        }
    },
    "loggers": {
        "": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": True
        },
        "src": {
            "handlers": ["console", "file"],
            "level": "DEBUG",
            "propagate": False
        }
    }
}

# Kiểm tra file tồn tại
def check_data_files():
    """Kiểm tra sự tồn tại của các file dữ liệu quan trọng"""
    required_files = [
        KNOWLEDGE_BASE,
        FUZZY_RULES,
        SAFETY_RULES,
        SYMPTOMS_ONTOLOGY
    ]
    
    missing_files = []
    for file_path in required_files:
        if not file_path.exists():
            missing_files.append(file_path.name)
    
    if missing_files:
        print(f"⚠️ Cảnh báo: Thiếu các file dữ liệu: {', '.join(missing_files)}")
        return False
    
    return True

# Tạo file mẫu nếu cần
def create_sample_files():
    """Tạo file mẫu nếu không tồn tại"""
    sample_data = {
        "dishes": [
            {
                "id": 1,
                "name": "Cháo gà gừng mẫu",
                "description": "Món ăn mẫu",
                "ingredients": ["gà", "gừng"],
                "yin_yang_property": "ôn",
                "health_benefits": ["tán hàn"],
                "match_score": 0.0
            }
        ]
    }
    
    if not KNOWLEDGE_BASE.exists():
        import json
        with open(KNOWLEDGE_BASE, 'w', encoding='utf-8') as f:
            json.dump(sample_data, f, ensure_ascii=False, indent=2)
        print(f"✅ Đã tạo file mẫu: {KNOWLEDGE_BASE.name}")
    
    # Tạo các file mẫu khác nếu cần...