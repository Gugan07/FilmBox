import React from 'react';

const StarRating = ({ rating, maxStars = 5, size = '1.2em' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <span key={`full-${index}`} className="star" style={{ fontSize: size }}>
          ★
        </span>
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <span className="star half" style={{ fontSize: size }}>
          ★
        </span>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <span key={`empty-${index}`} className="star empty" style={{ fontSize: size }}>
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
