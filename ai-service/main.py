import os
os.environ["TF_USE_LEGACY_KERAS"] = "1"

import json
import pickle
import re
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import tensorflow as tf
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel

try:
    from docx import Document
    from docx.shared import Pt
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml.ns import qn
except Exception:
    Document = None

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "career_model.keras"
LABEL_PATH = MODEL_DIR / "label_encode.pkl"
FALLBACK_LABELS_PATH = BASE_DIR / "labels.json"

MAX_TOKENS = 10000
MAX_LEN = 100
EMBEDDING_DIM = 64

app = FastAPI(title="CareVo AI API", version="0.1.0")

model: Optional[tf.keras.Model] = None
label_encoder = None
labels: List[str] = []
load_error = ""

PROFILE_TITLES = {
    "Administrasi": "Administrative Specialist",
    "Bisnis": "Business & HR Specialist",
    "Data & AI": "Data Science",
    "Keamanan Siber": "Cyber Security Analyst",
    "Kreatif & Desain": "UI/UX Designer",
    "Pemasaran": "Digital Marketing Specialist",
    "Pendidikan": "Education Specialist",
    "Rekayasa Perangkat Lunak": "Software Engineer",
}

TOP_PATHS = {
    "Administrasi": ["Administrative Officer", "Office Coordinator", "Data Entry Specialist"],
    "Bisnis": ["Human Resource Staff", "Business Analyst", "Project Coordinator"],
    "Data & AI": ["Data Scientist", "Data Analyst", "Machine Learning Engineer"],
    "Keamanan Siber": ["Cyber Security Analyst", "SOC Analyst", "Security Engineer"],
    "Kreatif & Desain": ["UI/UX Designer", "Product Designer", "Visual Designer"],
    "Pemasaran": ["Digital Marketing Specialist", "SEO Specialist", "Content Strategist"],
    "Pendidikan": ["Teacher", "Instructional Designer", "Education Consultant"],
    "Rekayasa Perangkat Lunak": ["Software Engineer", "Fullstack Developer", "Backend Developer"],
}

KEYWORDS = {
    "Administrasi": ["administrasi", "admin", "data entry", "scheduling", "microsoft excel", "microsoft word", "laporan", "office", "dokumen"],
    "Bisnis": ["human resource", "hr", "sumber daya manusia", "recruitment", "rekrutmen", "employee", "karyawan", "people management", "candidate screening", "interview", "hr administration", "administrasi karyawan", "business", "bisnis", "management", "project management", "strategy", "leadership", "communication", "sales"],
    "Data & AI": ["python", "sql", "data", "data analysis", "machine learning", "tensorflow", "statistik", "statistics", "analytics", "dashboard", "pandas"],
    "Keamanan Siber": ["cyber", "security", "network security", "penetration testing", "ethical hacking", "firewall", "malware", "linux"],
    "Kreatif & Desain": ["design", "desain", "ui", "ux", "figma", "wireframe", "wireframing", "prototype", "photoshop", "illustrator"],
    "Pemasaran": ["marketing", "pemasaran", "digital marketing", "content strategy", "seo", "sem", "campaign", "google analytics", "brand"],
    "Pendidikan": ["teaching", "mentoring", "pendidikan", "kurikulum", "public speaking", "kelas", "teacher", "training"],
    "Rekayasa Perangkat Lunak": ["software", "backend", "frontend", "java", "spring boot", "microservices", "docker", "react", "node", "api", "programming"],
}


# Rule prioritas untuk demo/production ringan.
# Ini menjaga agar input Human Resource tidak salah masuk Software hanya karena jurusan Teknik Informatika.
HR_KEYWORDS = [
    "human resource", "hr", "sumber daya manusia", "recruitment", "rekrutmen",
    "recruiter", "employee", "karyawan", "people management", "candidate screening",
    "interview", "wawancara", "hr administration", "administrasi karyawan",
]

STRONG_SOFTWARE_KEYWORDS = [
    "frontend", "backend", "fullstack", "javascript", "typescript", "react", "node",
    "express", "rest api", "coding", "programming", "docker", "software engineer",
    "software engineering",
]


def contains_any(text: str, keywords: List[str]) -> bool:
    return any(keyword in text for keyword in keywords)


