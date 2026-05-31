import json
import os
import pickle
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import tensorflow as tf
from fastapi import FastAPI
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "career_model.keras"
LABEL_PATH = MODEL_DIR / "label_encode.pkl"
FALLBACK_LABELS_PATH = BASE_DIR / "labels.json"

MAX_TOKENS = 10000
MAX_LEN = 100
EMBEDDING_DIM = 64

app = FastAPI(title="CAREVO TensorFlow AI Service", version="2.0.0")

model: Optional[tf.keras.Model] = None
label_encoder = None
labels: List[str] = []
load_error: str = ""

# Mapping label dari model user ke title dashboard dan path karier.
PROFILE_TITLES = {
    "Administrasi": "Administrative Specialist",
    "Bisnis": "Business Analyst",
    "Data & AI": "Data Science",
    "Keamanan Siber": "Cyber Security Analyst",
    "Kreatif & Desain": "UI/UX Designer",
    "Pemasaran": "Digital Marketing",
    "Pendidikan": "Education Specialist",
    "Rekayasa Perangkat Lunak": "Software Engineer",
}

TOP_PATHS = {
    "Administrasi": ["Administrative Officer", "Office Coordinator", "Operations Admin", "Executive Assistant"],
    "Bisnis": ["Business Analyst", "Product Manager", "Project Manager", "Operations Analyst"],
    "Data & AI": ["Data Scientist", "Data Analyst", "Machine Learning Engineer", "Business Intelligence Analyst"],
    "Keamanan Siber": ["Cyber Security Analyst", "SOC Analyst", "Security Engineer", "IT Risk Analyst"],
    "Kreatif & Desain": ["UI Designer", "UX Researcher", "Product Designer", "Visual Designer"],
    "Pemasaran": ["Digital Marketing Specialist", "SEO Specialist", "Content Strategist", "Social Media Specialist"],
    "Pendidikan": ["Instructional Designer", "Teacher", "Training Specialist", "Education Consultant"],
    "Rekayasa Perangkat Lunak": ["Fullstack Developer", "Backend Developer", "Frontend Developer", "Software Engineer"],
}

KEYWORDS = {
    "Administrasi": ["administrasi", "admin", "office", "document", "arsip", "excel", "data entry", "report"],
    "Bisnis": ["bisnis", "business", "management", "manager", "strategy", "product", "project", "finance", "operations", "sales"],
    "Data & AI": ["python", "sql", "data", "ai", "machine learning", "tensorflow", "pandas", "analytics", "analysis", "dashboard", "visualization", "statistics"],
    "Keamanan Siber": ["security", "cyber", "network", "penetration", "firewall", "soc", "malware", "risk", "linux"],
    "Kreatif & Desain": ["design", "ui", "ux", "figma", "prototype", "wireframe", "visual", "creative", "photoshop", "illustrator"],
    "Pemasaran": ["marketing", "seo", "content", "social media", "campaign", "ads", "brand", "copywriting", "market"],
    "Pendidikan": ["teaching", "teacher", "education", "training", "curriculum", "learning", "mentor", "classroom"],
    "Rekayasa Perangkat Lunak": ["react", "node", "express", "javascript", "frontend", "backend", "fullstack", "api", "html", "css", "programming", "software"],
}


