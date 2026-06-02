# CAREVO

CAREVO adalah aplikasi web berbasis AI untuk membantu user membuat profil karier, mengisi personal info, experience, education, skills, projects, certifications, dan languages, lalu mendapatkan rekomendasi career path dari model AI serta generate CV PDF/DOCX dari data terbaru.

## Features

- User Authentication Login/Register
- Personal Info, Experience, Education, Skills, Projects, Certifications, Languages
- Dashboard Career Profile
- AI Match Score
- Top 3 Career Path Matches
- TensorFlow/FastAPI Career Recommendation
- Generate CV PDF/DOCX
- PostgreSQL Database
- Express RESTful API

## Tech Stack

### Frontend

- React
- Vite
- Bootstrap
- CSS

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- PDFKit
- DOCX

### AI Service

- Python
- TensorFlow
- FastAPI
- Uvicorn
- Scikit-learn
- python-docx

## Struktur Project

```txt
CAREVO-CAPSTONE-PROJECT/
├── ai-service/
├── backend/
├── frontend/
└── README.md
```

## 1. Setup Database PostgreSQL

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

## 2. Jalankan AI Service

Masuk folder AI:

```bash
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Cek AI service:

```txt
http://localhost:8000/health
```

Jika berhasil, akan muncul `modelLoaded: true` dan `labelLoaded: true`.

### Endpoint AI

AI service punya endpoint utama sesuai API model:

```txt
POST /predict
```

Body:

```json
{
  "skills_text": "Saya memiliki pengalaman python sql data analysis machine learning tensorflow"
}
```

Response berisi rekomendasi karier:

```json
{
  "success": true,
  "prediction": "Data & AI",
  "recommendedCategory": "Data & AI",
  "matchScore": 98,
  "topPathMatches": [
    { "name": "Data Scientist", "score": 98 },
    { "name": "Data Analyst", "score": 94 },
    { "name": "Machine Learning Engineer", "score": 90 }
  ]
}
```

Swagger UI:

```txt
http://localhost:8000/docs
```

Kalau memakai API ngrok dari AI, ubah `AI_SERVICE_URL` di backend `.env`, contoh:

```env
AI_SERVICE_URL=https://arrogance-gentile-busboy.ngrok-free.dev
```

## 3. Setup Backend

Masuk folder backend:

```bash
cd backend
npm install
```

Buat file `.env` dari `.env.example`, lalu pastikan isinya seperti ini:

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
AI_SERVICE_TIMEOUT_MS=10000
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

## 4. Setup Frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di:

```txt
http://localhost:5173
```

## Alur Aplikasi

1. User register/login.
2. User mengisi form wajib: personal info, experience, education, skills.
3. Project, certification, dan language bersifat optional.
4. Data tersimpan ke PostgreSQL berdasarkan akun user.
5. Dashboard memanggil backend.
6. Backend mengambil data terbaru dari PostgreSQL.
7. Backend mengirim gabungan data user ke AI service `/predict` dalam format `skills_text`.
8. AI mengembalikan kategori karier, match score, dan top 3 path matches.
9. Dashboard menampilkan AI Match Score.
10. Generate CV PDF/DOCX memakai data terbaru dan hasil AI recommendation.

## Route Frontend

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

## API Backend

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET  /api/cv/data
POST /api/cv/generate-pdf
POST /api/cv/generate-docx

POST /api/career/recommendation
```

## GitHub Notes

Jangan push folder berikut:

```txt
node_modules/
venv/
.env
__pycache__/
```

Pastikan `.gitignore` berisi:

```gitignore
node_modules/
**/node_modules/
.env
**/.env
dist/
build/
venv/
**/venv/
__pycache__/
**/__pycache__/
*.pyc
.DS_Store
```
