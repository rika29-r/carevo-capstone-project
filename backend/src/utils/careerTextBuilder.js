const { normalizeText, getCoreRuleScores } = require('./careerDomainRules');

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function text(value) {
  return String(value ?? '').trim();
}

function push(parts, value) {
  if (value === null || value === undefined) return;
  if (typeof value === 'string' || typeof value === 'number') {
    const v = text(value);
    if (v) parts.push(v);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => push(parts, item));
    return;
  }
  if (typeof value === 'object') {
    [
      'fullName', 'careerInterest', 'professionalTitle', 'shortBio', 'location',
      'name', 'skillName', 'category', 'level', 'proficiency',
      'jobTitle', 'companyName', 'employmentType', 'description', 'skillsUsed',
      'institutionName', 'degreeMajor', 'gpa', 'educationDescription',
      'title', 'role', 'status', 'techStack', 'projectUrl',
      'certificateName', 'issuer', 'credentialId',
      'language', 'usageFrequency',
    ].forEach((key) => push(parts, value[key]));
  }
}

function sectionText(value) {
  const parts = [];
  push(parts, value);
  return parts.filter(Boolean).join(' ');
}

function inferKategoriKeahlian(textInput) {
  const { scores } = getCoreRuleScores(textInput);
  const [bestCategory, bestScore] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0] || ['', 0];
  if (!bestScore) return 'general';
  const map = {
    'Administrasi': 'administrasi',
    'Bisnis': 'bisnis manajemen',
    'Data & AI': 'data ai',
    'Keamanan Siber': 'keamanan siber',
    'Kreatif & Desain': 'kreatif desain',
    'Pemasaran': 'pemasaran',
    'Pendidikan': 'pendidikan konseling',
    'Rekayasa Perangkat Lunak': 'rekayasa perangkat lunak',
  };
  return map[bestCategory] || bestCategory;
}

function collectCvSections(cvData = {}) {
  const profile = cvData.personalInfo || cvData.profile || {};
  const skills = asArray(cvData.skillList || cvData.skills?.selectedSkills || cvData.skills || []);
  const experiences = asArray(cvData.experiences || cvData.experience || []);
  const projects = asArray(cvData.projectList || cvData.projects || cvData.project || []);
  const certifications = asArray(cvData.certificationList || cvData.certifications || cvData.certification || []);
  const educations = asArray(cvData.educations || cvData.education || []);
  const languages = asArray(cvData.languageList || cvData.languages || cvData.language || []);

  const keahlian = sectionText([
    skills.map((s) => [s.name, s.skillName, s.category, s.level].filter(Boolean).join(' ')),
    experiences.map((e) => [e.jobTitle, e.description, e.skillsUsed].filter(Boolean).join(' ')),
    projects.map((p) => [p.title, p.role, p.description].filter(Boolean).join(' ')),
  ]);

  const minat = sectionText([
    profile.careerInterest,
    profile.professionalTitle,
    profile.shortBio,
  ]);

  const pendidikan = sectionText(educations.map((e) => [e.degreeMajor, e.institutionName, e.description].filter(Boolean).join(' ')));
  const sertifikasi = sectionText(certifications.map((c) => [c.certificateName, c.name, c.issuer, c.description].filter(Boolean).join(' ')));
  const ipk = sectionText(educations.map((e) => e.gpa).filter(Boolean));
  const languageText = sectionText(languages.map((l) => [l.language, l.proficiency, l.usageFrequency].filter(Boolean).join(' ')));

  const kategori_keahlian = inferKategoriKeahlian(`${keahlian} ${minat} ${pendidikan} ${sertifikasi}`);
  const profil_gabungan = sectionText([keahlian, minat, pendidikan, sertifikasi, languageText]);

  return {
    keahlian,
    minat,
    pendidikan,
    sertifikasi,
    ipk,
    kategori_keahlian,
    profil_gabungan,
    languageText,
  };
}

function buildModelInputText(cvData = {}) {
  const sections = collectCvSections(cvData);

  // Format dibuat mirip training: keahlian + minat + kategori_keahlian + pendidikan + sertifikasi + ipk.
  // Field utama diberi bobot lebih besar tanpa mengubah frontend.
  const weighted = [
    sections.keahlian,
    sections.keahlian,
    sections.minat,
    sections.minat,
    sections.kategori_keahlian,
    sections.kategori_keahlian,
    sections.pendidikan,
    sections.sertifikasi,
    sections.ipk,
    sections.profil_gabungan,
  ].filter(Boolean).join(' ');

  return normalizeText(weighted || 'general profile');
}

module.exports = {
  collectCvSections,
  buildModelInputText,
  sectionText,
};
