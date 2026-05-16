import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, setRating, interactive = false, maxStars = 5, size = 24 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={index}
            className={`${interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'} bg-transparent border-none p-0 focus:outline-none`}
            onClick={() => interactive && setRating && setRating(starValue)}
            onMouseEnter={() => interactive && setHover(starValue)}
            onMouseLeave={() => interactive && setHover(0)}
            disabled={!interactive}
          >
            <Star
              size={size}
              className={`transition-colors ${starValue <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
