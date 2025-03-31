import { useState } from "react";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

const StarRating = ({
  initialRating = 0,
  totalStars = 5,
  onRatingChange,
  readOnly = false,
  size = "md",
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (starValue) => {
    if (readOnly) return;

    setRating(starValue);
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  // Determine star size based on prop
  const starSizeClass =
    {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    }[size] || "w-6 h-6";

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            className={`${
              readOnly ? "cursor-default" : "cursor-pointer"
            } p-0 border-none bg-transparent focus:outline-none mr-1`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !readOnly && setHover(starValue)}
            onMouseLeave={() => !readOnly && setHover(0)}
            disabled={readOnly}
            aria-label={`Rate ${starValue} out of ${totalStars} stars`}
          >
            {starValue <= (hover || rating) ? (
              <StarSolid className={`${starSizeClass} text-yellow-400`} />
            ) : (
              <StarOutline className={`${starSizeClass} text-gray-300`} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
