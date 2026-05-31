export function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value].filter(Boolean);
}

export function readableText(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value).trim();
  if (typeof value === 'object') {
    return String(value.name || value.skillName || value.title || value.language || value.jobTitle || value.companyName || value.institutionName || value.certificateName || '').trim();
  }
  return '';
}

export function mergeUniqueList(...lists) {
  const flat = lists.flatMap((item) => asArray(item));
  const seen = new Set();

  return flat.filter((item) => {
    const key = String(
      item?.id ||
      [
        readableText(item?.name || item?.skillName || item?.title || item?.language || item?.jobTitle || item?.institutionName || item?.certificateName),
        readableText(item?.companyName || item?.degreeMajor || item?.issuer),
        readableText(item?.startDate),
        readableText(item?.endDate),
      ].filter(Boolean).join('|') ||
      JSON.stringify(item)
    ).toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function text(value) {
  return readableText(value);
}

export function hasPersonalInfo(formData) {
  const p = formData?.personalInfo || {};
  return Boolean(text(p.fullName) && (text(p.professionalTitle) || text(p.careerInterest)) && text(p.location));
}

export function getExperienceList(formData) {
  const list = mergeUniqueList(formData?.experiences, formData?.experienceList);
  if (list.length) return list;
  const e = formData?.experience || {};
  return text(e.jobTitle) || text(e.companyName) ? [e] : [];
}

export function getEducationList(formData) {
  const list = mergeUniqueList(formData?.educations, formData?.educationList);
  if (list.length) return list;
  const e = formData?.education || {};
  return text(e.institutionName) || text(e.degreeMajor) ? [e] : [];
}

export function getProjectList(formData) {
  const list = mergeUniqueList(formData?.projectList, formData?.projectsList, Array.isArray(formData?.projects) ? formData.projects : []);
  if (list.length) return list;
  const p = formData?.projects || formData?.project || {};
  return text(p.title) || text(p.role) || p.thumbnail ? [p] : [];
}

export function getCertificationList(formData) {
  const list = mergeUniqueList(formData?.certificationList, formData?.certificationsList, Array.isArray(formData?.certifications) ? formData.certifications : []);
  if (list.length) return list;
  const c = formData?.certifications || formData?.certification || {};
  return text(c.certificateName) || text(c.issuer) ? [c] : [];
}

export function getLanguageList(formData) {
  const list = mergeUniqueList(formData?.languageList, formData?.languagesList, Array.isArray(formData?.languages) ? formData.languages : []);
  if (list.length) return list;
  const l = formData?.languages || formData?.language || {};
  return text(l.language) ? [l] : [];
}

export function hasExperience(formData) {
  return getExperienceList(formData).length > 0;
}

export function hasEducation(formData) {
  return getEducationList(formData).length > 0;
}

export function hasProject(formData) {
  return getProjectList(formData).length > 0;
}

export function hasCertification(formData) {
  return getCertificationList(formData).length > 0;
}

export function hasLanguage(formData) {
  return getLanguageList(formData).length > 0;
}

export function getSkillPercent(level) {
  if (level === 'Expert') return 92;
  if (level === 'Advanced') return 78;
  if (level === 'Intermediate') return 58;
  return 35;
}

export function getLanguagePercent(proficiency) {
  if (proficiency === 'Native Speaker' || proficiency === 'Native') return 100;
  if (proficiency === 'Professional Working' || proficiency === 'Professional') return 85;
  if (proficiency === 'Fluent') return 75;
  if (proficiency === 'Advanced') return 65;
  if (proficiency === 'Intermediate') return 45;
  return 25;
}

export function hasSkills(formData) {
  return getSkillList(formData).length > 0;
}

export function formatDate(date) {
  if (!date) return '-';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatYear(date) {
  if (!date) return '-';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date).slice(0, 4);
  return parsed.getFullYear();
}

export function getChecks(formData) {
  return {
    personalInfo: hasPersonalInfo(formData),
    experience: hasExperience(formData),
    education: hasEducation(formData),
    skills: hasSkills(formData),
    projects: hasProject(formData),
    certifications: hasCertification(formData),
    languages: hasLanguage(formData),
  };
}

export function getCompletionScore(formData) {
  const checks = getChecks(formData);
  const required = ['personalInfo', 'experience', 'education', 'skills', 'certifications'];
  const optional = ['projects', 'languages'];
  const requiredScore = required.reduce((sum, key) => sum + (checks[key] ? 16 : 0), 0);
  const optionalScore = optional.reduce((sum, key) => sum + (checks[key] ? 10 : 0), 0);
  return Math.min(100, requiredScore + optionalScore);
}

export function getProfile(formData) {
  const p = formData?.personalInfo || {};
  return {
    name: text(p.fullName) || 'CAREVO User',
    title: text(p.professionalTitle) || text(p.careerInterest) || 'Career Explorer',
    location: text(p.location) || 'Location not set',
    bio: text(p.shortBio) || 'Lengkapi bio singkat agar profil terlihat lebih profesional.',
    image: p.profileImage || '',
  };
}

export function getSkillList(formData) {
  const skillObjects = mergeUniqueList(formData?.skillList, formData?.skillsList);
  const selected = asArray(formData?.skills?.selectedSkills).map((item) =>
    typeof item === 'string'
      ? { name: item, category: formData?.skills?.skillCategory || 'General', level: formData?.skills?.proficiencyLevel || 'Basic' }
      : item
  );

  const expSkills = getExperienceList(formData).flatMap((exp) =>
    asArray(exp?.skillsUsed).map((item) => ({
      name: typeof item === 'string' ? item : item?.name,
      category: 'Experience',
      level: 'Intermediate',
    }))
  );

  const merged = [...skillObjects, ...selected, ...expSkills]
    .map((item) => (typeof item === 'string' ? { name: item } : item))
    .filter((item) => text(item?.name || item?.skillName || item?.title));

  return merged.filter((item, index, arr) => {
    const name = text(item.name || item.skillName || item.title).toLowerCase();
    return arr.findIndex((other) => text(other.name || other.skillName || other.title).toLowerCase() === name) === index;
  });
}
