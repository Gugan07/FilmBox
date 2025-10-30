import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/StarRating';

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
    <div className="container mt-4 fade-in" style={{ minHeight: '100vh', padding: '32px 0' }}>
      <div className="row">
        <div className="col-md-4">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="img-fluid movie-poster"
            alt={movie.title}
          />
        </div>
        <div className="col-md-8">
          <h1 className="mb-3">{movie.title}</h1>
          <div className="mb-3">
            <StarRating rating={averageRating} size="1.5em" />
            <span className="ms-2" style={{ color: '#FFD700', fontSize: '1.1em', fontWeight: 600 }}>
              {averageRating.toFixed(1)}/5 ({reviews.length} reviews)
            </span>
          </div>
          <div className="row mb-3">
            <div className="col-sm-6">
              <p className="mb-1"><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="mb-1"><strong>Runtime:</strong> {movie.runtime} minutes</p>
            </div>
            <div className="col-sm-6">
              <p className="mb-1"><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
              <p className="mb-1"><strong>Language:</strong> {movie.original_language.toUpperCase()}</p>
            </div>
          </div>
          <p className="mb-4" style={{ fontSize: '1.1em', lineHeight: '1.6', color: '#e0e0e0' }}>{movie.overview}</p>
          <div className="d-flex gap-3 flex-wrap">
            <button
              className="btn btn-outline-primary"
              onClick={addToWatchlist}
            >
              + Add to Watchlist
            </button>
            <Link
              to={`/review/${movieId}`}
              className="btn btn-outline-secondary"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-4">Cast</h3>
        <div className="row g-3">
          {movie.credits.cast.slice(0, 10).map((actor) => (
            <div key={actor.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
              <div className="card h-100 movie-card">
                <img
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image'}
                  className="card-img-top"
                  alt={actor.name}
                  style={{ height: '180px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                />
                <div className="card-body p-2">
                  <h6 className="card-title mb-1" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{actor.name}</h6>
                  <p className="card-text mb-0" style={{ fontSize: '0.75rem', color: '#aaa' }}>{actor.character}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-4">Reviews</h3>
        {reviews.length === 0 ? (
          <div className="text-center py-5">
            <p className="mb-3" style={{ fontSize: '1.1em', color: '#aaa' }}>No reviews yet. Be the first to review!</p>
            <Link
              to={`/review/${movieId}`}
              className="btn btn-outline-primary"
            >
              Write the First Review
            </Link>
          </div>
        ) : (
          <div className="row">
            {reviews.map((review) => (
              <div key={review.id} className="col-12 mb-3">
                <div className="card movie-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <h6 className="card-title mb-0 me-3" style={{ fontWeight: 600 }}>{review.user}</h6>
                      <StarRating rating={review.rating} size="1.1em" />
                      <span className="ms-2" style={{ color: '#FFD700', fontWeight: 600 }}>{review.rating}/5</span>
                    </div>
                    <p className="card-text mb-2" style={{ fontSize: '1em', lineHeight: '1.5' }}>{review.comment}</p>
                    <small style={{ color: '#888' }}>
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
