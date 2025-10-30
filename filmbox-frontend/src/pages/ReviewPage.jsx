import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Review() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [error, setError] = useState(null);

  const TMDB_API_KEY = '25b1dbad56303219ed64d71edfa14bfe';

  const fetchMovieDetails = async () => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
      setMovie(res.data);
    } catch (err) {
      setError('Failed to load movie details');
      console.error(err);
    }
  };
  const token = localStorage.getItem('access_token');


  const submitReview = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      alert('You must be logged in to submit a review');
      return;
    }
    if (!rating || rating < 1 || rating > 5) return alert('Invalid rating');
    if (!review) return alert('Review cannot be empty');

    try {
      await axios.post(
        'http://localhost:8000/api/reviews/',
        {
          movie_id: movieId,
          comment: review,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      alert('Review submitted!');
    } catch (error) {
      alert('Failed to submit review');
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
    // eslint-disable-next-line
  }, [movieId]);

  return (
    <div className="container mt-4" style={{ background: 'linear-gradient(135deg, #181818 60%, #232526 100%)', minHeight: '100vh', borderRadius: '18px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)', padding: '32px 0' }}>
      {error && (
        <div className="alert alert-danger text-center" role="alert" style={{ background: '#2c1a1a', color: '#ff4e4e', border: 'none', boxShadow: '0 2px 8px #000' }}>
          {error}
        </div>
      )}
      {movie ? (
        <div className="card" style={{ background: 'rgba(30,30,30,0.95)', border: 'none', borderRadius: '14px', marginBottom: '28px', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.55)', color: '#fff', padding: '28px 24px' }}>
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="card-img-top" alt={movie.title} style={{width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 16px #000'}} />
          <div className="card-body" style={{ padding: 0 }}>
            <h5 className="card-title" style={{ color: '#FFD700', fontWeight: 700, fontSize: '1.35rem', textShadow: '0 2px 8px #000', marginBottom: '15px' }}>{movie.title}</h5>
            <p className="card-text" style={{ color: '#eee', fontSize: '1.08rem', marginBottom: '20px' }}>{movie.overview}</p>
            <div className="mb-3">
              <label htmlFor="rating" className="form-label" style={{ color: '#FFD700', fontWeight: 600 }}>Rating</label>
              <select id="rating" className="form-select" value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ background: '#444', color: '#fff', border: 'none' }}>
                <option value="">Select rating</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="review" className="form-label" style={{ color: '#FFD700', fontWeight: 600 }}>Review</label>
              <textarea id="review" className="form-control" rows="3" value={review} onChange={(e) => setReview(e.target.value)} style={{ background: '#444', color: '#fff', border: 'none' }}></textarea>
            </div>
            <button className="btn btn-primary" onClick={submitReview} style={{ background: '#FFD700', borderColor: '#FFD700', color: '#181818', fontWeight: 600 }}>Submit Review</button>
          </div>
        </div>
      ) : (
        <p className="text-center" style={{ color: '#fff' }}>Loading movie details...</p>
      )}
    </div>
  );
}