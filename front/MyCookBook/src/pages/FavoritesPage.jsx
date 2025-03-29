import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites } from '../services/recipeService';
import RecipeCard from '../components/recipes/RecipeCard';
import { useAuth } from '../hooks/useAuth';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      console.log('Fetched favorites:', data);
      setFavorites(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchFavorites();
    
    // Add event listener for when the page receives focus
    window.addEventListener('focus', fetchFavorites);
    
    return () => {
      window.removeEventListener('focus', fetchFavorites);
    };
  }, [user, navigate]);

  const handleFavoriteToggle = async (recipeId, isFavorite) => {
    if (!isFavorite) {
      // If a recipe was removed from favorites, update the UI
      setFavorites(favorites.filter(recipe => recipe._id !== recipeId));
    } else {
      // If a recipe was added to favorites, refresh the list
      fetchFavorites();
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
          onClick={fetchFavorites}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(recipe => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              isFavorite={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't added any recipes to your favorites yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Explore Recipes
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
