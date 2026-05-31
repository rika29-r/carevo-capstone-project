const db = require('../config/db');
const { success, error } = require('../utils/response');
const { getCvDataByUserId } = require('../services/cvService');

const getCategories = async (req, res) => {
  const result = await db.query('SELECT * FROM career_categories ORDER BY name ASC');
  return success(res, 200, 'Kategori pekerjaan berhasil diambil.', { categories: result.rows });
};

const getKeywords = async (req, res) => {
  const result = await db.query(`
    SELECT ck.id, ck.keyword, ck.weight, cc.name AS category_name
    FROM career_keywords ck
    JOIN career_categories cc ON cc.id=ck.category_id
    ORDER BY cc.name, ck.keyword
  `);
  return success(res, 200, 'Keyword rekomendasi berhasil diambil.', { keywords: result.rows });
};


const { getCareerRecommendation } = require('../services/careerRecommendationGateway');

const recommendCareer = async (req, res) => {
  const cvData = await getCvDataByUserId(req.user.id);
  const recommendation = await getCareerRecommendation(cvData);

  // Sesuai request: jika AI menemukan career match terbaru, profile title ikut disesuaikan.
  // full_name/location/short_bio/foto tidak diubah.
  if (recommendation?.profileTitle && recommendation.recommendedCategory !== 'Other / General') {
    await db.query(
      `UPDATE profile_infos
       SET career_interest=$2, professional_title=$3, updated_at=CURRENT_TIMESTAMP
       WHERE user_id=$1`,
      [req.user.id, recommendation.recommendedCategory, recommendation.profileTitle]
    );
  }

  return success(res, 200, 'Rekomendasi AI berhasil dibuat dari data terbaru.', {
    ...recommendation,
    profileUpdated: true,
  });
};

const importKeywords = async (req, res) => {
  const categories = req.body.categories || [];
  if (!Array.isArray(categories)) return error(res, 400, 'categories harus berupa array.');

  let totalImported = 0;
  for (const category of categories) {
    if (!category.name) continue;
    const cat = await db.query(
      `INSERT INTO career_categories (name, description)
       VALUES ($1,$2)
       ON CONFLICT (name) DO UPDATE SET description=COALESCE(EXCLUDED.description, career_categories.description), updated_at=CURRENT_TIMESTAMP
       RETURNING id`,
      [category.name, category.description || null]
    );
    for (const keyword of category.keywords || []) {
      const item = typeof keyword === 'string' ? { keyword, weight: 1 } : keyword;
      if (!item.keyword) continue;
      await db.query(
        `INSERT INTO career_keywords (category_id, keyword, weight)
         VALUES ($1,$2,$3)
         ON CONFLICT (category_id, keyword) DO UPDATE SET weight=EXCLUDED.weight`,
        [cat.rows[0].id, String(item.keyword).toLowerCase(), item.weight || 1]
      );
      totalImported += 1;
    }
  }

  return success(res, 201, 'Dataset keyword berhasil diimport.', { totalImported });
};

module.exports = { getCategories, getKeywords, recommendCareer, importKeywords };
