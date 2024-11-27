from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data for testing
SAMPLE_MOVIES = [
    {
        "id": 1,
        "title": "Inception",
        "overview": "A thief who steals corporate secrets through dream-sharing technology.",
        "genre": "Sci-Fi",
        "rating": 8.8,
        "trailer_url": "https://www.youtube.com/embed/YoHD9XEInc0"
    },
    {
        "id": 2,
        "title": "The Dark Knight",
        "overview": "Batman fights the menace known as the Joker.",
        "genre": "Action",
        "rating": 9.0,
        "trailer_url": "https://www.youtube.com/embed/EXeTwQWrcwY"
    }
]

class Movie(BaseModel):
    id: int
    title: str
    overview: str
    genre: str
    rating: float
    trailer_url: str

@app.get("/")
def read_root():
    return {"message": "Movie API is running!"}

@app.get("/movies/next", response_model=Movie)
async def get_next_movie():
    # For testing, just return the first movie
    return SAMPLE_MOVIES[0]

@app.get("/movies", response_model=List[Movie])
async def get_movies():
    return SAMPLE_MOVIES

@app.post("/swipes")
async def create_swipe(movie_id: int, liked: bool):
    return {"status": "success", "liked": liked, "movie_id": movie_id}