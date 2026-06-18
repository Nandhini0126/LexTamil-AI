# Setup

## Frontend
```bash
cd frontend
npm install
npm run dev
```

## Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
python -m uvicorn main:app --host 127.0.0.1 --port 8000


```

## Datasets
Processed datasets are loaded from:
- `backend/data/processed/legal_docs.json`
- `backend/data/processed/legal_qa.json`

To refresh MILPaC documents from raw Excel files:
```bash
cd backend
python convert_milpac.py
```

## Logo
Put your logo file at:
`frontend/public/logo.jpeg`