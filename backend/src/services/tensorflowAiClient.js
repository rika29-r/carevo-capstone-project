const { collectCvText, correctCareerPrediction, normalizeCategoryName } = require('./careerAiService');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const AI_SERVICE_TIMEOUT_MS = Number(process.env.AI_SERVICE_TIMEOUT_MS || 10000);

const PROFILE_TITLES = {
  'Administrasi': 'Administrative Specialist',
  'Bisnis': 'Business & HR Specialist',
  'Data & AI': 'Data Science',
  'Keamanan Siber': 'Cyber Security Analyst',
  'Kreatif & Desain': 'UI/UX Designer',
  'Pemasaran': 'Digital Marketing Specialist',
  'Pendidikan': 'Education Specialist',
  'Rekayasa Perangkat Lunak': 'Software Engineer',
};

const TOP_PATHS = {
  'Administrasi': ['Administrative Officer', 'Office Coordinator', 'Data Entry Specialist'],
  'Bisnis': ['Human Resource Staff', 'Business Analyst', 'Project Coordinator'],
  'Data & AI': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer'],
  'Keamanan Siber': ['Cyber Security Analyst', 'SOC Analyst', 'Security Engineer'],
  'Kreatif & Desain': ['UI/UX Designer', 'Product Designer', 'Visual Designer'],
  'Pemasaran': ['Digital Marketing Specialist', 'SEO Specialist', 'Content Strategist'],
  'Pendidikan': ['Teacher', 'Instructional Designer', 'Education Consultant'],
  'Rekayasa Perangkat Lunak': ['Software Engineer', 'Fullstack Developer', 'Backend Developer'],
};

function normalizeAiResponse(json = {}) {
  const data = typeof json === 'string' ? { prediction: json } : Array.isArray(json) ? { prediction: json[0] } : (json || {});
  const rawCategory = data.recommendedCategory || data.prediction || data.category || data.label || data.result || data.career || 'Bisnis';
  const category = normalizeCategoryName(rawCategory) || 'Bisnis';
  const confidenceRaw = Number(data.confidence || data.probability || data.score || 0.78);
  const matchScore = Number(data.matchScore || Math.round(Math.min(0.98, Math.max(0.52, confidenceRaw)) * 100));
  const defaultPaths = TOP_PATHS[category] || [category, 'Career Specialist', 'Professional Role'];

  const topPathMatches = Array.isArray(data.topPathMatches)
    ? data.topPathMatches.slice(0, 3).map((item, index) => ({
      name: item.name || item.title || item.career || String(item),
      score: Number(item.score || Math.max(50, matchScore - index * 4)),
    }))
    : (Array.isArray(data.recommendedCareers) ? data.recommendedCareers : defaultPaths).slice(0, 3).map((name, index) => ({
      name: typeof name === 'string' ? name : name.name || name.title || String(name),
      score: Math.max(50, matchScore - index * 4),
    }));

  return {
    success: data.success !== false,
    prediction: category,
    recommendedCategory: category,
    profileTitle: data.profileTitle || PROFILE_TITLES[category] || category,
    confidence: Number((matchScore / 100).toFixed(2)),
    matchScore,
    level: data.level || (matchScore >= 85 ? 'ELITE PROFILE' : matchScore >= 70 ? 'STRONG PROFILE' : 'GROWING PROFILE'),
    topPathMatches,
    recommendedCareers: topPathMatches.map((item) => item.name),
    matchedKeywords: data.matchedKeywords || [],
    reason: data.reason || `AI rekomendasi membaca profil kamu paling cocok ke ${category}.`,
    suggestions: data.suggestions || [
      `Perkuat project dan skill yang relevan dengan ${category}.`,
      'Lengkapi pengalaman, education, skill, certification, dan project agar hasil AI makin akurat.',
      'Generate CV memakai data terbaru dari dashboard.',
    ],
    rankedCategories: data.rankedCategories || [],
    engine: data.engine || 'carevo-ai-api-/predict',
    modelLoaded: data.modelLoaded,
  };
}

async function predictWithTensorFlow(cvData = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_SERVICE_TIMEOUT_MS);
  const skillsText = collectCvText(cvData);

  try {
    const response = await fetch(`${AI_SERVICE_URL.replace(/\/$/, '')}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({ skills_text: skillsText || 'general profile' }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`AI service error ${response.status}: ${detail}`);
    }

    const json = await response.json();
    return correctCareerPrediction(skillsText, normalizeAiResponse(json));
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  predictWithTensorFlow,
  normalizeAiResponse,
};
