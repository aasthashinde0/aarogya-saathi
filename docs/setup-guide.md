# Aarogya Saathi - Setup & Deployment Guide

## 1. Prerequisites
- Python 3.10+
- Sarvam AI API Key (`SARVAM_API_KEY`)

## 2. Quick Start

### Step 1: Clone or Navigate to the Project
```bash
cd D:\aarogya-saathi
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables
Create or verify `.env`:
```env
SARVAM_API_KEY=your_sarvam_api_key_here
```

### Step 4: Run the Application
```bash
python run.py
```
Or directly with Uvicorn:
```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 5: Access the Application
- **Mobile-First Web App:** Open `http://localhost:8000` in any web browser or mobile browser.
- **Interactive API Documentation:** Open `http://localhost:8000/docs`.

---

## 3. Database & Migrations
By default, Aarogya Saathi runs out-of-the-box with SQLite and automatically seeds synthetic demo patient records (Ramesh Sharma, 68/M).

For Supabase / PostgreSQL deployment:
1. Run `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor.
2. Run `supabase/seed.sql` to populate initial demo data.
