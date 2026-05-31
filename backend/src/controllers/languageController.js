const db = require('../config/db');
const { success, error } = require('../utils/response');

const mapLanguage = (row) => row && ({
  id: row.id,
  userId: row.user_id,
  language: row.language,
  proficiency: row.proficiency,
  yearStarted: row.year_started,
  usageFrequency: row.usage_frequency,
  flagCode: row.flag_code,
  flagUrl: row.flag_url,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getLanguages = async (req, res) => {
  const result = await db.query('SELECT * FROM languages WHERE user_id=$1 ORDER BY id DESC', [req.user.id]);
  return success(res, 200, 'Languages berhasil diambil.', { languages: result.rows.map(mapLanguage) });
};

const getLanguageById = async (req, res) => {
  const result = await db.query('SELECT * FROM languages WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return error(res, 404, 'Language tidak ditemukan.');
  return success(res, 200, 'Language berhasil diambil.', { language: mapLanguage(result.rows[0]) });
};

const createLanguage = async (req, res) => {
  const { language, proficiency, yearStarted, usageFrequency, flagCode, flagUrl } = req.body;
  if (!language) return error(res, 400, 'Language wajib diisi.');

  const result = await db.query(
    `INSERT INTO languages
      (user_id, language, proficiency, year_started, usage_frequency, flag_code, flag_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [req.user.id, language, proficiency || 'Professional Working', yearStarted || null, usageFrequency || 'Daily', flagCode || null, flagUrl || null]
  );

  return success(res, 201, 'Language berhasil ditambahkan.', { language: mapLanguage(result.rows[0]) });
};

const updateLanguage = async (req, res) => {
  const oldData = await db.query('SELECT * FROM languages WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  if (oldData.rows.length === 0) return error(res, 404, 'Language tidak ditemukan.');

  const old = mapLanguage(oldData.rows[0]);
  const body = req.body;
  const result = await db.query(
    `UPDATE languages SET
      language=$1, proficiency=$2, year_started=$3, usage_frequency=$4,
      flag_code=$5, flag_url=$6, updated_at=CURRENT_TIMESTAMP
     WHERE id=$7 AND user_id=$8 RETURNING *`,
    [
      body.language ?? old.language,
      body.proficiency ?? old.proficiency,
      body.yearStarted ?? old.yearStarted,
      body.usageFrequency ?? old.usageFrequency,
      body.flagCode ?? old.flagCode,
      body.flagUrl ?? old.flagUrl,
      req.params.id,
      req.user.id,
    ]
  );

  return success(res, 200, 'Language berhasil diupdate.', { language: mapLanguage(result.rows[0]) });
};

const deleteLanguage = async (req, res) => {
  const result = await db.query('DELETE FROM languages WHERE id=$1 AND user_id=$2 RETURNING id', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return error(res, 404, 'Language tidak ditemukan.');
  return success(res, 200, 'Language berhasil dihapus.');
};

module.exports = { getLanguages, getLanguageById, createLanguage, updateLanguage, deleteLanguage };
