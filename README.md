# CAREVO - AI Career Recommendation Platform

CAREVO adalah aplikasi web capstone untuk membantu pengguna mendapatkan rekomendasi karier berdasarkan data profil, pendidikan, pengalaman, skill, project, sertifikasi, bahasa, dan minat karier.

Aplikasi ini menggunakan frontend React, backend Express, database PostgreSQL, serta AI service berbasis FastAPI dan TensorFlow untuk menghasilkan rekomendasi career path.

---

## Fitur Utama

- Register dan login pengguna menggunakan JWT.
- Form profil pengguna.
- Dashboard personal info, education, experience, skills, projects, certifications, dan languages.
- AI career recommendation berdasarkan profil gabungan pengguna.
- Hybrid filter untuk memperbaiki hasil AI jika prediksi kurang sesuai.
- Generate CV berdasarkan data dashboard.
- Penyimpanan data menggunakan PostgreSQL.
- Deployment menggunakan Vercel, Railway, Neon PostgreSQL, dan Hugging Face Spaces.

---

## Tech Stack

### Frontend

- React
- Vite
- CSS
- Fetch API

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- RESTful API
- CV Generator

### AI Service

- FastAPI
- TensorFlow / Keras
- Scikit-learn
- Hybrid Rule Filter
- Model `.keras`

### Deployment

- Frontend: Vercel
- Backend: Railway
- Database: Neon PostgreSQL
- AI Service: Hugging Face Spaces

---

## Struktur Folder

```txt
carevo-capstone-project/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── src/
│   ├── migrations/
│   ├── package.json
│   └── .env.example
│
├── ai-service/
│   ├── main.py
│   ├── career_rules.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── model/
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## Alur Sistem

```txt
Frontend React
↓
Backend Express API
↓
PostgreSQL Database
↓
AI Service FastAPI
↓
Career Recommendation
```

Backend mengambil data pengguna dari database, menyusun data tersebut menjadi profil gabungan, lalu mengirimkan input ke AI service untuk mendapatkan rekomendasi karier.

---

## Format Input AI

Model AI membaca profil gabungan dari beberapa data seperti:

```txt
keahlian + minat + kategori_keahlian + pendidikan + sertifikasi + ipk
```

Contoh input yang dikirim ke AI:

```txt
React Node.js Express PostgreSQL REST API Fullstack Developer Teknik Informatika Web Development Certification 3.80
```

Contoh hasil:

```txt
Rekayasa Perangkat Lunak
Fullstack Developer
Backend Developer
Frontend Developer
```

---

## Hybrid Filter

CAREVO menggunakan hybrid filter agar hasil rekomendasi lebih sesuai dengan input pengguna.

Jika input dominan:

```txt
React, Node.js, Express, PostgreSQL, Frontend, Backend, Fullstack
```

maka hasil diarahkan ke:

```txt
Rekayasa Perangkat Lunak
Fullstack Developer
Backend Developer
Frontend Developer
```

Jika input dominan:

```txt
Counseling, Psychology Assessment, Behavioral Observation, Empathy, Mentoring
```

maka hasil diarahkan ke:

```txt
Psikologi & Konseling
Counseling Assistant
Psychology Assistant
Educational Counselor
```

Jika input dominan:

```txt
Human Resource, Recruitment, Employee Administration, Interview Candidate
```

maka hasil diarahkan ke:

```txt
Bisnis / HR
Human Resource Staff
Recruitment Staff
HR Administration Staff
```

Jika AI service mati, backend tetap dapat memberikan rekomendasi menggunakan rule fallback.

---

# Cara Menjalankan Project Secara Lokal

## 1. Clone Repository

```powershell
git clone https://github.com/USERNAME/carevo-capstone-project.git
cd carevo-capstone-project
```

---

# Backend Setup

Masuk ke folder backend:

```powershell
cd backend
```

Install dependency:

```powershell
npm install
```

Buat file `.env` dari `.env.example`:

```powershell
copy .env.example .env
```

Jalankan migration:

```powershell
npm run migrate:up
```

Jalankan backend:

```powershell
npm run dev
```

Default backend local:

```txt
http://localhost:5000
```

Health check:

```txt
http://localhost:5000/api/health
```

---

# AI Service Setup

Masuk ke folder AI service:

```powershell
cd ai-service
```

Buat virtual environment:

```powershell
python -m venv venv
```

Aktifkan virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Jika terkena execution policy, jalankan:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Lalu aktifkan ulang:

```powershell
.\venv\Scripts\Activate.ps1
```

Install requirements:

```powershell
pip install -r requirements.txt
```

Jalankan AI service:

```powershell
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Default AI service local:

```txt
http://localhost:8000
```

Swagger AI:

```txt
http://localhost:8000/docs
```

---

# Frontend Setup

Masuk ke folder frontend:

```powershell
cd frontend
```

Install dependency:

```powershell
npm install
```

Buat file `.env` dari `.env.example`:

```powershell
copy .env.example .env
```

Jalankan frontend:

```powershell
npm run dev
```

Default frontend local:

```txt
http://localhost:5173
```

---

# Environment Variables

File `.env` asli tidak boleh dipush ke GitHub karena berisi password, token, dan konfigurasi rahasia.

Yang boleh dipush adalah file:

```txt
.env.example
```

---

## Backend Environment Example

Buat file:

```txt
backend/.env.example
```

Isi:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_USER=carevoo
DB_PASSWORD=your_database_password
DB_NAME=carevoo_db

PGHOST=localhost
PGPORT=5432
PGUSER=carevoo
PGPASSWORD=your_database_password
PGDATABASE=carevoo_db

DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME
PGSSLMODE=disable

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=7d
JWT_REFRESH_TOKEN_EXPIRES_IN=30d

AI_SERVICE_URL=http://localhost:8000
USE_TENSORFLOW_AI=true
AI_SERVICE_TIMEOUT_MS=30000
```

Contoh untuk local PostgreSQL:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_USER=carevoo
DB_PASSWORD=carevo123
DB_NAME=carevoo_db

DATABASE_URL=postgresql://carevoo:carevo123@localhost:5432/carevoo_db
PGSSLMODE=disable

JWT_SECRET=carevo_local_secret
JWT_EXPIRES_IN=7d
JWT_ACCESS_TOKEN_SECRET=carevo_local_access_secret
JWT_REFRESH_TOKEN_SECRET=carevo_local_refresh_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=7d
JWT_REFRESH_TOKEN_EXPIRES_IN=30d

AI_SERVICE_URL=http://localhost:8000
USE_TENSORFLOW_AI=true
AI_SERVICE_TIMEOUT_MS=30000
```

Contoh untuk deploy dengan Neon PostgreSQL:

```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app

DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DATABASE_NAME?sslmode=require
PGSSLMODE=require

JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=7d
JWT_ACCESS_TOKEN_SECRET=your_production_access_secret
JWT_REFRESH_TOKEN_SECRET=your_production_refresh_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=7d
JWT_REFRESH_TOKEN_EXPIRES_IN=30d

AI_SERVICE_URL=https://your-username-carevo-ai-service.hf.space
USE_TENSORFLOW_AI=true
AI_SERVICE_TIMEOUT_MS=30000
```

---

## Frontend Environment Example

Buat file:

```txt
frontend/.env.example
```

Isi:

```env
VITE_API_URL=http://localhost:5000/api
```

Contoh local:

```env
VITE_API_URL=http://localhost:5000/api
```

Contoh deploy:

```env
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

Frontend hanya membutuhkan `VITE_API_URL`.

Jangan masukkan `DATABASE_URL`, `JWT_SECRET`, atau konfigurasi AI ke frontend.

---

## AI Service Environment Example

Buat file:

```txt
ai-service/.env.example
```

Isi:

```env
TF_USE_LEGACY_KERAS=1
MODEL_PATH=./model/career_model.keras
LABEL_ENCODER_PATH=./model/label_encoder.pkl
```

Jika tidak memakai `.env` di AI service, variable ini tetap berguna sebagai dokumentasi konfigurasi.

---

# Model AI

Letakkan model AI di folder:

```txt
ai-service/model/
```

Nama file yang digunakan:

```txt
career_model.keras
label_encoder.pkl
```

AI service juga dapat menerima nama lama:

```txt
label_encode.pkl
```

Contoh struktur:

```txt
ai-service/
└── model/
    ├── career_model.keras
    └── label_encoder.pkl
```

---

# Deployment

CAREVO dapat dideploy dengan konfigurasi berikut:

```txt
Frontend  : Vercel
Backend   : Railway
Database  : Neon PostgreSQL
AI Service: Hugging Face Spaces
```

---

## 1. Deploy Database ke Neon

Langkah:

1. Buat project baru di Neon.
2. Pilih PostgreSQL version 16.
3. Copy connection string dari Neon.
4. Masukkan connection string ke environment backend.
5. Jalankan migration.

Contoh connection string Neon:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DATABASE_NAME?sslmode=require
PGSSLMODE=require
```

Jalankan migration:

```powershell
cd backend
npm run migrate:up
```

Cek tabel di Neon melalui menu:

```txt
Tables
```

---

## 2. Deploy AI Service ke Hugging Face Spaces

Buat Space baru di Hugging Face:

```txt
SDK: Docker
Visibility: Public
Port: 7860
```

Pastikan di folder `ai-service` ada file:

```txt
Dockerfile
requirements.txt
main.py
career_rules.py
model/
```