def clean_text(text: Any) -> str:
    text = str(text or "").lower()
    text = re.sub(r"[^a-zA-Z0-9&+./# ]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


@tf.keras.utils.register_keras_serializable()
class AttentionLayer(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def build(self, input_shape):
        self.W = self.add_weight(
            name="attention_weight",
            shape=(input_shape[-1], 1),
            initializer="random_normal",
            trainable=True,
        )
        super().build(input_shape)

    def call(self, inputs):
        score = tf.matmul(inputs, self.W)
        weights = tf.nn.softmax(score, axis=1)
        context = weights * inputs
        context = tf.reduce_sum(context, axis=1)
        return context

    def get_config(self):
        return super().get_config()


@tf.keras.utils.register_keras_serializable()
class CareerModel(tf.keras.Model):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        class_count = max(1, len(labels) or 8)
        self.vectorizer = tf.keras.layers.TextVectorization(
            max_tokens=MAX_TOKENS,
            output_mode="int",
            output_sequence_length=MAX_LEN,
            name="vectorizer",
        )
        self.embedding = tf.keras.layers.Embedding(MAX_TOKENS, EMBEDDING_DIM, mask_zero=True)
        self.bigru = tf.keras.layers.Bidirectional(
            tf.keras.layers.GRU(64, return_sequences=True, dropout=0.3)
        )
        self.attention = AttentionLayer()
        self.dense = tf.keras.layers.Dense(128, activation="relu")
        self.dropout = tf.keras.layers.Dropout(0.5)
        self.output_layer = tf.keras.layers.Dense(class_count, activation="softmax")

    def call(self, inputs, training=False):
        x = self.vectorizer(inputs)
        x = self.embedding(x)
        x = self.bigru(x, training=training)
        x = self.attention(x)
        x = self.dense(x)
        x = self.dropout(x, training=training)
        return self.output_layer(x)

    def get_config(self):
        return super().get_config()


class PredictRequest(BaseModel):
    text: str = ""
    cvData: Dict[str, Any] = {}


def add_value(parts: List[str], value: Any) -> None:
    if value is None:
        return
    if isinstance(value, (str, int, float)):
        text = str(value).strip()
        if text:
            parts.append(text)
        return
    if isinstance(value, list):
        for item in value:
            add_value(parts, item)
        return
    if isinstance(value, dict):
        keys = [
            "fullName", "careerInterest", "professionalTitle", "shortBio", "location", "phone", "email",
            "name", "category", "level", "proficiency", "language", "usageFrequency",
            "jobTitle", "companyName", "employmentType", "description", "skillsUsed",
            "institutionName", "degreeMajor", "gpa",
            "title", "role", "status",
            "certificateName", "issuer",
        ]
        for key in keys:
            add_value(parts, value.get(key))


def collect_text_from_cv(cv_data: Dict[str, Any]) -> str:
    parts: List[str] = []
    add_value(parts, cv_data.get("personalInfo") or cv_data.get("profile"))
    add_value(parts, cv_data.get("skills") or cv_data.get("skillList"))
    add_value(parts, cv_data.get("experiences"))
    add_value(parts, cv_data.get("educations"))
    add_value(parts, cv_data.get("projects") or cv_data.get("projectList"))
    add_value(parts, cv_data.get("certifications") or cv_data.get("certificationList"))
    add_value(parts, cv_data.get("languages") or cv_data.get("languageList"))
    return clean_text(" ".join(parts))


def keyword_score(text: str, label: str) -> Dict[str, Any]:
    lower = text.lower()
    matched = [word for word in KEYWORDS.get(label, []) if word in lower]
    score = min(0.98, 0.18 + len(matched) * 0.11)
    return {"matchedKeywords": matched, "score": score}


def fallback_predict(text: str) -> Dict[str, Any]:
    source_labels = labels or list(PROFILE_TITLES.keys())
    ranked = []
    for label in source_labels:
        item = keyword_score(text, label)
        ranked.append({
            "category": label,
            "rawScore": item["score"],
            "matchedKeywords": item["matchedKeywords"],
        })
    ranked.sort(key=lambda item: item["rawScore"], reverse=True)
    return {"ranked": ranked, "engine": "tensorflow-fallback-keyword"}


def model_predict(text: str) -> Dict[str, Any]:
    if model is None or label_encoder is None:
        return fallback_predict(text)

    cleaned = clean_text(text)
    pred = model(tf.constant([cleaned]), training=False).numpy()[0]
    class_labels = list(label_encoder.classes_)
    ranked = []
    for index, label in enumerate(class_labels):
        score = float(pred[index]) if index < len(pred) else 0.0
        kws = keyword_score(cleaned, label)["matchedKeywords"]
        ranked.append({
            "category": str(label),
            "rawScore": score,
            "matchedKeywords": kws,
        })
    ranked.sort(key=lambda item: item["rawScore"], reverse=True)
    return {"ranked": ranked, "engine": "tensorflow-uploaded-career_model.keras"}


@app.on_event("startup")
def load_assets():
    global model, label_encoder, labels, load_error
    load_error = ""

    try:
        if LABEL_PATH.exists():
            with open(LABEL_PATH, "rb") as file:
                label_encoder = pickle.load(file)
            labels = [str(item) for item in label_encoder.classes_]
        elif FALLBACK_LABELS_PATH.exists():
            labels = json.loads(FALLBACK_LABELS_PATH.read_text(encoding="utf-8"))
        else:
            labels = list(PROFILE_TITLES.keys())

        if MODEL_PATH.exists():
            custom_objects = {"AttentionLayer": AttentionLayer, "CareerModel": CareerModel}
            model = tf.keras.models.load_model(MODEL_PATH, custom_objects=custom_objects, compile=False)
        else:
            load_error = f"Model file tidak ditemukan: {MODEL_PATH}"
    except Exception as exc:  # service tetap hidup agar backend tidak crash
        model = None
        load_error = str(exc)


@app.get("/health")
def health():
    return {
        "success": True,
        "message": "CAREVO TensorFlow AI Service aktif.",
        "modelLoaded": model is not None,
        "labelLoaded": label_encoder is not None,
        "labels": labels,
        "modelPath": str(MODEL_PATH),
        "loadError": load_error,
    }


@app.post("/predict-career")
def predict_career(payload: PredictRequest):
    text = clean_text((payload.text or "") + " " + collect_text_from_cv(payload.cvData or {}))
    if not text:
        text = "general profile"

    result = model_predict(text)
    ranked = result["ranked"]
    best = ranked[0] if ranked else {"category": "Bisnis", "rawScore": 0.45, "matchedKeywords": []}
    category = best["category"]

    # Gabungkan confidence model + keyword supaya score dashboard tetap masuk akal.
    raw = float(best.get("rawScore") or 0)
    keyword_boost = min(0.18, len(best.get("matchedKeywords") or []) * 0.025)
    match_score = int(round(max(0.52, min(0.98, raw + keyword_boost)) * 100))

    paths = TOP_PATHS.get(category, [category])
    top_paths = [
        {"name": path, "score": max(50, match_score - index * 4)}
        for index, path in enumerate(paths)
    ]

    return {
        "recommendedCategory": category,
        "profileTitle": PROFILE_TITLES.get(category, category),
        "confidence": round(match_score / 100, 2),
        "matchScore": match_score,
        "level": "ELITE PROFILE" if match_score >= 85 else "STRONG PROFILE" if match_score >= 70 else "GROWING PROFILE",
        "topPathMatches": top_paths,
        "matchedKeywords": best.get("matchedKeywords", []),
        "reason": f"TensorFlow membaca data form/dashboard dan menemukan kecocokan paling kuat ke {category}.",
        "suggestions": [
            f"Perkuat project dan pengalaman yang berhubungan dengan {category}.",
            "Tambahkan skill yang relevan agar score AI lebih tinggi.",
            "Rapikan deskripsi profile agar CV lebih sesuai dengan rekomendasi AI.",
        ],
        "rankedCategories": [
            {
                "category": item["category"],
                "rawScore": item["rawScore"],
                "match": int(round(max(0.35, min(0.98, float(item["rawScore"]))) * 100)),
                "matchedKeywords": item.get("matchedKeywords", []),
            }
            for item in ranked
        ],
        "engine": result["engine"],
        "modelLoaded": model is not None,
    }
