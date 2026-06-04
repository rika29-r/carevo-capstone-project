const safe = (value) => String(value || '').trim();
const lower = (value) => safe(value).toLowerCase();

function normalizeText(text = '') {
  return lower(text)
    .replace(/[^a-z0-9&+.#/\-\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function addValue(parts, value) {
  if (value === null || value === undefined) return;
  if (typeof value === 'string' || typeof value === 'number') {
    const text = safe(value);
    if (text) parts.push(text);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => addValue(parts, item));
    return;
  }
  if (typeof value === 'object') {
    [
      'fullName', 'careerInterest', 'professionalTitle', 'shortBio', 'location',
      'name', 'skillName', 'category', 'level',
      'jobTitle', 'companyName', 'employmentType', 'description', 'skillsUsed',
      'institutionName', 'degreeMajor', 'gpa',
      'title', 'role', 'status', 'techStack',
      'certificateName', 'issuer',
      'language', 'proficiency', 'usageFrequency',
    ].forEach((key) => addValue(parts, value[key]));
  }
}

function sectionText(value) {
  const parts = [];
  addValue(parts, value);
  return parts.filter(Boolean).join(' ');
}

function collectCvText(cvData = {}) {
  const profile = cvData.personalInfo || cvData.profile || {};
  const skills = cvData.skills || cvData.skillList || [];
  const experiences = cvData.experiences || (cvData.experience ? [cvData.experience] : []);
  const projects = cvData.projects || cvData.projectList || [];
  const certifications = cvData.certifications || cvData.certificationList || [];
  const educations = cvData.educations || (cvData.education ? [cvData.education] : []);
  const languages = cvData.languages || cvData.languageList || [];

  const careerInterest = sectionText([profile.careerInterest, profile.professionalTitle]);
  const skillText = sectionText(skills);
  const experienceText = sectionText(experiences);
  const projectText = sectionText(projects);
  const certificationText = sectionText(certifications);
  const educationText = sectionText(educations);
  const personalText = sectionText([profile.shortBio, profile.location]);
  const languageText = sectionText(languages);

  // Field utama sengaja diulang supaya tidak kalah oleh jurusan.
  return normalizeText([
    `career interest ${careerInterest}`,
    `career interest ${careerInterest}`,
    `skills ${skillText}`,
    `skills ${skillText}`,
    `experience ${experienceText}`,
    `experience ${experienceText}`,
    `projects ${projectText}`,
    `certifications ${certificationText}`,
    `education ${educationText}`,
    `personal info ${personalText}`,
    `languages ${languageText}`,
  ].join(' '));
}

const CATEGORY_MODEL = {
  'Administrasi': {
    profileTitle: 'Administrative Specialist',
    paths: ['Administrative Officer', 'Office Coordinator', 'Data Entry Specialist'],
    keywords: {
      administrasi: 5, administration: 5, admin: 4, 'data entry': 6, scheduling: 4, jadwal: 3,
      document: 4, dokumen: 4, laporan: 4, excel: 4, 'microsoft excel': 5, word: 3, office: 3,
    },
  },
  'Bisnis': {
    profileTitle: 'Business & HR Specialist',
    paths: ['Human Resource Staff', 'Business Analyst', 'Project Coordinator'],
    keywords: {
      'human resource': 10, hr: 8, 'sumber daya manusia': 10, recruitment: 9, rekrutmen: 9,
      recruiter: 8, employee: 7, karyawan: 7, 'people management': 8, 'candidate screening': 9,
      interview: 7, wawancara: 6, 'hr administration': 8, 'administrasi karyawan': 9,
      management: 5, bisnis: 5, business: 5, leadership: 4, communication: 3, komunikasi: 3,
      teamwork: 2, 'public speaking': 2, operation: 4, operations: 4, product: 3, strategy: 4,
    },
  },
  'Data & AI': {
    profileTitle: 'Data Science',
    paths: ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer'],
    keywords: {
      python: 7, sql: 6, data: 5, analytics: 5, analysis: 5, 'analisis data': 7,
      'machine learning': 9, ai: 6, tensorflow: 7, pandas: 6, numpy: 5, statistik: 5,
      statistics: 5, dashboard: 4, visualization: 4, visualisasi: 4,
    },
  },
  'Keamanan Siber': {
    profileTitle: 'Cyber Security Analyst',
    paths: ['Cyber Security Analyst', 'SOC Analyst', 'Security Engineer'],
    keywords: {
      cybersecurity: 9, cyber: 7, security: 6, siber: 8, 'keamanan siber': 9,
      firewall: 5, network: 4, 'network security': 8, linux: 4, malware: 5,
      vulnerability: 6, 'penetration testing': 8, hacking: 6,
    },
  },
  'Kreatif & Desain': {
    profileTitle: 'UI/UX Designer',
    paths: ['UI/UX Designer', 'Product Designer', 'Visual Designer'],
    keywords: {
      figma: 8, ui: 6, ux: 6, 'ui ux': 9, design: 6, desain: 6, wireframe: 6,
      prototype: 5, photoshop: 5, illustrator: 5, visual: 4, creative: 4, kreatif: 4,
    },
  },
  'Pemasaran': {
    profileTitle: 'Digital Marketing Specialist',
    paths: ['Digital Marketing Specialist', 'SEO Specialist', 'Content Strategist'],
    keywords: {
      marketing: 8, pemasaran: 8, 'digital marketing': 10, seo: 7, sem: 5,
      campaign: 5, content: 5, copywriting: 5, brand: 4, social: 4, media: 3,
      ads: 5, advertising: 5,
    },
  },
  'Pendidikan': {
    profileTitle: 'Education Specialist',
    paths: ['Teacher', 'Mentor', 'Instructional Designer'],
    keywords: {
      teaching: 8, mengajar: 8, pendidikan: 7, education: 7, teacher: 7, guru: 7,
      mentor: 6, mentoring: 6, training: 5, kurikulum: 5, kelas: 4, tutor: 6,
    },
  },
  'Rekayasa Perangkat Lunak': {
    profileTitle: 'Software Engineer',
    paths: ['Software Engineer', 'Frontend Developer', 'Backend Developer'],
    keywords: {
      software: 6, 'software engineering': 9, 'software engineer': 9, programming: 6, coding: 6,
      frontend: 8, backend: 8, fullstack: 8, javascript: 7, typescript: 7, react: 7,
      node: 6, express: 5, api: 5, 'rest api': 7, database: 4, postgresql: 4, docker: 5,
      html: 3, css: 3, web: 4, website: 4,
    },
  },
};

const CATEGORY_ALIASES = {
  'business & product': 'Bisnis',
  business: 'Bisnis',
  bisnis: 'Bisnis',
  'bisnis & manajemen': 'Bisnis',
  'human resource': 'Bisnis',
  hr: 'Bisnis',
  'software engineering': 'Rekayasa Perangkat Lunak',
  'software engineer': 'Rekayasa Perangkat Lunak',
  software: 'Rekayasa Perangkat Lunak',
  'rekayasa perangkat lunak': 'Rekayasa Perangkat Lunak',
  data: 'Data & AI',
  'data science': 'Data & AI',
  'data & ai': 'Data & AI',
  'ui/ux design': 'Kreatif & Desain',
  'ui ux design': 'Kreatif & Desain',
  design: 'Kreatif & Desain',
  marketing: 'Pemasaran',
  'digital marketing': 'Pemasaran',
  education: 'Pendidikan',
  pendidikan: 'Pendidikan',
  administration: 'Administrasi',
  administrasi: 'Administrasi',
  cybersecurity: 'Keamanan Siber',
  'keamanan siber': 'Keamanan Siber',
};

function normalizeCategoryName(name = '') {
  const text = normalizeText(name);
  if (!text) return '';
  if (CATEGORY_ALIASES[text]) return CATEGORY_ALIASES[text];
  const exact = Object.keys(CATEGORY_MODEL).find((category) => normalizeText(category) === text);
  if (exact) return exact;
  if (text.includes('human resource') || text.includes('recruitment') || text === 'hr') return 'Bisnis';
  if (text.includes('software') || text.includes('frontend') || text.includes('backend')) return 'Rekayasa Perangkat Lunak';
  if (text.includes('data') || text.includes('machine learning') || text.includes('ai')) return 'Data & AI';
  if (text.includes('design') || text.includes('desain') || text.includes('ui') || text.includes('ux')) return 'Kreatif & Desain';
  if (text.includes('marketing') || text.includes('pemasaran')) return 'Pemasaran';
  if (text.includes('education') || text.includes('pendidikan') || text.includes('teaching')) return 'Pendidikan';
  if (text.includes('admin')) return 'Administrasi';
  if (text.includes('cyber') || text.includes('security') || text.includes('siber')) return 'Keamanan Siber';
  return name;
}

function keywordHit(text, keyword) {
  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) return false;
  if (normalizedKeyword.length <= 3) {
    return new RegExp(`(^|\\s)${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`, 'i').test(text);
  }
  return text.includes(normalizedKeyword);
}

