const db = require('../config/db');

const mapProfile = (row) => row && ({
  id: row.id,
  userId: row.user_id,
  fullName: row.full_name,
  careerInterest: row.career_interest,
  professionalTitle: row.professional_title,
  location: row.location,
  shortBio: row.short_bio,
  profileImage: row.profile_image,
  profileImageName: row.profile_image_name,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapEducation = (row) => row && ({
  id: row.id,
  institutionName: row.institution_name,
  degreeMajor: row.degree_major,
  startDate: row.start_date,
  endDate: row.end_date,
  currentlyStudy: row.currently_study,
  location: row.location,
  gpa: row.gpa,
  description: row.description,
});

const mapSkill = (row) => row && ({
  id: row.id,
  name: row.name,
  category: row.category,
  level: row.level,
});

const mapCertification = (row) => row && ({
  id: row.id,
  certificateName: row.certificate_name,
  name: row.certificate_name,
  issuer: row.issuer,
  issuingOrganization: row.issuer,
  issueDate: row.issue_date,
  credentialUrl: row.credential_url,
  description: row.description,
});

const mapProject = (row) => row && ({
  id: row.id,
  thumbnail: row.thumbnail,
  title: row.title,
  status: row.status,
  role: row.role,
  startDate: row.start_date,
  endDate: row.end_date,
  description: row.description,
  demoUrl: row.demo_url,
  githubUrl: row.github_url,
  featured: row.featured,
});

const mapLanguage = (row) => row && ({
  id: row.id,
  language: row.language,
  proficiency: row.proficiency,
  yearStarted: row.year_started,
  usageFrequency: row.usage_frequency,
  flagCode: row.flag_code,
  flagUrl: row.flag_url,
});

const mapExperience = (row) => row && ({
  id: row.id,
  jobTitle: row.job_title,
  companyName: row.company_name,
  employmentType: row.employment_type,
  location: row.location,
  startDate: row.start_date,
  endDate: row.end_date,
  currentlyWork: row.currently_work,
  description: row.description,
  skillsUsed: row.skills_used || [],
});

const getCvDataByUserId = async (userId) => {
  const [profile, educations, skills, certifications, experiences, projects, languages, settings] = await Promise.all([
    db.query('SELECT * FROM profile_infos WHERE user_id=$1', [userId]),
    db.query('SELECT * FROM educations WHERE user_id=$1 ORDER BY start_date DESC NULLS LAST, id DESC', [userId]),
    db.query('SELECT * FROM skills WHERE user_id=$1 ORDER BY category NULLS LAST, name ASC', [userId]),
    db.query('SELECT * FROM certifications WHERE user_id=$1 ORDER BY issue_date DESC NULLS LAST, id DESC', [userId]),
    db.query(`
      SELECT e.*,
        COALESCE(
          json_agg(json_build_object('id', s.id, 'name', s.name, 'category', s.category, 'level', s.level))
          FILTER (WHERE s.id IS NOT NULL), '[]'
        ) AS skills_used
      FROM experiences e
      LEFT JOIN experience_skills es ON es.experience_id=e.id
      LEFT JOIN skills s ON s.id=es.skill_id
      WHERE e.user_id=$1
      GROUP BY e.id
      ORDER BY e.start_date DESC NULLS LAST, e.id DESC
    `, [userId]),
    db.query('SELECT * FROM projects WHERE user_id=$1 ORDER BY featured DESC, start_date DESC NULLS LAST, id DESC', [userId]),
    db.query('SELECT * FROM languages WHERE user_id=$1 ORDER BY id DESC', [userId]),
    db.query('SELECT * FROM cv_settings WHERE user_id=$1', [userId]),
  ]);

  const data = {
    personalInfo: mapProfile(profile.rows[0]) || null,
    profile: mapProfile(profile.rows[0]) || null,
    educations: educations.rows.map(mapEducation),
    education: mapEducation(educations.rows[0]) || null,
    skills: skills.rows.map(mapSkill),
    skillList: skills.rows.map(mapSkill),
    certifications: certifications.rows.map(mapCertification),
    certificationList: certifications.rows.map(mapCertification),
    experiences: experiences.rows.map(mapExperience),
    experience: mapExperience(experiences.rows[0]) || null,
    projects: projects.rows.map(mapProject),
    projectList: projects.rows.map(mapProject),
    languages: languages.rows.map(mapLanguage),
    languageList: languages.rows.map(mapLanguage),
    settings: settings.rows[0] || null,
  };

  return data;
};

const buildChecklist = (cvData) => ({
  personalInfo: !!cvData.personalInfo,
  profile: !!cvData.personalInfo,
  experience: cvData.experiences.length > 0,
  education: cvData.educations.length > 0,
  skills: cvData.skills.length > 0,
  projects: cvData.projects.length > 0,
  certifications: cvData.certifications.length > 0,
  languages: cvData.languages.length > 0,
});

const normalizeSections = (sections = {}) => ({
  personalInfo: sections.personalInfo ?? sections.profile ?? true,
  experience: sections.experience ?? true,
  education: sections.education ?? true,
  skills: sections.skills ?? true,
  projects: sections.projects ?? true,
  certifications: sections.certifications ?? true,
  languages: sections.languages ?? true,
});

const buildPreviewData = (cvData, sections = {}) => {
  const include = normalizeSections(sections);
  return {
    personalInfo: include.personalInfo ? cvData.personalInfo : null,
    experiences: include.experience ? cvData.experiences : [],
    educations: include.education ? cvData.educations : [],
    skills: include.skills ? cvData.skills : [],
    projects: include.projects ? cvData.projects : [],
    certifications: include.certifications ? cvData.certifications : [],
    languages: include.languages ? cvData.languages : [],
    checklist: buildChecklist(cvData),
    generatedAt: new Date().toISOString(),
  };
};

module.exports = { getCvDataByUserId, buildChecklist, buildPreviewData, normalizeSections };
