import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const TMDB_API_KEY = '25b1dbad56303219ed64d71edfa14bfe';

    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        setMovies(res.data.results);
        setFilteredMovies(res.data.results);
      } catch (err) {
        setError('Failed to load movies');
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const TMDB_API_KEY = '25b1dbad56303219ed64d71edfa14bfe';
    const lowerSearch = searchTerm.trim().toLowerCase();

    if (lowerSearch === '') {
      setFilteredMovies(movies);
    } else {
      const fetchSearchedMovies = async () => {
        try {
          const res = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
              lowerSearch
            )}&page=1&include_adult=false`
          );
          setFilteredMovies(res.data.results);
        } catch (err) {
          setError('Failed to search movies');
          setFilteredMovies([]);
          console.error(err);
        }
      };

      fetchSearchedMovies();
    }
  }, [searchTerm, movies]);

  const addToWatchlist = async (movieId) => {
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

  const submitReview = async (movie) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return alert('You must be logged in to review');

    const content = prompt(`Enter your review for "${movie.title}":`);
    if (!content) return;

    const ratingStr = prompt(`Enter rating (1-5) for "${movie.title}":`);
    const rating = parseInt(ratingStr);
    if (!rating || rating < 1 || rating > 5) return alert('Invalid rating');

    try {
      await axios.post(
        'http://localhost:8000/api/reviews/',
        {
          film: movie.id,
          content,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert('Review submitted!');
    } catch (error) {
      alert('Failed to submit review');
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-4 fade-in" style={{ minHeight: '100vh', padding: '32px 0' }}>
      <h2 className="text-center mb-5">Popular Movies</h2>

      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">
        {filteredMovies.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="mb-0" style={{ fontSize: '1.2em', color: '#aaa' }}>No movies found.</p>
          </div>
        ) : (
          filteredMovies.map((movie) => (
            <div key={movie.id} className="col-xl-3 col-lg-4 col-md-6">
              <div className="card h-100 movie-card">
                <div className="position-relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    className="card-img-top movie-poster"
                    alt={movie.title}
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                  <div className="card-img-overlay d-flex align-items-end p-0">
                    <div className="w-100 p-3" style={{
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      borderRadius: '0 0 16px 16px'
                    }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <StarRating rating={movie.vote_average / 2} size="1em" />
                        <span className="badge" style={{
                          background: 'rgba(255,215,0,0.9)',
                          color: '#181818',
                          fontWeight: 600
                        }}>
                          {(movie.vote_average / 2).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-2" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    {movie.title}
                  </h5>
                  <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                  <div className="mt-auto">
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-outline-primary btn-sm flex-fill"
                        onClick={() => addToWatchlist(movie.id)}
                      >
                        + Watchlist
                      </button>
                      <Link
                        to={`/movie/${movie.id}`}
                        className="btn btn-outline-secondary btn-sm flex-fill"
                      >
                        Details
                      </Link>
                    </div>
                    <div className="d-flex gap-2 flex-wrap mt-2">
                      <button
                        className="btn btn-outline-info btn-sm flex-fill"
                        onClick={() => submitReview(movie)}
                      >
                        Review
                      </button>
                      <Link
                        to={`/review/${movie.id}`}
                        className="btn btn-outline-dark btn-sm flex-fill"
                      >
                        Write
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


