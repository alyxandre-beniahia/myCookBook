import { useState, useEffect } from "react";
import { rateRecipe, getRecipeRating } from "../../services/recipeService";
import StarRating from "./StarRating";
import { useAuth } from "../../hooks/useAuth";

const RecipeRating = ({ recipeId }) => {
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRating = async () => {
      try {
        setLoading(true);
        const data = await getRecipeRating(recipeId);
        setAverageRating(data.average);
        setTotalRatings(data.total);
        setError(null);
      } catch (err) {
        console.error("Error fetching recipe rating:", err);
        setError("Failed to load rating");
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [recipeId]);

  const handleRatingChange = async (newRating) => {
    if (!user) {
      alert("Please log in to rate recipes");
      return;
    }

    try {
      setLoading(true);
      await rateRecipe(recipeId, newRating);

      // Refetch the average rating
      const data = await getRecipeRating(recipeId);
      setAverageRating(data.average);
      setTotalRatings(data.total);

      setRating(newRating);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      console.error("Error rating recipe:", err);
      setError("Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !averageRating) {
    return <div className="text-gray-500">Loading ratings...</div>;
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Recipe Rating</h3>
          <div className="flex items-center mt-1">
            <StarRating
              initialRating={averageRating}
              readOnly={true}
              size="md"
            />
            <span className="ml-2 text-gray-600">
              {averageRating.toFixed(1)} ({totalRatings}{" "}
              {totalRatings === 1 ? "rating" : "ratings"})
            </span>
          </div>
        </div>

        {user && (
          <div className="border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-4">
            <h3 className="text-lg font-medium">Rate this recipe</h3>
            <div className="flex items-center mt-1">
              <StarRating
                initialRating={rating}
                onRatingChange={handleRatingChange}
                size="md"
              />
              {loading && (
                <span className="ml-2 text-gray-500">Submitting...</span>
              )}
              {success && (
                <span className="ml-2 text-green-500">Rating submitted!</span>
              )}
              {error && <span className="ml-2 text-red-500">{error}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeRating;
