# CAREVO

CAREVO adalah aplikasi web berbasis AI untuk membantu pengguna membuat profil karier, mengisi data pengalaman, pendidikan, skill, project, certification, dan language, lalu mendapatkan rekomendasi career path serta generate CV otomatis berdasarkan data terbaru user.

## Features

- User Authentication Login/Register
- Personal Profile Management
- Experience Management
- Education Management
- Skills Management
- Projects Management
- Certifications Management
- Languages Management
- Dashboard Career Profile
- AI Match Score
- Top 3 Career Path Recommendation
- TensorFlow AI Career Recommendation
- Generate CV PDF/DOCX
- PostgreSQL Database Integration
- RESTful API with Express.js

## Tech Stack

### Frontend

- React
- Vite
- Bootstrap
- CSS
- JavaScript

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- RESTful API
- PDF/DOCX Generator

### AI Service

- Python
- TensorFlow
- FastAPI
- Uvicorn
- NumPy
- Pandas
- Scikit-learn

## Getting Started

### Prerequisites

Pastikan sudah menginstall:

- Node.js
- npm
- Python 3.10 atau 3.11
- PostgreSQL
- Git
- VS Code

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/CAREVO.git
cd CAREVO
```

Ganti `USERNAME` dengan username GitHub kamu.

### 2. Setup PostgreSQL Database

Masuk PostgreSQL:

```bash
psql -U postgres
```

Buat user dan database:

```sql
CREATE USER carevoo WITH ENCRYPTED PASSWORD 'carevo123';
CREATE DATABASE carevoo_db;
GRANT ALL ON DATABASE carevoo_db TO carevoo;
ALTER DATABASE carevoo_db OWNER TO carevoo;
\c carevoo_db
GRANT ALL ON SCHEMA public TO carevoo;
ALTER SCHEMA public OWNER TO carevoo;
\q
```

### 3. Setup Backend

Masuk folder backend:

```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_USER=carevoo
DB_PASSWORD=carevo123
DB_NAME=carevoo_db

PGHOST=localhost
PGPORT=5432
PGUSER=carevoo
PGPASSWORD=carevo123
PGDATABASE=carevoo_db

DATABASE_URL=postgres://carevoo:carevo123@localhost:5432/carevoo_db

JWT_SECRET=carevo_super_secret_key
JWT_EXPIRES_IN=7d
JWT_ACCESS_TOKEN_SECRET=carevo_super_secret_access
JWT_REFRESH_TOKEN_SECRET=carevo_super_secret_refresh
JWT_ACCESS_TOKEN_EXPIRES_IN=7d
JWT_REFRESH_TOKEN_EXPIRES_IN=30d

AI_SERVICE_URL=http://localhost:8000
USE_TENSORFLOW_AI=true
AI_SERVICE_TIMEOUT_MS=7000
```

Jalankan migration:

```bash
npm run migrate:up
```

Jalankan backend:

```bash
npm run dev
```

Backend berjalan di:

```txt
http://localhost:5000
```

### 4. Setup AI Service TensorFlow

Buka terminal baru, lalu masuk folder AI service:

```bash
cd ai-service
```

Buat virtual environment:

```bash
python -m venv venv
```

Aktifkan virtual environment:

```bash
venv\Scripts\activate
```

Install dependency:

```bash
pip install -r requirements.txt
```

Jalankan AI service:

```bash
uvicorn main:app --reload --port 8000
```

AI service berjalan di:

```txt
http://localhost:8000
```

Cek status AI:

```txt
http://localhost:8000/health
```

Jika berhasil, akan muncul:

```json
{
  "success": true,
  "modelLoaded": true,
  "labelLoaded": true
}
```

### 5. Setup Frontend

Buka terminal baru, lalu masuk folder frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di:

```txt
http://localhost:5173
```

## Application Flow

1. User melakukan register atau login.
2. User mengisi form profile, experience, education, skills, project, certification, dan language.
3. Data disimpan ke PostgreSQL berdasarkan akun user.
4. Backend mengambil data terbaru user dari database.
5. Backend mengirim data user ke AI TensorFlow service.
6. TensorFlow memberikan rekomendasi career path dan match score.
7. Dashboard menampilkan AI Match Score dan Top 3 Career Path Matches.
8. User dapat generate CV PDF/DOCX berdasarkan data terbaru dan hasil rekomendasi AI.

## Main Routes

### Frontend

```txt
/
/login
/register
/form/profile
/form/experience
/form/education
/form/skills
/form/projects
/form/certifications
/form/languages
/dashboard
/dashboard/profile
/dashboard/experience
/dashboard/education
/dashboard/skills
/dashboard/projects
/dashboard/certifications
/dashboard/languages
/dashboard/generate-cv
```

### Backend API

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET    /api/profile
POST   /api/profile
PUT    /api/profile

GET    /api/experiences
POST   /api/experiences
PUT    /api/experiences/:id
DELETE /api/experiences/:id

GET    /api/educations
POST   /api/educations
PUT    /api/educations/:id
DELETE /api/educations/:id

GET    /api/skills
POST   /api/skills
PUT    /api/skills/:id
DELETE /api/skills/:id

GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/certifications
POST   /api/certifications
PUT    /api/certifications/:id
DELETE /api/certifications/:id

GET    /api/languages
POST   /api/languages
PUT    /api/languages/:id
DELETE /api/languages/:id

GET  /api/dashboard/summary
GET  /api/dashboard/completeness

GET  /api/cv/data
POST /api/cv/generate-pdf
POST /api/cv/generate-docx

POST /api/career/recommendation
```

## Project Structure

```txt
CAREVO/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── migrations/
│   ├── package.json
│   └── .env
│
├── ai-service/
│   ├── main.py
│   ├── requirements.txt
│   └── model/
│       ├── career_model.keras
│       └── label_encode.pkl
│
└── README.md
```

## Notes

- Backend harus berjalan di `localhost:5000`.
- Frontend harus berjalan di `localhost:5173`.
- AI TensorFlow service harus berjalan di `localhost:8000`.
- Endpoint selain login/register membutuhkan JWT token.
- Token dikirim melalui header:

```txt
Authorization: Bearer <token>
```

- File `.env` tidak disarankan untuk di-push ke GitHub.

## License

This project is created for educational and capstone project purposes.
