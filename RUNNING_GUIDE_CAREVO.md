# CAREVO Complete Fix v9

Isi project ini sudah mencakup:
- Frontend React + Vite
- Backend Node.js + Express + PostgreSQL
- AI Service FastAPI + TensorFlow model
- Backend AI fallback/correction agar input HR tidak salah ke Software
- CV generator PDF/DOCX tanpa memasukkan AI Match ke CV

## 1. Database PostgreSQL

Buat database sesuai `.env` backend:

```sql
CREATE USER carevoo WITH PASSWORD 'carevo123';
CREATE DATABASE carevoo_db OWNER carevoo;
GRANT ALL PRIVILEGES ON DATABASE carevoo_db TO carevoo;
```

## 2. Backend

```powershell
cd backend
copy .env.example .env
npm install
npm run migrate:up
npm run dev
```

Test:

```txt
http://localhost:5000/api/health
```

## 3. AI Service

Disarankan Python 3.11.

```powershell
cd ai-service
py -3.11 -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Test:

```txt
http://localhost:8000/docs
```

Contoh test `/predict`:

```json
{
  "skills_text": "Career interest: Human Resource. Major: Teknik Informatika. Experience: Human Resource Staff recruitment interview candidate screening employee administration. Skills: problem solving teamwork public speaking communication."
}
```

Hasil harus dominan ke `Bisnis`, bukan Software.

## 4. Frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev -- --force
```

Buka:

```txt
http://localhost:5173
```

## 5. Catatan penting

Kalau tampilan tidak berubah, pastikan yang dijalankan di terminal adalah folder project ini, bukan folder lama.

```powershell
pwd
```

Frontend sudah import:

```js
import './dashboard/dashboard.css';
```

Backend `.env` default:

```txt
AI_SERVICE_URL=http://localhost:8000
USE_TENSORFLOW_AI=true
```

Kalau AI mati, backend tetap memberi rekomendasi fallback yang sudah dikoreksi.
