import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getRecipeById,
  getRecipeRating,
  getRecipeComments,
  createComment,
  deleteComment,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
} from "../../services/recipeService";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import RecipeRating from "./RecipeRating";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState({ average: 0, total: 0 });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(id);
        setRecipe(data);

        // Fetch rating
        const ratingData = await getRecipeRating(id);
        setRating(ratingData);

        // Fetch comments
        const commentsData = await getRecipeComments(id);
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const checkFavorite = async () => {
    if (!user) return;

    try {
      const favorites = await getFavorites();
      // Assuming favorites is an array of recipe IDs or recipe objects with _id property
      const isFavorite = favorites.some((fav) =>
        typeof fav === "string" ? fav === recipe._id : fav._id === recipe._id
      );
      setIsFavorited(isFavorite);
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  useEffect(() => {
    if (recipe && user) {
      checkFavorite();
    }
  }, [recipe, user]);

  const handleFavoriteToggle = async () => {
    if (!user) return;

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        await removeFromFavorites(recipe._id);
      } else {
        await addToFavorites(recipe._id);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await createComment(recipe._id, newComment);
      setComments([...comments, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(recipe._id, commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || "Recipe not found"}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Recipe header */}
        <div className="relative">
          {recipe.image?.url ? (
            <img
              src={recipe.image.url}
              alt={recipe.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 w-full">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">
                  {recipe.title}
                </h1>

                {user && (
                  <button
                    onClick={handleFavoriteToggle}
                    disabled={favoriteLoading}
                    className="p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    {isFavorited ? (
                      <HeartSolid className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartOutline className="h-6 w-6 text-gray-600" />
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center mt-2">
                <span className="text-white mr-4">
                  By {recipe.author?.name || "Unknown"}
                </span>
                <span className="text-white">
                  {rating.average.toFixed(1)} ★ ({rating.total}{" "}
                  {rating.total === 1 ? "rating" : "ratings"})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe content */}
        <div className="p-6">
          {/* Add RecipeRating component */}
          <RecipeRating recipeId={id} />

          <div className="mb-6 mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">
              {recipe.description || "No description available"}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc pl-5">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700 mb-1">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal pl-5">
              {recipe.steps.map((step, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Comments section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">
              Comments ({comments.length})
            </h2>

            {user && (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Post Comment
                </button>
              </form>
            )}

            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{comment.user.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {user && user._id === comment.user._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
