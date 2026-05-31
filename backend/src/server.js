require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const educationRoutes = require('./routes/educationRoutes');
const skillRoutes = require('./routes/skillRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const languageRoutes = require('./routes/languageRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const cvRoutes = require('./routes/cvRoutes');
const careerRoutes = require('./routes/careerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CAREVO Backend API aktif.',
    modules: ['auth', 'profile', 'educations', 'skills', 'certifications', 'experiences', 'projects', 'languages', 'dashboard', 'cv', 'career'],
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/educations', educationRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/career', careerRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan.',
  });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`CAREVO backend running on http://localhost:${PORT}`);
});
