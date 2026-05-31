
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('carevo_token');

export const setSession = (data) => {
  if (data?.token) localStorage.setItem('carevo_token', data.token);
  if (data?.user) localStorage.setItem('carevo_user', JSON.stringify(data.user));
};

export const clearSession = () => {
  localStorage.removeItem('carevo_token');
  localStorage.removeItem('carevo_user');
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('carevo_user') || 'null');
  } catch {
    return null;
  }
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server.');
  }

  return data;
};

export const authApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
};

export const profileApi = {
  get: () => request('/profile'),
  create: (payload) => request('/profile', { method: 'POST', body: JSON.stringify(payload) }),
  update: (payload) => request('/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  remove: () => request('/profile', { method: 'DELETE' }),
};

const crudApi = (resource) => ({
  getAll: () => request(`/${resource}`),
  getById: (id) => request(`/${resource}/${id}`),
  create: (payload) => request(`/${resource}`, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => request(`/${resource}/${id}`, { method: 'DELETE' }),
});

export const educationApi = crudApi('educations');
export const skillApi = {
  ...crudApi('skills'),
  bulk: (payload) => request('/skills/bulk', { method: 'POST', body: JSON.stringify(payload) }),
};
export const certificationApi = crudApi('certifications');
export const experienceApi = crudApi('experiences');
export const projectApi = crudApi('projects');
export const languageApi = crudApi('languages');

export const dashboardApi = {
  summary: () => request('/dashboard/summary'),
  completeness: () => request('/dashboard/completeness'),
};

const first = (value) => (Array.isArray(value) ? value[0] : value) || {};
const nonEmpty = (value) => String(value || '').trim().length > 0;
const readable = (value) => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  return String(value.name || value.skillName || value.title || value.language || value.jobTitle || value.companyName || value.institutionName || value.certificateName || '').trim();
};
const uniqueBy = (items, keyGetter) => {
  const seen = new Set();
  return (items || []).filter((item) => {
    if (!item) return false;
    const key = String(keyGetter(item) || '').trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const safeRemoveAll = async (api) => {
  try {
    const result = await api.getAll();
    const list = Object.values(result).find(Array.isArray) || [];
    await Promise.all(list.map((item) => item?.id && api.remove(item.id)));
  } catch (error) {
    console.warn('Skip remove old data:', error.message);
  }
};

export const getFullProfileData = async () => {
  const [profileRes, eduRes, skillRes, certRes, expRes, projectRes, langRes] = await Promise.all([
    profileApi.get().catch(() => ({ profile: null })),
    educationApi.getAll().catch(() => ({ educations: [] })),
    skillApi.getAll().catch(() => ({ skills: [] })),
    certificationApi.getAll().catch(() => ({ certifications: [] })),
    experienceApi.getAll().catch(() => ({ experiences: [] })),
    projectApi.getAll().catch(() => ({ projects: [] })),
    languageApi.getAll().catch(() => ({ languages: [] })),
  ]);

  const profile = profileRes.profile || {};
  const educations = eduRes.educations || [];
  const skills = skillRes.skills || [];
  const certifications = certRes.certifications || [];
  const experiences = expRes.experiences || [];
  const projects = projectRes.projects || [];
  const languages = langRes.languages || [];

  return {
    personalInfo: profile,
    education: educations[0] || {},
    educations,
    skills: {
      selectedSkills: skills.map((skill) => ({ name: skill.name, category: skill.category || 'General', level: skill.level || 'Basic' })),
      skillCategory: skills[0]?.category || 'General',
      proficiencyLevel: skills[0]?.level || 'Basic',
    },
    skillList: skills,
    certifications: certifications[0] || {},
    certificationList: certifications,
    experience: experiences[0] || {},
    experiences,
    projects: projects[0] || {},
    projectList: projects,
    languages: languages[0] || {},
    languageList: languages,
  };
};

export const saveFullFormDataToBackend = async (formData = {}) => {
  const personalInfo = formData.personalInfo || {};

  const normalizeList = (...values) => {
    for (const value of values) {
      if (Array.isArray(value) && value.length > 0) return value.filter(Boolean);
    }
    return [];
  };

  const singleIfFilled = (value, keys = []) => {
    if (!value || Array.isArray(value)) return [];
    return keys.some((key) => nonEmpty(value[key])) ? [value] : [];
  };

  const educations = uniqueBy([
    ...normalizeList(formData.educations, formData.educationList),
    ...singleIfFilled(formData.education, ['institutionName', 'schoolName', 'degreeMajor', 'degree']),
  ], (item) => [item.institutionName || item.schoolName || item.institution, item.degreeMajor || item.degree, item.startDate].join('|'));

  const certifications = uniqueBy([
    ...normalizeList(formData.certificationList, formData.certificationsList, Array.isArray(formData.certifications) ? formData.certifications : []),
    ...singleIfFilled(!Array.isArray(formData.certifications) ? formData.certifications : null, ['certificateName', 'issuer']),
    ...singleIfFilled(formData.certification, ['certificateName', 'issuer']),
  ], (item) => [item.certificateName || item.name || item.certificationName, item.issuer, item.issueDate].join('|'));

  const experiences = uniqueBy([
    ...normalizeList(formData.experiences, formData.experienceList),
    ...singleIfFilled(formData.experience, ['jobTitle', 'companyName']),
  ], (item) => [item.jobTitle, item.companyName, item.startDate, item.endDate].join('|'));

  const projects = uniqueBy([
    ...normalizeList(formData.projectList, formData.projectsList, Array.isArray(formData.projects) ? formData.projects : []),
    ...singleIfFilled(!Array.isArray(formData.projects) ? formData.projects : null, ['title', 'role']),
    ...singleIfFilled(formData.project, ['title', 'role']),
  ], (item) => [item.title, item.role, item.startDate].join('|'));

  const languages = uniqueBy([
    ...normalizeList(formData.languageList, formData.languagesList, Array.isArray(formData.languages) ? formData.languages : []),
    ...singleIfFilled(!Array.isArray(formData.languages) ? formData.languages : null, ['language']),
    ...singleIfFilled(formData.language, ['language']),
  ], (item) => [item.language, item.proficiency, item.yearStarted].join('|'));

  const rawSkillList = normalizeList(formData.skillList, formData.skillsList, Array.isArray(formData.skills) ? formData.skills : []);
  const skillsData = formData.skills || {};
  const selectedSkillObjects = Array.isArray(skillsData.selectedSkills)
    ? skillsData.selectedSkills.map((item) => {
        if (typeof item === 'string') {
          return {
            name: item,
            category: skillsData.skillCategory || 'General',
            level: skillsData.proficiencyLevel || 'Basic',
          };
        }
        return {
          name: readable(item),
          category: item?.category || skillsData.skillCategory || 'General',
          level: item?.level || item?.proficiency || skillsData.proficiencyLevel || 'Basic',
        };
      })
    : [];

  const experienceSkillObjects = experiences.flatMap((experience) =>
    (Array.isArray(experience.skillsUsed) ? experience.skillsUsed : []).map((skill) => ({
      name: readable(skill),
      category: 'Experience',
      level: 'Intermediate',
    }))
  );

  const skills = [...rawSkillList, ...selectedSkillObjects, ...experienceSkillObjects]
    .map((item) => {
      if (typeof item === 'string') {
        return {
          name: item,
          category: skillsData.skillCategory || 'General',
          level: skillsData.proficiencyLevel || 'Basic',
        };
      }

      return {
        name: readable(item),
        category: item?.category || skillsData.skillCategory || 'General',
        level: item?.level || item?.proficiency || skillsData.proficiencyLevel || 'Basic',
      };
    })
    .filter((item, index, array) =>
      nonEmpty(item.name) &&
      array.findIndex((other) => String(other.name).trim().toLowerCase() === String(item.name).trim().toLowerCase()) === index
    );

  if (nonEmpty(personalInfo.fullName)) {
    await profileApi.create({
      fullName: personalInfo.fullName,
      careerInterest: personalInfo.careerInterest || personalInfo.professionalTitle,
      professionalTitle: personalInfo.professionalTitle || personalInfo.careerInterest,
      location: personalInfo.location,
      shortBio: personalInfo.shortBio,
      profileImage: personalInfo.profileImage,
      profileImageName: personalInfo.profileImageName,
    });
  }

  await Promise.all([
    safeRemoveAll(educationApi),
    safeRemoveAll(skillApi),
    safeRemoveAll(certificationApi),
    safeRemoveAll(experienceApi),
    safeRemoveAll(projectApi),
    safeRemoveAll(languageApi),
  ]);

  for (const item of educations) {
    if (nonEmpty(item.institutionName || item.schoolName || item.institution) && nonEmpty(item.degreeMajor || item.degree)) {
      await educationApi.create({
        ...item,
        institutionName: item.institutionName || item.schoolName || item.institution,
        degreeMajor: item.degreeMajor || item.degree,
      });
    }
  }

  for (const item of skills) {
    await skillApi.create({
      name: item.name,
      category: item.category || 'General',
      level: item.level || 'Basic',
    });
  }

  for (const item of experiences) {
    if (nonEmpty(item.jobTitle) && nonEmpty(item.companyName)) {
      await experienceApi.create(item);
    }
  }

  for (const item of certifications) {
    if (nonEmpty(item.certificateName || item.name) || nonEmpty(item.issuer)) {
      await certificationApi.create({
        ...item,
        certificateName: item.certificateName || item.name || item.certificationName,
      });
    }
  }

  for (const item of projects) {
    if (nonEmpty(item.title) || nonEmpty(item.role)) {
      await projectApi.create(item);
    }
  }

  for (const item of languages) {
    if (nonEmpty(item.language)) {
      await languageApi.create({
        ...item,
        proficiency: item.proficiency || 'Professional Working',
        usageFrequency: item.usageFrequency || 'Daily',
      });
    }
  }

  return getFullProfileData();
};

const downloadRequest = async (endpoint, payload = {}) => {
  const token = getToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Gagal download file CV.');
  }

  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="?([^";]+)"?/i);
  const fileName = match?.[1] || payload.fileName || 'CAREVO_CV';
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return { fileName };
};

export const cvApi = {
  data: () => request('/cv/data'),
  checklist: () => request('/cv/checklist'),
  preview: (payload) => request('/cv/preview', { method: 'POST', body: JSON.stringify(payload) }),
  generatePdf: (payload) => downloadRequest('/cv/generate-pdf', payload),
  generateDocx: (payload) => downloadRequest('/cv/generate-docx', payload),
};

export const careerApi = {
  categories: () => request('/career/categories'),
  keywords: () => request('/career/keywords'),
  recommendation: (payload = {}) => request('/career/recommendation', { method: 'POST', body: JSON.stringify(payload) }),
  importKeywords: (payload) => request('/career/import-keywords', { method: 'POST', body: JSON.stringify(payload) }),
};
