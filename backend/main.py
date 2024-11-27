from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from googleapiclient.discovery import build
import random
import os
import isodate

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

# Cache to store video results
video_cache = []

@app.get("/videos/next")
async def get_next_video():
    global video_cache
    try:
        # If cache is empty, fetch new videos
        if not video_cache:
            search_response = youtube.search().list(
                q="movie clip",
                part="id,snippet",
                maxResults=10,  # Reduced from 50 to 10
                type="video",
                videoDuration="short",
                fields="items(id/videoId,snippet(title,description,thumbnails/high,channelTitle))"  # Specify only needed fields
            ).execute()

            if search_response.get('items'):
                video_cache = search_response['items']
            else:
                return {"error": "No videos found"}

        # Get and remove a random video from cache
        video = video_cache.pop(random.randint(0, len(video_cache) - 1))
        
        return {
            "id": video['id']['videoId'],
            "title": video['snippet']['title'],
            "description": video['snippet']['description'],
            "thumbnail": video['snippet']['thumbnails']['high']['url'],
            "embed_url": f"https://www.youtube.com/embed/{video['id']['videoId']}",
            "channel_title": video['snippet']['channelTitle'],
            "view_count": "N/A",  # Lower API usage rates
            "like_count": "N/A"   
        }

    except Exception as e:
        return {"error": str(e)}

@app.post("/videos/{video_id}/like")
async def like_video(video_id: str):
    return {"status": "success"}

@app.post("/videos/{video_id}/dislike")
async def dislike_video(video_id: str):
    return {"status": "success"}