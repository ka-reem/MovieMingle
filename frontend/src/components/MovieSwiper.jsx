import React, { useState, useEffect } from 'react';

const MovieSwiper = () => {
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
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
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
    <div className="container mx-auto px-4 md:px-8 w-full min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Video Section */}
        <div className="lg:w-2/3 w-full">
          {currentVideo && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
              {/* Video Player */}
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  src={currentVideo.embed_url}
                  className="absolute top-0 left-0 w-full h-full"
                  allowFullScreen
                  frameBorder="0"
                />
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                <p className="text-gray-600 mb-2">{currentVideo.channel_title}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>{parseInt(currentVideo.view_count).toLocaleString()} views</span>
                  <span className="mx-2">•</span>
                  <span>{parseInt(currentVideo.like_count).toLocaleString()} likes</span>
                </div>
                <p className="text-gray-700">{currentVideo.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-6 p-6 border-t">
                <button
                  onClick={() => handleSwipe(false)}
                  className="px-8 py-4 bg-red-500 text-white text-lg rounded-full hover:bg-red-600 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleSwipe(true)}
                  className="px-8 py-4 bg-green-500 text-white text-lg rounded-full hover:bg-green-600 transition-colors"
                >
                  Like
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Liked Videos Sidebar */}
        <div className="lg:w-1/3 w-full">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-6">Videos You Liked</h3>
            <div className="space-y-6">
              {likedVideos.length === 0 ? (
                <p className="text-gray-500">No liked videos yet</p>
              ) : (
                likedVideos.map(video => (
                  <div key={video.id} className="flex flex-col gap-2">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full aspect-video object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium line-clamp-2">{video.title}</h4>
                      <p className="text-sm text-gray-500">{video.channel_title}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieSwiper;