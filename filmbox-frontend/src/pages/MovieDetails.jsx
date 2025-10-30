import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

export default function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);

  const TMDB_API_KEY = '25b1dbad56303219ed64d71edfa14bfe';

  const fetchMovieDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/movies/${movieId}/`);
      setMovie(res.data);
    } catch (err) {
      setError('Failed to load movie details');
      console.error(err);
    }
  };

  const fetchMovieReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/movies/${movieId}/reviews/`);
      setReviews(res.data.reviews);
      setAverageRating(res.data.average_rating);
    } catch (err) {
      console.error('Failed to load reviews', err);
    }
  };

  const addToWatchlist = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      alert('You must be logged in to add to watchlist');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/watchlist/',
        { movie_id: movieId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert('Movie added to watchlist!');
    } catch (error) {
      alert('Failed to add to watchlist');
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
    fetchMovieReviews();
  }, [movieId]);

  if (error) {
    return (
      <div className="container mt-4" style={{ background: 'linear-gradient(135deg, #181818 60%, #232526 100%)', minHeight: '100vh', borderRadius: '18px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)', padding: '32px 0' }}>
        <div className="alert alert-danger text-center" role="alert" style={{ background: '#2c1a1a', color: '#ff4e4e', border: 'none', boxShadow: '0 2px 8px #000' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mt-4" style={{ background: 'linear-gradient(135deg, #181818 60%, #232526 100%)', minHeight: '100vh', borderRadius: '18px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)', padding: '32px 0' }}>
        <p className="text-center" style={{ color: '#fff' }}>Loading movie details...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ background: 'linear-gradient(135deg, #181818 60%, #232526 100%)', minHeight: '100vh', borderRadius: '18px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)', padding: '32px 0' }}>
      <div className="row">
        <div className="col-md-4">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="img-fluid"
            alt={movie.title}
            style={{ borderRadius: '14px', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.55)' }}
          />
        </div>
        <div className="col-md-8" style={{ color: '#fff' }}>
          <h1 style={{ color: '#FFD700', fontWeight: 700, textShadow: '0 2px 12px #000' }}>{movie.title}</h1>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
          <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Average Rating:</strong> {averageRating}/5 ({reviews.length} reviews)</p>
          <button
            className="btn btn-outline-primary me-2"
            onClick={addToWatchlist}
            style={{ color: '#FFD700', borderColor: '#FFD700' }}
          >
            + Add to Watchlist
          </button>
          <Link
            to={`/review/${movieId}`}
            className="btn btn-outline-secondary"
            style={{ color: '#FFD700', borderColor: '#FFD700' }}
          >
            Write a Review
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <h3 style={{ color: '#FFD700', fontWeight: 600 }}>Cast</h3>
        <div className="row">
          {movie.credits.cast.slice(0, 10).map((actor) => (
            <div key={actor.id} className="col-md-2 mb-3">
              <div className="card" style={{ background: 'rgba(30,30,30,0.95)', border: 'none', borderRadius: '8px', color: '#fff' }}>
                <img
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image'}
                  className="card-img-top"
                  alt={actor.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body" style={{ padding: '10px' }}>
                  <h6 className="card-title" style={{ fontSize: '0.9rem' }}>{actor.name}</h6>
                  <p className="card-text" style={{ fontSize: '0.8rem', color: '#ccc' }}>{actor.character}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 style={{ color: '#FFD700', fontWeight: 600 }}>Reviews</h3>
        {reviews.length === 0 ? (
          <p style={{ color: '#fff' }}>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="card mb-3" style={{ background: 'rgba(30,30,30,0.95)', border: 'none', borderRadius: '8px', color: '#fff' }}>
              <div className="card-body">
                <h6 className="card-title" style={{ color: '#FFD700' }}>{review.user} - {review.rating}/5</h6>
                <p className="card-text">{review.comment}</p>
                <small style={{ color: '#ccc' }}>{new Date(review.created_at).toLocaleDateString()}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
