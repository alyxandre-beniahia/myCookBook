import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById, getFavorites } from '../services/recipeService';
import RecipeDetail from '../components/recipes/RecipeDetail';
import { useAuth } from '../hooks/useAuth';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch recipe details
        const recipeData = await getRecipeById(id);
        setRecipe(recipeData);
        
        // If user is logged in, check if this recipe is in their favorites
        if (user) {
          try {
            const favoritesData = await getFavorites();
            const isInFavorites = favoritesData.some(fav => fav._id === id);
            setIsFavorite(isInFavorites);
          } catch (favError) {
            console.error('Error checking favorites:', favError);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user]);

  const handleFavoriteToggle = (recipeId, newIsFavorite) => {
    setIsFavorite(newIsFavorite);
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
        <p className="text-red-500">{error || 'Recipe not found'}</p>
      </div>
    );
  }

  return <RecipeDetail recipe={recipe} isFavorite={isFavorite} onFavoriteToggle={handleFavoriteToggle} />;
};

export default RecipeDetailPage;