Contoh `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

ENV TF_USE_LEGACY_KERAS=1
ENV PORT=7860

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

Contoh `requirements.txt`:

```txt
fastapi
uvicorn[standard]
numpy
pandas
scikit-learn
tensorflow
tf-keras
python-dotenv
requests
python-docx
python-multipart
```

Setelah deploy berhasil, test:

```txt
https://your-username-carevo-ai-service.hf.space/docs
```

Contoh environment backend untuk AI service:

```env
AI_SERVICE_URL=https://your-username-carevo-ai-service.hf.space
USE_TENSORFLOW_AI=true
AI_SERVICE_TIMEOUT_MS=30000
```

---

## 3. Deploy Backend ke Railway

Deploy backend dari GitHub repository.

Setting Railway:

```txt
Root Directory: backend
Build Command: npm install
Start Command: node src/server.js
```

Environment variables Railway:

```env
NODE_ENV=production
CLIENT_URL=http://localhost:5173

DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DATABASE_NAME?sslmode=require
PGSSLMODE=require

JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=7d
JWT_ACCESS_TOKEN_SECRET=your_production_access_secret
JWT_REFRESH_TOKEN_SECRET=your_production_refresh_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=7d
JWT_REFRESH_TOKEN_EXPIRES_IN=30d

AI_SERVICE_URL=https://your-username-carevo-ai-service.hf.space
USE_TENSORFLOW_AI=true
AI_SERVICE_TIMEOUT_MS=30000
```

Setelah backend berhasil deploy, generate domain Railway.

Test backend:

```txt
https://your-backend-url.up.railway.app/api/health
```

Jika response seperti ini muncul, backend berhasil:

```json
{
  "success": true,
  "message": "CAREVO API sehat."
}
```

---

## 4. Deploy Frontend ke Vercel

Deploy frontend dari GitHub repository.

Setting Vercel:

```txt
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Environment variable Vercel:

```env
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

Setelah deploy selesai, copy URL frontend Vercel.

Contoh:

```txt
https://carevo-capstone-project.vercel.app
```

---

## 5. Update CORS Backend

Setelah frontend Vercel aktif, update environment backend Railway:

```env
CLIENT_URL=https://your-frontend-url.vercel.app
```

Jika ingin frontend lokal tetap bisa dipakai:

```env
CLIENT_URL=http://localhost:5173,https://your-frontend-url.vercel.app
```

Lalu redeploy backend Railway.

---

# Testing Deployment

Setelah semua deploy selesai, test:

1. Register user baru.
2. Login.
3. Isi personal info.
4. Isi education.
5. Isi experience.
6. Isi skills.
7. Isi projects.
8. Isi certifications.
9. Isi languages.
10. Cek AI Match.
11. Generate CV.
12. Cek data masuk ke Neon Tables.

---

# Contoh Data Testing

## Contoh Fullstack Developer

```txt
Professional Title:
Fullstack Web Developer

Career Interest:
Fullstack Developer

Skills:
React, JavaScript, Node.js, Express.js, PostgreSQL, REST API, JWT Authentication, CRUD, HTML, CSS, Git, Frontend Development, Backend Development, Fullstack Development
```

Expected result:

```txt
Rekayasa Perangkat Lunak
Fullstack Developer
Backend Developer
Frontend Developer
```

## Contoh Psikologi Konseling

```txt
Professional Title:
Psychology & Counseling Enthusiast

Career Interest:
Psychology Counselor

Skills:
Counseling, Psychology Assessment, Behavioral Observation, Active Listening, Empathy, Mentoring, Communication, Problem Solving, Emotional Intelligence, Case Documentation
```

Expected result:

```txt
Psikologi & Konseling
Counseling Assistant
Psychology Assistant
Educational Counselor
```

---

# Troubleshooting

## CORS Error

Jika frontend Vercel tidak bisa login/register, cek environment backend:

```env
CLIENT_URL=https://your-frontend-url.vercel.app
```

Lalu redeploy backend.

## AI Match Delay

Jika AI Match agak lambat, kemungkinan AI service mengalami cold start. Buka dulu:

```txt
https://your-username-carevo-ai-service.hf.space/docs
```

lalu tunggu beberapa saat sebelum testing.

## Database SSL Error

Jika muncul error:

```txt
connection is insecure
```

pastikan backend memakai:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DATABASE_NAME?sslmode=require
PGSSLMODE=require
```

dan konfigurasi database backend memakai SSL.

## Hugging Face Model Error

Jika muncul error Keras atau TensorFlow, pastikan `requirements.txt` memiliki:

```txt
tensorflow
tf-keras
```

---

# GitHub Safety

Jangan push file berikut:

```txt
.env
backend/.env
frontend/.env
ai-service/.env
node_modules/
venv/
```

Yang boleh dipush:

```txt
.env.example
backend/.env.example
frontend/.env.example
ai-service/.env.example
```

Contoh `.gitignore`:

```gitignore
.env
.env.*
backend/.env
backend/.env.*
frontend/.env
frontend/.env.*
ai-service/.env
ai-service/.env.*

node_modules/
backend/node_modules/
frontend/node_modules/

venv/
.venv/
ai-service/venv/
ai-service/.venv/

__pycache__/
*.pyc

dist/
frontend/dist/
build/

*.log
.vscode/
.idea/
.DS_Store
Thumbs.db
```

---

# Author

CAREVO Capstone Project  
Developed by Harika Shry