function getRuleScores(inputText = '') {
  const text = normalizeText(inputText);
  const scores = {};
  const matched = {};
  Object.entries(CATEGORY_MODEL).forEach(([category, model]) => {
    let score = 0;
    matched[category] = [];
    Object.entries(model.keywords).forEach(([keyword, weight]) => {
      if (keywordHit(text, keyword)) {
        score += weight;
        matched[category].push(keyword);
      }
    });
    scores[category] = score;
  });
  return { scores, matched };
}

function bestCategoryFromScores(scores = {}) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0] || ['Bisnis', 0];
}

function hasAny(text, keywords) {
  const normalized = normalizeText(text);
  return keywords.some((keyword) => keywordHit(normalized, keyword));
}

function toRecommendation(category, score, matchedKeywords = [], extras = {}) {
  const normalized = normalizeCategoryName(category) || 'Bisnis';
  const model = CATEGORY_MODEL[normalized] || CATEGORY_MODEL.Bisnis;
  const matchScore = Math.max(62, Math.min(98, Number(score) || 78));
  const topPathMatches = model.paths.map((name, index) => ({ name, score: Math.max(55, matchScore - index * 4) }));
  return {
    success: true,
    prediction: normalized,
    recommendedCategory: normalized,
    profileTitle: model.profileTitle,
    confidence: Number((matchScore / 100).toFixed(2)),
    matchScore,
    level: matchScore >= 85 ? 'ELITE PROFILE' : matchScore >= 70 ? 'STRONG PROFILE' : 'GROWING PROFILE',
    topPathMatches,
    recommendedCareers: topPathMatches.map((item) => item.name),
    matchedKeywords,
    reason: extras.reason || `Data profil paling kuat mengarah ke ${normalized}.`,
    suggestions: extras.suggestions || [
      `Perkuat skill dan project yang relevan dengan ${normalized}.`,
      'Lengkapi experience, education, certification, dan project agar rekomendasi makin akurat.',
      'Gunakan data terbaru di dashboard sebelum generate CV.',
    ],
    rankedCategories: extras.rankedCategories || [],
    ...extras,
  };
}

