const db = require('../config/db');
const { success, error } = require('../utils/response');

const mapExperience = (row) => row && ({
  id: row.id,
  userId: row.user_id,
  jobTitle: row.job_title,
  companyName: row.company_name,
  employmentType: row.employment_type,
  location: row.location,
  startDate: row.start_date,
  endDate: row.end_date,
  currentlyWork: row.currently_work,
  description: row.description,
  skillsUsed: row.skills_used || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const experienceSelect = `
  SELECT e.*,
    COALESCE(
      json_agg(json_build_object('id', s.id, 'name', s.name, 'category', s.category, 'level', s.level))
      FILTER (WHERE s.id IS NOT NULL), '[]'
    ) AS skills_used
  FROM experiences e
  LEFT JOIN experience_skills es ON es.experience_id = e.id
  LEFT JOIN skills s ON s.id = es.skill_id
`;

const attachSkills = async (experienceId, userId, skillsUsed = []) => {
  if (!Array.isArray(skillsUsed)) return;

  await db.query('DELETE FROM experience_skills WHERE experience_id = $1', [experienceId]);

  for (const item of skillsUsed) {
    let skillId = null;

    if (typeof item === 'number') {
      const existing = await db.query('SELECT id FROM skills WHERE id=$1 AND user_id=$2', [item, userId]);
      if (existing.rows.length > 0) skillId = existing.rows[0].id;
    } else if (typeof item === 'string' && item.trim()) {
      const result = await db.query(
        `INSERT INTO skills (user_id, name)
         VALUES ($1, $2)
         ON CONFLICT (user_id, name) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
         RETURNING id`,
        [userId, item.trim()]
      );
      skillId = result.rows[0].id;
    } else if (item?.id) {
      const existing = await db.query('SELECT id FROM skills WHERE id=$1 AND user_id=$2', [item.id, userId]);
      if (existing.rows.length > 0) skillId = existing.rows[0].id;
    } else if (item?.name) {
      const result = await db.query(
        `INSERT INTO skills (user_id, name)
         VALUES ($1, $2)
         ON CONFLICT (user_id, name) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
         RETURNING id`,
        [userId, item.name]
      );
      skillId = result.rows[0].id;
    }

    if (skillId) {
      await db.query(
        `INSERT INTO experience_skills (experience_id, skill_id)
         VALUES ($1,$2)
         ON CONFLICT (experience_id, skill_id) DO NOTHING`,
        [experienceId, skillId]
      );
    }
  }
};

const getExperiences = async (req, res) => {
  const result = await db.query(
    `${experienceSelect}
     WHERE e.user_id=$1
     GROUP BY e.id
     ORDER BY e.start_date DESC NULLS LAST, e.id DESC`,
    [req.user.id]
  );
  return success(res, 200, 'Experiences berhasil diambil.', { experiences: result.rows.map(mapExperience) });
};

const getExperienceById = async (req, res) => {
  const result = await db.query(
    `${experienceSelect}
     WHERE e.id=$1 AND e.user_id=$2
     GROUP BY e.id`,
    [req.params.id, req.user.id]
  );
  if (result.rows.length === 0) return error(res, 404, 'Experience tidak ditemukan.');
  return success(res, 200, 'Experience berhasil diambil.', { experience: mapExperience(result.rows[0]) });
};

const createExperience = async (req, res) => {
  const { jobTitle, companyName, employmentType, location, startDate, endDate, currentlyWork, description, skillsUsed } = req.body;
  if (!jobTitle || !companyName) return error(res, 400, 'Job Title dan Company Name wajib diisi.');

  const result = await db.query(
    `INSERT INTO experiences
      (user_id, job_title, company_name, employment_type, location, start_date, end_date, currently_work, description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [req.user.id, jobTitle, companyName, employmentType || 'Full-time', location || null, startDate || null, currentlyWork ? null : endDate || null, !!currentlyWork, description || null]
  );

  await attachSkills(result.rows[0].id, req.user.id, skillsUsed);

  const saved = await db.query(`${experienceSelect} WHERE e.id=$1 AND e.user_id=$2 GROUP BY e.id`, [result.rows[0].id, req.user.id]);
  return success(res, 201, 'Experience berhasil ditambahkan.', { experience: mapExperience(saved.rows[0]) });
};

const updateExperience = async (req, res) => {
  const oldData = await db.query('SELECT * FROM experiences WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  if (oldData.rows.length === 0) return error(res, 404, 'Experience tidak ditemukan.');

  const old = mapExperience(oldData.rows[0]);
  const body = req.body;
  const currentlyWork = body.currentlyWork ?? old.currentlyWork;
  const result = await db.query(
    `UPDATE experiences SET
      job_title=$1, company_name=$2, employment_type=$3, location=$4,
      start_date=$5, end_date=$6, currently_work=$7, description=$8, updated_at=CURRENT_TIMESTAMP
     WHERE id=$9 AND user_id=$10 RETURNING *`,
    [
      body.jobTitle ?? old.jobTitle,
      body.companyName ?? old.companyName,
      body.employmentType ?? old.employmentType,
      body.location ?? old.location,
      body.startDate ?? old.startDate,
      currentlyWork ? null : (body.endDate ?? old.endDate),
      currentlyWork,
      body.description ?? old.description,
      req.params.id,
      req.user.id,
    ]
  );

  if (Array.isArray(body.skillsUsed)) await attachSkills(result.rows[0].id, req.user.id, body.skillsUsed);

  const saved = await db.query(`${experienceSelect} WHERE e.id=$1 AND e.user_id=$2 GROUP BY e.id`, [req.params.id, req.user.id]);
  return success(res, 200, 'Experience berhasil diupdate.', { experience: mapExperience(saved.rows[0]) });
};

const deleteExperience = async (req, res) => {
  const result = await db.query('DELETE FROM experiences WHERE id=$1 AND user_id=$2 RETURNING id', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return error(res, 404, 'Experience tidak ditemukan.');
  return success(res, 200, 'Experience berhasil dihapus.');
};

module.exports = { getExperiences, getExperienceById, createExperience, updateExperience, deleteExperience };
