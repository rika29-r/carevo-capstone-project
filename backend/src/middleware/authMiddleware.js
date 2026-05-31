const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { error } = require('../utils/response');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return error(res, 401, 'Token tidak ditemukan. Silakan login terlebih dahulu.');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET || process.env.JWT_SECRET
    );

    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return error(res, 401, 'User tidak ditemukan. Silakan login ulang.');
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    return error(res, 401, 'Token tidak valid atau sudah expired.');
  }
};

module.exports = authMiddleware;
