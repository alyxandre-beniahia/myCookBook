import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  searchRecipes,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
} from "../services/recipeService";
import RecipeCard from "../components/recipes/RecipeCard";
import RecipeSearch from "../components/recipes/RecipeSearch";
import { useAuth } from "../hooks/useAuth";

const RecipeSearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Search recipes
        const params = {};
        if (query) params.query = query;
        if (category) params.category = category;

        const recipesData = await searchRecipes(params);
        setRecipes(recipesData);

        // If user is logged in, fetch their favorites
        if (user) {
          try {
            const favoritesData = await getFavorites();
            setFavorites(favoritesData);
          } catch (favError) {
            console.error("Error fetching favorites:", favError);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error searching recipes:", err);
        setError("Failed to search recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, category, user]);

  // Check if a recipe is in the user's favorites
  const isRecipeFavorite = (recipeId) => {
    return favorites.some((fav) => fav._id === recipeId);
  };

  const handleFavoriteToggle = async (recipeId, isFavorite) => {
    if (!user) {
      alert("Please log in to save favorites");
      return;
    }

    try {
      if (isFavorite) {
        await addToFavorites(recipeId);
        const recipe = recipes.find((r) => r._id === recipeId);
        if (recipe && !favorites.some((f) => f._id === recipeId)) {
          setFavorites([...favorites, recipe]);
        }
      } else {
        await removeFromFavorites(recipeId);
        setFavorites(favorites.filter((f) => f._id !== recipeId));
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
      alert("Failed to update favorites");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Include the search component */}
      <RecipeSearch />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {recipes.length > 0
              ? `Found ${recipes.length} recipe${
                  recipes.length === 1 ? "" : "s"
                }`
              : "No recipes found"}
            {query && ` for "${query}"`}
            {category && ` in category "${category}"`}
          </h2>

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  isFavorite={user ? isRecipeFavorite(recipe._id) : false}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No recipes found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeSearchPage;
