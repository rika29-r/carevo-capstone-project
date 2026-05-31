const db = require('../config/db');
const { success, error } = require('../utils/response');

const mapEducation = (row) => row && ({
  id: row.id,
  userId: row.user_id,
  institutionName: row.institution_name,
  degreeMajor: row.degree_major,
  startDate: row.start_date,
  endDate: row.end_date,
  currentlyStudy: row.currently_study,
  location: row.location,
  gpa: row.gpa,
  description: row.description,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getEducations = async (req, res) => {
  const result = await db.query(
    'SELECT * FROM educations WHERE user_id = $1 ORDER BY start_date DESC NULLS LAST, id DESC',
    [req.user.id]
  );
  return success(res, 200, 'Education berhasil diambil.', { educations: result.rows.map(mapEducation) });
};

const getEducationById = async (req, res) => {
  const result = await db.query('SELECT * FROM educations WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return error(res, 404, 'Education tidak ditemukan.');
  return success(res, 200, 'Education berhasil diambil.', { education: mapEducation(result.rows[0]) });
};

const createEducation = async (req, res) => {
  const { institutionName, degreeMajor, startDate, endDate, currentlyStudy, location, gpa, description } = req.body;
  if (!institutionName || !degreeMajor) return error(res, 400, 'Institution Name dan Degree / Major wajib diisi.');

  const result = await db.query(
    `INSERT INTO educations
      (user_id, institution_name, degree_major, start_date, end_date, currently_study, location, gpa, description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [req.user.id, institutionName, degreeMajor, startDate || null, currentlyStudy ? null : endDate || null, !!currentlyStudy, location || null, gpa || null, description || null]
  );

  return success(res, 201, 'Education berhasil ditambahkan.', { education: mapEducation(result.rows[0]) });
};

const updateEducation = async (req, res) => {
  const oldData = await db.query('SELECT * FROM educations WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  if (oldData.rows.length === 0) return error(res, 404, 'Education tidak ditemukan.');

  const old = mapEducation(oldData.rows[0]);
  const body = req.body;
  const currentlyStudy = body.currentlyStudy ?? old.currentlyStudy;

  const result = await db.query(
    `UPDATE educations SET
      institution_name = $1,
      degree_major = $2,
      start_date = $3,
      end_date = $4,
      currently_study = $5,
      location = $6,
      gpa = $7,
      description = $8,
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $9 AND user_id = $10
     RETURNING *`,
    [
      body.institutionName ?? old.institutionName,
      body.degreeMajor ?? old.degreeMajor,
      body.startDate ?? old.startDate,
      currentlyStudy ? null : (body.endDate ?? old.endDate),
      currentlyStudy,
      body.location ?? old.location,
      body.gpa ?? old.gpa,
      body.description ?? old.description,
      req.params.id,
      req.user.id,
    ]
  );

  return success(res, 200, 'Education berhasil diupdate.', { education: mapEducation(result.rows[0]) });
};

const deleteEducation = async (req, res) => {
  const result = await db.query('DELETE FROM educations WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return error(res, 404, 'Education tidak ditemukan.');
  return success(res, 200, 'Education berhasil dihapus.');
};

module.exports = { getEducations, getEducationById, createEducation, updateEducation, deleteEducation };
