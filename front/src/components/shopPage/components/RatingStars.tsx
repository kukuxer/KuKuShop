import { useState } from "react";
import { FaStar } from "react-icons/fa";

const RatingStars = ({ rating }: { rating: number }) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            className={`w-4 h-4 cursor-pointer transition-colors duration-200 ${
              (hoveredRating !== null ? hoveredRating : rating) >= starValue
                ? "text-purple-500"
                : "text-gray-600"
            }`}
            onMouseEnter={() => setHoveredRating(starValue)}
            onMouseLeave={() => setHoveredRating(null)}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
