import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../components/StarRating';

export default function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const TMDB_API_KEY = '25b1dbad56303219ed64d71edfa14bfe';

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/movies/${movieId}/`),
          axios.get(`http://localhost:8000/api/movies/${movieId}/reviews/`)
        ]);
        setMovie(movieRes.data);
        setReviews(reviewsRes.data.reviews);
        setAverageRating(reviewsRes.data.average_rating);
      } catch (err) {
        setError('Failed to load movie details or reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

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

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ background: 'linear-gradient(135deg, #181818 60%, #232526 100%)', minHeight: '100vh', borderRadius: '18px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)', padding: '32px 0' }}>
      {movie && (
        <>
          {/* Movie Header */}
          <div className="row mb-4">
            <div className="col-md-4">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="img-fluid rounded shadow"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            </div>
            <div className="col-md-8">
              <h1 className="display-4 fw-bold text-warning mb-3" style={{ textShadow: '0 2px 8px #000' }}>
                {movie.title}
              </h1>
              <div className="d-flex align-items-center mb-3">
                <StarRating rating={averageRating} />
                <span className="ms-2 text-light fs-5">
                  {averageRating > 0 ? `${averageRating.toFixed(1)} / 5` : 'No ratings yet'}
                </span>
                <span className="ms-2 text-muted">({reviews.length} reviews)</span>
              </div>
              <p className="text-light fs-5 mb-3">{movie.release_date?.split('-')[0]}</p>
              <p className="text-light mb-4">{movie.overview}</p>
              <div className="mb-3">
                <strong className="text-warning">Genres:</strong>
                <span className="text-light ms-2">
                  {movie.genres?.map(g => g.name).join(', ') || 'N/A'}
                </span>
              </div>
              <div className="mb-4">
                <strong className="text-warning">Runtime:</strong>
                <span className="text-light ms-2">{movie.runtime} minutes</span>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-warning"
                  onClick={addToWatchlist}
                >
                  + Add to Watchlist
                </button>
                <Link
                  to={`/review/${movieId}`}
                  className="btn btn-warning"
                >
                  Write Review
                </Link>
              </div>
            </div>
          </div>

          {/* Cast Section */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div className="mb-5">
              <h2 className="text-warning mb-4">Cast</h2>
              <div className="row">
                {movie.credits.cast.slice(0, 10).map((actor) => (
                  <div key={actor.id} className="col-md-2 col-sm-4 mb-3">
                    <div className="card bg-dark text-light border-secondary h-100">
                      <img
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/placeholder.jpg'}
                        alt={actor.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body p-2">
                        <h6 className="card-title fs-6">{actor.name}</h6>
                        <p className="card-text small text-muted">{actor.character}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div>
            <h2 className="text-warning mb-4">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-light">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="row">
                {reviews.map((review) => (
                  <div key={review.id} className="col-md-6 mb-3">
                    <div className="card bg-dark text-light border-secondary">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title text-warning">{review.user}</h6>
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="card-text">{review.comment}</p>
                        <small className="text-muted">
                          {new Date(review.created_at).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
