export default function RatingStars({ rating, interactive = false, onRate }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="rating-stars">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= rating ? 'filled' : ''}`}
          disabled={!interactive}
          onClick={() => interactive && onRate(star)}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}
