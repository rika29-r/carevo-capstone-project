const db = require('../config/db');
const { success, error } = require('../utils/response');

const mapProject = (row) => row && ({
  id: row.id,
  userId: row.user_id,
  thumbnail: row.thumbnail,
  thumbnailName: row.thumbnail_name,
  title: row.title,
  status: row.status,
  role: row.role,
  startDate: row.start_date,
  endDate: row.end_date,
  description: row.description,
  demoUrl: row.demo_url,
  githubUrl: row.github_url,
  featured: row.featured,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getProjects = async (req, res) => {
  const result = await db.query('SELECT * FROM projects WHERE user_id=$1 ORDER BY id DESC', [req.user.id]);
  return success(res, 200, 'Projects berhasil diambil.', { projects: result.rows.map(mapProject) });
};

const getProjectById = async (req, res) => {
  const result = await db.query('SELECT * FROM projects WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return error(res, 404, 'Project tidak ditemukan.');
  return success(res, 200, 'Project berhasil diambil.', { project: mapProject(result.rows[0]) });
};

const createProject = async (req, res) => {
  const { thumbnail, thumbnailName, title, status, role, startDate, endDate, description, demoUrl, githubUrl, featured } = req.body;
  if (!title) return error(res, 400, 'Project Title wajib diisi.');

  const result = await db.query(
    `INSERT INTO projects
      (user_id, thumbnail, thumbnail_name, title, status, role, start_date, end_date, description, demo_url, github_url, featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [req.user.id, thumbnail || null, thumbnailName || null, title, status || 'In Progress', role || null, startDate || null, endDate || null, description || null, demoUrl || null, githubUrl || null, !!featured]
  );

  return success(res, 201, 'Project berhasil ditambahkan.', { project: mapProject(result.rows[0]) });
};

const updateProject = async (req, res) => {
  const oldData = await db.query('SELECT * FROM projects WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  if (oldData.rows.length === 0) return error(res, 404, 'Project tidak ditemukan.');

  const old = mapProject(oldData.rows[0]);
  const body = req.body;
  const result = await db.query(
    `UPDATE projects SET
      thumbnail=$1, thumbnail_name=$2, title=$3, status=$4, role=$5,
      start_date=$6, end_date=$7, description=$8, demo_url=$9, github_url=$10,
      featured=$11, updated_at=CURRENT_TIMESTAMP
     WHERE id=$12 AND user_id=$13 RETURNING *`,
    [
      body.thumbnail ?? old.thumbnail,
      body.thumbnailName ?? old.thumbnailName,
      body.title ?? old.title,
      body.status ?? old.status,
      body.role ?? old.role,
      body.startDate ?? old.startDate,
      body.endDate ?? old.endDate,
      body.description ?? old.description,
      body.demoUrl ?? old.demoUrl,
      body.githubUrl ?? old.githubUrl,
      body.featured ?? old.featured,
      req.params.id,
      req.user.id,
    ]
  );

  return success(res, 200, 'Project berhasil diupdate.', { project: mapProject(result.rows[0]) });
};

const deleteProject = async (req, res) => {
  const result = await db.query('DELETE FROM projects WHERE id=$1 AND user_id=$2 RETURNING id', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return error(res, 404, 'Project tidak ditemukan.');
  return success(res, 200, 'Project berhasil dihapus.');
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
