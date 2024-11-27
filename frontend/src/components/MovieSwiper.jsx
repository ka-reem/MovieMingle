import React, { useState, useEffect } from 'react';

const MovieSwiper = () => {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch a movie when component mounts
    fetchNextMovie();
  }, []);

  const fetchNextMovie = async () => {
    try {
      const response = await fetch('http://localhost:8000/movies/next');
      const movie = await response.json();
      setCurrentMovie(movie);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };

  const handleSwipe = (liked) => {
    if (liked) {
      setLikedMovies([...likedMovies, currentMovie]);
    }
    fetchNextMovie();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {currentMovie && (
        <div className="movie-card">
          <h2>{currentMovie.title}</h2>
          <p>{currentMovie.overview}</p>
          <div>
            <p>Genre: {currentMovie.genre}</p>
            <p>Rating: {currentMovie.rating}/10</p>
          </div>
          {currentMovie.trailer_url && (
            <iframe
              src={currentMovie.trailer_url}
              width="100%"
              height="315"
              frameBorder="0"
              allowFullScreen
            />
          )}
          <div className="button-container">
            <button onClick={() => handleSwipe(false)}>👎 Dislike</button>
            <button onClick={() => handleSwipe(true)}>👍 Like</button>
          </div>
        </div>
      )}
      
      {likedMovies.length > 0 && (
        <div className="liked-movies">
          <h3>Liked Movies:</h3>
          <ul>
            {likedMovies.map(movie => (
              <li key={movie.id}>{movie.title}</li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .movie-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .button-container {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
        }

        button {
          padding: 10px 20px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 16px;
          transition: transform 0.1s;
        }

        button:hover {
          transform: scale(1.05);
        }

        .liked-movies {
          margin-top: 20px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default MovieSwiper;