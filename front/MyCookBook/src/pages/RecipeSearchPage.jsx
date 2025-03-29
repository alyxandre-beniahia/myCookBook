import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchRecipes, getFavorites } from '../services/recipeService';
import RecipeCard from '../components/recipes/RecipeCard';
import { useAuth } from '../hooks/useAuth';

const RecipeSearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
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
            console.error('Error fetching favorites:', favError);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error searching recipes:', err);
        setError('Failed to search recipes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [query, category, user]);

  // Check if a recipe is in the user's favorites
  const isRecipeFavorite = (recipeId) => {
    return favorites.some(fav => fav._id === recipeId);
  };

  const handleFavoriteToggle = (recipeId, isFavorite) => {
    if (isFavorite) {
      // Add to favorites locally
      const recipe = recipes.find(r => r._id === recipeId);
      if (recipe && !favorites.some(f => f._id === recipeId)) {
        setFavorites([...favorites, recipe]);
      }
    } else {
      // Remove from favorites locally
      setFavorites(favorites.filter(f => f._id !== recipeId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-6">
        {query && `Search: "${query}"`} 
        {category && (query ? ` in category: ${category}` : `Category: ${category}`)}
      </p>
      
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
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
          <p className="text-gray-500">No recipes found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RecipeSearchPage;
