import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
    <div className="container mt-4" style={{ background: 'linear-gradient(135deg, #181818 60%, #232526 100%)', minHeight: '100vh', borderRadius: '18px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)', padding: '32px 0' }}>
    <h2 className="text-center mb-4" style={{ color: '#FFD700', fontWeight: 700, letterSpacing: '2px', fontSize: '2.5rem', textShadow: '0 2px 12px #000' }}>Popular Movies</h2>

    <input
      type="text"
      className="form-control mb-3"
      placeholder="Search a movie to review..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ background: '#444', color: '#fff', border: 'none' }}
    />

    {error && (
      <div className="alert alert-danger text-center" role="alert" style={{ background: '#2c1a1a', color: '#ff4e4e', border: 'none', boxShadow: '0 2px 8px #000' }}>
        {error}
      </div>
    )}

    <div className="row">
      {filteredMovies.length === 0 ? (
        <p className="text-center" style={{ color: '#fff' }}>No movies found.</p>
      ) : (
        filteredMovies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-4">
            <div className="card h-100" style={{ background: 'rgba(30,30,30,0.95)', border: 'none', borderRadius: '14px', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.55)', color: '#fff' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="card-img-top"
                alt={movie.title}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px 8px 0 0', boxShadow: '0 4px 16px #000' }}
              />
              <div className="card-body d-flex flex-column" style={{ padding: '20px' }}>
                <h5 className="card-title" style={{ color: '#FFD700', fontWeight: 700, fontSize: '1.1rem', textShadow: '0 2px 8px #000', marginBottom: '10px' }}>{movie.title}</h5>
                <p className="card-text" style={{ color: '#eee', fontSize: '0.9rem', marginBottom: '15px' }}>{movie.release_date}</p>
                <button
                  className="btn btn-outline-primary mb-2"
                  onClick={() => addToWatchlist(movie.id)}
                  style={{ color: '#FFD700', borderColor: '#FFD700' }}
                >
                  + Add to Watchlist
                </button>
                <button
                  className="btn btn-outline-secondary mb-2"
                  onClick={() => submitReview(movie)}
                  style={{ color: '#FFD700', borderColor: '#FFD700' }}
                >
                  Review
                </button>
                <Link
                  to={`/movie/${movie.id}`}
                  className="btn btn-outline-info me-2"
                  style={{ color: '#FFD700', borderColor: '#FFD700' }}
                >
                  View Details
                </Link>
                <Link
                  to={`/review/${movie.id}`}
                  className="btn btn-outline-dark"
                  style={{ color: '#FFD700', borderColor: '#FFD700' }}
                >
                  Review
                </Link>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
}


