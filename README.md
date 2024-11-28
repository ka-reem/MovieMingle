### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install fastapi uvicorn google-api-python-client
```

3. Set up your YouTube API key:
```bash
export YOUTUBE_API_KEY="your_api_key_here"
```

4. Start the backend server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to `http://localhost:5173`


### Backend
- FastAPI (Python)
- YouTube Data API v3
- Groq & Llama (Soon)

### Frontend
- React
- Tailwind CSS
- Vite
