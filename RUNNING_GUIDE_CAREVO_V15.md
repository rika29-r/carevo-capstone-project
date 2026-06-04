# RUNNING GUIDE CAREVO V15

## 1. Database PostgreSQL

Buat database dan user sesuai `.env` backend:

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

Cek:

```txt
http://localhost:5000/api/health
```

## 3. AI Service

```powershell
cd ai-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Cek:

```txt
http://localhost:8000/health
```

Test predict:

```json
{
  "skills_text": "Career interest Human Resource. Experience Human Resource Staff recruitment interview candidate employee administration communication teamwork. Pendidikan Teknik Informatika."
}
```

Hasil harus dominan ke:

```txt
Bisnis
```

## 4. Frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev -- --force
```

Cek `.env` frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

## Catatan Penting

Frontend di project ini diambil langsung dari `frontend.zip` yang kamu upload dan tidak diubah.
