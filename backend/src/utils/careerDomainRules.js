const safe = (value) => String(value ?? '').trim();

function normalizeText(text = '') {
  return safe(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9&+.#/\-\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function keywordHit(text, keyword) {
  const cleanedText = normalizeText(text);
  const cleanedKeyword = normalizeText(keyword);
  if (!cleanedKeyword) return false;
  if (cleanedKeyword.length <= 3 || ['ai', 'hr', 'ui', 'ux', 'qa', 'it', 'r'].includes(cleanedKeyword)) {
    return new RegExp(`(^|\\s)${escapeRegex(cleanedKeyword)}(\\s|$)`, 'i').test(cleanedText);
  }
  return cleanedText.includes(cleanedKeyword);
}

function hasAny(text, keywords = []) {
  return keywords.some((keyword) => keywordHit(text, keyword));
}

function scoreKeywords(text, keywords = {}) {
  let score = 0;
  const matched = [];
  Object.entries(keywords).forEach(([keyword, weight]) => {
    if (keywordHit(text, keyword)) {
      score += Number(weight || 1);
      matched.push(keyword);
    }
  });
  return { score, matched };
}

const CORE_CATEGORIES = {
  'Administrasi': {
    profileTitle: 'Administrative Specialist',
    paths: ['Administrative Officer', 'Office Coordinator', 'Data Entry Specialist'],
    keywords: {
      administrasi: 8, administration: 8, administrative: 7, admin: 5,
      'data entry': 9, arsip: 8, archive: 7, filing: 6,
      scheduling: 6, penjadwalan: 6, 'document management': 9, 'manajemen dokumen': 9,
      'microsoft office': 5, 'microsoft excel': 5, excel: 4, 'microsoft word': 4,
      laporan: 4, 'customer service': 4, 'pelayanan pelanggan': 4,
      surat: 4, dokumen: 4, receptionist: 5, resepsionis: 5,
    },
  },
  'Bisnis': {
    profileTitle: 'Business & HR Specialist',
    paths: ['Human Resource Staff', 'Business Analyst', 'Project Coordinator'],
    keywords: {
      bisnis: 5, business: 5, management: 5, manajemen: 5,
      'business analysis': 9, 'business analyst': 9, 'analisis bisnis': 9,
      'project management': 8, 'manajemen proyek': 8, project: 2, coordinator: 4,
      'financial planning': 7, 'strategic management': 7, finance: 6, keuangan: 6,
      accounting: 8, akuntansi: 8, pajak: 7, tax: 7, audit: 7,
      entrepreneur: 6, entrepreneurship: 6, wirausaha: 6, usaha: 4,
      'human resource': 12, 'human resources': 12, 'sumber daya manusia': 12,
      hr: 8, hrd: 9, recruitment: 11, rekrutmen: 11, recruiter: 9,
      'candidate screening': 10, 'screening kandidat': 10, 'interview candidate': 9,
      interview: 5, wawancara: 5, 'employee administration': 10, 'administrasi karyawan': 10,
      employee: 7, karyawan: 7, 'people management': 9, 'talent acquisition': 9,
      payroll: 7, onboarding: 7, leadership: 3, communication: 2, komunikasi: 2, teamwork: 1,
    },
  },
  'Data & AI': {
    profileTitle: 'Data Science',
    paths: ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer'],
    keywords: {
      'data analysis': 12, 'analisis data': 12, 'data analyst': 12,
      'data science': 13, 'data scientist': 13, 'machine learning': 13,
      'deep learning': 11, 'artificial intelligence': 11, ai: 5,
      tensorflow: 10, pytorch: 9, python: 7, sql: 6,
      pandas: 8, numpy: 8, statistics: 7, statistik: 7,
      'data visualization': 7, 'visualisasi data': 7, 'big data': 8,
      analytics: 7, dashboard: 4, tableau: 6, powerbi: 6, 'power bi': 6,
      etl: 7, database: 3,
    },
  },
  'Keamanan Siber': {
    profileTitle: 'Cyber Security Analyst',
    paths: ['Cyber Security Analyst', 'SOC Analyst', 'Security Engineer'],
    keywords: {
      cybersecurity: 13, 'cyber security': 13, cyber: 8, siber: 8,
      'keamanan siber': 13, security: 5, 'network security': 12,
      'penetration testing': 12, pentest: 11, 'ethical hacking': 11,
      firewall: 8, vulnerability: 8, malware: 7, linux: 5,
      'incident response': 8, soc: 7, 'security analyst': 10,
    },
  },
  'Kreatif & Desain': {
    profileTitle: 'Creative & Design Specialist',
    paths: ['UI/UX Designer', 'Graphic Designer', 'Creative Designer'],
    keywords: {
      'ui ux': 12, 'ux ui': 12, 'ui/ux': 12, ui: 4, ux: 4,
      figma: 11, wireframe: 8, wireframing: 8, prototype: 8,
      'graphic design': 10, 'desain grafis': 10, design: 5, desain: 5,
      'visual communication': 8, 'komunikasi visual': 8,
      'adobe illustrator': 8, illustrator: 7, photoshop: 7,
      creative: 6, kreatif: 6, branding: 5, photography: 5, fotografi: 5,
    },
  },
  'Pemasaran': {
    profileTitle: 'Digital Marketing Specialist',
    paths: ['Digital Marketing Specialist', 'SEO Specialist', 'Content Strategist'],
    keywords: {
      'digital marketing': 13, marketing: 10, pemasaran: 10,
      seo: 9, sem: 8, 'social media marketing': 9, 'content strategy': 8,
      campaign: 7, kampanye: 7, 'google analytics': 7,
      copywriting: 7, advertising: 6, iklan: 6, ads: 5,
      brand: 5, branding: 5, social: 2, media: 2, content: 5, konten: 5,
      sales: 6, penjualan: 6,
    },
  },
  'Pendidikan': {
    profileTitle: 'Education Specialist',
    paths: ['Teacher', 'Mentor', 'Education Consultant'],
    keywords: {
      teaching: 11, mengajar: 11, teacher: 10, guru: 10,
      education: 10, pendidikan: 10, mentoring: 8, mentor: 8,
      curriculum: 9, kurikulum: 9, 'classroom management': 8,
      'educational assessment': 9, assessment: 4, training: 6,
      tutor: 8, pembelajaran: 7, kelas: 5, instruktur: 7, instructor: 7,
      counseling: 7, konseling: 7, psikologi: 5, psychology: 5,
    },
  },
  'Rekayasa Perangkat Lunak': {
    profileTitle: 'Software Engineer',
    paths: ['Software Engineer', 'Frontend Developer', 'Backend Developer'],
    keywords: {
      'software engineering': 13, 'software engineer': 13, 'rekayasa perangkat lunak': 13,
      frontend: 12, 'front end': 12, backend: 12, 'back end': 12,
      fullstack: 12, 'full stack': 12, 'web developer': 10, developer: 5,
      programming: 10, coding: 10, javascript: 10, typescript: 10,
      react: 10, vite: 5, 'node js': 10, 'node.js': 10, express: 8,
      'rest api': 8, api: 5, microservices: 7, 'spring boot': 8,
      java: 5, postgresql: 5, mysql: 5, docker: 6, deployment: 5,
      html: 3, css: 3, 'teknik informatika': 1, informatika: 1, 'computer science': 1,
    },
  },
};

const EXTENDED_DOMAINS = {
  'Psikologi & Konseling': {
    baseCategory: 'Pendidikan',
    profileTitle: 'Psychology & Counseling Assistant',
    paths: ['Counseling Assistant', 'Psychology Assistant', 'Educational Counselor'],
    keywords: {
      psikologi: 14, psychology: 14, counseling: 14, konseling: 14,
      counselor: 12, konselor: 12, 'mental health': 12, 'kesehatan mental': 12,
      'psychology assessment': 14, 'asesmen psikologi': 14, assessment: 4,
      'behavioral observation': 10, 'observasi perilaku': 10, perilaku: 6,
      empathy: 8, empati: 8, 'active listening': 8, 'emotional intelligence': 9,
      mentoring: 7, mentor: 7, student: 4, siswa: 4, 'student assessment': 8,
    },
    exclusiveWhen: (text) => !hasAny(text, ['recruitment', 'rekrutmen', 'human resource', 'hrd', 'employee', 'karyawan', 'talent acquisition']),
  },
  'Psikologi Industri & HR': {
    baseCategory: 'Bisnis',
    profileTitle: 'Industrial Psychology & HR Specialist',
    paths: ['Human Resource Staff', 'Recruitment Staff', 'Talent Acquisition Assistant'],
    requiresAny: ['psikologi', 'psychology', 'psikologi industri', 'organizational psychology', 'industrial psychology'],
    keywords: {
      'psikologi industri': 14, 'organizational psychology': 14, 'industrial psychology': 14,
      psikologi: 6, psychology: 6, 'human resource': 13, hr: 8, hrd: 9,
      recruitment: 12, rekrutmen: 12, 'candidate screening': 11, interview: 6,
      'employee engagement': 10, 'employee administration': 9, karyawan: 7,
      'people management': 9, 'talent acquisition': 10, assessment: 5,
    },
  },
  'Tata Boga & Kuliner': {
    baseCategory: 'Kreatif & Desain',
    profileTitle: 'Culinary & Food Service Specialist',
    paths: ['Culinary Assistant', 'Pastry & Bakery Assistant', 'Food Product Developer'],
    keywords: {
      'tata boga': 16, kuliner: 14, culinary: 14, chef: 13, koki: 13,
      memasak: 12, masak: 10, masakan: 10, cooking: 12,
      pastry: 12, bakery: 12, baking: 12, roti: 8, cake: 8, kue: 8,
      'food preparation': 10, 'food service': 9, kitchen: 8, dapur: 8,
      plating: 8, recipe: 8, resep: 8, menu: 7, 'menu planning': 8,
      boga: 9, sanitasi: 7, hygiene: 7, higienitas: 7, 'food product': 8,
    },
  },
  'Kesehatan & Layanan Klinis': {
    baseCategory: 'Pendidikan',
    profileTitle: 'Healthcare Support Specialist',
    paths: ['Healthcare Assistant', 'Clinical Administration Staff', 'Patient Care Assistant'],
    keywords: {
      kesehatan: 13, healthcare: 13, medical: 11, medis: 11, klinis: 10, clinical: 10,
      nursing: 13, perawat: 13, nurse: 13, patient: 8, pasien: 8,
      farmasi: 12, pharmacy: 12, pharmacist: 10, apoteker: 10,
      nutrition: 9, gizi: 9, fisioterapi: 10, physiotherapy: 10,
    },
  },
  'Hospitality & Pariwisata': {
    baseCategory: 'Bisnis',
    profileTitle: 'Hospitality & Tourism Specialist',
    paths: ['Hotel Front Office Staff', 'Guest Relation Officer', 'Tourism Staff'],
    keywords: {
      hospitality: 14, hotel: 12, pariwisata: 13, tourism: 13, travel: 9,
      'front office': 11, housekeeping: 10, 'guest relation': 10, concierge: 9,
      restoran: 8, restaurant: 8, fnb: 8, 'food and beverage': 9,
      reservasi: 8, reservation: 8, tour: 7, wisata: 9,
    },
  },
  'Agribisnis & Pertanian': {
    baseCategory: 'Bisnis',
    profileTitle: 'Agribusiness & Agriculture Specialist',
    paths: ['Agribusiness Assistant', 'Agriculture Field Staff', 'Plantation Operations Assistant'],
    keywords: {
      pertanian: 14, agriculture: 14, agribusiness: 14, agribisnis: 14,
      perkebunan: 12, plantation: 12, sawit: 12, palm: 8, tani: 10, petani: 10,
      tanaman: 9, crop: 9, soil: 8, tanah: 7, horticulture: 10, hortikultura: 10,
      livestock: 9, peternakan: 9, perikanan: 9, fisheries: 9,
    },
  },
  'Legal & Compliance': {
    baseCategory: 'Administrasi',
    profileTitle: 'Legal & Compliance Assistant',
    paths: ['Legal Administrative Assistant', 'Compliance Staff', 'Paralegal Assistant'],
    keywords: {
      hukum: 14, legal: 14, law: 10, paralegal: 12, compliance: 11,
      kontrak: 9, contract: 9, regulation: 8, regulasi: 8,
      'legal drafting': 10, 'legal research': 10, perizinan: 8, licensing: 8,
    },
  },
  'Teknik & Engineering Non-Software': {
    baseCategory: 'Rekayasa Perangkat Lunak',
    profileTitle: 'Engineering & Technical Specialist',
    paths: ['Engineering Assistant', 'Technical Staff', 'Quality Control Assistant'],
    keywords: {
      'teknik mesin': 13, mechanical: 12, mesin: 8, 'teknik sipil': 13, civil: 10,
      'teknik elektro': 13, electrical: 11, elektro: 10, 'quality control': 10, qc: 7,
      autocad: 9, solidworks: 9, manufaktur: 10, manufacturing: 10,
      maintenance: 8, produksi: 8, production: 8,
    },
    exclusiveWhen: (text) => !hasAny(text, ['frontend', 'backend', 'software', 'coding', 'programming', 'react', 'node js']),
  },
  'Fashion & Beauty': {
    baseCategory: 'Kreatif & Desain',
    profileTitle: 'Fashion & Beauty Creative Specialist',
    paths: ['Fashion Design Assistant', 'Beauty Consultant', 'Makeup Artist Assistant'],
    keywords: {
      fashion: 13, 'tata busana': 14, busana: 10, menjahit: 10, sewing: 10,
      makeup: 12, 'make up': 12, beauty: 11, kecantikan: 11,
      skincare: 9, kosmetik: 9, barber: 9, hair: 7, salon: 9,
    },
  },
};

const CATEGORY_ALIASES = {
  business: 'Bisnis', bisnis: 'Bisnis', 'bisnis & manajemen': 'Bisnis', 'business & hr specialist': 'Bisnis',
  'human resource': 'Bisnis', hr: 'Bisnis', hrd: 'Bisnis', management: 'Bisnis', manajemen: 'Bisnis',
  administration: 'Administrasi', administrasi: 'Administrasi', admin: 'Administrasi',
  data: 'Data & AI', 'data science': 'Data & AI', 'data & ai': 'Data & AI', ai: 'Data & AI',
  cybersecurity: 'Keamanan Siber', 'cyber security': 'Keamanan Siber', 'keamanan siber': 'Keamanan Siber',
  design: 'Kreatif & Desain', desain: 'Kreatif & Desain', 'ui ux': 'Kreatif & Desain', 'ui/ux': 'Kreatif & Desain',
  marketing: 'Pemasaran', pemasaran: 'Pemasaran', 'digital marketing': 'Pemasaran',
  education: 'Pendidikan', pendidikan: 'Pendidikan', teaching: 'Pendidikan',
  software: 'Rekayasa Perangkat Lunak', 'software engineering': 'Rekayasa Perangkat Lunak',
  'software engineer': 'Rekayasa Perangkat Lunak', 'rekayasa perangkat lunak': 'Rekayasa Perangkat Lunak',
};

const STRONG_SOFTWARE = ['frontend', 'backend', 'fullstack', 'full stack', 'react', 'node js', 'node.js', 'express', 'javascript', 'typescript', 'coding', 'programming', 'software engineering', 'software engineer', 'spring boot', 'rest api', 'microservices'];
const STRONG_DATA = ['machine learning', 'data analysis', 'analisis data', 'data science', 'data scientist', 'data analyst', 'tensorflow', 'pandas', 'numpy', 'statistics', 'statistik'];
const STRONG_HR = ['human resource', 'human resources', 'hrd', 'sumber daya manusia', 'recruitment', 'rekrutmen', 'candidate screening', 'interview candidate', 'employee administration', 'administrasi karyawan', 'people management', 'talent acquisition'];

function normalizeCategoryName(name = '') {
  const text = normalizeText(name);
  if (!text) return '';
  const extended = Object.keys(EXTENDED_DOMAINS).find((domain) => normalizeText(domain) === text);
  if (extended) return extended;
  if (CATEGORY_ALIASES[text]) return CATEGORY_ALIASES[text];
  const exact = Object.keys(CORE_CATEGORIES).find((category) => normalizeText(category) === text);
  if (exact) return exact;
  for (const [domain, config] of Object.entries(EXTENDED_DOMAINS)) {
    if (keywordHit(text, domain) || keywordHit(text, config.profileTitle)) return domain;
  }
  if (keywordHit(text, 'human resource') || keywordHit(text, 'recruitment') || keywordHit(text, 'hrd')) return 'Bisnis';
  if (keywordHit(text, 'software') || keywordHit(text, 'frontend') || keywordHit(text, 'backend')) return 'Rekayasa Perangkat Lunak';
  if (keywordHit(text, 'machine learning') || keywordHit(text, 'data') || keywordHit(text, 'ai')) return 'Data & AI';
  if (keywordHit(text, 'cyber') || keywordHit(text, 'security') || keywordHit(text, 'siber')) return 'Keamanan Siber';
  if (keywordHit(text, 'figma') || keywordHit(text, 'design') || keywordHit(text, 'desain') || keywordHit(text, 'ui') || keywordHit(text, 'ux')) return 'Kreatif & Desain';
  if (keywordHit(text, 'marketing') || keywordHit(text, 'pemasaran') || keywordHit(text, 'seo')) return 'Pemasaran';
  if (keywordHit(text, 'teaching') || keywordHit(text, 'pendidikan') || keywordHit(text, 'education') || keywordHit(text, 'counseling') || keywordHit(text, 'psikologi')) return 'Pendidikan';
  if (keywordHit(text, 'admin') || keywordHit(text, 'administrasi')) return 'Administrasi';
  return name;
}

function getCoreRuleScores(inputText = '') {
  const text = normalizeText(inputText);
  const scores = {};
  const matched = {};
  Object.entries(CORE_CATEGORIES).forEach(([category, model]) => {
    const result = scoreKeywords(text, model.keywords);
    scores[category] = result.score;
    matched[category] = result.matched;
  });

  // Jurusan informatika hanya konteks. Tanpa keyword teknis, jangan otomatis software.
  if ((keywordHit(text, 'teknik informatika') || keywordHit(text, 'informatika') || keywordHit(text, 'computer science')) && !hasAny(text, STRONG_SOFTWARE)) {
    scores['Rekayasa Perangkat Lunak'] = Math.min(scores['Rekayasa Perangkat Lunak'] || 0, 2);
  }

  return { scores, matched };
}

function getExtendedDomainScores(inputText = '') {
  const text = normalizeText(inputText);
  const scores = {};
  const matched = {};
  Object.entries(EXTENDED_DOMAINS).forEach(([domain, config]) => {
    const result = scoreKeywords(text, config.keywords);
    const passesRequired = Array.isArray(config.requiresAny) ? hasAny(text, config.requiresAny) : true;
    const allowed = passesRequired && (typeof config.exclusiveWhen === 'function' ? config.exclusiveWhen(text) : true);
    scores[domain] = allowed ? result.score : 0;
    matched[domain] = allowed ? result.matched : [];
  });
  return { scores, matched };
}

function bestFromScores(scores = {}) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0] || ['', 0];
}

