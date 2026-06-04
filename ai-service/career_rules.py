import re
from typing import Any, Dict, List, Tuple


def clean_text(text: Any = "") -> str:
    text = str(text or "").lower()
    text = re.sub(r"[^a-zA-Z0-9&+./#\- ]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def keyword_hit(text: str, keyword: str) -> bool:
    t = clean_text(text)
    k = clean_text(keyword)
    if not k:
        return False
    if len(k) <= 3 or k in ["ai", "hr", "ui", "ux", "qa", "it", "r"]:
        return re.search(rf"(^|\s){re.escape(k)}(\s|$)", t) is not None
    return k in t


def has_any(text: str, keywords: List[str]) -> bool:
    return any(keyword_hit(text, kw) for kw in keywords)


CORE_CATEGORIES: Dict[str, Dict[str, Any]] = {
    "Administrasi": {
        "profileTitle": "Administrative Specialist",
        "paths": ["Administrative Officer", "Office Coordinator", "Data Entry Specialist"],
        "keywords": {
            "administrasi": 8, "administration": 8, "administrative": 7, "admin": 5,
            "data entry": 9, "arsip": 8, "archive": 7, "filing": 6,
            "scheduling": 6, "penjadwalan": 6, "document management": 9, "manajemen dokumen": 9,
            "microsoft office": 5, "microsoft excel": 5, "excel": 4, "microsoft word": 4,
            "laporan": 4, "customer service": 4, "pelayanan pelanggan": 4,
            "surat": 4, "dokumen": 4, "receptionist": 5, "resepsionis": 5,
        },
    },
    "Bisnis": {
        "profileTitle": "Business & HR Specialist",
        "paths": ["Human Resource Staff", "Business Analyst", "Project Coordinator"],
        "keywords": {
            "bisnis": 5, "business": 5, "management": 5, "manajemen": 5,
            "business analysis": 9, "business analyst": 9, "analisis bisnis": 9,
            "project management": 8, "manajemen proyek": 8, "finance": 6, "keuangan": 6,
            "accounting": 8, "akuntansi": 8, "audit": 7, "tax": 7, "pajak": 7,
            "entrepreneur": 6, "wirausaha": 6, "usaha": 4,
            "human resource": 12, "human resources": 12, "sumber daya manusia": 12,
            "hr": 8, "hrd": 9, "recruitment": 11, "rekrutmen": 11, "recruiter": 9,
            "candidate screening": 10, "screening kandidat": 10, "interview candidate": 9,
            "interview": 5, "wawancara": 5, "employee administration": 10, "administrasi karyawan": 10,
            "employee": 7, "karyawan": 7, "people management": 9, "talent acquisition": 9,
            "payroll": 7, "onboarding": 7, "leadership": 3, "communication": 2, "komunikasi": 2,
        },
    },
    "Data & AI": {
        "profileTitle": "Data Science",
        "paths": ["Data Scientist", "Data Analyst", "Machine Learning Engineer"],
        "keywords": {
            "data analysis": 12, "analisis data": 12, "data analyst": 12,
            "data science": 13, "data scientist": 13, "machine learning": 13,
            "deep learning": 11, "artificial intelligence": 11, "ai": 5,
            "tensorflow": 10, "pytorch": 9, "python": 7, "sql": 6,
            "pandas": 8, "numpy": 8, "statistics": 7, "statistik": 7,
            "data visualization": 7, "visualisasi data": 7, "big data": 8,
            "analytics": 7, "dashboard": 4, "tableau": 6, "powerbi": 6, "power bi": 6,
        },
    },
    "Keamanan Siber": {
        "profileTitle": "Cyber Security Analyst",
        "paths": ["Cyber Security Analyst", "SOC Analyst", "Security Engineer"],
        "keywords": {
            "cybersecurity": 13, "cyber security": 13, "cyber": 8, "siber": 8,
            "keamanan siber": 13, "network security": 12, "penetration testing": 12,
            "pentest": 11, "ethical hacking": 11, "firewall": 8, "vulnerability": 8,
            "malware": 7, "linux": 5, "incident response": 8, "soc": 7,
        },
    },
    "Kreatif & Desain": {
        "profileTitle": "Creative & Design Specialist",
        "paths": ["UI/UX Designer", "Graphic Designer", "Creative Designer"],
        "keywords": {
            "ui ux": 12, "ux ui": 12, "ui/ux": 12, "ui": 4, "ux": 4,
            "figma": 11, "wireframe": 8, "prototype": 8, "graphic design": 10,
            "desain grafis": 10, "design": 5, "desain": 5, "visual communication": 8,
            "komunikasi visual": 8, "illustrator": 7, "photoshop": 7, "creative": 6, "kreatif": 6,
        },
    },
    "Pemasaran": {
        "profileTitle": "Digital Marketing Specialist",
        "paths": ["Digital Marketing Specialist", "SEO Specialist", "Content Strategist"],
        "keywords": {
            "digital marketing": 13, "marketing": 10, "pemasaran": 10,
            "seo": 9, "sem": 8, "social media marketing": 9, "content strategy": 8,
            "campaign": 7, "kampanye": 7, "google analytics": 7,
            "copywriting": 7, "advertising": 6, "iklan": 6, "sales": 6, "penjualan": 6,
        },
    },
    "Pendidikan": {
        "profileTitle": "Education Specialist",
        "paths": ["Teacher", "Mentor", "Education Consultant"],
        "keywords": {
            "teaching": 11, "mengajar": 11, "teacher": 10, "guru": 10,
            "education": 10, "pendidikan": 10, "mentoring": 8, "mentor": 8,
            "curriculum": 9, "kurikulum": 9, "classroom management": 8,
            "educational assessment": 9, "assessment": 4, "training": 6,
            "tutor": 8, "pembelajaran": 7, "kelas": 5, "counseling": 7, "konseling": 7,
            "psikologi": 5, "psychology": 5,
        },
    },
    "Rekayasa Perangkat Lunak": {
        "profileTitle": "Software Engineer",
        "paths": ["Software Engineer", "Frontend Developer", "Backend Developer"],
        "keywords": {
            "software engineering": 13, "software engineer": 13, "rekayasa perangkat lunak": 13,
            "frontend": 12, "backend": 12, "fullstack": 12, "full stack": 12,
            "web developer": 10, "programming": 10, "coding": 10, "javascript": 10,
            "typescript": 10, "react": 10, "node js": 10, "node.js": 10,
            "express": 8, "rest api": 8, "spring boot": 8, "java": 5,
            "postgresql": 5, "mysql": 5, "docker": 6, "teknik informatika": 1,
            "informatika": 1, "computer science": 1,
        },
    },
}

EXTENDED_DOMAINS: Dict[str, Dict[str, Any]] = {
    "Psikologi & Konseling": {
        "baseCategory": "Pendidikan",
        "profileTitle": "Psychology & Counseling Assistant",
        "paths": ["Counseling Assistant", "Psychology Assistant", "Educational Counselor"],
        "keywords": {
            "psikologi": 14, "psychology": 14, "counseling": 14, "konseling": 14,
            "counselor": 12, "konselor": 12, "mental health": 12, "kesehatan mental": 12,
            "psychology assessment": 14, "asesmen psikologi": 14, "behavioral observation": 10,
            "observasi perilaku": 10, "empathy": 8, "empati": 8, "active listening": 8,
            "emotional intelligence": 9, "mentoring": 7, "student assessment": 8,
        },
        "exclusiveUnlessNo": ["recruitment", "rekrutmen", "human resource", "hrd", "employee", "karyawan", "talent acquisition"],
    },
    "Psikologi Industri & HR": {
        "baseCategory": "Bisnis",
        "profileTitle": "Industrial Psychology & HR Specialist",
        "paths": ["Human Resource Staff", "Recruitment Staff", "Talent Acquisition Assistant"],
        "requiresAny": ["psikologi", "psychology", "psikologi industri", "organizational psychology", "industrial psychology"],
        "keywords": {
            "psikologi industri": 14, "organizational psychology": 14, "industrial psychology": 14,
            "human resource": 13, "hr": 8, "hrd": 9, "recruitment": 12, "rekrutmen": 12,
            "candidate screening": 11, "employee engagement": 10, "employee administration": 9,
            "people management": 9, "talent acquisition": 10, "assessment": 5,
        },
    },
    "Tata Boga & Kuliner": {
        "baseCategory": "Kreatif & Desain",
        "profileTitle": "Culinary & Food Service Specialist",
        "paths": ["Culinary Assistant", "Pastry & Bakery Assistant", "Food Product Developer"],
        "keywords": {
            "tata boga": 16, "kuliner": 14, "culinary": 14, "chef": 13, "koki": 13,
            "memasak": 12, "masak": 10, "masakan": 10, "cooking": 12,
            "pastry": 12, "bakery": 12, "baking": 12, "roti": 8, "cake": 8, "kue": 8,
            "food preparation": 10, "food service": 9, "kitchen": 8, "dapur": 8,
            "plating": 8, "recipe": 8, "resep": 8, "menu": 7, "menu planning": 8,
            "boga": 9, "sanitasi": 7, "hygiene": 7, "food product": 8,
        },
    },
    "Kesehatan & Layanan Klinis": {
        "baseCategory": "Pendidikan",
        "profileTitle": "Healthcare Support Specialist",
        "paths": ["Healthcare Assistant", "Clinical Administration Staff", "Patient Care Assistant"],
        "keywords": {
            "kesehatan": 13, "healthcare": 13, "medical": 11, "medis": 11,
            "klinis": 10, "clinical": 10, "nursing": 13, "perawat": 13, "nurse": 13,
            "patient": 8, "pasien": 8, "farmasi": 12, "pharmacy": 12,
            "nutrition": 9, "gizi": 9, "fisioterapi": 10,
        },
    },
    "Hospitality & Pariwisata": {
        "baseCategory": "Bisnis",
        "profileTitle": "Hospitality & Tourism Specialist",
        "paths": ["Hotel Front Office Staff", "Guest Relation Officer", "Tourism Staff"],
        "keywords": {
            "hospitality": 14, "hotel": 12, "pariwisata": 13, "tourism": 13,
            "travel": 9, "front office": 11, "housekeeping": 10, "guest relation": 10,
            "restaurant": 8, "restoran": 8, "fnb": 8, "food and beverage": 9,
            "reservasi": 8, "reservation": 8, "wisata": 9,
        },
    },
    "Agribisnis & Pertanian": {
        "baseCategory": "Bisnis",
        "profileTitle": "Agribusiness & Agriculture Specialist",
        "paths": ["Agribusiness Assistant", "Agriculture Field Staff", "Plantation Operations Assistant"],
        "keywords": {
            "pertanian": 14, "agriculture": 14, "agribusiness": 14, "agribisnis": 14,
            "perkebunan": 12, "plantation": 12, "sawit": 12, "tani": 10, "petani": 10,
            "tanaman": 9, "crop": 9, "soil": 8, "horticulture": 10, "hortikultura": 10,
            "peternakan": 9, "perikanan": 9,
        },
    },
    "Legal & Compliance": {
        "baseCategory": "Administrasi",
        "profileTitle": "Legal & Compliance Assistant",
        "paths": ["Legal Administrative Assistant", "Compliance Staff", "Paralegal Assistant"],
        "keywords": {
            "hukum": 14, "legal": 14, "law": 10, "paralegal": 12,
            "compliance": 11, "kontrak": 9, "contract": 9, "regulation": 8,
            "regulasi": 8, "legal drafting": 10, "legal research": 10, "perizinan": 8,
        },
    },
    "Teknik & Engineering Non-Software": {
        "baseCategory": "Rekayasa Perangkat Lunak",
        "profileTitle": "Engineering & Technical Specialist",
        "paths": ["Engineering Assistant", "Technical Staff", "Quality Control Assistant"],
        "keywords": {
            "teknik mesin": 13, "mechanical": 12, "mesin": 8,
            "teknik sipil": 13, "civil": 10, "teknik elektro": 13, "electrical": 11,
            "quality control": 10, "qc": 7, "autocad": 9, "solidworks": 9,
            "manufaktur": 10, "manufacturing": 10, "maintenance": 8, "produksi": 8,
        },
        "exclusiveUnlessNo": ["frontend", "backend", "software", "coding", "programming", "react", "node js"],
    },
    "Fashion & Beauty": {
        "baseCategory": "Kreatif & Desain",
        "profileTitle": "Fashion & Beauty Creative Specialist",
        "paths": ["Fashion Design Assistant", "Beauty Consultant", "Makeup Artist Assistant"],
        "keywords": {
            "fashion": 13, "tata busana": 14, "busana": 10, "menjahit": 10,
            "makeup": 12, "make up": 12, "beauty": 11, "kecantikan": 11,
            "skincare": 9, "kosmetik": 9, "barber": 9, "salon": 9,
        },
    },
}

ALIASES = {
    "business": "Bisnis", "bisnis": "Bisnis", "bisnis & manajemen": "Bisnis",
    "human resource": "Bisnis", "hr": "Bisnis", "hrd": "Bisnis",
    "administration": "Administrasi", "administrasi": "Administrasi", "admin": "Administrasi",
    "data": "Data & AI", "data science": "Data & AI", "data & ai": "Data & AI", "ai": "Data & AI",
    "cybersecurity": "Keamanan Siber", "cyber security": "Keamanan Siber", "keamanan siber": "Keamanan Siber",
    "design": "Kreatif & Desain", "desain": "Kreatif & Desain", "ui ux": "Kreatif & Desain", "ui/ux": "Kreatif & Desain",
    "marketing": "Pemasaran", "pemasaran": "Pemasaran", "digital marketing": "Pemasaran",
    "education": "Pendidikan", "pendidikan": "Pendidikan", "teaching": "Pendidikan",
    "software": "Rekayasa Perangkat Lunak", "software engineering": "Rekayasa Perangkat Lunak",
}

STRONG_SOFTWARE = ["frontend", "backend", "fullstack", "react", "node js", "node.js", "express", "javascript", "typescript", "coding", "programming", "software engineering", "rest api", "microservices"]
STRONG_DATA = ["machine learning", "data analysis", "analisis data", "data science", "data scientist", "data analyst", "tensorflow", "pandas", "numpy", "statistics"]
STRONG_HR = ["human resource", "human resources", "hrd", "sumber daya manusia", "recruitment", "rekrutmen", "candidate screening", "employee administration", "people management", "talent acquisition"]


def normalize_category(value: str) -> str:
    text = clean_text(value)
    if not text:
        return ""
    for domain in EXTENDED_DOMAINS:
        if clean_text(domain) == text:
            return domain
    if text in ALIASES:
        return ALIASES[text]
    for label in CORE_CATEGORIES:
        if clean_text(label) == text:
            return label
    if keyword_hit(text, "tata boga") or keyword_hit(text, "kuliner") or keyword_hit(text, "chef"):
        return "Tata Boga & Kuliner"
    if keyword_hit(text, "psikologi") or keyword_hit(text, "counseling") or keyword_hit(text, "konseling"):
        return "Pendidikan"
    if keyword_hit(text, "human resource") or keyword_hit(text, "recruitment") or keyword_hit(text, "hrd"):
        return "Bisnis"
    if keyword_hit(text, "software") or keyword_hit(text, "frontend") or keyword_hit(text, "backend"):
        return "Rekayasa Perangkat Lunak"
    if keyword_hit(text, "machine learning") or keyword_hit(text, "data") or keyword_hit(text, "ai"):
        return "Data & AI"
    if keyword_hit(text, "marketing") or keyword_hit(text, "pemasaran") or keyword_hit(text, "seo"):
        return "Pemasaran"
    return value


def score_domain(text: str, keywords: Dict[str, int]) -> Tuple[int, List[str]]:
    score = 0
    matched: List[str] = []
    for kw, weight in keywords.items():
        if keyword_hit(text, kw):
            score += int(weight)
            matched.append(kw)
    return score, matched


def core_scores(text: str) -> Dict[str, Any]:
    scores, matched = {}, {}
    for cat, config in CORE_CATEGORIES.items():
        score, hits = score_domain(text, config["keywords"])
        scores[cat] = score
        matched[cat] = hits
    if (keyword_hit(text, "teknik informatika") or keyword_hit(text, "informatika") or keyword_hit(text, "computer science")) and not has_any(text, STRONG_SOFTWARE):
        scores["Rekayasa Perangkat Lunak"] = min(scores.get("Rekayasa Perangkat Lunak", 0), 2)
    return {"scores": scores, "matched": matched}


def extended_scores(text: str) -> Dict[str, Any]:
    scores, matched = {}, {}
    for domain, config in EXTENDED_DOMAINS.items():
        allowed = True
        if config.get("requiresAny"):
            allowed = has_any(text, config["requiresAny"])
        if allowed and config.get("exclusiveUnlessNo"):
            allowed = not has_any(text, config["exclusiveUnlessNo"])
        score, hits = score_domain(text, config["keywords"])
        scores[domain] = score if allowed else 0
        matched[domain] = hits if allowed else []
    return {"scores": scores, "matched": matched}


def match_from_score(score: int) -> int:
    if score >= 42: return 98
    if score >= 34: return 96
    if score >= 26: return 93
    if score >= 18: return 89
    if score >= 12: return 82
    if score >= 8: return 74
    if score >= 4: return 64
    return 56


def best(scores: Dict[str, int]) -> Tuple[str, int]:
    return sorted(scores.items(), key=lambda item: item[1], reverse=True)[0] if scores else ("Bisnis", 0)


def config_for(category: str) -> Dict[str, Any]:
    if category in EXTENDED_DOMAINS:
        return EXTENDED_DOMAINS[category]
    return CORE_CATEGORIES.get(category, CORE_CATEGORIES["Bisnis"])


def build_recommendation(category: str, match_score: int, matched_keywords: List[str], extra: Dict[str, Any] = None) -> Dict[str, Any]:
    category = normalize_category(category) or "Bisnis"
    config = config_for(category)
    safe_score = max(52, min(98, int(match_score or 78)))
    paths = config.get("paths") or [category, "Career Specialist", "Professional Role"]
    top_paths = [{"name": path, "score": max(50, safe_score - index * 4)} for index, path in enumerate(paths[:3])]
    data = {
        "success": True,
        "prediction": category,
        "recommendedCategory": category,
        "recommended_career": category,
        "baseModelCategory": config.get("baseCategory", category),
        "base_model_category": config.get("baseCategory", category),
        "profileTitle": config.get("profileTitle", category),
        "confidence": round(safe_score / 100, 2),
        "matchScore": safe_score,
        "level": "ELITE PROFILE" if safe_score >= 85 else "STRONG PROFILE" if safe_score >= 70 else "GROWING PROFILE",
        "topPathMatches": top_paths,
        "recommendedCareers": [item["name"] for item in top_paths],
        "matchedKeywords": matched_keywords,
        "reason": f"CAREVO membaca input dan menemukan kecocokan paling kuat ke {category}.",
        "suggestions": [
            f"Tambahkan skill, pengalaman, atau project yang relevan dengan {category}.",
            "Gunakan skill spesifik bidang agar tidak tertukar oleh skill umum seperti communication/teamwork.",
            "Lengkapi education, certification, dan project agar rekomendasi makin akurat.",
        ],
    }
    if extra:
        data.update(extra)
    return data


def hybrid_recommendation(text: str, model_result: Dict[str, Any] = None, model_loaded: bool = False) -> Dict[str, Any]:
    cleaned = clean_text(text or "general profile")
    core = core_scores(cleaned)
    ext = extended_scores(cleaned)
    best_core, best_core_score = best(core["scores"])
    best_ext, best_ext_score = best(ext["scores"])

    ranked = (model_result or {}).get("ranked", [])
    ai_best = ranked[0] if ranked else {}
    ai_category = normalize_category(ai_best.get("category", ""))
    ai_conf = float(ai_best.get("rawScore") or 0)
    ai_base = EXTENDED_DOMAINS.get(ai_category, {}).get("baseCategory", ai_category)
    ai_rule_score = core["scores"].get(ai_base, 0)

    final_category = ai_category or best_core or "Bisnis"
    final_match = max(match_from_score(best_core_score), round(min(max(ai_conf, 0), 0.98) * 100))
    corrected = False
    reason = ""

    if best_ext_score >= 12 and best_ext_score >= best_core_score - 2:
        final_category = best_ext
        final_match = max(final_match, match_from_score(best_ext_score))
        corrected = bool(ai_category and ai_category != final_category)
        reason = f"Input mengandung domain spesifik {best_ext}; model hanya punya label umum sehingga filter menampilkan jalur lebih tepat."

    if has_any(cleaned, STRONG_HR) and not has_any(cleaned, STRONG_SOFTWARE) and core["scores"].get("Bisnis", 0) >= 9:
        final_category = "Psikologi Industri & HR" if best_ext == "Psikologi Industri & HR" else "Bisnis"
        final_match = max(final_match, 94)
        corrected = bool(ai_category and ai_category != final_category)
        reason = "Keyword HR/recruitment dominan dan tidak ada keyword software teknis yang kuat."

    if has_any(cleaned, STRONG_DATA) and core["scores"].get("Data & AI", 0) >= core["scores"].get("Rekayasa Perangkat Lunak", 0) + 5:
        final_category = "Data & AI"
        final_match = max(final_match, 92)
        corrected = bool(ai_category and ai_category != final_category)
        reason = "Keyword Data/AI dominan."

    if final_category not in EXTENDED_DOMAINS:
        if best_core_score >= 10 and best_core_score >= ai_rule_score + 7 and best_core != ai_base:
            final_category = best_core
            final_match = max(final_match, match_from_score(best_core_score))
            corrected = bool(ai_category)
            reason = f"Rule {best_core} lebih kuat dari model."
        elif ai_conf and ai_conf < 0.75 and best_core_score >= 8 and best_core != ai_base:
            final_category = best_core
            final_match = max(final_match, match_from_score(best_core_score))
            corrected = True
            reason = "Confidence model rendah, memakai rule score."

    matched_keywords = ext["matched"].get(final_category, []) if final_category in EXTENDED_DOMAINS else core["matched"].get(final_category, [])
    top_core = [
        {"category": cat, "score": score, "matchedKeywords": core["matched"].get(cat, [])}
        for cat, score in sorted(core["scores"].items(), key=lambda item: item[1], reverse=True) if score > 0
    ][:5]
    top_ext = [
        {"category": cat, "score": score, "matchedKeywords": ext["matched"].get(cat, [])}
        for cat, score in sorted(ext["scores"].items(), key=lambda item: item[1], reverse=True) if score > 0
    ][:5]
    return build_recommendation(final_category, final_match, matched_keywords, {
        "engine": (model_result or {}).get("engine", "tensorflow+general-domain-filter"),
        "modelLoaded": model_loaded,
        "correctedByRule": corrected,
        "corrected_by_rule": corrected,
        "correctionReason": reason,
        "ruleScores": core["scores"],
        "extendedDomainScores": ext["scores"],
        "topRuleCategories": top_core,
        "topExtendedDomains": top_ext,
        "rankedCategories": [
            {"category": item["category"], "rawScore": item["score"], "match": match_from_score(item["score"]), "matchedKeywords": item["matchedKeywords"]}
            for item in top_core
        ],
        "originalAiPrediction": ai_category or None,
        "originalAiConfidence": round(ai_conf * 100, 2),
    })
