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

# Get API key from environment variable
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
if not YOUTUBE_API_KEY:
    raise ValueError("YOUTUBE_API_KEY environment variable is not set")

youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

@app.get("/videos/next")
async def get_next_video():
    try:
        # Search for movie reviews or trailers
        search_response = youtube.search().list(
            q="movie review",  # You can change this search term
            part="id,snippet",
            maxResults=50,
            type="video",
            videoDuration="medium"  # Only medium length videos (4-20 mins)
        ).execute()

        if not search_response.get('items'):
            return {"error": "No videos found"}

        # Randomly select one video
        video = random.choice(search_response['items'])
        video_id = video['id']['videoId']

        # Get additional video details
        video_response = youtube.videos().list(
            part="statistics,contentDetails",
            id=video_id
        ).execute()

        video_details = video_response['items'][0]

        return {
            "id": video_id,
            "title": video['snippet']['title'],
            "description": video['snippet']['description'],
            "thumbnail": video['snippet']['thumbnails']['high']['url'],
            "embed_url": f"https://www.youtube.com/embed/{video_id}",
            "channel_title": video['snippet']['channelTitle'],
            "view_count": video_details['statistics'].get('viewCount', 0),
            "like_count": video_details['statistics'].get('likeCount', 0),
            "duration": video_details['contentDetails']['duration']
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/videos/{video_id}/like")
async def like_video(video_id: str):
    return {"status": "success"}

@app.post("/videos/{video_id}/dislike")
async def dislike_video(video_id: str):
    return {"status": "success"}