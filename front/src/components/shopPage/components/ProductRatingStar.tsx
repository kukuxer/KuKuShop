import { useState } from "react";
import { FaStar } from "react-icons/fa";

const ProductRatingStar = ({ rating }: { rating: number }) => {

  const displayRating = rating;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = star <= Math.floor(displayRating);
        const isHalf =
          !isFull &&
          star === Math.ceil(displayRating) &&
          displayRating - Math.floor(displayRating) >= 0.4 &&
          displayRating - Math.floor(displayRating) < 1;

        return (
          <span
            key={star}
            className="relative w-5 h-5"
          >
            {/* Gray background star */}
            <FaStar className="text-gray-400 w-5 h-5 absolute top-0 left-0" />

            {isFull && (
              <FaStar className="text-purple-500 w-5 h-5 absolute top-0 left-0" />
            )}

            {isHalf && (
              <span className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
                <FaStar className="text-purple-500 w-5 h-5" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default ProductRatingStar;
