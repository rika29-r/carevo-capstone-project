const { collectCvText } = require('./careerAiService');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const AI_SERVICE_TIMEOUT_MS = Number(process.env.AI_SERVICE_TIMEOUT_MS || 10000);

const PROFILE_TITLES = {
  'Administrasi': 'Administrative Specialist',
  'Bisnis': 'Business Analyst',
  'Data & AI': 'Data Science',
  'Keamanan Siber': 'Cyber Security Analyst',
  'Kreatif & Desain': 'UI/UX Designer',
  'Pemasaran': 'Digital Marketing Specialist',
  'Pendidikan': 'Education Specialist',
  'Rekayasa Perangkat Lunak': 'Software Engineer',
};

const TOP_PATHS = {
  'Administrasi': ['Administrative Officer', 'Office Coordinator', 'Data Entry Specialist'],
  'Bisnis': ['Business Analyst', 'Project Manager', 'Operations Analyst'],
  'Data & AI': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer'],
  'Keamanan Siber': ['Cyber Security Analyst', 'SOC Analyst', 'Security Engineer'],
  'Kreatif & Desain': ['UI/UX Designer', 'Product Designer', 'Visual Designer'],
  'Pemasaran': ['Digital Marketing Specialist', 'SEO Specialist', 'Content Strategist'],
  'Pendidikan': ['Teacher', 'Instructional Designer', 'Education Consultant'],
  'Rekayasa Perangkat Lunak': ['Software Engineer', 'Fullstack Developer', 'Backend Developer'],
};

function normalizeAiResponse(json = {}) {
  const rawResponse = json;
  const data =
    typeof rawResponse === 'string'
      ? { prediction: rawResponse }
      : Array.isArray(rawResponse)
        ? { prediction: rawResponse[0] }
        : rawResponse || {};

  const rawCategory =
    data.recommendedCategory ||
    data.prediction ||
    data.category ||
    data.label ||
    data.result ||
    data.career ||
    'Rekayasa Perangkat Lunak';

  const category = String(rawCategory || 'Rekayasa Perangkat Lunak').trim();
  const confidence = Number(data.confidence || data.probability || data.score || data.matchScore || 0.88);
  const matchScore = Number(json.matchScore || Math.round(Math.min(0.98, Math.max(0.52, confidence)) * 100));
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
      'Generate CV akan memakai data terbaru dan rekomendasi AI ini.',
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
    // Sesuai API AI yang diberikan: POST /predict dengan body { skills_text: "..." }
    const response = await fetch(`${AI_SERVICE_URL.replace(/\/$/, '')}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Dibutuhkan kalau AI dibuka lewat ngrok free di browser/server tertentu.
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
    return normalizeAiResponse(json);
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  predictWithTensorFlow,
  normalizeAiResponse,
};
