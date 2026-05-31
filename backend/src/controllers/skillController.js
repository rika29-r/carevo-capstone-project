const db = require('../config/db');
const { success, error } = require('../utils/response');

const mapSkill = (row) => row && ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  category: row.category,
  level: row.level,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getSkills = async (req, res) => {
  const result = await db.query('SELECT * FROM skills WHERE user_id = $1 ORDER BY id DESC', [req.user.id]);
  return success(res, 200, 'Skills berhasil diambil.', { skills: result.rows.map(mapSkill) });
};

const getSkillById = async (req, res) => {
  const result = await db.query('SELECT * FROM skills WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return error(res, 404, 'Skill tidak ditemukan.');
  return success(res, 200, 'Skill berhasil diambil.', { skill: mapSkill(result.rows[0]) });
};

const createSkill = async (req, res) => {
  const { name, category, level } = req.body;
  if (!name) return error(res, 400, 'Nama skill wajib diisi.');

  try {
    const result = await db.query(
      `INSERT INTO skills (user_id, name, category, level)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [req.user.id, String(name).trim(), category || null, level || null]
    );
    return success(res, 201, 'Skill berhasil ditambahkan.', { skill: mapSkill(result.rows[0]) });
  } catch (err) {
    if (err.code === '23505') return error(res, 409, 'Skill sudah ada di akun ini.');
    throw err;
  }
};

const bulkCreateSkills = async (req, res) => {
  const { selectedSkills = [], skillCategory, proficiencyLevel } = req.body;
  const skills = Array.isArray(selectedSkills) ? selectedSkills : [];

  if (skills.length === 0) return error(res, 400, 'Minimal pilih atau tambahkan 1 skill.');

  const inserted = [];
  for (const skillName of skills) {
    const cleanName = typeof skillName === 'string' ? skillName : skillName?.name;
    if (!cleanName) continue;
    const result = await db.query(
      `INSERT INTO skills (user_id, name, category, level)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id, name) DO UPDATE SET
        category = EXCLUDED.category,
        level = EXCLUDED.level,
        updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [req.user.id, cleanName, skillCategory || null, proficiencyLevel || null]
    );
    inserted.push(mapSkill(result.rows[0]));
  }

  return success(res, 201, 'Skills berhasil disimpan.', { skills: inserted });
};

const updateSkill = async (req, res) => {
  const oldData = await db.query('SELECT * FROM skills WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  if (oldData.rows.length === 0) return error(res, 404, 'Skill tidak ditemukan.');

  const old = mapSkill(oldData.rows[0]);
  const { name, category, level } = req.body;
  const result = await db.query(
    `UPDATE skills SET name=$1, category=$2, level=$3, updated_at=CURRENT_TIMESTAMP
     WHERE id=$4 AND user_id=$5 RETURNING *`,
    [name ?? old.name, category ?? old.category, level ?? old.level, req.params.id, req.user.id]
  );
  return success(res, 200, 'Skill berhasil diupdate.', { skill: mapSkill(result.rows[0]) });
};

const deleteSkill = async (req, res) => {
  const result = await db.query('DELETE FROM skills WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return error(res, 404, 'Skill tidak ditemukan.');
  return success(res, 200, 'Skill berhasil dihapus.');
};

module.exports = { getSkills, getSkillById, createSkill, bulkCreateSkills, updateSkill, deleteSkill };