def rule_based_override(text: str) -> Optional[Dict[str, Any]]:
    cleaned = clean_text(text)
    has_hr = contains_any(cleaned, HR_KEYWORDS)
    has_software = contains_any(cleaned, STRONG_SOFTWARE_KEYWORDS)

    if has_hr and not has_software:
        category = "Bisnis"
        paths = TOP_PATHS.get(category, [category])
        top_paths = [{"name": path, "score": max(55, 95 - index * 4)} for index, path in enumerate(paths[:3])]
        return {
            "success": True,
            "prediction": category,
            "recommendedCategory": category,
            "profileTitle": "Business & HR Specialist",
            "confidence": 0.95,
            "matchScore": 95,
            "level": "ELITE PROFILE",
            "topPathMatches": top_paths,
            "recommendedCareers": [item["name"] for item in top_paths],
            "matchedKeywords": [keyword for keyword in HR_KEYWORDS if keyword in cleaned],
            "reason": "Input lebih dominan Human Resource/HR, sehingga sistem memprioritaskan kategori Bisnis.",
            "suggestions": [
                "Perkuat pengalaman recruitment, employee administration, interview, dan people management.",
                "Tambahkan project atau kegiatan organisasi yang berkaitan dengan HR.",
                "Rapikan deskripsi profile dan experience agar CV lebih kuat untuk posisi HR.",
            ],
            "rankedCategories": [
                {"category": "Bisnis", "rawScore": 0.95, "match": 95, "matchedKeywords": [keyword for keyword in HR_KEYWORDS if keyword in cleaned]},
                {"category": "Rekayasa Perangkat Lunak", "rawScore": 0.12, "match": 35, "matchedKeywords": []},
            ],
            "engine": "rule-based-hr-override",
            "modelLoaded": model is not None,
        }

    return None


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
        self.vectorizer = tf.keras.layers.TextVectorization(max_tokens=MAX_TOKENS, output_mode="int", output_sequence_length=MAX_LEN)
        self.embedding = tf.keras.layers.Embedding(MAX_TOKENS, EMBEDDING_DIM, mask_zero=True)
        self.bigru = tf.keras.layers.Bidirectional(tf.keras.layers.GRU(64, return_sequences=True, dropout=0.3))
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


class CareerRequest(BaseModel):
    skills_text: str


class PredictCareerRequest(BaseModel):
    text: str = ""
    cvData: Dict[str, Any] = {}


class GenerateCvRequest(BaseModel):
    name: str = "CAREVO USER"
    phone: str = ""
    email: str = ""
    linkedin: str = ""
    portfolio: str = ""
    location: str = ""
    professional_summary: str = ""
    education: List[Dict[str, Any]] = []
    experiences: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    certifications: List[str] = []
    achievements: List[str] = []
    skills: str = ""
    languages: str = ""
    career_group: str = ""
    recommended_careers: List[str] = []


def add_value(parts: List[str], value: Any) -> None:
    if value is None:
        return
    if isinstance(value, (str, int, float)):
        value = str(value).strip()
        if value:
            parts.append(value)
        return
    if isinstance(value, list):
        for item in value:
            add_value(parts, item)
        return
    if isinstance(value, dict):
        for key in [
            "fullName", "careerInterest", "professionalTitle", "shortBio", "location", "name", "category", "level",
            "proficiency", "language", "jobTitle", "companyName", "employmentType", "description", "skillsUsed",
            "institutionName", "degreeMajor", "gpa", "title", "role", "status", "certificateName", "issuer",
        ]:
            add_value(parts, value.get(key))


def collect_text_from_cv(cv_data: Dict[str, Any]) -> str:
    parts: List[str] = []
    for key in ["personalInfo", "profile", "skills", "skillList", "experiences", "educations", "projects", "projectList", "certifications", "certificationList", "languages", "languageList"]:
        add_value(parts, cv_data.get(key))
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
        ranked.append({"category": label, "rawScore": item["score"], "matchedKeywords": item["matchedKeywords"]})
    ranked.sort(key=lambda item: item["rawScore"], reverse=True)
    return {"ranked": ranked, "engine": "keyword-fallback"}


def model_predict(text: str) -> Dict[str, Any]:
    cleaned = clean_text(text)
    if model is None or label_encoder is None:
        return fallback_predict(cleaned)
    try:
        pred = model(tf.constant([cleaned]), training=False).numpy()[0]
        class_labels = [str(item) for item in label_encoder.classes_]
        ranked = []
        for index, label in enumerate(class_labels):
            score = float(pred[index]) if index < len(pred) else 0.0
            kws = keyword_score(cleaned, label)["matchedKeywords"]
            ranked.append({"category": label, "rawScore": score, "matchedKeywords": kws})
        ranked.sort(key=lambda item: item["rawScore"], reverse=True)
        return {"ranked": ranked, "engine": "tensorflow-career_model.keras"}
    except Exception as exc:
        fallback = fallback_predict(cleaned)
        fallback["engine"] = f"tensorflow-error-fallback: {exc}"
        return fallback


