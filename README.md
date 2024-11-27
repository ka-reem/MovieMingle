First, set up the YouTube Data API:

bashCopy# Install required packages
pip install google-api-python-client fastapi sqlalchemy psycopg2-binary

# Get YouTube API key:
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable YouTube Data API v3
4. Create credentials (API key)

To get a channel ID:


Go to any YouTube channel
Click "About"
Click "Share"
Copy the channel ID


Features implemented:


Fetch videos from any YouTube channel
Store video metadata in database
Random video selection
Channel video browsing
Video player with controls
Thumbnail grid view


Legal compliance:


Uses official YouTube API
Proper video embedding
Respects YouTube's terms of service
No content extraction


To run the system:

bashCopy# Set up environment variables
export YOUTUBE_API_KEY="your_key_here"

# Initialize database
createdb videodb
alembic upgrade head

# Run backend
uvicorn main:app --reload

# Run frontend (in another terminal)
npm run dev