function matchFromScore(score = 0) {
  if (score >= 42) return 98;
  if (score >= 34) return 96;
  if (score >= 26) return 93;
  if (score >= 18) return 89;
  if (score >= 12) return 82;
  if (score >= 8) return 74;
  if (score >= 4) return 64;
  return 56;
}

function getProfileConfig(category = '') {
  if (EXTENDED_DOMAINS[category]) return EXTENDED_DOMAINS[category];
  if (CORE_CATEGORIES[category]) return { ...CORE_CATEGORIES[category], baseCategory: category };
  return { ...CORE_CATEGORIES.Bisnis, baseCategory: 'Bisnis' };
}

function buildRecommendation(category, matchScore, matchedKeywords = [], extras = {}) {
  const normalized = normalizeCategoryName(category) || 'Bisnis';
  const config = getProfileConfig(normalized);
  const baseCategory = config.baseCategory || normalized;
  const safeScore = Math.max(52, Math.min(98, Number(matchScore) || 78));
  const paths = Array.isArray(config.paths) && config.paths.length ? config.paths : [normalized, 'Career Specialist', 'Professional Role'];
  const topPathMatches = paths.slice(0, 3).map((name, index) => ({
    name,
    score: Math.max(50, safeScore - index * 4),
  }));

  return {
    success: true,
    prediction: normalized,
    recommendedCategory: normalized,
    recommended_career: normalized,
    baseModelCategory: baseCategory,
    base_model_category: baseCategory,
    profileTitle: config.profileTitle || normalized,
    confidence: Number((safeScore / 100).toFixed(2)),
    matchScore: safeScore,
    level: safeScore >= 85 ? 'ELITE PROFILE' : safeScore >= 70 ? 'STRONG PROFILE' : 'GROWING PROFILE',
    topPathMatches,
    recommendedCareers: topPathMatches.map((item) => item.name),
    matchedKeywords,
    reason: `CAREVO membaca data form dan menemukan kecocokan paling kuat ke ${normalized}.`,
    suggestions: [
      `Tambahkan skill, pengalaman, atau project yang relevan dengan ${normalized}.`,
      'Gunakan skill spesifik bidang agar tidak tertukar dengan skill umum seperti communication/teamwork.',
      'Lengkapi education, certification, dan project agar rekomendasi makin akurat.',
    ],
    ...extras,
  };
}

