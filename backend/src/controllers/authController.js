const bcrypt = require('bcryptjs');
const db = require('../config/db');
const generateToken = require('../utils/generateToken');
const { success, error } = require('../utils/response');

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.created_at,
});

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return error(res, 400, 'Name, email, dan password wajib diisi.');
  }

  if (password.length < 6) {
    return error(res, 400, 'Password minimal 6 karakter.');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);

  if (existingUser.rows.length > 0) {
    return error(res, 409, 'Email sudah terdaftar. Silakan login.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, created_at`,
    [name.trim(), normalizedEmail, hashedPassword]
  );

  const user = sanitizeUser(result.rows[0]);
  const token = generateToken(result.rows[0]);

  return success(res, 201, 'Register berhasil.', { user, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return error(res, 400, 'Email dan password wajib diisi.');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const result = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);

  if (result.rows.length === 0) {
    return error(res, 401, 'Email atau password salah.');
  }

  const userRow = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, userRow.password);

  if (!isPasswordValid) {
    return error(res, 401, 'Email atau password salah.');
  }

  const user = sanitizeUser(userRow);
  const token = generateToken(userRow);

  return success(res, 200, 'Login berhasil.', { user, token });
};

const me = async (req, res) => {
  return success(res, 200, 'User berhasil diambil.', { user: req.user });
};

const logout = async (req, res) => {
  return success(res, 200, 'Logout berhasil. Hapus token di frontend.');
};

module.exports = { register, login, me, logout };
