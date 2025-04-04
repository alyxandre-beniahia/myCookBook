import { useState, useEffect } from "react";
import { rateRecipe, getRecipeRating } from "../../services/recipeService";
import StarRating from "./StarRating";
import { useAuth } from "../../hooks/useAuth";

const RecipeRating = ({ recipeId }) => {
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  // Fetch the current rating when the component mounts
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

  // Handle when a user clicks on a star to rate
  const handleRatingChange = async (newRating) => {
    // If not logged in, show an alert
    if (!user) {
      alert("Please log in to rate recipes");
      return;
    }

    try {
      // Show submitting state
      setSubmitting(true);
      setUserRating(newRating); // Update the UI immediately

      // Submit the rating to the API
      await rateRecipe(recipeId, newRating);

      // Refetch the average rating
      const data = await getRecipeRating(recipeId);
      setAverageRating(data.average);
      setTotalRatings(data.total);

      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setError(null);
    } catch (err) {
      console.error("Error rating recipe:", err);
      setError("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Recipe Rating</h3>
          <div className="flex items-center mt-1">
            {loading ? (
              <span className="text-gray-500">Loading ratings...</span>
            ) : (
              <>
                <StarRating
                  initialRating={averageRating}
                  readOnly={true}
                  size="md"
                />
                <span className="ml-2 text-gray-600">
                  {averageRating.toFixed(1)} ({totalRatings}{" "}
                  {totalRatings === 1 ? "rating" : "ratings"})
                </span>
              </>
            )}
          </div>
        </div>

        {user && (
          <div className="border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-4">
            <h3 className="text-lg font-medium">Rate this recipe</h3>
            <div className="flex items-center mt-1">
              <StarRating
                initialRating={userRating}
                onRatingChange={handleRatingChange}
                size="md"
              />
              {submitting && (
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
