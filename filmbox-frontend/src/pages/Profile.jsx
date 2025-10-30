import { useEffect, useState } from 'react';
import axios from 'axios';

const TMDB_API_KEY = '25b1dbad56303219ed64d71edfa14bfe';

export default function Profile() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieTitles, setMovieTitles] = useState({});
  const [moviePosters, setMoviePosters] = useState({});
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedRating, setEditedRating] = useState('');
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      if (!accessToken) {
        setError('You must be logged in to view your reviews.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:8000/api/reviews/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setReviews(res.data);
      } catch (err) {
        setError('Failed to load your reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [accessToken]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const titles = {};
      const posters = {};
      const uniqueMovieIds = Array.from(new Set(reviews.map(r => r.movie_id)));
      await Promise.all(uniqueMovieIds.map(async (movieId) => {
        if (!movieId) return;
        try {
          const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
          titles[movieId] = res.data.title;
          posters[movieId] = res.data.poster_path;
        } catch (e) {
          titles[movieId] = 'Unknown Movie';
          posters[movieId] = null;
        }
      }));
      setMovieTitles(titles);
      setMoviePosters(posters);
    };
    if (reviews.length > 0) {
      fetchMovieDetails();
    }
  }, [reviews]);

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditedContent(review.content);
    setEditedRating(review.rating);
  };

  const handleCancelClick = () => {
    setEditingReviewId(null);
    setEditedContent('');
    setEditedRating('');
  };

  const handleSaveClick = async (reviewId) => {
    if (editedRating < 1 || editedRating > 5) {
      alert('Rating must be between 1 and 5.');
      return;
    }

    if (!accessToken) {
      setError('You must be logged in to edit your review.');
      return;
    }

    try {
      await axios.put(`http://localhost:8000/api/reviews/${reviewId}/`, {
        comment: editedContent,
        rating: Number(editedRating),
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Refresh reviews after successful update
      const res = await axios.get('http://localhost:8000/api/reviews/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setReviews(res.data);

      // Reset editing state
      handleCancelClick();
    } catch (err) {
      setError('Failed to update review. Please try again.');
    }
  };

  return (
    <div className="container mt-4" style={{
      background: 'linear-gradient(135deg, #181818 60%, #232526 100%)',
      minHeight: '100vh',
      borderRadius: '18px',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)',
      padding: '32px 0'
    }}>
      <h2 className="text-center mb-4" style={{
        color: '#FFD700',
        fontWeight: 700,
        letterSpacing: '2px',
        fontSize: '2.5rem',
        textShadow: '0 2px 12px #000'
      }}>My Reviews</h2>

      {loading && <p className="text-center" style={{ color: '#fff' }}>Loading your reviews...</p>}

      {error && (
        <div className="alert alert-danger text-center" role="alert" style={{
          background: '#2c1a1a',
          color: '#ff4e4e',
          border: 'none',
          boxShadow: '0 2px 8px #000'
        }}>
          {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-center" style={{ color: '#bbb' }}>You have not submitted any reviews yet.</p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="list-group" style={{ background: 'transparent' }}>
          {reviews.map((review) => (
            <div key={review.id} className="list-group-item" style={{
              background: 'rgba(30,30,30,0.95)',
              border: 'none',
              borderRadius: '14px',
              marginBottom: '28px',
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.55)',
              color: '#fff',
              padding: '28px 24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {moviePosters[review.movie_id] ? (
                  <img src={`https://image.tmdb.org/t/p/w92${moviePosters[review.movie_id]}`}
                       alt={movieTitles[review.movie_id] || 'Movie'}
                       style={{
                         width: '60px',
                         height: '90px',
                         objectFit: 'cover',
                         borderRadius: '8px',
                         marginRight: '20px',
                         boxShadow: '0 4px 16px #000'
                       }} />
                ) : (
                  <div style={{
                    width: '60px',
                    height: '90px',
                    background: '#333',
                    borderRadius: '8px',
                    marginRight: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 16px #000'
                  }}>No Image</div>
                )}
                <h5 className="font-weight-bold mb-0" style={{
                  color: '#FFD700',
                  fontWeight: 700,
                  fontSize: '1.35rem',
                  textShadow: '0 2px 8px #000'
                }}>{movieTitles[review.movie_id] || 'Loading...'}</h5>
              </div>

              <p style={{ color: '#FFD700', fontWeight: 600, marginBottom: 4 }}>
                <strong>Rating:</strong> <span style={{ color: '#fff', fontWeight: 500 }}>{review.rating} / 5</span>
                <button className="btn btn-sm btn-outline-light ms-2" onClick={() => handleEditClick(review)}>Edit</button>
              </p>

              <p style={{ color: '#eee', fontSize: '1.08rem', marginBottom: 8 }}>{review.content}</p>
              <small className="text-muted" style={{ color: '#aaa' }}>
                Reviewed on {new Date(review.created_at).toLocaleDateString()}
              </small>

              {editingReviewId === review.id && (
                <div className="mt-3">
                  <h5>Edit Review</h5>
                  <div className="mb-3">
                    <label htmlFor={`rating-${review.id}`} className="form-label">Rating (1-5)</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`rating-${review.id}`}
                      min="1"
                      max="5"
                      value={editedRating}
                      onChange={(e) => setEditedRating(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor={`content-${review.id}`} className="form-label">Review Content</label>
                    <textarea
                      className="form-control"
                      id={`content-${review.id}`}
                      rows="3"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    ></textarea>
                  </div>
                  <button className="btn btn-primary me-2" onClick={() => handleSaveClick(review.id)}>Save</button>
                  <button className="btn btn-secondary" onClick={handleCancelClick}>Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
