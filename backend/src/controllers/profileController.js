const db = require('../config/db');
const { success, error } = require('../utils/response');

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

const getProfile = async (req, res) => {
  const result = await db.query('SELECT * FROM profile_infos WHERE user_id = $1', [req.user.id]);
  return success(res, 200, 'Profile berhasil diambil.', { profile: mapProfile(result.rows[0]) || null });
};

const createProfile = async (req, res) => {
  const {
    fullName,
    careerInterest,
    professionalTitle,
    location,
    shortBio,
    profileImage,
    profileImageName,
  } = req.body;

  const title = careerInterest || professionalTitle || null;

  if (!fullName) {
    return error(res, 400, 'Full Name wajib diisi.');
  }

  const result = await db.query(
    `INSERT INTO profile_infos
      (user_id, full_name, career_interest, professional_title, location, short_bio, profile_image, profile_image_name)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (user_id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      career_interest = EXCLUDED.career_interest,
      professional_title = EXCLUDED.professional_title,
      location = EXCLUDED.location,
      short_bio = EXCLUDED.short_bio,
      profile_image = EXCLUDED.profile_image,
      profile_image_name = EXCLUDED.profile_image_name,
      updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [req.user.id, fullName, title, title, location || null, shortBio || null, profileImage || null, profileImageName || null]
  );

  return success(res, 201, 'Profile berhasil disimpan.', { profile: mapProfile(result.rows[0]) });
};

const updateProfile = async (req, res) => {
  return createProfile(req, res);
};

const deleteProfile = async (req, res) => {
  await db.query('DELETE FROM profile_infos WHERE user_id = $1', [req.user.id]);
  return success(res, 200, 'Profile berhasil dihapus.');
};

module.exports = { getProfile, createProfile, updateProfile, deleteProfile };