function normalizeAiResult(aiResult = {}) {
  const rawCategory = aiResult.recommendedCategory || aiResult.recommended_career || aiResult.recommendedCareer || aiResult.prediction || aiResult.category || aiResult.career || aiResult.label || '';
  const category = normalizeCategoryName(rawCategory);
  const rawConfidence = aiResult.confidence ?? aiResult.probability ?? aiResult.score ?? aiResult.matchScore ?? 0;
  let confidence = Number(rawConfidence || 0);
  if (confidence > 1) confidence = confidence / 100;
  if (!Number.isFinite(confidence)) confidence = 0;
  return { category: Object.keys(CORE_CATEGORIES).includes(category) || Object.keys(EXTENDED_DOMAINS).includes(category) ? category : '', confidence, rawCategory };
}

function correctCareerPrediction(inputText = '', aiResult = {}) {
  const text = normalizeText(inputText);
  const core = getCoreRuleScores(text);
  const ext = getExtendedDomainScores(text);
  const [bestCoreCategory, bestCoreScore] = bestFromScores(core.scores);
  const [bestExtCategory, bestExtScore] = bestFromScores(ext.scores);
  const ai = normalizeAiResult(aiResult);
  const aiCategory = ai.category;
  const aiBaseCategory = EXTENDED_DOMAINS[aiCategory]?.baseCategory || aiCategory;
  const aiRuleScore = core.scores[aiBaseCategory] || 0;

  const hasSoftware = hasAny(text, STRONG_SOFTWARE);
  const hasData = hasAny(text, STRONG_DATA);
  const hasHR = hasAny(text, STRONG_HR);

  let finalCategory = aiCategory || bestCoreCategory || 'Bisnis';
  let finalScore = Math.max(matchFromScore(bestCoreScore), Math.round((ai.confidence || 0) * 100));
  let correctedByBackend = false;
  let correctionReason = '';

  // Extended domain wins when it is strong, because model label only has 8 broad classes.
  if (bestExtScore >= 12 && bestExtScore >= bestCoreScore - 2) {
    finalCategory = bestExtCategory;
    finalScore = Math.max(finalScore, matchFromScore(bestExtScore));
    correctedByBackend = Boolean(aiCategory && aiCategory !== finalCategory);
    correctionReason = `Input mengandung domain spesifik ${bestExtCategory}; model hanya punya label umum sehingga backend menampilkan jalur yang lebih tepat.`;
  }

  // HR should not become software just because the user studies Informatics.
  if (hasHR && !hasSoftware && core.scores.Bisnis >= 9) {
    finalCategory = bestExtCategory === 'Psikologi Industri & HR' ? bestExtCategory : 'Bisnis';
    finalScore = Math.max(finalScore, 94);
    correctedByBackend = Boolean(aiCategory && aiCategory !== finalCategory);
    correctionReason = 'Keyword HR/recruitment dominan dan tidak ada keyword software teknis yang kuat.';
  }

  // Strong data should beat generic software.
  if (hasData && core.scores['Data & AI'] >= (core.scores['Rekayasa Perangkat Lunak'] || 0) + 5) {
    finalCategory = 'Data & AI';
    finalScore = Math.max(finalScore, 92);
    correctedByBackend = Boolean(aiCategory && aiCategory !== finalCategory);
    correctionReason = 'Keyword Data/AI lebih dominan dari kategori lain.';
  }

  if (!Object.keys(EXTENDED_DOMAINS).includes(finalCategory)) {
    if (!aiCategory && bestCoreScore > 0) {
      finalCategory = bestCoreCategory;
      finalScore = matchFromScore(bestCoreScore);
      correctedByBackend = true;
      correctionReason = 'Output model kosong/tidak valid, backend memakai rule score.';
    } else if (bestCoreScore >= 10 && bestCoreScore >= aiRuleScore + 7 && bestCoreCategory !== aiBaseCategory) {
      finalCategory = bestCoreCategory;
      finalScore = Math.max(finalScore, matchFromScore(bestCoreScore));
      correctedByBackend = Boolean(aiCategory);
      correctionReason = `Keyword ${bestCoreCategory} jauh lebih dominan dari hasil model.`;
    } else if (bestCoreScore >= 8 && ai.confidence > 0 && ai.confidence < 0.75 && bestCoreCategory !== aiBaseCategory) {
      finalCategory = bestCoreCategory;
      finalScore = Math.max(finalScore, matchFromScore(bestCoreScore));
      correctedByBackend = true;
      correctionReason = 'Confidence model rendah, backend memakai rule score paling kuat.';
    }
  }

  const topCoreCategories = Object.entries(core.scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0)
    .slice(0, 5)
    .map(([category, score]) => ({ category, score, matchedKeywords: core.matched[category] || [] }));

  const topExtendedDomains = Object.entries(ext.scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0)
    .slice(0, 5)
    .map(([category, score]) => ({ category, score, matchedKeywords: ext.matched[category] || [] }));

  const matchedKeywords = EXTENDED_DOMAINS[finalCategory]
    ? (ext.matched[finalCategory] || [])
    : (core.matched[finalCategory] || []);

  return buildRecommendation(finalCategory, finalScore, matchedKeywords, {
    ...aiResult,
    correctedByBackend,
    corrected_by_backend: correctedByBackend,
    correctionReason,
    correction_reason: correctionReason,
    originalAiPrediction: aiCategory || ai.rawCategory || null,
    original_ai_prediction: aiCategory || ai.rawCategory || null,
    originalAiConfidence: Number(((ai.confidence || 0) * 100).toFixed(2)),
    original_ai_confidence: Number(((ai.confidence || 0) * 100).toFixed(2)),
    ruleScores: core.scores,
    rule_scores: core.scores,
    extendedDomainScores: ext.scores,
    extended_domain_scores: ext.scores,
    topRuleCategories: topCoreCategories,
    top_rule_categories: topCoreCategories,
    topExtendedDomains,
    top_extended_domains: topExtendedDomains,
    rankedCategories: Array.isArray(aiResult.rankedCategories) && aiResult.rankedCategories.length
      ? aiResult.rankedCategories
      : topCoreCategories.map((item) => ({ category: item.category, match: matchFromScore(item.score), rawScore: item.score, matchedKeywords: item.matchedKeywords })),
  });
}

function recommendFromText(inputText = '') {
  return correctCareerPrediction(inputText, { engine: 'node-general-domain-filter', confidence: 0 });
}

module.exports = {
  CORE_CATEGORIES,
  EXTENDED_DOMAINS,
  normalizeText,
  keywordHit,
  hasAny,
  normalizeCategoryName,
  getCoreRuleScores,
  getExtendedDomainScores,
  matchFromScore,
  buildRecommendation,
  correctCareerPrediction,
  recommendFromText,
};
