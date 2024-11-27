from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from googleapiclient.discovery import build
import random
import os
from datetime import datetime, timedelta
import isodate  # for parsing YouTube duration

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
if not YOUTUBE_API_KEY:
    raise ValueError("YOUTUBE_API_KEY environment variable is not set")

youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

def is_short_duration(duration_str):
    """Check if video duration is under 2.5 minutes"""
    duration = isodate.parse_duration(duration_str)
    return duration.total_seconds() <= 150  # 150 seconds = 2.5 minutes

@app.get("/videos/next")
async def get_next_video():
    try:
        # Search for short videos, including Shorts
        search_response = youtube.search().list(
            q="movie scene OR movie clip OR movie shorts",  # Search terms
            part="id,snippet",
            maxResults=50,  # Get more results to filter
            type="video",
            videoDuration="short",  # Only short videos
            order="relevance",      # Get relevant results
            # Add Shorts to results
            videoType="any"
        ).execute()

        if not search_response.get('items'):
            return {"error": "No videos found"}

        valid_videos = []
        
        # Get detailed info for each video to check exact duration
        for item in search_response['items']:
            video_id = item['id']['videoId']
            video_response = youtube.videos().list(
                part="contentDetails,statistics",
                id=video_id
            ).execute()

            if video_response['items']:
                duration = video_response['items'][0]['contentDetails']['duration']
                if is_short_duration(duration):
                    valid_videos.append((item, video_response['items'][0]))

        if not valid_videos:
            return {"error": "No videos found within duration limit"}

        # Randomly select one of the valid videos
        video, video_details = random.choice(valid_videos)
        
        return {
            "id": video['id']['videoId'],
            "title": video['snippet']['title'],
            "description": video['snippet']['description'],
            "thumbnail": video['snippet']['thumbnails']['high']['url'],
            "embed_url": f"https://www.youtube.com/embed/{video['id']['videoId']}",
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