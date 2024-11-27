import React, { useState, useEffect } from 'react';

const VideoSwiper = () => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNextVideo = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/videos/next');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setCurrentVideo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextVideo();
  }, []);

  const handleSwipe = async (liked) => {
    if (!currentVideo) return;

    try {
      // Record the like/dislike
      await fetch(`http://localhost:8000/videos/${currentVideo.id}/${liked ? 'like' : 'dislike'}`, {
        method: 'POST'
      });

      if (liked) {
        setLikedVideos(prev => [...prev, currentVideo]);
      }

      // Get next video
      fetchNextVideo();
    } catch (err) {
      setError('Failed to record preference');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 rounded-lg">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchNextVideo}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {currentVideo && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Video Player */}
          <div className="relative pt-[56.25%]">
            <iframe
              src={currentVideo.embed_url}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
              frameBorder="0"
            />
          </div>

          {/* Video Info */}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{currentVideo.title}</h2>
            <p className="text-gray-600 mb-2">{currentVideo.channel_title}</p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span>{parseInt(currentVideo.view_count).toLocaleString()} views</span>
              <span className="mx-2">•</span>
              <span>{parseInt(currentVideo.like_count).toLocaleString()} likes</span>
            </div>
            <p className="text-gray-700">{currentVideo.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 p-4 border-t">
            <button
              onClick={() => handleSwipe(false)}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => handleSwipe(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Like
            </button>
          </div>
        </div>
      )}

      {/* Liked Videos List */}
      {likedVideos.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4">Videos You Liked:</h3>
          <div className="space-y-4">
            {likedVideos.map(video => (
              <div key={video.id} className="flex items-center gap-4">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium">{video.title}</h4>
                  <p className="text-sm text-gray-500">{video.channel_title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSwiper;