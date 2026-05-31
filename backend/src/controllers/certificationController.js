const db = require('../config/db');
const { success, error } = require('../utils/response');

const mapCertification = (row) => row && ({
  id: row.id,
  userId: row.user_id,
  certificateName: row.certificate_name,
  issuer: row.issuer,
  issueDate: row.issue_date,
  expirationDate: row.expiration_date,
  credentialId: row.credential_id,
  credentialUrl: row.credential_url,
  description: row.description,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getCertifications = async (req, res) => {
  const result = await db.query('SELECT * FROM certifications WHERE user_id = $1 ORDER BY issue_date DESC NULLS LAST, id DESC', [req.user.id]);
  return success(res, 200, 'Certifications berhasil diambil.', { certifications: result.rows.map(mapCertification) });
};

const getCertificationById = async (req, res) => {
  const result = await db.query('SELECT * FROM certifications WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return error(res, 404, 'Certification tidak ditemukan.');
  return success(res, 200, 'Certification berhasil diambil.', { certification: mapCertification(result.rows[0]) });
};

const createCertification = async (req, res) => {
  const { certificateName, issuer, issueDate, expirationDate, credentialId, credentialUrl, description } = req.body;
  if (!certificateName) return error(res, 400, 'Certification Name wajib diisi.');

  const result = await db.query(
    `INSERT INTO certifications
      (user_id, certificate_name, issuer, issue_date, expiration_date, credential_id, credential_url, description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [req.user.id, certificateName, issuer || null, issueDate || null, expirationDate || null, credentialId || null, credentialUrl || null, description || null]
  );

  return success(res, 201, 'Certification berhasil ditambahkan.', { certification: mapCertification(result.rows[0]) });
};

const updateCertification = async (req, res) => {
  const oldData = await db.query('SELECT * FROM certifications WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  if (oldData.rows.length === 0) return error(res, 404, 'Certification tidak ditemukan.');

  const old = mapCertification(oldData.rows[0]);
  const body = req.body;
  const result = await db.query(
    `UPDATE certifications SET
      certificate_name=$1, issuer=$2, issue_date=$3, expiration_date=$4,
      credential_id=$5, credential_url=$6, description=$7, updated_at=CURRENT_TIMESTAMP
     WHERE id=$8 AND user_id=$9 RETURNING *`,
    [
      body.certificateName ?? old.certificateName,
      body.issuer ?? old.issuer,
      body.issueDate ?? old.issueDate,
      body.expirationDate ?? old.expirationDate,
      body.credentialId ?? old.credentialId,
      body.credentialUrl ?? old.credentialUrl,
      body.description ?? old.description,
      req.params.id,
      req.user.id,
    ]
  );

  return success(res, 200, 'Certification berhasil diupdate.', { certification: mapCertification(result.rows[0]) });
};

const deleteCertification = async (req, res) => {
  const result = await db.query('DELETE FROM certifications WHERE id=$1 AND user_id=$2 RETURNING id', [req.params.id, req.user.id]);
  if (result.rows.length === 0) return error(res, 404, 'Certification tidak ditemukan.');
  return success(res, 200, 'Certification berhasil dihapus.');
};

module.exports = { getCertifications, getCertificationById, createCertification, updateCertification, deleteCertification };
