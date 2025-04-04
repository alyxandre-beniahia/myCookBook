import { useState } from "react";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

const StarRating = ({
  initialRating = 0,
  onRatingChange,
  readOnly = false,
  size = "md",
  filled = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (readOnly) return;

    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        // Determine if this star should be filled
        const isFilled = star <= (hover || rating);

        // Choose which star component to use
        // If readOnly and filled prop is true, always use solid stars
        // Otherwise use solid/outline based on rating
        const StarComponent =
          (readOnly && filled) || isFilled ? StarSolid : StarOutline;

        return (
          <button
            type="button"
            key={star}
            className={`${
              readOnly ? "cursor-default" : "cursor-pointer"
            } p-0.5 focus:outline-none`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            disabled={readOnly}
          >
            <StarComponent
              className={`${sizeClass} ${
                isFilled ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
