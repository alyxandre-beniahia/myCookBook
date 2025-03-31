import { Link } from "react-router-dom";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  addToFavorites,
  removeFromFavorites,
  getRecipeRating,
} from "../../services/recipeService";

const RecipeCard = ({
  recipe,
  isFavorite: initialIsFavorite = false,
  onFavoriteToggle,
}) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState({ average: 0, total: 0 });

  // Update isFavorite state when the prop changes
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  // Fetch rating for this recipe
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const ratingData = await getRecipeRating(recipe._id);
        setRating(ratingData);
      } catch (error) {
        console.error("Error fetching recipe rating:", error);
      }
    };

    fetchRating();
  }, [recipe._id]);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(recipe._id);
      } else {
        await addToFavorites(recipe._id);
      }

      setIsFavorite(!isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(recipe._id, !isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/recipes/${recipe._id}`} className="block">
        <div className="relative h-48">
          {recipe.image?.url ? (
            <img
              src={recipe.image.url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {user && (
            <button
              onClick={handleFavoriteToggle}
              disabled={isLoading}
              className="absolute top-2 right-2 p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all"
            >
              {isFavorite ? (
                <HeartSolid className="h-6 w-6 text-red-500" />
              ) : (
                <HeartOutline className="h-6 w-6 text-gray-600" />
              )}
            </button>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h3 className="text-white font-bold text-lg truncate">
              {recipe.title}
            </h3>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full">
              {recipe.category}
            </span>
            <span className="text-sm text-gray-500">
              by {recipe.author?.name || "Unknown"}
            </span>
          </div>

          {/* Add rating display */}
          <div className="flex items-center mb-2">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">
              {rating.average.toFixed(1)} ({rating.total})
            </span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 h-10">
            {recipe.description || "No description available"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
