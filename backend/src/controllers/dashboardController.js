
const db = require('../config/db');
const { success } = require('../utils/response');

const count = async (table, userId) => {
  const result = await db.query(`SELECT COUNT(*)::int AS total FROM ${table} WHERE user_id = $1`, [userId]);
  return result.rows[0]?.total || 0;
};

const getDashboardSummary = async (req, res) => {
  const userId = req.user.id;

  const [profile, educations, skills, certifications, experiences, projects, languages] = await Promise.all([
    count('profile_infos', userId),
    count('educations', userId),
    count('skills', userId),
    count('certifications', userId),
    count('experiences', userId),
    count('projects', userId),
    count('languages', userId),
  ]);

  const completedSections = [];
  const missingSections = [];

  const sections = {
    personalInfo: profile > 0,
    experience: experiences > 0,
    education: educations > 0,
    skills: skills > 0,
    projects: projects > 0,
    certifications: certifications > 0,
    languages: languages > 0,
  };

  Object.entries(sections).forEach(([key, value]) => {
    if (value) completedSections.push(key);
    else missingSections.push(key);
  });

  const requiredKeys = ['personalInfo', 'experience', 'education', 'skills'];
  const optionalKeys = ['projects', 'certifications', 'languages'];
  const requiredScore = requiredKeys.reduce((sum, key) => sum + (sections[key] ? 20 : 0), 0);
  const optionalScore = optionalKeys.reduce((sum, key) => sum + (sections[key] ? 6 : 0), 0);
  const percentage = Math.min(100, requiredScore + optionalScore);

  return success(res, 200, 'Dashboard summary berhasil diambil.', {
    totals: {
      profile,
      educations,
      skills,
      certifications,
      experiences,
      projects,
      languages,
    },
    completeness: {
      percentage,
      completedSections,
      missingSections,
      sections,
    },
  });
};

const getDashboardCompleteness = async (req, res) => {
  const userId = req.user.id;

  const [profile, educations, skills, certifications, experiences, projects, languages] = await Promise.all([
    count('profile_infos', userId),
    count('educations', userId),
    count('skills', userId),
    count('certifications', userId),
    count('experiences', userId),
    count('projects', userId),
    count('languages', userId),
  ]);

  const sections = {
    personalInfo: profile > 0,
    experience: experiences > 0,
    education: educations > 0,
    skills: skills > 0,
    projects: projects > 0,
    certifications: certifications > 0,
    languages: languages > 0,
  };

  const completedSections = Object.keys(sections).filter((key) => sections[key]);
  const missingSections = Object.keys(sections).filter((key) => !sections[key]);
  const requiredCompleted = ['personalInfo', 'experience', 'education', 'skills'].every((key) => sections[key]);

  return success(res, 200, 'Dashboard completeness berhasil diambil.', {
    completedSections,
    missingSections,
    sections,
    requiredCompleted,
  });
};

module.exports = { getDashboardSummary, getDashboardCompleteness };
