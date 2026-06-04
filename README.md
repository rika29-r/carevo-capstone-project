# CAREVO Complete Project

Isi folder:
- `frontend/` = frontend dari file yang kamu upload. Tidak diubah.
- `backend/` = Express + PostgreSQL + JWT + CRUD dashboard + CV generator + AI recommendation gateway.
- `ai-service/` = FastAPI TensorFlow service + hybrid rule filter.

Frontend sengaja dipertahankan sama seperti file `frontend.zip` yang kamu berikan.

## Jalankan Backend

```powershell
cd backend
copy .env.example .env
npm install
npm run migrate:up
npm run dev
```

Default backend: `http://localhost:5000/api`

## Jalankan AI Service

```powershell
cd ai-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Default AI: `http://localhost:8000`

Cek AI:

```txt
http://localhost:8000/health
```

## Jalankan Frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev -- --force
```

Default frontend: `http://localhost:5173`

Pastikan `.env` frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

## Model Baru

Kalau kamu punya model baru dari Colab, taruh file di:

```txt
ai-service/model/career_model.keras
ai-service/model/label_encoder.pkl
```

AI service juga masih menerima nama lama:

```txt
ai-service/model/label_encode.pkl
```

## Hybrid Filter

Sistem ini memakai:
1. TensorFlow model dari `ai-service`.
2. Backend filter untuk mengoreksi hasil model yang kurang akurat.
3. Rule fallback kalau AI service mati.

Contoh: jika input dominan Human Resource, recruitment, interview, employee administration, maka sistem mengarahkan ke `Bisnis`, bukan `Rekayasa Perangkat Lunak`, walaupun jurusan user Teknik Informatika.