def normalize_result(text: str) -> Dict[str, Any]:
    if not clean_text(text):
        text = "general profile"

    override = rule_based_override(text)
    if override is not None:
        return override

    result = model_predict(text)
    ranked = result.get("ranked", [])
    best = ranked[0] if ranked else {"category": "Bisnis", "rawScore": 0.45, "matchedKeywords": []}
    category = best.get("category", "Bisnis")
    raw = float(best.get("rawScore") or 0)
    keyword_boost = min(0.18, len(best.get("matchedKeywords") or []) * 0.025)
    match_score = int(round(max(0.52, min(0.98, raw + keyword_boost)) * 100))
    paths = TOP_PATHS.get(category, [category])
    top_paths = [{"name": path, "score": max(50, match_score - index * 4)} for index, path in enumerate(paths[:3])]

    return {
        "success": True,
        "prediction": category,
        "recommendedCategory": category,
        "profileTitle": PROFILE_TITLES.get(category, category),
        "confidence": round(match_score / 100, 2),
        "matchScore": match_score,
        "level": "ELITE PROFILE" if match_score >= 85 else "STRONG PROFILE" if match_score >= 70 else "GROWING PROFILE",
        "topPathMatches": top_paths,
        "recommendedCareers": [item["name"] for item in top_paths],
        "matchedKeywords": best.get("matchedKeywords", []),
        "reason": f"AI membaca data user dan menemukan kecocokan paling kuat ke {category}.",
        "suggestions": [
            f"Perkuat project dan pengalaman yang berhubungan dengan {category}.",
            "Tambahkan skill yang relevan agar score AI lebih tinggi.",
            "Rapikan deskripsi profile agar CV lebih sesuai dengan rekomendasi AI.",
        ],
        "rankedCategories": [
            {
                "category": item["category"],
                "rawScore": item.get("rawScore", 0),
                "match": int(round(max(0.35, min(0.98, float(item.get("rawScore", 0)))) * 100)),
                "matchedKeywords": item.get("matchedKeywords", []),
            }
            for item in ranked
        ],
        "engine": result.get("engine"),
        "modelLoaded": model is not None,
    }


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
    except Exception as exc:
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


@app.post("/predict")
def predict(payload: CareerRequest):
    return normalize_result(payload.skills_text)


@app.post("/predict-career")
def predict_career(payload: PredictCareerRequest):
    text = clean_text((payload.text or "") + " " + collect_text_from_cv(payload.cvData or {}))
    return normalize_result(text)


def add_section_title(doc, title: str):
    p = doc.add_paragraph()
    run = p.add_run(title.upper())
    run.bold = True
    run.font.size = Pt(13)
    return p


def add_bullet(doc, text: str):
    p = doc.add_paragraph(style="List Bullet")
    run = p.add_run(str(text or ""))
    run.font.size = Pt(10)
    return p


@app.post("/generate-ats-cv")
def generate_ats_cv(payload: GenerateCvRequest):
    if Document is None:
        return {"success": False, "message": "python-docx belum terinstall. Jalankan: pip install python-docx"}

    doc = Document()
    style = doc.styles["Normal"]
    style.font.name = "Times New Roman"
    style._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")
    style.font.size = Pt(11)

    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run(str(payload.name or "CAREVO USER").upper())
    run.bold = True
    run.font.size = Pt(20)

    contact = doc.add_paragraph()
    contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    contact.add_run(" | ".join([x for x in [payload.phone, payload.email, payload.linkedin, payload.portfolio] if x]))

    location_para = doc.add_paragraph()
    location_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    location_para.add_run(payload.location or "")

    add_section_title(doc, "Professional Summary")
    doc.add_paragraph(payload.professional_summary or "")

    add_section_title(doc, "Education")
    for edu in payload.education:
        p = doc.add_paragraph()
        p.add_run(str(edu.get("university") or edu.get("institutionName") or "Institution")).bold = True
        if edu.get("location"):
            p.add_run(f" | {edu.get('location')}")
        degree = doc.add_paragraph()
        degree_run = degree.add_run(f"{edu.get('degree') or edu.get('degreeMajor') or ''} | GPA: {edu.get('gpa', '')} | {edu.get('year', '')}")
        degree_run.italic = True
        for item in edu.get("details", []):
            add_bullet(doc, item)

    add_section_title(doc, "Work Experience")
    for exp in payload.experiences:
        p = doc.add_paragraph()
        p.add_run(str(exp.get("company") or exp.get("companyName") or "Company")).bold = True
        if exp.get("location"):
            p.add_run(f" | {exp.get('location')}")
        role = doc.add_paragraph()
        role_run = role.add_run(f"{exp.get('position') or exp.get('jobTitle') or ''} | {exp.get('period', '')}")
        role_run.italic = True
        for item in exp.get("responsibilities", []) or [exp.get("description", "")]:
            if item:
                add_bullet(doc, item)

    add_section_title(doc, "Projects")
    for project in payload.projects:
        p = doc.add_paragraph()
        p.add_run(str(project.get("title") or "Project")).bold = True
        doc.add_paragraph(str(project.get("description") or ""))
        for item in project.get("details", []):
            add_bullet(doc, item)

    add_section_title(doc, "Certifications")
    for cert in payload.certifications:
        add_bullet(doc, cert)

    add_section_title(doc, "Achievements")
    for ach in payload.achievements:
        add_bullet(doc, ach)

    add_section_title(doc, "Skills")
    doc.add_paragraph(payload.skills or "")

    add_section_title(doc, "Languages")
    doc.add_paragraph(payload.languages or "")

    # AI Match sengaja tidak dimasukkan ke CV agar CV tetap ATS-friendly.

    out = tempfile.NamedTemporaryFile(delete=False, suffix=".docx")
    out.close()
    doc.save(out.name)
    return FileResponse(out.name, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", filename="CAREVO_AI_ATS_CV.docx")
