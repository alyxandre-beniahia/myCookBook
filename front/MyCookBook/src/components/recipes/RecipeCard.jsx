import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { ClockIcon, UserIcon, FireIcon } from "@heroicons/react/24/outline";

const RecipeCard = ({
  recipe,
  isFavorite,
  onFavoriteToggle,
  height,
  className = "",
  id,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!recipe) return null;

  const { _id, title, description, author, category } = recipe;

  // Extract the image URL from different possible structures
  let imageUrl = "";
  if (recipe.image) {
    if (typeof recipe.image === "object" && recipe.image.url) {
      imageUrl = recipe.image.url;
    } else if (typeof recipe.image === "string") {
      imageUrl = recipe.image;
    }
  } else if (recipe.imageUrl) {
    imageUrl = recipe.imageUrl;
  } else if (recipe.imagePath) {
    imageUrl = recipe.imagePath;
  }

  // Get preparation time or default
  const prepTime = recipe.prepTime || recipe.preparationTime || "30 min";

  // Get difficulty or default
  const difficulty = recipe.difficulty || "Medium";

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(_id, !isFavorite);
    }
  };

  return (
    <div
      className={`group relative w-full h-full overflow-hidden rounded-2xl bg-[#fafafa] border border-[#ddd] shadow-md transition-all duration-300 ${
        isHovered ? "shadow-lg translate-y-[-5px] border-[#ccc]" : ""
      } ${className}`}
      style={{ height: height ? `${height}px` : "auto" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={id}
    >
      {/* Category badge */}
      {category && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#e6b800]/90 text-white backdrop-blur-md shadow-md">
            {category}
          </span>
        </div>
      )}

      {/* Favorite button */}
      {onFavoriteToggle && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-all duration-200 transform hover:scale-110"
        >
          {isFavorite ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600 group-hover:text-red-400" />
          )}
        </button>
      )}

      {/* Image with gradient overlay */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
        {imageUrl && !imageError ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center rounded-t-2xl">
            <span className="text-gray-600 font-medium">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <Link to={`/recipes/${_id}`} className="block">
        <div className="p-5">
          <h3 className="text-lg font-semibold text-[#262633] mb-2 line-clamp-2 group-hover:text-[#4a4a5e] transition-colors duration-200">
            {title}
          </h3>

          {description && (
            <p className="text-[#4a4a5e] text-sm line-clamp-2 mb-3">
              {description}
            </p>
          )}

          {/* Recipe metadata */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4" />
              <span>{prepTime}</span>
            </div>

            <div className="flex items-center space-x-1">
              <FireIcon className="h-4 w-4" />
              <span>{difficulty}</span>
            </div>

            {author && author.name && (
              <div className="flex items-center space-x-1">
                <UserIcon className="h-4 w-4" />
                <span>{author.name}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* View recipe button */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#fafafa] to-transparent pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link
          to={`/recipes/${_id}`}
          className="block w-full py-2 text-center text-sm font-medium text-white bg-[#262633] rounded-lg hover:bg-[#333344] transition-colors duration-200"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
