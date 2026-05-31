
const safe = (value) => String(value || '').toLowerCase();
const read = (value) => {
  if (!value) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return value.name || value.skillName || value.title || value.language || value.jobTitle || value.companyName || value.institutionName || value.degreeMajor || value.certificateName || value.description || '';
};

const CATEGORY_MODEL = [
  {
    category: 'Data Science',
    profileTitle: 'Data Science',
    paths: ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Business Intelligence Analyst'],
    keywords: {
      python: 6, sql: 6, data: 5, analytics: 5, analysis: 5, machine: 6, learning: 5, ai: 5, statistics: 4,
      dashboard: 4, visualization: 4, pandas: 5, tensorflow: 5, excel: 3, database: 3, postgresql: 4,
    },
  },
  {
    category: 'Software Engineering',
    profileTitle: 'Software Engineer',
    paths: ['Fullstack Developer', 'Backend Developer', 'Frontend Developer', 'Software Engineer'],
    keywords: {
      javascript: 6, react: 6, node: 6, express: 5, api: 5, rest: 5, html: 3, css: 3, frontend: 5,
      backend: 5, fullstack: 6, software: 5, programming: 4, web: 4, git: 3, database: 3,
    },
  },
  {
    category: 'UI/UX Design',
    profileTitle: 'UI/UX Designer',
    paths: ['UI Designer', 'UX Researcher', 'Product Designer', 'Design Systems Architect'],
    keywords: {
      figma: 6, ui: 6, ux: 6, design: 5, wireframe: 5, prototype: 5, user: 3, research: 4,
      visual: 3, photoshop: 3, illustrator: 3, interface: 4,
    },
  },
  {
    category: 'Culinary & Hospitality',
    profileTitle: 'Culinary Professional',
    paths: ['Chef', 'Culinary Specialist', 'Restaurant Operations', 'Food Product Developer'],
    keywords: {
      chef: 7, cooking: 7, culinary: 7, food: 5, kitchen: 5, restaurant: 5, baking: 5, hospitality: 5,
      recipe: 4, cuisine: 5, pastry: 5,
    },
  },
  {
    category: 'Business & Product',
    profileTitle: 'Business & Product',
    paths: ['Product Manager', 'Business Analyst', 'Project Manager', 'Operations Analyst'],
    keywords: {
      business: 6, management: 5, product: 5, strategy: 5, marketing: 4, sales: 4, operation: 4,
      project: 4, leadership: 4, communication: 3, finance: 4,
    },
  },
  {
    category: 'Digital Marketing',
    profileTitle: 'Digital Marketing',
    paths: ['Digital Marketing Specialist', 'SEO Specialist', 'Content Strategist', 'Social Media Specialist'],
    keywords: {
      marketing: 7, seo: 6, content: 5, social: 5, media: 4, campaign: 5, copywriting: 5,
      brand: 4, ads: 5, analytics: 3,
    },
  },
];

function collectCvText(cvData = {}) {
  const chunks = [];
  const add = (v) => { const t = read(v); if (t) chunks.push(t); };
  const p = cvData.personalInfo || cvData.profile || {};
  add(p.fullName); add(p.careerInterest); add(p.professionalTitle); add(p.shortBio); add(p.location);
  (cvData.skills || cvData.skillList || []).forEach((s) => { add(s.name || s); add(s.category); add(s.level); });
  (cvData.experiences || []).forEach((x) => { add(x.jobTitle); add(x.companyName); add(x.employmentType); add(x.location); add(x.description); (x.skillsUsed || []).forEach(add); });
  (cvData.educations || []).forEach((x) => { add(x.institutionName); add(x.degreeMajor); add(x.description); add(x.gpa); });
  (cvData.projects || cvData.projectList || []).forEach((x) => { add(x.title); add(x.role); add(x.description); });
  (cvData.certifications || cvData.certificationList || []).forEach((x) => { add(x.certificateName || x.name); add(x.issuer); add(x.description); });
  (cvData.languages || cvData.languageList || []).forEach((x) => { add(x.language); add(x.proficiency); });
  return safe(chunks.join(' '));
}

function scoreText(text, model) {
  let score = 0;
  const matched = [];
  for (const [keyword, weight] of Object.entries(model.keywords)) {
    const pattern = new RegExp(`(^|\\W)${keyword.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}(\\W|$)`, 'i');
    if (pattern.test(text)) { score += weight; matched.push(keyword); }
  }
  return { score, matched };
}

function recommendFromCvData(cvData = {}) {
  const text = collectCvText(cvData);
  const raw = CATEGORY_MODEL.map((model) => ({ ...model, ...scoreText(text, model) }))
    .sort((a, b) => b.score - a.score);
  const best = raw[0];
  const second = raw[1];
  const fallback = !best || best.score <= 0;
  const top = fallback ? CATEGORY_MODEL[1] : best;
  const total = raw.reduce((sum, item) => sum + item.score, 0) || top.score || 1;
  const matchScore = fallback ? 45 : Math.max(62, Math.min(98, Math.round((top.score / total) * 100 + 45)));
  const rankedCategories = raw.map((item) => ({ category: item.category, score: item.score, match: Math.max(0, Math.min(98, Math.round((item.score / total) * 100 + 40))), matchedKeywords: item.matched }));

  return {
    recommendedCategory: top.category,
    profileTitle: top.profileTitle,
    confidence: Number((matchScore / 100).toFixed(2)),
    matchScore,
    level: matchScore >= 85 ? 'ELITE PROFILE' : matchScore >= 70 ? 'STRONG PROFILE' : matchScore >= 55 ? 'GROWING PROFILE' : 'START PROFILE',
    topPathMatches: top.paths.map((name, index) => ({ name, score: Math.max(55, matchScore - index * 4) })),
    matchedKeywords: fallback ? [] : top.matched,
    reason: fallback
      ? 'Data belum cukup kuat, jadi CAREVO memberi rekomendasi awal yang masih bisa berubah setelah profil dilengkapi.'
      : `Data profil, skill, education, experience, project, dan certification paling kuat mengarah ke ${top.category}.`,
    suggestions: [
      `Perkuat skill yang relevan dengan ${top.category}.`,
      'Tambahkan project atau pengalaman yang mendukung rekomendasi karier ini.',
      'Perbarui deskripsi profil agar CV lebih cocok dengan hasil AI.',
    ],
    rankedCategories,
  };
}

module.exports = { recommendFromCvData, collectCvText };