function correctCareerPrediction(inputText = '', aiResult = {}) {
  const text = normalizeText(inputText);
  const { scores, matched } = getRuleScores(text);
  const [bestCategory, bestScore] = bestCategoryFromScores(scores);
  const aiCategory = normalizeCategoryName(aiResult.recommendedCategory || aiResult.prediction || aiResult.category || aiResult.label || '');
  const aiScore = scores[aiCategory] || 0;
  const aiMatch = Number(aiResult.matchScore || (Number(aiResult.confidence || 0) * 100) || 0);

  const hrKeywords = [
    'human resource', 'hr', 'sumber daya manusia', 'recruitment', 'rekrutmen', 'recruiter',
    'employee', 'karyawan', 'people management', 'candidate screening', 'interview', 'wawancara',
    'hr administration', 'administrasi karyawan',
  ];
  const strongSoftwareKeywords = [
    'frontend', 'backend', 'fullstack', 'javascript', 'typescript', 'react', 'node', 'express',
    'rest api', 'coding', 'programming', 'docker', 'software engineer', 'software engineering',
  ];

  const hasHR = hasAny(text, hrKeywords);
  const hasStrongSoftware = hasAny(text, strongSoftwareKeywords);

  if (hasHR && !hasStrongSoftware) {
    return toRecommendation('Bisnis', Math.max(aiMatch, 95), matched.Bisnis, {
      ...aiResult,
      correctedByBackend: true,
      correctionReason: 'Input dominan Human Resource/HR, jadi backend mengoreksi hasil model ke Bisnis.',
      rankedCategories: Object.entries(scores).map(([category, score]) => ({ category, score, matchedKeywords: matched[category] })).sort((a, b) => b.score - a.score),
      engine: aiResult.engine || 'backend-rule-correction',
    });
  }

  if (bestScore >= 6 && bestScore >= aiScore + 4) {
    return toRecommendation(bestCategory, Math.max(aiMatch, 88), matched[bestCategory], {
      ...aiResult,
      correctedByBackend: true,
      correctionReason: `Keyword ${bestCategory} lebih dominan dibanding hasil model.`,
      rankedCategories: Object.entries(scores).map(([category, score]) => ({ category, score, matchedKeywords: matched[category] })).sort((a, b) => b.score - a.score),
      engine: aiResult.engine || 'backend-rule-correction',
    });
  }

  if (!aiCategory || aiMatch < 60) {
    return toRecommendation(bestCategory, Math.max(75, bestScore * 7), matched[bestCategory], {
      ...aiResult,
      correctedByBackend: true,
      correctionReason: 'Confidence model rendah atau output kosong, backend memakai rule score terkuat.',
      rankedCategories: Object.entries(scores).map(([category, score]) => ({ category, score, matchedKeywords: matched[category] })).sort((a, b) => b.score - a.score),
      engine: aiResult.engine || 'backend-rule-fallback',
    });
  }

  const normalizedCategory = aiCategory || bestCategory;
  const model = CATEGORY_MODEL[normalizedCategory] || CATEGORY_MODEL.Bisnis;
  const topPathMatches = aiResult.topPathMatches || model.paths.map((name, index) => ({ name, score: Math.max(55, aiMatch - index * 4) }));

  return {
    ...aiResult,
    prediction: normalizedCategory,
    recommendedCategory: normalizedCategory,
    profileTitle: aiResult.profileTitle || model.profileTitle,
    topPathMatches,
    recommendedCareers: aiResult.recommendedCareers || topPathMatches.map((item) => item.name),
    correctedByBackend: false,
    rankedCategories: aiResult.rankedCategories?.length ? aiResult.rankedCategories : Object.entries(scores).map(([category, score]) => ({ category, score, matchedKeywords: matched[category] })).sort((a, b) => b.score - a.score),
  };
}

function recommendFromCvData(cvData = {}) {
  const text = collectCvText(cvData);
  const { scores, matched } = getRuleScores(text);
  const [bestCategory, bestScore] = bestCategoryFromScores(scores);
  const score = bestScore > 0 ? Math.min(98, 65 + bestScore * 3) : 55;
  return correctCareerPrediction(text, toRecommendation(bestCategory, score, matched[bestCategory], { engine: 'node-keyword-fallback' }));
}

module.exports = {
  recommendFromCvData,
  collectCvText,
  correctCareerPrediction,
  getRuleScores,
  normalizeCategoryName,
};
