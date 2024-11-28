from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from googleapiclient.discovery import build
import random
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

SEARCH_TERMS = [
    "movie scene compilation",
    "best movie moments",
    "funny movie clips",
    "action movie scenes",
    "movie fight scenes",
    "movie chase scenes",
    "emotional movie scenes",
    "classic movie clips",
    "movie shorts",
    "movie bloopers",
    "behind the scenes movie",
    "movie montage",
    "movie clip shorts",
    "epic movie moments",
    "movie scene reaction",
    "iconic film scenes",
    "movie highlights shorts",
    "great movie scenes",
    "movie scene breakdown",
    "unforgettable movie moments"
]

SORT_OPTIONS = [
    'date',
    'rating',
    'relevance',
    'viewCount',
    'title'
]

@app.get("/videos/next")
async def get_next_video():
    try:
        search_term = random.choice(SEARCH_TERMS)
        sort_order = random.choice(SORT_OPTIONS)
        
        search_response = youtube.search().list(
            q=search_term,
            part="id,snippet",
            maxResults=1,
            type="video",
            videoDuration="short",
            order=sort_order,
            safeSearch="moderate",
            relevanceLanguage="en",  # English language results
            regionCode="US",         # US region content
            fields="items(id/videoId,snippet(title,description,thumbnails/high,channelTitle))",
            publishedAfter="2015-01-01T00:00:00Z"
        ).execute()

        if not search_response.get('items'):
            return {"error": "No videos found"}
            
        video = search_response['items'][0]
        
        return {
            "id": video['id']['videoId'],
            "title": video['snippet']['title'],
            "description": video['snippet']['description'],
            "thumbnail": video['snippet']['thumbnails']['high']['url'],
            "embed_url": f"https://www.youtube.com/embed/{video['id']['videoId']}",
            "channel_title": video['snippet']['channelTitle']
        }

    except Exception as e:
        return {"error": str(e)}

@app.post("/videos/{video_id}/like")
async def like_video(video_id: str):
    return {"status": "success"}

@app.post("/videos/{video_id}/dislike")
async def dislike_video(video_id: str):
    return {"status": "success"}